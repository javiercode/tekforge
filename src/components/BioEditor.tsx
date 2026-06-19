import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFirestore, BioData, BioLink } from '../hooks/useFirestore';
import { QRCodeCanvas } from 'qrcode.react';
import { THEMES } from './BioPublicPage';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton,
  List,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Tooltip,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckIcon from '@mui/icons-material/Check';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SaveIcon from '@mui/icons-material/Save';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export default function BioEditor() {
  const { user } = useAuth();
  const { getBio, getBioByUserId, saveBio, loading: dbLoading } = useFirestore();

  // Estados generales
  const [loading, setLoading] = useState(true);
  const [hasBio, setHasBio] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [setupError, setSetupError] = useState('');

  // Estado de los datos de la Bio
  const [bioData, setBioData] = useState<BioData>({
    username: '',
    userId: '',
    title: '',
    bio: '',
    photoURL: '',
    theme: 'navy',
    buttonStyle: 'rounded',
    links: [],
    socials: {},
    createdAt: '',
    views: 0,
  });

  // Estados de retroalimentación
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  // Cargar datos al iniciar
  useEffect(() => {
    const loadUserBio = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const existingBio = await getBioByUserId(user.uid);
        if (existingBio) {
          setBioData(existingBio);
          setHasBio(true);
        } else {
          // Inicializar plantilla por defecto
          setBioData({
            username: '',
            userId: user.uid,
            title: user.displayName || 'Mi Nombre',
            bio: 'Bienvenido a mi página de enlaces',
            photoURL: user.photoURL || '',
            theme: 'navy',
            buttonStyle: 'rounded',
            links: [
              { id: '1', label: 'Mi sitio web', url: 'https://ejemplo.com' },
            ],
            socials: {
              instagram: '',
              twitter: '',
              linkedin: '',
              youtube: '',
              facebook: '',
            },
            createdAt: new Date().toISOString(),
            views: 0,
          });
          setHasBio(false);
        }
      } catch (err) {
        console.error('Error cargando bio:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUserBio();
  }, [user, getBioByUserId]);

  // Manejo del registro de usuario único (Username Setup)
  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError('');

    const slug = usernameInput.trim().toLowerCase();
    if (slug.length < 3) {
      setSetupError('El nombre de usuario debe tener al menos 3 caracteres.');
      return;
    }
    if (!/^[a-z0-9-_]+$/.test(slug)) {
      setSetupError('El nombre de usuario solo puede contener letras minúsculas, números, guiones y guiones bajos.');
      return;
    }

    try {
      setLoading(true);
      // Validar disponibilidad
      const isTaken = await getBio(slug);
      if (isTaken) {
        setSetupError('Este nombre de usuario ya está ocupado. Intenta con otro.');
        setLoading(false);
        return;
      }

      // Crear bio inicial
      const newBio: BioData = {
        ...bioData,
        username: slug,
        createdAt: new Date().toISOString(),
      };

      await saveBio(newBio);
      setBioData(newBio);
      setHasBio(true);
    } catch (err) {
      setSetupError('Error al crear tu página de enlaces.');
    } finally {
      setLoading(false);
    }
  };

  // Guardar cambios en el editor
  const handleSaveBio = async () => {
    setSaveSuccess(false);
    setSaveError('');
    try {
      await saveBio(bioData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError('Ocurrió un error al guardar los cambios.');
    }
  };

  // Manejo de enlaces dinámicos
  const handleLinkChange = (id: string, field: 'label' | 'url', value: string) => {
    const updatedLinks = bioData.links.map((link) => {
      if (link.id === id) {
        return { ...link, [field]: value };
      }
      return link;
    });
    setBioData({ ...bioData, links: updatedLinks });
  };

  const handleAddLink = () => {
    const newLink: BioLink = {
      id: Date.now().toString(),
      label: 'Nuevo enlace',
      url: 'https://',
    };
    setBioData({ ...bioData, links: [...bioData.links, newLink] });
  };

  const handleDeleteLink = (id: string) => {
    const updatedLinks = bioData.links.filter((link) => link.id !== id);
    setBioData({ ...bioData, links: updatedLinks });
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    const links = [...bioData.links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    // Intercambiar
    const temp = links[index];
    links[index] = links[targetIndex];
    links[targetIndex] = temp;

    setBioData({ ...bioData, links });
  };

  // Manejo de redes sociales
  const handleSocialChange = (platform: string, value: string) => {
    setBioData({
      ...bioData,
      socials: {
        ...bioData.socials,
        [platform]: value,
      },
    });
  };

  // Copiar link de bio
  const publicUrl = `${window.location.origin}/bio/${bioData.username}`;
  const copyBioLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // Descargar código QR de la Bio
  const downloadQR = () => {
    const canvas = document.getElementById('bio-qr-canvas') as HTMLCanvasElement | null;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qr_bio_${bioData.username}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  if (!user) {
    return (
      <Card sx={{ maxWidth: 600, mx: 'auto', p: 4, textAlign: 'center', borderRadius: 4 }}>
        <CardContent>
          <AccountCircleIcon sx={{ fontSize: 70, color: 'primary.light', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
            Páginas de Enlaces de TekForge
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.5 }}>
            Crea una hermosa página de aterrizaje móvil personalizada para colocar en tus redes sociales (Instagram, TikTok, YouTube). Gestiona todos tus enlaces importantes en un solo lugar y genera un código QR para compartirla de inmediato.
          </Typography>
          <Alert severity="info" sx={{ borderRadius: 2, textAlign: 'left', mb: 3 }}>
            Inicia sesión con Google usando el botón ubicado en la barra superior de la página para comenzar a diseñar tu página hoy mismo. ¡Es completamente gratis!
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // PANTALLA DE REGISTRO DE NOMBRE DE USUARIO (SETUP)
  if (!hasBio) {
    return (
      <Card sx={{ maxWidth: 550, mx: 'auto', borderRadius: 4, p: { xs: 2, sm: 4 } }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
            Elige tu nombre de usuario para tu página
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Este nombre formará tu dirección URL pública para compartir en tu biografía de redes sociales.
          </Typography>

          {setupError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {setupError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSetupSubmit} noValidate>
            <TextField
              fullWidth
              label="Nombre de usuario (alias)"
              placeholder="mi-marca-personal"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              required
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                        tekforge.app/bio/
                      </Typography>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 4 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              disabled={!usernameInput}
              endIcon={<KeyboardArrowRightIcon />}
              sx={{ py: 1.5, fontSize: '1.05rem' }}
            >
              Crear mi página de enlace
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // VISTA DEL EDITOR ACTIVO
  const activeTheme = THEMES[bioData.theme] || THEMES.minimal;
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={4}>
        {/* PANEL IZQUIERDO: FORMULARIO DE EDICIÓN */}
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Header / Enlace Público */}
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                🔗 Tu página de enlaces está activa
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Las estadísticas registran un total de <strong>{bioData.views || 0}</strong> visualizaciones en tu perfil.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'stretch', sm: 'center' },
                  gap: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  component="a"
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'secondary.main',
                    fontWeight: 700,
                    textDecoration: 'none',
                    wordBreak: 'break-all',
                    flexGrow: 1,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {publicUrl}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={linkCopied ? <CheckIcon /> : <ContentCopyIcon />}
                    onClick={copyBioLink}
                    color={linkCopied ? 'success' : 'primary'}
                  >
                    {linkCopied ? 'Copiado' : 'Copiar'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<OpenInNewIcon />}
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visitar
                  </Button>
                </Box>
              </Box>
            </Paper>

            {saveSuccess && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                ¡Tus cambios han sido guardados y se publicaron exitosamente!
              </Alert>
            )}
            {saveError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {saveError}
              </Alert>
            )}

            {/* Configuración de Perfil */}
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Información de Perfil
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Título del Perfil"
                      value={bioData.title}
                      onChange={(e) => setBioData({ ...bioData, title: e.target.value })}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="URL de Foto de Perfil"
                      value={bioData.photoURL}
                      onChange={(e) => setBioData({ ...bioData, photoURL: e.target.value })}
                      placeholder="https://ejemplo.com/mifoto.jpg"
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Biografía / Descripción corta"
                      value={bioData.bio}
                      onChange={(e) => setBioData({ ...bioData, bio: e.target.value })}
                      placeholder="Escribe algo interesante sobre ti o tu negocio..."
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Diseño Visual */}
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
                  Diseño de Página y Estilo
                </Typography>

                {/* Selección de Tema */}
                <FormControl component="fieldset" sx={{ mb: 3, display: 'block' }}>
                  <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1.5, fontSize: '0.9rem' }}>
                    Tema Visual
                  </FormLabel>
                  <RadioGroup
                    row
                    value={bioData.theme}
                    onChange={(e) => setBioData({ ...bioData, theme: e.target.value })}
                    sx={{ gap: 1 }}
                  >
                    {Object.keys(THEMES).map((themeKey) => {
                      const themeDetails = THEMES[themeKey];
                      return (
                        <Paper
                          key={themeKey}
                          elevation={0}
                          sx={{
                            border: bioData.theme === themeKey ? '2px solid' : '1px solid',
                            borderColor: bioData.theme === themeKey ? 'secondary.main' : 'divider',
                            borderRadius: 2,
                            p: 1.5,
                            minWidth: 100,
                            textAlign: 'center',
                            cursor: 'pointer',
                          }}
                          onClick={() => setBioData({ ...bioData, theme: themeKey })}
                        >
                          <Box
                            sx={{
                              width: '100%',
                              height: 12,
                              borderRadius: 1,
                              background: themeDetails.background,
                              mb: 1,
                            }}
                          />
                          <FormControlLabel
                            value={themeKey}
                            control={<Radio size="small" sx={{ display: 'none' }} />}
                            label={
                              <Typography variant="body2" sx={{ fontWeight: bioData.theme === themeKey ? 700 : 500, m: 0 }}>
                                {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
                              </Typography>
                            }
                            sx={{ m: 0, justifyContent: 'center' }}
                          />
                        </Paper>
                      );
                    })}
                  </RadioGroup>
                </FormControl>

                <Divider sx={{ my: 2 }} />

                {/* Selección de Botones */}
                <FormControl component="fieldset" sx={{ display: 'block' }}>
                  <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1.5, fontSize: '0.9rem' }}>
                    Forma de Botones de Enlace
                  </FormLabel>
                  <RadioGroup
                    row
                    value={bioData.buttonStyle}
                    onChange={(e) => setBioData({ ...bioData, buttonStyle: e.target.value })}
                  >
                    <FormControlLabel value="rounded" control={<Radio />} label="Esquinas Redondeadas" />
                    <FormControlLabel value="pill" control={<Radio />} label="Forma de Píldora" />
                    <FormControlLabel value="outline" control={<Radio />} label="Contorno / Outline" />
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>

            {/* Redes Sociales */}
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Redes Sociales
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Instagram URL"
                      placeholder="instagram.com/usuario"
                      value={bioData.socials.instagram || ''}
                      onChange={(e) => handleSocialChange('instagram', e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <InstagramIcon color="action" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Twitter / X URL"
                      placeholder="twitter.com/usuario"
                      value={bioData.socials.twitter || ''}
                      onChange={(e) => handleSocialChange('twitter', e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <TwitterIcon color="action" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="LinkedIn URL"
                      placeholder="linkedin.com/in/usuario"
                      value={bioData.socials.linkedin || ''}
                      onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LinkedInIcon color="action" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="YouTube URL"
                      placeholder="youtube.com/canal"
                      value={bioData.socials.youtube || ''}
                      onChange={(e) => handleSocialChange('youtube', e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <YouTubeIcon color="action" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Facebook URL"
                      placeholder="facebook.com/pagina"
                      value={bioData.socials.facebook || ''}
                      onChange={(e) => handleSocialChange('facebook', e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <FacebookIcon color="action" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Administrador de Enlaces */}
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Administrar Enlaces
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={handleAddLink}
                  >
                    Agregar Enlace
                  </Button>
                </Box>

                <List sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 0 }}>
                  {bioData.links.map((link, index) => (
                    <Paper
                      key={link.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        bgcolor: 'grey.50',
                      }}
                    >
                      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <TextField
                            fullWidth
                            label="Etiqueta / Texto"
                            value={link.label}
                            onChange={(e) => handleLinkChange(link.id, 'label', e.target.value)}
                            required
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 5 }}>
                          <TextField
                            fullWidth
                            label="URL de Destino"
                            value={link.url}
                            onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                            required
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Tooltip title="Subir">
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => moveLink(index, 'up')}
                                disabled={index === 0}
                              >
                                <ArrowUpwardIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Bajar">
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => moveLink(index, 'down')}
                                disabled={index === bioData.links.length - 1}
                              >
                                <ArrowDownwardIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteLink(link.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                  {bioData.links.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                      No tienes enlaces agregados. ¡Haz clic en 'Agregar Enlace' para comenzar!
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>

            {/* Código QR de tu Bio */}
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3 }}>
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: '#ffffff',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <QRCodeCanvas
                    id="bio-qr-canvas"
                    value={publicUrl}
                    size={140}
                    fgColor="#0c1a30"
                    bgColor="#ffffff"
                    level="Q"
                    includeMargin={true}
                  />
                </Box>
                <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Código QR de tu Página
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 400 }}>
                    Descarga el código QR oficial de tu página de enlaces para colocarlo en empaques de productos, tarjetas de presentación, carteles o cartas de restaurantes.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={downloadQR}
                  >
                    Descargar QR (PNG)
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* BOTÓN FLOTANTE / STICKY DE GUARDADO */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 6 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSaveBio}
                disabled={dbLoading}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 14px rgba(238, 97, 35, 0.3)',
                  '&:hover': {
                    bgcolor: 'secondary.dark',
                    boxShadow: '0 6px 20px rgba(238, 97, 35, 0.4)',
                  },
                }}
              >
                {dbLoading ? 'Guardando...' : 'Guardar y Publicar'}
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* PANEL DERECHO: PREVISUALIZACIÓN MÓVIL EN VIVO */}
        <Grid size={{ xs: 12, md: 5, lg: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box
            sx={{
              position: 'sticky',
              top: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05rem' }}>
              Previsualización en Vivo
            </Typography>

            {/* Mockup de Celular */}
            <Box
              sx={{
                width: 290,
                height: 580,
                borderRadius: '40px',
                border: '10px solid #2d3748',
                boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                overflow: 'hidden',
                position: 'relative',
                bgcolor: activeTheme.background,
                color: activeTheme.text,
                display: 'flex',
                flexDirection: 'column',
                pt: 5,
                pb: 4,
                px: 2,
              }}
            >
              {/* Botón superior (altavoz de mockup) */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 15,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 60,
                  height: 14,
                  borderRadius: '10px',
                  bgcolor: '#2d3748',
                }}
              />

              <Box
                sx={{
                  overflowY: 'auto',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  '&::-webkit-scrollbar': { display: 'none' }, // ocultar barra
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}
              >
                {/* Avatar */}
                <Avatar
                  src={bioData.photoURL}
                  sx={{
                    width: 75,
                    height: 75,
                    border: `2px solid ${activeTheme.text}`,
                    mb: 1.5,
                    fontSize: '1.8rem',
                    bgcolor: 'secondary.main',
                    color: '#ffffff',
                  }}
                >
                  {bioData.title?.[0]?.toUpperCase() || 'U'}
                </Avatar>

                {/* Título de Bio */}
                <Typography variant="body1" sx={{ fontWeight: 800, mb: 0.5, textAlign: 'center', fontSize: '1.05rem' }}>
                  {bioData.title || 'Mi Nombre'}
                </Typography>

                {/* Bio text */}
                <Typography variant="caption" sx={{ mb: 2, opacity: 0.85, textAlign: 'center', px: 1, display: 'block', maxHeight: 40, overflow: 'hidden' }}>
                  {bioData.bio || 'Mi biografía...'}
                </Typography>

                {/* Socials en Mockup */}
                {Object.keys(bioData.socials).some((k) => bioData.socials[k as keyof typeof bioData.socials]) && (
                  <Box sx={{ display: 'flex', gap: 1, mb: 2.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {Object.entries(bioData.socials).map(([platform, val]) => {
                      if (!val) return null;
                      return (
                        <Box
                          key={platform}
                          sx={{
                            color: activeTheme.text,
                            transform: 'scale(0.8)',
                            opacity: 0.8,
                          }}
                        >
                          {platform === 'instagram' && <InstagramIcon />}
                          {platform === 'twitter' && <TwitterIcon />}
                          {platform === 'linkedin' && <LinkedInIcon />}
                          {platform === 'youtube' && <YouTubeIcon />}
                          {platform === 'facebook' && <FacebookIcon />}
                        </Box>
                      );
                    })}
                  </Box>
                )}

                {/* Links en Mockup */}
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5, px: 0.5 }}>
                  {bioData.links.map((link) => (
                    <Box
                      key={link.id}
                      sx={{
                        py: 1,
                        px: 1.5,
                        borderRadius: getBorderRadius(bioData.buttonStyle),
                        bgcolor: bioData.buttonStyle === 'outline' ? 'transparent' : activeTheme.buttonBg,
                        color: bioData.buttonStyle === 'outline' ? activeTheme.text : activeTheme.buttonText,
                        borderColor: activeTheme.text,
                        border: bioData.buttonStyle === 'outline' ? `2px solid ${activeTheme.text}` : activeTheme.buttonBorder,
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        boxShadow: 'none',
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {link.label || 'Enlace'}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Pie de página en Mockup */}
              <Typography variant="caption" sx={{ mt: 'auto', opacity: 0.5, fontSize: '0.6rem', letterSpacing: '0.05rem', textAlign: 'center' }}>
                CREADO CON TEKFORGE
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}