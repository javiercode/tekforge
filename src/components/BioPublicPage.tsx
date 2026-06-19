import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirestore, BioData } from '../hooks/useFirestore';
import {
  Box,
  Container,
  Avatar,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import HomeIcon from '@mui/icons-material/Home';
import LanguageIcon from '@mui/icons-material/Language';

// Definición de presets de temas visuales
export const THEMES: { [key: string]: { background: string; text: string; buttonBg: string; buttonText: string; buttonBorder?: string } } = {
  navy: {
    background: 'linear-gradient(135deg, #0c1a30 0%, #1a2a4a 100%)',
    text: '#ffffff',
    buttonBg: 'rgba(255, 255, 255, 0.1)',
    buttonText: '#ffffff',
    buttonBorder: '1px solid rgba(255, 255, 255, 0.2)',
  },
  sunset: {
    background: 'linear-gradient(135deg, #ee6123 0%, #ff007f 100%)',
    text: '#ffffff',
    buttonBg: '#ffffff',
    buttonText: '#ee6123',
  },
  midnight: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    text: '#f8fafc',
    buttonBg: '#3b82f6',
    buttonText: '#ffffff',
  },
  forest: {
    background: 'linear-gradient(135deg, #064e3b 0%, #0d9488 100%)',
    text: '#ffffff',
    buttonBg: 'rgba(255, 255, 255, 0.15)',
    buttonText: '#ffffff',
    buttonBorder: '1px solid rgba(255, 255, 255, 0.3)',
  },
  coral: {
    background: 'linear-gradient(135deg, #fecdd3 0%, #ffedd5 100%)',
    text: '#1e293b',
    buttonBg: '#ffffff',
    buttonText: '#e11d48',
  },
  minimal: {
    background: '#f8fafc',
    text: '#1e293b',
    buttonBg: '#ffffff',
    buttonText: '#0f172a',
    buttonBorder: '1px solid #e2e8f0',
  },
};

export default function BioPublicPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { getBio, incrementBioViews } = useFirestore();
  const [bioData, setBioData] = useState<BioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBio = async () => {
      if (!username) return;
      try {
        const data = await getBio(username);
        if (data) {
          setBioData(data);
          await incrementBioViews(username);
        } else {
          setError('Esta página de enlace no existe.');
        }
      } catch (err) {
        setError('Ocurrió un error al cargar la página de enlace.');
      } finally {
        setLoading(false);
      }
    };
    fetchBio();
  }, [username, getBio, incrementBioViews]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress color="primary" size={50} />
      </Box>
    );
  }

  if (error || !bioData) {
    return (
      <Container maxWidth="xs" sx={{ py: 8 }}>
        <Card sx={{ borderRadius: 4, textAlign: 'center', p: 3 }}>
          <CardContent>
            <Typography variant="h5" color="error" sx={{ fontWeight: 800, mb: 2 }}>
              404: Página no encontrada
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {error || 'La página que buscas no existe o ha sido eliminada por su creador.'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              fullWidth
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              Ir a TekForge
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Obtener el esquema de colores del tema
  const activeTheme = THEMES[bioData.theme] || THEMES.minimal;

  // Obtener el radio del botón basado en el estilo
  const getBorderRadius = (style: string) => {
    switch (style) {
      case 'pill':
        return '50px';
      case 'outline':
        return '8px';
      case 'rounded':
      default:
        return '12px';
    }
  };

  // Ícono correspondiente para las redes sociales
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <InstagramIcon />;
      case 'twitter':
        return <TwitterIcon />;
      case 'linkedin':
        return <LinkedInIcon />;
      case 'youtube':
        return <YouTubeIcon />;
      case 'facebook':
        return <FacebookIcon />;
      default:
        return <LanguageIcon />;
    }
  };

  return (
    <Box
      sx={{
        background: activeTheme.background,
        color: activeTheme.text,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 8,
        pb: 6,
        px: 2,
      }}
    >
      <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Foto de Perfil */}
        <Avatar
          src={bioData.photoURL}
          alt={bioData.title}
          sx={{
            width: 100,
            height: 100,
            border: `3px solid ${activeTheme.text}`,
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            mb: 3,
            fontSize: '2.5rem',
            bgcolor: 'secondary.main',
            color: '#ffffff',
          }}
        >
          {bioData.title?.[0]?.toUpperCase() || 'U'}
        </Avatar>

        {/* Título */}
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 800, textAlign: 'center', mb: 1, letterSpacing: '-0.02em' }}
        >
          {bioData.title}
        </Typography>

        {/* Biografía */}
        {bioData.bio && (
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              mb: 3,
              opacity: 0.9,
              fontSize: '1rem',
              maxWidth: '90%',
              lineHeight: 1.4,
            }}
          >
            {bioData.bio}
          </Typography>
        )}

        {/* Redes Sociales */}
        {bioData.socials && Object.keys(bioData.socials).some((key) => bioData.socials[key as keyof typeof bioData.socials]) && (
          <Box sx={{ display: 'flex', gap: 1.5, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            {Object.entries(bioData.socials).map(([platform, value]) => {
              if (!value) return null;
              // Asegurar que comience con http/https
              const url = value.startsWith('http') ? value : `https://${value}`;
              return (
                <IconButton
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: activeTheme.text,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.15)',
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  {getSocialIcon(platform)}
                </IconButton>
              );
            })}
          </Box>
        )}

        {/* Listado de Enlaces */}
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5, mb: 6 }}>
          {bioData.links && bioData.links.length > 0 ? (
            bioData.links.map((link) => {
              // Validar url
              let formattedUrl = link.url;
              if (!formattedUrl.startsWith('http')) {
                formattedUrl = `https://${formattedUrl}`;
              }

              return (
                <Button
                  key={link.id}
                  href={formattedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant={bioData.buttonStyle === 'outline' ? 'outlined' : 'contained'}
                  sx={{
                    py: 2,
                    px: 3,
                    borderRadius: getBorderRadius(bioData.buttonStyle),
                    bgcolor: bioData.buttonStyle === 'outline' ? 'transparent' : activeTheme.buttonBg,
                    color: bioData.buttonStyle === 'outline' ? activeTheme.text : activeTheme.buttonText,
                    borderColor: activeTheme.text,
                    borderWidth: bioData.buttonStyle === 'outline' ? '2px' : undefined,
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: bioData.buttonStyle === 'outline' ? 'none' : '0 4px 12px rgba(0,0,0,0.06)',
                    textAlign: 'center',
                    textTransform: 'none',
                    display: 'block',
                    width: '100%',
                    border: activeTheme.buttonBorder,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                      bgcolor: bioData.buttonStyle === 'outline' ? 'rgba(255, 255, 255, 0.1)' : activeTheme.buttonBg,
                      borderColor: activeTheme.text,
                      borderWidth: bioData.buttonStyle === 'outline' ? '2px' : undefined,
                      opacity: 0.95,
                    },
                  }}
                >
                  {link.label}
                </Button>
              );
            })
          ) : (
            <Typography variant="body2" sx={{ opacity: 0.7, textAlign: 'center' }}>
              No hay enlaces disponibles en este momento.
            </Typography>
          )}
        </Box>

        {/* Marca de la App */}
        <Typography
          variant="caption"
          component="a"
          href="/"
          sx={{
            opacity: 0.6,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 800,
            letterSpacing: '0.05rem',
            '&:hover': {
              opacity: 0.9,
              textDecoration: 'underline',
            },
          }}
        >
          CREADO CON TEKFORGE
        </Typography>
      </Container>
    </Box>
  );
}