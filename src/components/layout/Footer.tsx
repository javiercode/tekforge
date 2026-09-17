import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        bgcolor: 'primary.main',
        color: '#ffffff',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinkIcon sx={{ fontSize: 22, color: 'secondary.main' }} />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                letterSpacing: '.05rem',
                color: '#ffffff',
                fontSize: '1rem',
              }}
            >
              TEKFORGE
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center' }}>
            &copy; {new Date().getFullYear()} TekForge. Todos los derechos reservados.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'flex', gap: 1.5 }}>
            <Typography component="span" variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Privacidad
            </Typography>
            &bull;
            <Typography component="span" variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Términos
            </Typography>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}