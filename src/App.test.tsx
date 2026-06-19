import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock de hooks para evitar llamadas asíncronas a Firebase en las pruebas
jest.mock('./hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signInWithGoogle: jest.fn(),
    logout: jest.fn(),
  }),
}));

jest.mock('./hooks/useFirestore', () => ({
  useFirestore: () => ({
    addUrl: jest.fn(),
    getUrl: jest.fn(),
    incrementClicks: jest.fn(),
    getUserUrls: jest.fn().mockResolvedValue([]),
    deleteUrl: jest.fn(),
    getBio: jest.fn(),
    getBioByUserId: jest.fn(),
    saveBio: jest.fn(),
    incrementBioViews: jest.fn(),
    loading: false,
    error: null,
  }),
}));

test('renders TEKFORGE title in navigation', () => {
  render(<App />);
  const titleElements = screen.getAllByText(/TEKFORGE/i);
  expect(titleElements.length).toBeGreaterThan(0);
  expect(titleElements[0]).toBeInTheDocument();
});

test('renders main CTA heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Crea conexiones más fuertes/i);
  expect(headingElement).toBeInTheDocument();
});
