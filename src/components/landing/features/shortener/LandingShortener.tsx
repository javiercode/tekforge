import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LinkIcon from '@mui/icons-material/Link';
import './LandingShortener.css';

import URLShortenerWidget from '../../../tools/URLShortenerWidget';

export default function LandingShortener() {
  return (
    <Box className="landing-shortener-container">
      <Grid container spacing={6} sx={{ alignItems: 'flex-start', py: 4 }}>
        {/* Left: Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <LinkIcon sx={{ fontSize: 32, color: 'secondary.main' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>
              Acortador de Enlaces (URLs)
            </Typography>
          </Box>

          <Typography
            variant="h3"
            sx={{ fontWeight: 900, mb: 3, letterSpacing: '-0.02em', color: 'primary.main', fontSize: { xs: '2rem', sm: '2.8rem' } }}
          >
            Enlaces simples, potentes y completamente bajo tu marca
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
            Reduce drásticamente la longitud de tus direcciones URL para compartirlas de manera elegante. Registra alias personalizados únicos que eleven el CTR de tus biografías y publicaciones, y monitorea el rendimiento en tiempo real.
          </Typography>

          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
            {[
              { text: 'Acortamiento de enlaces automático instantáneo.', desc: 'Genera códigos aleatorios de alta seguridad para simplificar URLs largas.' },
              { text: 'Alias personalizados y memorizables.', desc: 'Crea alias amigables (ej: tekforge.app/mi-promocion) que refuercen tu marca.' },
              { text: 'Contador de clics en tiempo real.', desc: 'Supervisa cuántas visitas atrae cada enlace de forma centralizada.' },
              { text: 'Generación integrada de códigos QR.', desc: 'Cada enlace acortado viene acompañado de su propio QR descargable.' },
              { text: 'Historial de enlaces interactivo.', desc: 'Administra, copia, prueba o elimina tus enlaces guardados con facilidad.' },
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
        </Grid>

        {/* Right: Actual Functional URL Shortener Widget directly inline! */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 4 },
              borderRadius: 6,
              borderColor: 'grey.200',
              boxShadow: '0 12px 32px rgba(0,0,0,0.03)',
              bgcolor: '#ffffff',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: 'primary.main', borderBottom: '1px solid', borderColor: 'grey.100', pb: 1.5 }}>
              Acortador de Enlaces en Vivo
            </Typography>
            <URLShortenerWidget />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}