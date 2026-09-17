import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

// Import feature components from their modular, dedicated folders
import LandingHome from './features/home/LandingHome';
import LandingBioView from './features/bio/LandingBio';
import LandingQRView from './features/qr/LandingQR';
import LandingShortenerView from './features/shortener/LandingShortener';
import LandingAIView from './features/ai/LandingAI';
import LandingTikTokView from './features/tiktok/LandingTikTok';
import LandingMediaKitView from './features/mediakit/LandingMediaKit';
import LandingAnalyticsView from './features/analytics/LandingAnalytics';

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Read section param from URL query ?sec=X (default 0 for Home)
  const queryParams = new URLSearchParams(location.search);
  const secParam = queryParams.get('sec');
  const activeMenu = secParam ? parseInt(secParam, 10) : 0;

  const handleLaunchTool = (tabIndex: number) => {
    navigate(`/app?tab=${tabIndex}`);
  };

  const handleSelectMenu = (index: number) => {
    navigate(`/?sec=${index}`);
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        window.scrollTo(0, 0);
      }
    }
  };

  // Scroll to top when active section changes
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        window.scrollTo(0, 0);
      }
    }
  }, [activeMenu]);

  return (
    <Box sx={{ pb: 4, transition: 'opacity 0.2s', minHeight: '500px' }}>
      {activeMenu === 0 && (
        <LandingHome onSelectMenu={handleSelectMenu} onLaunchTool={handleLaunchTool} />
      )}
      {activeMenu === 1 && (
        <LandingBioView />
      )}
      {activeMenu === 2 && (
        <LandingQRView />
      )}
      {activeMenu === 3 && (
        <LandingShortenerView />
      )}
      {activeMenu === 4 && (
        <LandingAIView />
      )}
      {activeMenu === 5 && (
        <LandingTikTokView />
      )}
      {activeMenu === 6 && (
        <LandingMediaKitView />
      )}
      {activeMenu === 7 && (
        <LandingAnalyticsView />
      )}
    </Box>
  );
}