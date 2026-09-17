import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import UrlShortener from './components/UrlShortener';
import LandingPage from './components/landing/LandingPage';
import RedirectHandler from './components/RedirectHandler';
import BioPublicPage from './components/BioPublicPage';
import Header from './components/layout/Header';
import Body from './components/layout/Body';
import Footer from './components/layout/Footer';
import { Box } from '@mui/material';

function App() {
  return (
    <HashRouter>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Header />
        <Body>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<UrlShortener />} />
            <Route path="/bio/:username" element={<BioPublicPage />} />
            <Route path="/:shortCode" element={<RedirectHandler />} />
          </Routes>
        </Body>
        <Footer />
      </Box>
    </HashRouter>
  );
}

export default App;