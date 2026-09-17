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
import BarChartIcon from '@mui/icons-material/BarChart';
import './LandingAnalytics.css';

export default function LandingAnalytics() {
  return (
    <Box className="landing-analytics-container">
      <Grid container spacing={6} sx={{ alignItems: 'center', py: 4 }}>
        {/* Left: Info */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <BarChartIcon sx={{ fontSize: 32, color: 'text.disabled' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>
              Métricas de Conversión y Analítica
            </Typography>
            <Chip label="Próximamente" color="info" size="small" sx={{ fontWeight: 800, fontSize: '0.65rem' }} />
          </Box>

          <Typography
            variant="h3"
            sx={{ fontWeight: 900, mb: 3, letterSpacing: '-0.02em', color: 'primary.main', fontSize: { xs: '2rem', sm: '2.8rem' } }}
          >
            Sigue, analiza y optimiza cada interacción en tiempo real
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
            Consigue visibilidad absoluta sobre el comportamiento de tu audiencia en internet. Estamos preparando un módulo analítico de conversión de alto nivel que integrará píxeles y herramientas de rastreo para auditar tus clics e impresiones globales.
          </Typography>

          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
            {[
              { text: 'Integración nativa con Google Analytics (G4).', desc: 'Rastrea comportamientos profundos de tus visitantes de manera formal.' },
              { text: 'Meta Pixel e integración para anuncios de Facebook.', desc: 'Genera públicos similares y optimiza tus campañas de remarketing.' },
              { text: 'Estadísticas geográficas y de navegadores.', desc: 'Conoce desde qué países y dispositivos provienen tus mejores clientes.' },
              { text: 'Monitoreo de impresiones y tasas de clics por bloque.', desc: 'Identifica cuáles son las ofertas o enlaces que generan mayor engagement.' },
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
            <BarChartIcon sx={{ fontSize: 60, color: 'text.disabled', mx: 'auto', mb: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: 'text.secondary' }}>
              Mapeado en el Roadmap Técnico
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ px: 2, lineHeight: 1.5 }}>
              Integración automatizada para Meta Pixel, TikTok Pixel y Google Analytics, además de atención de soporte prioritario para cuentas Pro en desarrollo.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}