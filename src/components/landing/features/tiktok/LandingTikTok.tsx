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
import CampaignIcon from '@mui/icons-material/Campaign';
import './LandingTikTok.css';

export default function LandingTikTok() {
  return (
    <Box className="landing-tiktok-container">
      <Grid container spacing={6} sx={{ alignItems: 'center', py: 4 }}>
        {/* Left: Info */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <CampaignIcon sx={{ fontSize: 32, color: 'text.disabled' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>
              Publicidad TikTok (Campañas)
            </Typography>
            <Chip label="Roadmap" color="secondary" size="small" sx={{ fontWeight: 800, fontSize: '0.65rem' }} />
          </Box>

          <Typography
            variant="h3"
            sx={{ fontWeight: 900, mb: 3, letterSpacing: '-0.02em', color: 'primary.main', fontSize: { xs: '2rem', sm: '2.8rem' } }}
          >
            Sincroniza y crea campañas publicitarias efectivas en TikTok Ads
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
            Lanza tus anuncios directamente desde un único dashboard administrativo integrado. Conéctate con las APIs oficiales de TikTok Ads para dar de alta conjuntos de anuncios, seleccionar audiencias personalizadas, subir contenido audiovisual e impulsar la conversión de tu audiencia al instante.
          </Typography>

          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
            {[
              { text: 'Conexión por API segura con TikTok Ads Manager.', desc: 'Vincula tu cuenta publicitaria en un solo clic y autoriza de forma segura.' },
              { text: 'Creación de conjuntos de anuncios rápida.', desc: 'Diseña anuncios y conjuntos de manera visual sin salir de TekForge.' },
              { text: 'Presupuestos e impresiones monitoreados de manera unificada.', desc: 'Ten visibilidad de la inversión diaria de tus campañas directamente en tu panel.' },
              { text: 'Recomendaciones de presupuestos inteligentes.', desc: 'Sugerencias automatizadas para rentabilizar la captación de prospectos.' },
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
            <CampaignIcon sx={{ fontSize: 60, color: 'text.disabled', mx: 'auto', mb: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: 'text.secondary' }}>
              Mapeado en el Roadmap Técnico
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ px: 2, lineHeight: 1.5 }}>
              Integración nativa con la plataforma publicitaria de TikTok Ads por medio de SDKs autorizados y OAuth, planificada para la fase final del año fiscal.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}