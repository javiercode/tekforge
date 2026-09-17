import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import HomeIcon from '@mui/icons-material/Home';
import PortraitIcon from '@mui/icons-material/Portrait';
import QrCodeIcon from '@mui/icons-material/QrCode';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CampaignIcon from '@mui/icons-material/Campaign';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BarChartIcon from '@mui/icons-material/BarChart';
import Auth from '../Auth';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // Read section param from URL query ?sec=X
  const queryParams = new URLSearchParams(location.search);
  const secParam = queryParams.get('sec');
  const activeTab = location.pathname === '/' ? (secParam ? parseInt(secParam, 10) : 0) : -1;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    navigate(`/?sec=${newValue}`);
  };

  return (
    <AppBar
      position="static"
      color="primary"
      elevation={0}
      sx={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        bgcolor: '#0c1a30',
        zIndex: 1100,
        py: 0.5
      }}
    >
      <Container maxWidth="lg">
        {/* Single-Row Unified AppBar Toolbar */}
        <Toolbar
          disableGutters
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 1.5, md: 3 },
            minHeight: '64px',
          }}
        >
          {/* Left: Brand Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexShrink: 0 }}>
            <LinkIcon sx={{ fontSize: 26, color: 'secondary.main' }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                fontWeight: 900,
                letterSpacing: '.1rem',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '1.25rem',
              }}
            >
              TEKFORGE
            </Typography>
          </Box>

          {/* Center: Scrollable/Responsive Menu Tabs in the same row! */}
          <Box
            sx={{
              flexGrow: 1,
              maxWidth: { xs: '100%', md: 'calc(100% - 300px)' },
              display: 'flex',
              justifyContent: 'center',
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <Tabs
              value={activeTab === -1 ? false : activeTab}
              onChange={handleTabChange}
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                minHeight: '44px',
                height: '44px',
                '& .MuiTabs-flexContainer': {
                  justifyContent: 'center',
                },
                '& .MuiTab-root': {
                  minWidth: 'auto',
                  py: 0.5,
                  px: { xs: 1.2, sm: 1.5 },
                  fontWeight: 700,
                  fontSize: { xs: '0.72rem', sm: '0.78rem' },
                  textTransform: 'none',
                  color: 'rgba(255, 255, 255, 0.65)',
                  minHeight: '44px',
                  height: '44px',
                  gap: 0.5,
                  whiteSpace: 'nowrap',
                  '&.Mui-selected': {
                    color: 'secondary.main',
                  },
                  '&:hover': {
                    color: 'secondary.light',
                  }
                },
              }}
            >
              <Tab icon={<HomeIcon sx={{ fontSize: 15 }} />} iconPosition="start" label="Inicio" />
              <Tab icon={<PortraitIcon sx={{ fontSize: 15 }} />} iconPosition="start" label="Enlaces" />
              <Tab icon={<QrCodeIcon sx={{ fontSize: 15 }} />} iconPosition="start" label="QRs" />
              <Tab icon={<LinkIcon sx={{ fontSize: 15 }} />} iconPosition="start" label="Acortador" />
              <Tab icon={<PsychologyIcon sx={{ fontSize: 15 }} />} iconPosition="start" label="IA" />
              <Tab icon={<CampaignIcon sx={{ fontSize: 15 }} />} iconPosition="start" label="TikTok Ads" />
              <Tab icon={<AutoAwesomeIcon sx={{ fontSize: 15 }} />} iconPosition="start" label="Media Kit" />
              <Tab icon={<BarChartIcon sx={{ fontSize: 15 }} />} iconPosition="start" label="Analíticas" />
            </Tabs>
          </Box>

          {/* Right: Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            <Button
              component={Link}
              to="/app"
              variant="outlined"
              color="secondary"
              size="small"
              sx={{
                fontWeight: 800,
                textTransform: 'none',
                borderRadius: 2,
                borderWidth: '1.5px',
                borderColor: 'secondary.main',
                color: '#ffffff',
                px: 2,
                py: 0.5,
                fontSize: '0.8rem',
                '&:hover': {
                  borderWidth: '1.5px',
                  bgcolor: 'rgba(238, 97, 35, 0.15)',
                  borderColor: 'secondary.light',
                }
              }}
            >
              Lanzar App
            </Button>
            <Auth />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}