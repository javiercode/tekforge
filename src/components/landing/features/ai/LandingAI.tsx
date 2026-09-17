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
import PsychologyIcon from '@mui/icons-material/Psychology';
import './LandingAI.css';

export default function LandingAI() {
  return (
    <Box className="landing-ai-container">
      <Grid container spacing={6} sx={{ alignItems: 'center', py: 4 }}>
        {/* Left: Info */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <PsychologyIcon sx={{ fontSize: 32, color: 'text.disabled' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>
              Funciones de Inteligencia Artificial (IA)
            </Typography>
            <Chip label="Próximamente" color="info" size="small" sx={{ fontWeight: 800, fontSize: '0.65rem' }} />
          </Box>

          <Typography
            variant="h3"
            sx={{ fontWeight: 900, mb: 3, letterSpacing: '-0.02em', color: 'primary.main', fontSize: { xs: '2rem', sm: '2.8rem' } }}
          >
            Tu redactor creativo personal integrado, potenciado por NLP
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
            ¿Te cuesta redactar la biografía perfecta o definir llamados a la acción de alto impacto? Estamos implementando un asistente de inteligencia artificial inteligente en nuestro backend potenciado por modelos NLP como BERT. Genera copys atractivos y optimiza tus tasas de conversión automáticamente.
          </Typography>

          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
            {[
              { text: 'Redactor autónomo de biografías de alto impacto.', desc: 'Ingresa palabras clave sobre tu nicho y la IA creará múltiples biografías optimizadas.' },
              { text: 'Sugerencias inteligentes de llamados a la acción (CTAs).', desc: 'Recibe recomendaciones basadas en psicología del consumidor para elevar clics.' },
              { text: 'Análisis de legibilidad y tono de voz.', desc: 'Asegúrate de que tus textos sintonicen con tu audiencia objetivo en redes sociales.' },
              { text: 'Traductor automático inteligente.', desc: 'Llega a audiencias globales traduciendo tus bloques en múltiples idiomas al instante.' },
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
            <PsychologyIcon sx={{ fontSize: 60, color: 'text.disabled', mx: 'auto', mb: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: 'text.secondary' }}>
              Mapeado en el Roadmap Técnico
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ px: 2, lineHeight: 1.5 }}>
              Servicio de optimización y sugerencia de biografía a nivel de API con procesamiento de lenguaje natural BERT en desarrollo para el siguiente trimestre.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}