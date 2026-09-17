import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import QrCodeIcon from '@mui/icons-material/QrCode';
import PortraitIcon from '@mui/icons-material/Portrait';

import BioEditor from './BioEditor';
import QRGeneratorWidget from './tools/QRGeneratorWidget';
import URLShortenerWidget from './tools/URLShortenerWidget';

export default function UrlShortener() {
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam !== null) {
      const parsed = parseInt(tabParam, 10);
      if (parsed >= 0 && parsed <= 2) {
        setTabValue(parsed);
      }
    }
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: tabValue === 2 ? 1100 : 700, margin: '0 auto', px: 2, transition: 'max-width 0.3s' }}>
      {/* Title & Subtitle Section */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography
          variant="h4"
          component="h1"
          color="primary.main"
          sx={{ fontWeight: 800, mb: 1.5, fontSize: { xs: '1.8rem', sm: '2.5rem' }, letterSpacing: '-0.02em' }}
        >
          Crea conexiones más fuertes
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 550, margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.5 }}
        >
          La plataforma todo en uno para acortar tus enlaces, generar códigos QR profesionales y conectar con tu audiencia.
        </Typography>
      </Box>

      {/* Main card */}
      <Card sx={{ width: '100%', borderRadius: 4, boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTabs-flexContainer': {
              justifyContent: { xs: 'flex-start', sm: 'center' },
            },
            '& .MuiTab-root': {
              minWidth: { xs: 'auto', sm: 160 },
              py: { xs: 1.5, sm: 2 },
              fontWeight: 700,
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              textTransform: 'none'
            },
          }}
        >
          <Tab icon={<QrCodeIcon />} iconPosition="start" label="Código QR" />
          <Tab icon={<LinkIcon />} iconPosition="start" label="Acortar URL" />
          <Tab icon={<PortraitIcon />} iconPosition="start" label="Página de Enlace" />
        </Tabs>

        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          {/* TAB 0: QR CODE GENERATOR */}
          {tabValue === 0 && (
            <QRGeneratorWidget />
          )}

          {/* TAB 1: SHORTEN URL */}
          {tabValue === 1 && (
            <URLShortenerWidget />
          )}

          {/* TAB 2: LINK-IN-BIO PAGES */}
          {tabValue === 2 && (
            <BioEditor />
          )}
        </CardContent>
      </Card>
    </Box>
  );
}