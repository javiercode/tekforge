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

const mockAddUrl = jest.fn();
const mockGetUrl = jest.fn();
const mockIncrementClicks = jest.fn();
const mockGetUserUrls = jest.fn().mockResolvedValue([]);
const mockDeleteUrl = jest.fn();
const mockGetBio = jest.fn();
const mockGetBioByUserId = jest.fn();
const mockSaveBio = jest.fn();
const mockIncrementBioViews = jest.fn();

jest.mock('./hooks/useFirestore', () => ({
  useFirestore: () => ({
    addUrl: mockAddUrl,
    getUrl: mockGetUrl,
    incrementClicks: mockIncrementClicks,
    getUserUrls: mockGetUserUrls,
    deleteUrl: mockDeleteUrl,
    getBio: mockGetBio,
    getBioByUserId: mockGetBioByUserId,
    saveBio: mockSaveBio,
    incrementBioViews: mockIncrementBioViews,
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
