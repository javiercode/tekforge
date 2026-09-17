import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import './LandingMediaKit.css';

export default function LandingMediaKit() {
  return (
    <Box className="landing-mediakit-container">
      <Grid container spacing={6} sx={{ alignItems: 'center', py: 4 }}>
        {/* Left: Info */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <AutoAwesomeIcon sx={{ fontSize: 32, color: 'text.disabled' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>
              Media Kit Auto-Actualizable
            </Typography>
            <Chip label="Roadmap" color="secondary" size="small" sx={{ fontWeight: 800, fontSize: '0.65rem' }} />
          </Box>

          <Typography
            variant="h3"
            sx={{ fontWeight: 900, mb: 3, letterSpacing: '-0.02em', color: 'primary.main', fontSize: { xs: '2rem', sm: '2.8rem' } }}
          >
            Tu carta de presentación comercial auto-actualizable para marcas
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
            Consigue patrocinadores de manera rápida y profesional compartiendo un kit de prensa digital dinámico. Nuestro Media Kit automatizado extraerá métricas de clics e interacciones de tus páginas de enlaces de forma autónoma para mostrar datos verídicos y atractivos a las marcas interesadas en colaborar contigo.
          </Typography>

          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
            {[
              { text: 'Estadísticas de engagement automáticas.', desc: 'Muestra visitas y clics de tus páginas con gráficas limpias e interactivas.' },
              { text: 'Diseño ultra-profesional y comercial.', desc: 'Presenta tu audiencia, nicho, tarifas publicitarias y colaboraciones pasadas en un portafolio impecable.' },
              { text: 'Tarifario publicitario ajustable.', desc: 'Edita tus paquetes y precios de forma rápida según tus campañas vigentes.' },
              { text: 'Enlace único para marcas.', desc: 'Comparte un link exclusivo (ej: tekforge.app/bio/mi-marca/mediakit) protegido por contraseña.' },
            ].map((item, idx) => (
              <ListItem key={idx} disableGutters sx={{ alignItems: 'flex-start', p: 0 }}>
                <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                  <CheckCircleIcon color="action" fontSize="small" sx={{ color: 'text.disabled' }} />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>{item.text}</Typography>}
                  secondary={<Typography variant="caption" color="text.disabled">{item.desc}</Typography>}
                  sx={{ m: 0 }}
                />
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Right: Graphic Mockup */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            variant="outlined"
            sx={{
              p: 4,
              borderRadius: 6,
              borderColor: 'grey.100',
              bgcolor: 'grey.50',
              display: 'flex',
              flexDirection: 'column',
              opacity: 0.8,
              textAlign: 'center'
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 60, color: 'text.disabled', mx: 'auto', mb: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: 'text.secondary' }}>
              Mapeado en el Roadmap Técnico
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ px: 2, lineHeight: 1.5 }}>
              Generación automatizada de PDF de prensa y portafolio de patrocinio dinámico sincronizado directamente con la base de datos de Beacons en desarrollo.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}