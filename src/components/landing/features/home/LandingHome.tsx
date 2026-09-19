import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import PortraitIcon from '@mui/icons-material/Portrait';
import QrCodeIcon from '@mui/icons-material/QrCode';
import LinkIcon from '@mui/icons-material/Link';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CampaignIcon from '@mui/icons-material/Campaign';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BarChartIcon from '@mui/icons-material/BarChart';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import './LandingHome.css';

interface LandingHomeProps {
  onSelectMenu: (index: number) => void;
  onLaunchTool: (tabIndex: number) => void;
}

export default function LandingHome({ onSelectMenu, onLaunchTool }: LandingHomeProps) {
  const FEATURES = [
    {
      category: 'Página de Enlaces (Link-in-Bio)',
      title: 'Ilimitados enlaces, personalización de colores, fuentes y layout.',
      description: 'Lanza una hermosa página móvil adaptable con galerías, tiendas de productos digitales, embeds de video y suscripción por email en segundos.',
      status: 'Disponible',
      menuIndex: 1,
      icon: <PortraitIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      cta: 'Ver Detalles',
      launchTab: 2,
    },
    {
      category: 'Código QR',
      title: 'Generar códigos QR personalizados.',
      description: 'Genera códigos QR de alta resolución con colores personalizables y logotipos de marca incrustados en el centro (Salud, Dentistas, Google, React, etc.).',
      status: 'Disponible',
      menuIndex: 2,
      icon: <QrCodeIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      cta: 'Ver Detalles',
      launchTab: 0,
    },
    {
      category: 'Acortador URL',
      title: 'Acortador de enlaces con alias personalizado.',
      description: 'Simplifica enlaces largos en alias ultra-cortos y de fácil memorización, ideales para biografías y publicaciones impresas, con historial y contador de clics.',
      status: 'Disponible',
      menuIndex: 3,
      icon: <LinkIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      cta: 'Ver Detalles',
      launchTab: 1,
    },
    {
      category: 'Funciones de IA',
      title: 'Optimización de contenido inteligente.',
      description: 'Funcionalidades avanzadas de backend potenciadas por NLP y modelos BERT para redactar biografías, traducir textos y optimizar tus llamados a la acción de forma autónoma.',
      status: 'Próximamente',
      menuIndex: 4,
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'text.disabled' }} />,
      cta: 'Ver Roadmap',
    },
    {
      category: 'Publicidad TikTok',
      title: 'Dashboard de campañas automatizado.',
      description: 'Administración centralizada conectada mediante APIs para configurar, publicar y optimizar tus anuncios y campañas de publicidad directamente en TikTok.',
      status: 'Roadmap',
      menuIndex: 5,
      icon: <CampaignIcon sx={{ fontSize: 40, color: 'text.disabled' }} />,
      cta: 'Ver Roadmap',
    },
    {
      category: 'Media Kit',
      title: 'Kit multimedia auto-actualizable.',
      description: 'Genera una tarjeta de presentación digital automatizada con estadísticas reales en tiempo real para pitching directo y negociaciones rápidas con marcas y patrocinadores.',
      status: 'Roadmap',
      menuIndex: 6,
      icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: 'text.disabled' }} />,
      cta: 'Ver Roadmap',
    },
    {
      category: 'Soporte / Analítica',
      title: 'Métricas de conversión avanzadas.',
      description: 'Analiza detalladamente las impresiones y clics globales, con integraciones directas para Google Analytics, Meta Pixel, redirecciones avanzadas y soporte prioritario.',
      status: 'Próximamente',
      menuIndex: 7,
      icon: <BarChartIcon sx={{ fontSize: 40, color: 'text.disabled' }} />,
      cta: 'Ver Roadmap',
    }
  ];

  return (
    <Box className="landing-home-container">
      {/* HERO SECTION */}
      <Box
        className="landing-hero-box"
        sx={{
          background: 'linear-gradient(135deg, #0c1a30 0%, #1a2a4a 100%)',
          color: '#ffffff',
          borderRadius: 6,
          py: { xs: 8, md: 10 },
          px: { xs: 3, md: 8 },
          mb: 8,
          textAlign: 'center',
          boxShadow: '0px 12px 40px rgba(12, 26, 48, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative circles */}
        <Box
          className="hero-circle-1"
          sx={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(238,97,35,0.08) 0%, rgba(255,255,255,0) 70%)',
          }}
        />
        <Box
          className="hero-circle-2"
          sx={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(238,97,35,0.08) 0%, rgba(255,255,255,0) 70%)',
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.4rem', sm: '3.5rem', md: '4rem' },
              lineHeight: 1.15,
              mb: 3,
              letterSpacing: '-0.02em',
            }}
          >
            Multiplica el Impacto de tu{' '}
            <span style={{ color: '#ee6123' }}>Presencia Digital</span>
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 6,
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1.1rem', sm: '1.3rem' },
            }}
          >
            La suite de herramientas todo en uno definitiva para creadores y marcas. Diseña hermosas páginas Link-in-Bio, crea códigos QR vectoriales con tu logo y simplifica enlaces con estadísticas en tiempo real.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => onSelectMenu(1)}
              endIcon={<KeyboardArrowRightIcon />}
              sx={{
                py: 2,
                px: 5,
                fontSize: '1.1rem',
                fontWeight: 800,
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(238, 97, 35, 0.35)',
                textTransform: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 30px rgba(238, 97, 35, 0.45)',
                },
              }}
            >
              Comenzar Gratis ahora
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.4)',
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: 3,
                textTransform: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#ffffff',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
              href="#caracteristicas"
            >
              Explorar Funciones
            </Button>
          </Box>
        </Container>
      </Box>

      {/* FEATURE SECTION */}
      <Container id="caracteristicas" maxWidth="lg" sx={{ px: 0 }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 900,
            textAlign: 'center',
            mb: 1.5,
            color: 'primary.main',
            fontSize: { xs: '1.8rem', sm: '2.5rem' },
            letterSpacing: '-0.02em',
          }}
        >
          Nuestra Plataforma de Herramientas
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            mb: 6,
            maxWidth: 600,
            mx: 'auto',
            fontSize: '1.1rem',
            lineHeight: 1.6,
          }}
        >
          Desde la gestión visual de tu bio hasta la creación de códigos QR e integraciones futuras con IA: todo lo que necesitas en un único panel de control.
        </Typography>

        <Grid container spacing={4}>
          {FEATURES.map((feat, index) => {
            const isAvailable = feat.status === 'Disponible';

            return (
              <Grid size={{ xs: 12, md: feat.menuIndex <= 3 ? 6 : 4 }} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    borderColor: isAvailable ? 'grey.200' : 'grey.100',
                    bgcolor: isAvailable ? '#ffffff' : 'grey.50',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isAvailable ? '0 4px 12px rgba(0,0,0,0.01)' : 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': isAvailable
                      ? {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(12, 26, 48, 0.04)',
                          borderColor: 'primary.light',
                        }
                      : {},
                  }}
                >
                  <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      {feat.icon}
                      <Chip
                        label={feat.status}
                        size="small"
                        color={feat.status === 'Disponible' ? 'success' : feat.status === 'Próximamente' ? 'info' : 'secondary'}
                        sx={{ fontWeight: 800, fontSize: '0.65rem' }}
                      />
                    </Box>

                    <Typography variant="caption" sx={{ fontWeight: 800, color: isAvailable ? 'primary.main' : 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.05rem', display: 'block', mb: 1 }}>
                      {feat.category}
                    </Typography>

                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: isAvailable ? 'text.primary' : 'text.disabled' }}>
                      {feat.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6, flexGrow: 1, color: isAvailable ? 'text.secondary' : 'text.disabled' }}>
                      {feat.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 'auto' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onSelectMenu(feat.menuIndex)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 700,
                          px: 2,
                        }}
                      >
                        {feat.cta}
                      </Button>
                      {isAvailable && feat.launchTab !== undefined && (
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => onLaunchTool(feat.launchTab)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 2,
                          }}
                        >
                          Ir al Panel
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}