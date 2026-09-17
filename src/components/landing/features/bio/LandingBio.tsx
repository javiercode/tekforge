import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PortraitIcon from '@mui/icons-material/Portrait';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import './LandingBio.css';

interface LandingBioProps {
  onLaunchTool: (tabIndex: number) => void;
}

export default function LandingBio({ onLaunchTool }: LandingBioProps) {
  return (
    <Box className="landing-bio-container">
      <Grid container spacing={6} sx={{ alignItems: 'center', py: 4 }}>
        {/* Left: Info */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <PortraitIcon sx={{ fontSize: 32, color: 'secondary.main' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>
              Páginas de Enlaces (Link-in-Bio)
            </Typography>
          </Box>

          <Typography
            variant="h3"
            sx={{ fontWeight: 900, mb: 3, letterSpacing: '-0.02em', color: 'primary.main', fontSize: { xs: '2rem', sm: '2.8rem' } }}
          >
            Tu carta de presentación digital en un único enlace inteligente
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
            Diseña una página de aterrizaje móvil personalizada y optimizada para tus redes sociales (Instagram, TikTok, YouTube). Conecta con tu audiencia recopilando correos, vendiendo infoproductos o integrando multimedia sin necesidad de saber programar.
          </Typography>

          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 5 }}>
            {[
              { text: 'Enlaces ilimitados con estilos avanzados (Solid, Outline, Glassmorphism).', desc: 'Destaca tus links importantes con efectos visuales premium.' },
              { text: 'Bloques de Tienda Digital y Descargas con precios.', desc: 'Vende e-books, cursos o consultorías de forma directa.' },
              { text: 'Integración multimedia responsiva (YouTube, Spotify, Twitch).', desc: 'Permite reproducir tus videos o playlists sin salir de tu página.' },
              { text: 'Captación de Emails y suscripciones integrado.', desc: 'Crea boletines informativos y haz crecer tu audiencia al instante.' },
              { text: 'Personalización de tipografía, avatar (forma y bordes) y temas.', desc: 'Diseña según la identidad visual exacta de tu marca.' },
            ].map((item, idx) => (
              <ListItem key={idx} disableGutters sx={{ alignItems: 'flex-start', p: 0 }}>
                <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{item.text}</Typography>}
                  secondary={<Typography variant="caption" color="text.secondary">{item.desc}</Typography>}
                  sx={{ m: 0 }}
                />
              </ListItem>
            ))}
          </List>

          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => onLaunchTool(2)}
            endIcon={<KeyboardArrowRightIcon />}
            sx={{
              py: 1.8,
              px: 4,
              fontSize: '1rem',
              fontWeight: 800,
              borderRadius: 3.5,
              textTransform: 'none',
              boxShadow: '0 6px 20px rgba(238, 97, 35, 0.25)',
            }}
          >
            Crear mi Página Link-in-Bio Gratis
          </Button>
        </Grid>

        {/* Right: Phone Frame Preview */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 6,
              borderColor: 'grey.200',
              boxShadow: '0 12px 32px rgba(0,0,0,0.03)',
              bgcolor: 'grey.50',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {/* Mockup layout container */}
            <Box
              sx={{
                width: 250,
                height: 480,
                borderRadius: '32px',
                border: '8px solid #1e293b',
                bgcolor: '#0c1a30',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                position: 'relative'
              }}
            >
              <Box sx={{ width: 40, height: 10, bgcolor: '#1e293b', borderRadius: '5px', mx: 'auto', mb: 2 }} />
              <Box sx={{ width: 45, height: 45, borderRadius: '50%', bgcolor: 'secondary.main', mx: 'auto', mb: 1 }} />
              <Box sx={{ width: 80, height: 8, bgcolor: 'rgba(255,255,255,0.4)', borderRadius: 1, mx: 'auto', mb: 0.5 }} />
              <Box sx={{ width: 110, height: 5, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 1, mx: 'auto', mb: 3 }} />
              
              {/* Fake blocks */}
              <Box sx={{ width: '100%', height: 26, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, mb: 1, border: '1px solid rgba(255,255,255,0.15)' }} />
              <Box sx={{ width: '100%', height: 26, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, mb: 1.5, border: '1px solid rgba(255,255,255,0.15)' }} />
              
              {/* Fake store card */}
              <Box sx={{ width: '100%', height: 55, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3, p: 1, mb: 1.5, border: '1px dashed rgba(255,255,255,0.15)' }}>
                <Box sx={{ width: '60%', height: 6, bgcolor: 'rgba(255,255,255,0.4)', borderRadius: 1, mb: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ width: '25%', height: 8, bgcolor: 'secondary.main', borderRadius: 1 }} />
                  <Box sx={{ width: '35%', height: 12, bgcolor: '#ffffff', borderRadius: 1 }} />
                </Box>
              </Box>

              <Box sx={{ width: 60, height: 5, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 1, mx: 'auto', mt: 'auto' }} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}