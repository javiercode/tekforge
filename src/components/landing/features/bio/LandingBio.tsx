import React from 'react';
import { Box, Typography } from '@mui/material';
import PortraitIcon from '@mui/icons-material/Portrait';
import './LandingBio.css';

import BioEditor from '../../../BioEditor';

export default function LandingBio() {
  return (
    <Box className="landing-bio-container">
      {/* Title & Description describing biographies */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <PortraitIcon sx={{ fontSize: 32, color: 'secondary.main' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>
            Biografías y Páginas de Enlaces (Link-in-Bio)
          </Typography>
        </Box>

        <Typography
          variant="h3"
          sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.02em', color: 'primary.main', fontSize: { xs: '2rem', sm: '2.8rem' } }}
        >
          Crea y personaliza tu biografía profesional al instante
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.6, maxWidth: 800 }}>
          Diseña una página de biografía móvil totalmente adaptable para tus redes sociales. Centraliza todos tus enlaces importantes, vende productos digitales, incrusta contenido multimedia y recopila suscripciones de correo directamente en vivo.
        </Typography>
      </Box>

      {/* Actual functional Bio Editor and setup wizard inline directly! */}
      <Box sx={{ mt: 2 }}>
        <BioEditor />
      </Box>
    </Box>
  );
}