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
  TextField,
  Alert,
  Paper,
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
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

const getFontFamily = (typ?: string) => {
  switch (typ) {
    case 'serif':
      return "'Georgia', 'Times New Roman', serif";
    case 'monospace':
      return "'Fira Code', 'Courier New', monospace";
    case 'cursive':
      return "'Dancing Script', 'Comic Sans MS', cursive";
    case 'sans-serif':
    default:
      return "system-ui, -apple-system, sans-serif";
  }
};

export default function BioPublicPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { getBio, incrementBioViews } = useFirestore();
  const [bioData, setBioData] = useState<BioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Email collector local states
  const [subscribedEmails, setSubscribedEmails] = useState<{ [blockId: string]: string }>({});
  const [subscriptionSuccess, setSubscriptionSuccess] = useState<{ [blockId: string]: boolean }>({});

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
  const fontFamily = getFontFamily(bioData.typography);

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
      case 'github':
        return <GitHubIcon />;
      case 'website':
        return <LanguageIcon />;
      default:
        return <LanguageIcon />;
    }
  };

  const handleSubscribeSubmit = (e: React.FormEvent, blockId: string) => {
    e.preventDefault();
    const email = subscribedEmails[blockId];
    if (email && email.trim()) {
      setSubscriptionSuccess((prev) => ({ ...prev, [blockId]: true }));
      // Borrar input
      setSubscribedEmails((prev) => ({ ...prev, [blockId]: '' }));
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        setSubscriptionSuccess((prev) => ({ ...prev, [blockId]: false }));
      }, 5000);
    }
  };

  // Render de la página de bio pública
  const renderBioContent = () => (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 6,
        px: 2,
        fontFamily: fontFamily,
        minHeight: bioData.disposicion === 'mobile' ? '540px' : 'auto',
      }}
    >
      {/* Foto de Perfil */}
      <Avatar
        src={bioData.photoURL}
        alt={bioData.title}
        sx={{
          width: 100,
          height: 100,
          border: `3px solid ${bioData.avatarBorderColor || activeTheme.text}`,
          borderRadius: bioData.avatarShape === 'rounded' ? '16px' : '50%',
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
        sx={{ fontWeight: 800, textAlign: 'center', mb: 1, letterSpacing: '-0.02em', fontFamily: 'inherit' }}
      >
        {bioData.title}
      </Typography>

      {/* Introducción */}
      {bioData.intro && (
        <Typography
          variant="subtitle1"
          sx={{
            textAlign: 'center',
            fontWeight: 600,
            mb: 1.5,
            opacity: 0.85,
            fontSize: '1rem',
            maxWidth: '90%',
            fontFamily: 'inherit'
          }}
        >
          {bioData.intro}
        </Typography>
      )}

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
            fontFamily: 'inherit'
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

      {/* Listado de Enlaces/Bloques dinámicos */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5, mb: 6 }}>
        {bioData.links && bioData.links.length > 0 ? (
          bioData.links.map((link) => {
            const blockType = link.type || 'link';

            if (blockType === 'link') {
              let formattedUrl = link.url;
              if (!formattedUrl.startsWith('http')) {
                formattedUrl = `https://${formattedUrl}`;
              }

              const isGlass = link.style === 'glass';
              const isOutline = link.style === 'outline';

              return (
                <Button
                  key={link.id}
                  href={formattedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant={isOutline ? 'outlined' : 'contained'}
                  sx={{
                    py: 2,
                    px: 3,
                    borderRadius: getBorderRadius(bioData.buttonStyle),
                    bgcolor: isOutline ? 'transparent' : isGlass ? 'rgba(255, 255, 255, 0.12)' : activeTheme.buttonBg,
                    backdropFilter: isGlass ? 'blur(10px)' : 'none',
                    color: isOutline ? activeTheme.text : isGlass ? activeTheme.text : activeTheme.buttonText,
                    borderColor: activeTheme.text,
                    borderWidth: isOutline ? '2px' : undefined,
                    border: isOutline ? `2px solid ${activeTheme.text}` : isGlass ? '1px solid rgba(255, 255, 255, 0.25)' : activeTheme.buttonBorder,
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: isOutline ? 'none' : '0 4px 12px rgba(0,0,0,0.06)',
                    textAlign: 'center',
                    textTransform: 'none',
                    display: 'block',
                    width: '100%',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                      bgcolor: isOutline ? 'rgba(255, 255, 255, 0.15)' : isGlass ? 'rgba(255, 255, 255, 0.22)' : activeTheme.buttonBg,
                      opacity: 0.95,
                    },
                  }}
                >
                  {link.label}
                </Button>
              );
            }

            if (blockType === 'store') {
              let formattedUrl = link.url;
              if (!formattedUrl.startsWith('http')) {
                formattedUrl = `https://${formattedUrl}`;
              }

              return (
                <Paper
                  key={link.id}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(8px)',
                    color: activeTheme.text,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    fontFamily: 'inherit'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, textAlign: 'left', lineHeight: 1.3, fontFamily: 'inherit' }}>
                    {link.label}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.main', fontFamily: 'inherit' }}>
                      {link.price || 'USD 0.00'}
                    </Typography>
                    <Button
                      variant="contained"
                      href={formattedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="medium"
                      sx={{
                        bgcolor: activeTheme.buttonBg,
                        color: activeTheme.buttonText,
                        fontWeight: 700,
                        textTransform: 'none',
                        px: 3,
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: activeTheme.buttonBg,
                          opacity: 0.9,
                        }
                      }}
                    >
                      {link.cta || 'Comprar'}
                    </Button>
                  </Box>
                </Paper>
              );
            }

            if (blockType === 'media') {
              let embedSrc = link.url;
              
              if (link.provider === 'YouTube') {
                const videoId = link.url.split('v=')[1]?.split('&')[0] || link.url.split('youtu.be/')[1] || '';
                embedSrc = `https://www.youtube.com/embed/${videoId}`;
              } else if (link.provider === 'Spotify') {
                embedSrc = link.url.includes('spotify.com/embed') ? link.url : link.url.replace('spotify.com/', 'spotify.com/embed/');
              } else if (link.provider === 'Twitch') {
                const channel = link.url.split('twitch.tv/')[1] || '';
                embedSrc = `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`;
              }

              return (
                <Box
                  key={link.id}
                  sx={{
                    width: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    height: 180,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  }}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    src={embedSrc}
                    title={`${link.provider || 'Media'} Player`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </Box>
              );
            }

            if (blockType === 'email') {
              const hasSubscribed = subscriptionSuccess[link.id];

              return (
                <Paper
                  key={link.id}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px dashed rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    fontFamily: 'inherit'
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, textAlign: 'center', fontFamily: 'inherit' }}>
                    {link.label || 'Suscríbete a mi Boletín de Novedades'}
                  </Typography>

                  {hasSubscribed ? (
                    <Alert severity="success" sx={{ py: 0.5, borderRadius: 2 }}>
                      ¡Gracias por suscribirte!
                    </Alert>
                  ) : (
                    <Box
                      component="form"
                      onSubmit={(e) => handleSubscribeSubmit(e, link.id)}
                      sx={{ display: 'flex', gap: 1 }}
                    >
                      <TextField
                        size="small"
                        required
                        type="email"
                        placeholder={link.input_placeholder || 'Tu correo aquí'}
                        value={subscribedEmails[link.id] || ''}
                        onChange={(e) => setSubscribedEmails((prev) => ({ ...prev, [link.id]: e.target.value }))}
                        sx={{
                          flexGrow: 1,
                          bgcolor: 'rgba(255,255,255,0.06)',
                          borderRadius: 2,
                          input: { color: activeTheme.text, py: 1 },
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
                        }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          bgcolor: 'secondary.main',
                          color: '#ffffff',
                          fontWeight: 700,
                          textTransform: 'none',
                          borderRadius: 2,
                          px: 2.5,
                          '&:hover': {
                            bgcolor: 'secondary.dark',
                          }
                        }}
                      >
                        {link.submit_button || 'Unirse'}
                      </Button>
                    </Box>
                  )}
                </Paper>
              );
            }

            return null;
          })
        ) : (
          <Typography variant="body2" sx={{ opacity: 0.7, textAlign: 'center', fontFamily: 'inherit' }}>
            No hay enlaces disponibles en este momento.
          </Typography>
        )}
      </Box>

      {/* Marca de la App */}
      {bioData.watermarkVisible !== false && (
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
            fontFamily: 'inherit',
            textTransform: 'uppercase',
            '&:hover': {
              opacity: 0.9,
              textDecoration: 'underline',
            },
          }}
        >
          {bioData.watermarkText || 'Powered by Beacons'}
        </Typography>
      )}
    </Container>
  );

  // Render principal basado en la disposición
  const isMobileLayout = bioData.disposicion === 'mobile';

  if (isMobileLayout) {
    return (
      <Box
        sx={{
          bgcolor: '#0f172a', // Fondo oscuro tipo escritorio para resaltar el frame del celular
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: { xs: 0, sm: 4 },
        }}
      >
        {/* Frame de Celular en pantallas grandes, fluido en pantallas de celular */}
        <Box
          sx={{
            width: { xs: '100%', sm: '430px' },
            minHeight: { xs: '100vh', sm: '850px' },
            maxHeight: { xs: 'none', sm: '900px' },
            borderRadius: { xs: 0, sm: '48px' },
            border: { xs: 'none', sm: '12px solid #1e293b' },
            boxShadow: { xs: 'none', sm: '0 25px 50px -12px rgba(0,0,0,0.5)' },
            background: activeTheme.background,
            color: activeTheme.text,
            overflowY: 'auto',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {/* Dynamic render */}
          {renderBioContent()}
        </Box>
      </Box>
    );
  }

  // Layout fluido adaptable normal (Desktop fluid)
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
        fontFamily: fontFamily
      }}
    >
      {renderBioContent()}
    </Box>
  );
}