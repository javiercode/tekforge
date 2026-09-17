import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QrCodeIcon from '@mui/icons-material/QrCode';
import './LandingQR.css';

import QRGeneratorWidget from '../../../tools/QRGeneratorWidget';

export default function LandingQR() {
  return (
    <Box className="landing-qr-container">
      <Grid container spacing={6} sx={{ alignItems: 'flex-start', py: 4 }}>
        {/* Left: Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <QrCodeIcon sx={{ fontSize: 32, color: 'secondary.main' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>
              Código QR Personalizado
            </Typography>
          </Box>

          <Typography
            variant="h3"
            sx={{ fontWeight: 900, mb: 3, letterSpacing: '-0.02em', color: 'primary.main', fontSize: { xs: '2rem', sm: '2.8rem' } }}
          >
            Códigos QR profesionales con la identidad de tu marca
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
            Crea códigos QR estáticos o dinámicos configurando el color de primer plano, el tamaño (hasta 512px) y sobreponiendo logotipos centrales emblemáticos de manera nativa para generar confianza inmediata e impulsar tus escaneos.
          </Typography>

          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
            {[
              { text: 'Logotipos vectoriales preestablecidos.', desc: 'Incrusta logos dedicados para Salud, Dentistas, Google, React, o enlaces estándar.' },
              { text: 'Paletas de colores personalizables.', desc: 'Configura colores como Negro, Navy Blue o Naranja para combinar con tus folletos.' },
              { text: 'Tamaños flexibles de alta resolución.', desc: 'Exporta imágenes en 128px, 256px o 512px para impresiones o web.' },
              { text: 'Generación desde enlace (URL) o texto libre.', desc: 'Codifica cualquier tipo de información al instante.' },
              { text: 'Descarga instantánea en formato PNG de alta fidelidad.', desc: 'Listo para colocar en tarjetas de presentación, menús o carteles.' },
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

        {/* Right: Actual Functional QR Widget directly inline! */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 4 },
              borderRadius: 6,
              borderColor: 'grey.200',
              boxShadow: '0 12px 36px rgba(0,0,0,0.03)',
              bgcolor: '#ffffff',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: 'primary.main', borderBottom: '1px solid', borderColor: 'grey.100', pb: 1.5 }}>
              Generador de Código QR en Vivo
            </Typography>
            <QRGeneratorWidget />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}