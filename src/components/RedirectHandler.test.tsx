import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RedirectHandler, { isSafeUrl } from './RedirectHandler';

const mockGetUrl = jest.fn();
const mockIncrementClicks = jest.fn();

jest.mock('../hooks/useFirestore', () => ({
  useFirestore: () => ({ getUrl: mockGetUrl, incrementClicks: mockIncrementClicks }),
}));

const mockReplace = jest.fn();
const originalLocation = window.location;

const renderAt = (path: string) =>
  render(
    <React.StrictMode>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/:shortCode" element={<RedirectHandler />} />
        </Routes>
      </MemoryRouter>
    </React.StrictMode>
  );

beforeEach(() => {
  jest.clearAllMocks();
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...originalLocation, replace: mockReplace },
  });
});

afterAll(() => {
  Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
});

describe('isSafeUrl', () => {
  it('acepta http y https', () => {
    expect(isSafeUrl('https://github.io')).toBe(true);
    expect(isSafeUrl('http://example.com/a')).toBe(true);
  });
  it('rechaza protocolos peligrosos y URLs inválidas', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('data:text/html,hi')).toBe(false);
    expect(isSafeUrl('no es url')).toBe(false);
  });
});

describe('RedirectHandler', () => {
  it('incrementa clics una sola vez y redirige (StrictMode)', async () => {
    mockGetUrl.mockResolvedValue({ originalUrl: 'https://github.io' });
    mockIncrementClicks.mockResolvedValue(undefined);
    renderAt('/invitacion');
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('https://github.io'));
    expect(mockGetUrl).toHaveBeenCalledTimes(1);
    expect(mockIncrementClicks).toHaveBeenCalledTimes(1);
    expect(mockIncrementClicks).toHaveBeenCalledWith('invitacion');
  });

  it('muestra error si el shortCode no existe', async () => {
    mockGetUrl.mockResolvedValue(null);
    renderAt('/nada');
    expect(await screen.findByText(/no existe o ha sido eliminada/i)).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('redirige aunque falle el incremento de clics', async () => {
    mockGetUrl.mockResolvedValue({ originalUrl: 'https://github.io' });
    mockIncrementClicks.mockRejectedValue(new Error('permission-denied'));
    renderAt('/invitacion');
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('https://github.io'));
  });

  it('no redirige si la URL es inválida', async () => {
    mockGetUrl.mockResolvedValue({ originalUrl: 'javascript:alert(1)' });
    renderAt('/malo');
    expect(await screen.findByText(/destino no es válida/i)).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
    expect(mockIncrementClicks).not.toHaveBeenCalled();
  });

  it('muestra error si falla la consulta a Firestore', async () => {
    mockGetUrl.mockRejectedValue(new Error('network'));
    renderAt('/x');
    expect(await screen.findByText(/Ocurrió un error/i)).toBeInTheDocument();
  });
});
