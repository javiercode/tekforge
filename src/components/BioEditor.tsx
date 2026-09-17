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
  Alert,
  CircularProgress,
  InputAdornment,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckIcon from '@mui/icons-material/Check';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SaveIcon from '@mui/icons-material/Save';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import GoogleIcon from '@mui/icons-material/Google';

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

export default function BioEditor() {
  const { user, signInWithGoogle } = useAuth();
  const { getBio, getBioByUserId, saveBio, loading: dbLoading } = useFirestore();

  // Estados generales
  const [loading, setLoading] = useState(true);
  const [hasBio, setHasBio] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [setupError, setSetupError] = useState('');

  // Estados para el wizard de configuración inicial (Pasos_Creacion_Cuenta_Gratis)
  const [setupStep, setSetupStep] = useState(0);
  const [selectedNiche, setSelectedNiche] = useState('Tecnología / Programación');
  const [selectedTheme, setSelectedTheme] = useState('navy');
  const [selectedTypography, setSelectedTypography] = useState('sans-serif');
  const [selectedButtonStyle, setSelectedButtonStyle] = useState('rounded');
  const [selectedDisposicion, setSelectedDisposicion] = useState('auto');
  const [selectedAvatarShape, setSelectedAvatarShape] = useState<'circle' | 'rounded'>('circle');
  const [selectedAvatarBorderColor, setSelectedAvatarBorderColor] = useState('#ffffff');

  // Estado de los datos de la Bio
  const [bioData, setBioData] = useState<BioData>({
    username: '',
    userId: '',
    title: '',
    bio: '',
    intro: '',
    photoURL: '',
    theme: 'navy',
    buttonStyle: 'rounded',
    links: [],
    socials: {},
    createdAt: '',
    views: 0,
    headerLayout: 'default',
    bannerURL: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    customWebsiteLabel: '',
    customWebsiteURL: ''
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
          setBioData({
            ...existingBio,
            headerLayout: existingBio.headerLayout || 'default',
            bannerURL: existingBio.bannerURL || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
            customWebsiteLabel: existingBio.customWebsiteLabel || '',
            customWebsiteURL: existingBio.customWebsiteURL || ''
          });
          setHasBio(true);
        } else {
          // Inicializar plantilla por defecto
          setBioData({
            username: '',
            userId: user.uid,
            title: user.displayName || 'Mi Nombre',
            bio: 'Bienvenido a mi página de enlaces',
            intro: '',
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
              github: '',
              website: '',
            },
            createdAt: new Date().toISOString(),
            views: 0,
            headerLayout: 'default',
            bannerURL: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
            customWebsiteLabel: '',
            customWebsiteURL: ''
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

  const handleLinkFieldChange = (id: string, field: string, value: any) => {
    const updatedLinks = bioData.links.map((link) => {
      if (link.id === id) {
        return { ...link, [field]: value };
      }
      return link;
    });
    setBioData({ ...bioData, links: updatedLinks });
  };

  const handleAddBlock = (type: 'link' | 'store' | 'media' | 'email') => {
    const newLink: BioLink = {
      id: Date.now().toString(),
      label: type === 'link' ? 'Nuevo enlace' :
             type === 'store' ? 'E-Book / Curso' :
             type === 'media' ? 'Reproductor Multimedia' : 'Suscríbete a mi Boletín',
      url: type === 'email' ? '' : 'https://',
      type,
      style: 'solid',
      price: type === 'store' ? 'USD 0.00' : undefined,
      cta: type === 'store' ? 'Comprar/Descargar' : undefined,
      provider: type === 'media' ? 'YouTube' : undefined,
      input_placeholder: type === 'email' ? 'Tu correo aquí' : undefined,
      submit_button: type === 'email' ? 'Suscribirse' : undefined
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

  // Manejo de subida de foto en base64
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeInBytes = 50 * 1024; // Límite de 50 KB para Base64 eficiente en Firestore
    if (file.size > maxSizeInBytes) {
      setSaveError('La imagen supera el límite de 50 KB. Por favor selecciona una de menor tamaño.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setBioData((prev) => ({ ...prev, photoURL: base64String }));
      setSaveError(''); // Limpiar cualquier error previo
    };
    reader.onerror = () => {
      setSaveError('Error al leer el archivo de imagen.');
    };
    reader.readAsDataURL(file);
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
      <Card sx={{ maxWidth: 600, mx: 'auto', p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.05)' }}>
        <CardContent>
          <AccountCircleIcon sx={{ fontSize: 70, color: 'primary.light', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
            Páginas de Enlaces de TekForge
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.5 }}>
            Crea una hermosa página de aterrizaje móvil personalizada para colocar en tus redes sociales (Instagram, TikTok, YouTube). Gestiona todos tus enlaces importantes en un solo lugar y genera un código QR para compartirla de inmediato.
          </Typography>
          <Alert severity="info" sx={{ borderRadius: 2, textAlign: 'left', mb: 4 }}>
            Inicia sesión con Google usando el botón ubicado en la barra superior de la página para comenzar a diseñar tu página hoy mismo. ¡Es completamente gratis!
          </Alert>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={signInWithGoogle}
            startIcon={<GoogleIcon />}
            sx={{
              py: 1.8,
              px: 5,
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: 3,
              boxShadow: '0 4px 14px rgba(238, 97, 35, 0.25)',
              textTransform: 'none',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(238, 97, 35, 0.35)',
              }
            }}
          >
            Iniciar Sesión con Google
          </Button>
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
    const handleNextFromStep0 = async (e: React.FormEvent) => {
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
        const isTaken = await getBio(slug);
        if (isTaken) {
          setSetupError('Este nombre de usuario ya está ocupado. Intenta con otro.');
          setLoading(false);
          return;
        }
        setSetupStep(1);
      } catch (err) {
        setSetupError('Error al validar disponibilidad del usuario.');
      } finally {
        setLoading(false);
      }
    };

    const handleFinishSetup = async () => {
      try {
        setLoading(true);
        const slug = usernameInput.trim().toLowerCase();
        
        const newBio: BioData = {
          userId: user ? user.uid : '',
          username: slug,
          title: user?.displayName || 'Mi Nombre',
          bio: 'Bienvenido a mi página de enlaces',
          intro: 'Creador de Contenido & Emprendedor',
          photoURL: user?.photoURL || '',
          theme: selectedTheme,
          buttonStyle: selectedButtonStyle,
          nicho: selectedNiche,
          typography: selectedTypography,
          disposicion: selectedDisposicion,
          avatarShape: selectedAvatarShape,
          avatarBorderColor: selectedAvatarBorderColor,
          watermarkVisible: true,
          watermarkText: '⚡ Powered by Beacons',
          links: [
            {
              id: 'block_1',
              label: '🚀 Conecta con mis proyectos',
              url: 'https://tekforge.app',
              type: 'link',
              style: 'solid'
            },
            {
              id: 'block_2',
              label: '📚 E-Book Gratis: Mi Primer Curso',
              url: 'https://ejemplo.com/ebook',
              type: 'store',
              price: 'USD 0.00',
              cta: 'Descargar'
            },
            {
              id: 'block_3',
              label: '🎥 Mira mi último video',
              url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              type: 'media',
              provider: 'YouTube'
            },
            {
              id: 'block_4',
              label: '✉️ Suscríbete a mi newsletter',
              url: '',
              type: 'email',
              input_placeholder: 'Tu correo aquí',
              submit_button: 'Suscribirse'
            }
          ],
          socials: {
            instagram: '',
            twitter: '',
            linkedin: '',
            youtube: '',
            facebook: '',
            github: '',
            website: '',
          },
          createdAt: new Date().toISOString(),
          views: 0,
          headerLayout: 'default',
          bannerURL: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
          customWebsiteLabel: '',
          customWebsiteURL: ''
        };

        await saveBio(newBio);
        setBioData(newBio);
        setHasBio(true);
      } catch (err) {
        console.error('Error al finalizar configuración:', err);
        setSetupError(`Error al crear tu página de enlaces: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Card sx={{ maxWidth: 600, mx: 'auto', borderRadius: 4, p: { xs: 2, sm: 4 }, boxShadow: '0px 8px 32px rgba(0,0,0,0.06)' }}>
        <CardContent>
          {/* Stepper Indicator */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, gap: 1 }}>
            {[0, 1, 2].map((step) => (
              <Box
                key={step}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: setupStep === step ? 'secondary.main' : setupStep > step ? 'success.main' : 'grey.200',
                  color: setupStep >= step ? '#ffffff' : 'text.secondary',
                  fontWeight: 'bold',
                  fontSize: '0.85rem'
                }}
              >
                {step + 1}
              </Box>
            ))}
          </Box>

          {setupError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {setupError}
            </Alert>
          )}

          {/* STEP 1: CATEGORIZACIÓN & USERNAME */}
          {setupStep === 0 && (
            <Box component="form" onSubmit={handleNextFromStep0} noValidate>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
                Paso 1: Tu Identidad y Nicho
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                Elige tu nombre de usuario único y la categoría que mejor describa tu perfil.
              </Typography>

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
                sx={{ mb: 3 }}
              />

              <FormControl fullWidth sx={{ mb: 4 }}>
                <FormLabel sx={{ fontWeight: 700, mb: 1.5, fontSize: '0.9rem', color: 'text.primary' }}>
                  Selecciona tu Nicho / Categoría
                </FormLabel>
                <RadioGroup
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}
                >
                  {[
                    { label: 'Tecnología / Programación', icon: '💻' },
                    { label: 'Educación / Cursos', icon: '📚' },
                    { label: 'Música / Arte', icon: '🎵' },
                    { label: 'Moda / Estilo de vida', icon: '✨' },
                    { label: 'Negocios / Marketing', icon: '📈' },
                    { label: 'Salud / Bienestar', icon: '🏥' },
                    { label: 'Otros', icon: '🌐' }
                  ].map((nicheItem) => (
                    <Paper
                      key={nicheItem.label}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        border: '1px solid',
                        borderColor: selectedNiche === nicheItem.label ? 'secondary.main' : 'divider',
                        borderRadius: 2,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: selectedNiche === nicheItem.label ? 'rgba(238, 97, 35, 0.04)' : '#ffffff'
                      }}
                      onClick={() => setSelectedNiche(nicheItem.label)}
                    >
                      <Typography sx={{ fontSize: '1.2rem' }}>{nicheItem.icon}</Typography>
                      <FormControlLabel
                        value={nicheItem.label}
                        control={<Radio size="small" sx={{ display: 'none' }} />}
                        label={<Typography variant="body2" sx={{ fontWeight: 600 }}>{nicheItem.label}</Typography>}
                        sx={{ m: 0 }}
                      />
                    </Paper>
                  ))}
                </RadioGroup>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                disabled={!usernameInput}
                endIcon={<KeyboardArrowRightIcon />}
                sx={{ py: 1.5, fontSize: '1.05rem', borderRadius: 2 }}
              >
                Siguiente Paso
              </Button>
            </Box>
          )}

          {/* STEP 2: CONFIGURACIÓN INICIAL DE ESTILO */}
          {setupStep === 1 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
                Paso 2: Estilo & Plantilla
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                Personaliza la apariencia visual de tu página. ¡Siempre podrás cambiarla luego!
              </Typography>

              {/* Tema */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Tema Visual (Colores)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {Object.keys(THEMES).map((themeKey) => {
                  const themeDetails = THEMES[themeKey];
                  return (
                    <Paper
                      key={themeKey}
                      elevation={0}
                      sx={{
                        border: selectedTheme === themeKey ? '2px solid' : '1px solid',
                        borderColor: selectedTheme === themeKey ? 'secondary.main' : 'divider',
                        borderRadius: 2,
                        p: 1.5,
                        flexGrow: 1,
                        minWidth: 100,
                        textAlign: 'center',
                        cursor: 'pointer',
                        bgcolor: selectedTheme === themeKey ? 'rgba(238, 97, 35, 0.04)' : '#ffffff'
                      }}
                      onClick={() => setSelectedTheme(themeKey)}
                    >
                      <Box sx={{ width: '100%', height: 10, borderRadius: 1, background: themeDetails.background, mb: 1 }} />
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        {themeKey.toUpperCase()}
                      </Typography>
                    </Paper>
                  );
                })}
              </Box>

              {/* Tipografía */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Tipografía de la Página
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {[
                  { value: 'sans-serif', label: 'Moderna (Sans)', font: 'system-ui' },
                  { value: 'serif', label: 'Elegante (Serif)', font: 'Georgia' },
                  { value: 'monospace', label: 'Código (Mono)', font: 'Courier New' },
                  { value: 'cursive', label: 'Artística (Script)', font: 'Comic Sans MS' }
                ].map((item) => (
                  <Button
                    key={item.value}
                    variant={selectedTypography === item.value ? 'contained' : 'outlined'}
                    color={selectedTypography === item.value ? 'secondary' : 'primary'}
                    onClick={() => setSelectedTypography(item.value)}
                    sx={{ flexGrow: 1, fontFamily: item.font, textTransform: 'none', borderRadius: 2 }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              {/* Estilo Botón & Disposición */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Forma de los Botones
                  </Typography>
                  <FormControl fullWidth>
                    <RadioGroup
                      value={selectedButtonStyle}
                      onChange={(e) => setSelectedButtonStyle(e.target.value)}
                    >
                      <FormControlLabel value="rounded" control={<Radio size="small" />} label="Esquinas Redondeadas" />
                      <FormControlLabel value="pill" control={<Radio size="small" />} label="Forma de Píldora" />
                      <FormControlLabel value="outline" control={<Radio size="small" />} label="Contorno / Outline" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Disposición (Layout)
                  </Typography>
                  <FormControl fullWidth>
                    <RadioGroup
                      value={selectedDisposicion}
                      onChange={(e) => setSelectedDisposicion(e.target.value)}
                    >
                      <FormControlLabel value="auto" control={<Radio size="small" />} label="Adaptable Automático" />
                      <FormControlLabel value="mobile" control={<Radio size="small" />} label="Contenedor Móvil Primero" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => setSetupStep(0)}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Atrás
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => setSetupStep(2)}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Siguiente
                </Button>
              </Box>
            </Box>
          )}

          {/* STEP 3: JERARQUÍA VISUAL & PRECONFIGURACIÓN */}
          {setupStep === 2 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
                Paso 3: Jerarquía de Bloques
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                Diseñaremos tu página utilizando la jerarquía visual optimizada para cuentas gratis.
              </Typography>

              {/* Resumen de la Estructura */}
              <Paper variant="outlined" sx={{ p: 2.5, mb: 4, borderRadius: 3, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'primary.main' }}>
                  Estructura pre-poblada:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main' }} />
                    <Typography variant="body2">
                      <strong>Sección Cabecera:</strong> Foto de perfil ({selectedAvatarShape}), Título, Introducción y Barra de Redes Sociales.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main' }} />
                    <Typography variant="body2">
                      <strong>Botón Enlace:</strong> Botón directo con estilo {selectedButtonStyle}.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main' }} />
                    <Typography variant="body2">
                      <strong>Tienda Digital:</strong> Tarjeta de producto con precio y botón CTA para descargas.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main' }} />
                    <Typography variant="body2">
                      <strong>Multimedia:</strong> Reproductor para videos/música (YouTube, Spotify, Twitch).
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main' }} />
                    <Typography variant="body2">
                      <strong>Captador de Emails:</strong> Boletín de suscripción de audiencia integrado.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main' }} />
                    <Typography variant="body2">
                      <strong>Pie de Página:</strong> Marca de agua "Powered by Beacons".
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Avatar Shape Configuration in Wizard */}
              <Grid container spacing={2} sx={{ mb: 4, alignItems: 'center' }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Forma del Avatar (Foto)
                  </Typography>
                  <FormControl fullWidth>
                    <RadioGroup
                      value={selectedAvatarShape}
                      onChange={(e) => setSelectedAvatarShape(e.target.value as 'circle' | 'rounded')}
                    >
                      <FormControlLabel value="circle" control={<Radio size="small" />} label="Círculo Perfecto" />
                      <FormControlLabel value="rounded" control={<Radio size="small" />} label="Esquinas Suaves" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Color del Borde del Avatar"
                    placeholder="#ffffff"
                    value={selectedAvatarBorderColor}
                    onChange={(e) => setSelectedAvatarBorderColor(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => setSetupStep(1)}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Atrás
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={handleFinishSetup}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Crear mi página de enlace
                </Button>
              </Box>
            </Box>
          )}
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
            {/* Header / Enlace Público & Mini Dashboard */}
            <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, border: '1px solid', borderColor: 'divider', borderRadius: 4, bgcolor: '#ffffff' }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                    🔗 Tu biografía está activa
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    component="a"
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'secondary.main',
                      fontWeight: 700,
                      textDecoration: 'none',
                      wordBreak: 'break-all',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {publicUrl}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={linkCopied ? <CheckIcon /> : <ContentCopyIcon />}
                    onClick={copyBioLink}
                    color={linkCopied ? 'success' : 'primary'}
                    sx={{ py: 1, borderRadius: 2 }}
                  >
                    {linkCopied ? 'Copiado' : 'Copiar'}
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<OpenInNewIcon />}
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ py: 1, borderRadius: 2 }}
                  >
                    Visitar
                  </Button>
                </Box>
              </Box>

              {/* MINI DASHBOARD */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center', height: '100%', bgcolor: 'rgba(238, 97, 35, 0.01)' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Visualizaciones</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, my: 0.5, color: 'primary.main' }}>{bioData.views || 0}</Typography>
                    <Chip label="+14% este mes" color="success" size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 16 }} />
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center', height: '100%', bgcolor: 'rgba(238, 97, 35, 0.01)' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Clics Totales</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, my: 0.5, color: 'primary.main' }}>{Math.floor((bioData.views || 0) * 0.42)}</Typography>
                    <Chip label="+8% esta sem" color="success" size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 16 }} />
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center', height: '100%', bgcolor: 'rgba(238, 97, 35, 0.01)' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>CTR Promedio</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, my: 0.5, color: 'secondary.main' }}>{bioData.views ? '42.0%' : '0.0%'}</Typography>
                    <Chip label="Excelente CTR" color="secondary" size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 16 }} />
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'center', height: '100%', bgcolor: 'rgba(0, 0, 0, 0.01)' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', mb: 1, textAlign: 'center' }}>Tráfico</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Móvil</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>85%</Typography>
                      </Box>
                      <Box sx={{ width: '100%', height: 4, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                        <Box sx={{ width: '85%', height: '100%', bgcolor: 'secondary.main' }} />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
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

            {/* ACCORDION FORM SECTIONS TO PREVENT OVERLOAD */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              
              {/* SECCIÓN 1: INFORMACIÓN DE PERFIL (MINIMALIST) */}
              <Accordion defaultExpanded variant="outlined" sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'grey.50', py: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    👤 Información de Perfil & Banner
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Título del Perfil"
                        value={bioData.title}
                        onChange={(e) => setBioData({ ...bioData, title: e.target.value })}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Introducción (Subtítulo)"
                        value={bioData.intro || ''}
                        onChange={(e) => setBioData({ ...bioData, intro: e.target.value })}
                        placeholder="Ej. Desarrollador Web | Creador de Contenido"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="URL de Foto de Perfil"
                        value={bioData.photoURL.startsWith('data:image/') ? '(Imagen cargada en Base64)' : bioData.photoURL}
                        disabled={bioData.photoURL.startsWith('data:image/')}
                        onChange={(e) => setBioData({ ...bioData, photoURL: e.target.value })}
                        placeholder="https://ejemplo.com/mifoto.jpg"
                        variant="outlined"
                        helperText={bioData.photoURL.startsWith('data:image/') ? "Para usar URL, elimina primero la foto." : "URL directa o sube una foto con el botón de al lado."}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 0.5 }}>
                      <Button
                        variant="contained"
                        component="label"
                        color="primary"
                        size="small"
                        sx={{ py: 1, textTransform: 'none', fontWeight: 700, borderRadius: 2, flexGrow: 1 }}
                      >
                        Subir Foto
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handlePhotoUpload}
                        />
                      </Button>
                      {bioData.photoURL && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{ py: 1, textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                          onClick={() => setBioData({ ...bioData, photoURL: '' })}
                        >
                          Eliminar
                        </Button>
                      )}
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="URL de Imagen de Banner (Estilo Canvas)"
                        value={bioData.bannerURL || ''}
                        onChange={(e) => setBioData({ ...bioData, bannerURL: e.target.value })}
                        placeholder="https://images.unsplash.com/... o un gradiente pre-cargado"
                        variant="outlined"
                        helperText="Añade un banner superior horizontal. Plantillas pre-pobladas abajo."
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                        label="Biografía / Descripción (máx. 160 caracteres)"
                        value={bioData.bio}
                        slotProps={{ htmlInput: { maxLength: 160 } }}
                        onChange={(e) => setBioData({ ...bioData, bio: e.target.value })}
                        placeholder="Escribe una breve presentación atractiva de ti..."
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* SECCIÓN 2: PLANTILLAS CANVAS & PALETAS DE COLORES Presets */}
              <Accordion variant="outlined" sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'grey.50', py: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    🎨 Plantillas Canvas & Paletas de Colores
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3 }}>
                  {/* Canvas Template Presets */}
                  <FormLabel component="legend" sx={{ fontWeight: 700, mb: 1.5, fontSize: '0.85rem', color: 'text.primary' }}>
                    Plantilla de Cabecera (Canvas Layout)
                  </FormLabel>
                  <RadioGroup
                    row
                    value={bioData.headerLayout || 'default'}
                    onChange={(e) => setBioData({ ...bioData, headerLayout: e.target.value as any })}
                    sx={{ gap: 1.5, mb: 4 }}
                  >
                    {[
                      { value: 'default', label: 'Estándar (Avatar)', desc: 'Avatar circular con texto' },
                      { value: 'banner-avatar', label: 'Banner Overlap', desc: 'Banner superior y Avatar' },
                      { value: 'banner', label: 'Solo Banner', desc: 'Banner superior sin avatar' },
                      { value: 'solo-avatar', label: 'Perfil Puro', desc: 'Avatar centrado sin banner' },
                      { value: 'full-bg', label: 'Canvas Completo', desc: 'Fondo de imagen completo' }
                    ].map((item) => (
                      <Paper
                        key={item.value}
                        elevation={0}
                        sx={{
                          border: (bioData.headerLayout || 'default') === item.value ? '2px solid' : '1px solid',
                          borderColor: (bioData.headerLayout || 'default') === item.value ? 'secondary.main' : 'divider',
                          borderRadius: 2,
                          p: 1.5,
                          flexGrow: 1,
                          minWidth: 120,
                          cursor: 'pointer',
                          bgcolor: (bioData.headerLayout || 'default') === item.value ? 'rgba(238, 97, 35, 0.04)' : '#ffffff'
                        }}
                        onClick={() => setBioData({ ...bioData, headerLayout: item.value as any })}
                      >
                        <FormControlLabel
                          value={item.value}
                          control={<Radio size="small" sx={{ display: 'none' }} />}
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 800 }}>{item.label}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', mt: 0.5 }}>{item.desc}</Typography>
                            </Box>
                          }
                          sx={{ m: 0 }}
                        />
                      </Paper>
                    ))}
                  </RadioGroup>

                  {/* Preloaded Geometric Banner presets */}
                  {['banner', 'banner-avatar'].includes(bioData.headerLayout || 'default') && (
                    <Box sx={{ mb: 4 }}>
                      <FormLabel sx={{ fontWeight: 700, mb: 1, display: 'block', fontSize: '0.85rem' }}>Presets de Banner Superior</FormLabel>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {[
                          { label: 'Montaña', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
                          { label: 'Bosque', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80' },
                          { label: 'Geométrico', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
                          { label: 'Carbon Matte', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' }
                        ].map((banner) => (
                          <Chip
                            key={banner.label}
                            label={banner.label}
                            onClick={() => setBioData({ ...bioData, bannerURL: banner.url })}
                            variant={bioData.bannerURL === banner.url ? 'filled' : 'outlined'}
                            color={bioData.bannerURL === banner.url ? 'secondary' : 'default'}
                            sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Themes / Presets select */}
                  <Divider sx={{ my: 2 }} />
                  <FormControl component="fieldset" sx={{ display: 'block', mt: 2 }}>
                    <FormLabel component="legend" sx={{ fontWeight: 700, mb: 1.5, fontSize: '0.85rem', color: 'text.primary' }}>
                      Paleta de Colores Minimalista (Tema Visual)
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
                              bgcolor: bioData.theme === themeKey ? 'rgba(238, 97, 35, 0.04)' : '#ffffff'
                            }}
                            onClick={() => setBioData({ ...bioData, theme: themeKey })}
                          >
                            <Box sx={{ width: '100%', height: 10, borderRadius: 0.5, background: themeDetails.background, mb: 1 }} />
                            <FormControlLabel
                              value={themeKey}
                              control={<Radio size="small" sx={{ display: 'none' }} />}
                              label={<Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.75rem' }}>{themeKey.toUpperCase()}</Typography>}
                              sx={{ m: 0, justifyContent: 'center' }}
                            />
                          </Paper>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>

                  {/* Typography & Button Shape */}
                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <FormLabel sx={{ fontWeight: 700, mb: 1, fontSize: '0.8rem' }}>Tipografía</FormLabel>
                        <RadioGroup
                          value={bioData.typography || 'sans-serif'}
                          onChange={(e) => setBioData({ ...bioData, typography: e.target.value })}
                        >
                          <FormControlLabel value="sans-serif" control={<Radio size="small" />} label={<Typography variant="body2">Sans-Serif (Moderna)</Typography>} />
                          <FormControlLabel value="serif" control={<Radio size="small" />} label={<Typography variant="body2">Serif (Elegante)</Typography>} />
                          <FormControlLabel value="monospace" control={<Radio size="small" />} label={<Typography variant="body2">Monospace (Tech)</Typography>} />
                          <FormControlLabel value="cursive" control={<Radio size="small" />} label={<Typography variant="body2">Cursive (Artística)</Typography>} />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <FormLabel sx={{ fontWeight: 700, mb: 1, fontSize: '0.8rem' }}>Estilo Botón</FormLabel>
                        <RadioGroup
                          value={bioData.buttonStyle}
                          onChange={(e) => setBioData({ ...bioData, buttonStyle: e.target.value })}
                        >
                          <FormControlLabel value="rounded" control={<Radio size="small" />} label={<Typography variant="body2">Esquinas Redondeadas</Typography>} />
                          <FormControlLabel value="pill" control={<Radio size="small" />} label={<Typography variant="body2">Forma de Píldora</Typography>} />
                          <FormControlLabel value="outline" control={<Radio size="small" />} label={<Typography variant="body2">Contorno / Outline</Typography>} />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* SECCIÓN 3: REDES SOCIALES & URL PERSONALIZADA (MINIMALIST) */}
              <Accordion variant="outlined" sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'grey.50', py: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    🌐 Redes Sociales & Enlace Personalizado
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3 }}>
                  {/* Custom Website Label and URL */}
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'primary.main' }}>
                    🔗 Tu Sitio Web / URL Personalizada
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Texto del enlace personalizado"
                        placeholder="Visita mi portafolio web"
                        value={bioData.customWebsiteLabel || ''}
                        onChange={(e) => setBioData({ ...bioData, customWebsiteLabel: e.target.value })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="URL de destino"
                        placeholder="https://miweb.com"
                        value={bioData.customWebsiteURL || ''}
                        onChange={(e) => setBioData({ ...bioData, customWebsiteURL: e.target.value })}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  {/* Compact, Minimalist Social Inputs reveal-on-click */}
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                    📱 Enlaces de Redes Sociales
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    Introduce los enlaces de tus plataformas sociales. Se mostrarán como hermosos íconos adaptados en tu biografía.
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {[
                      { name: 'Instagram', field: 'instagram', icon: <InstagramIcon color="secondary" /> },
                      { name: 'Twitter / X', field: 'twitter', icon: <TwitterIcon color="primary" /> },
                      { name: 'LinkedIn', field: 'linkedin', icon: <LinkedInIcon color="primary" /> },
                      { name: 'YouTube', field: 'youtube', icon: <YouTubeIcon color="error" /> },
                      { name: 'Facebook', field: 'facebook', icon: <FacebookIcon color="primary" /> },
                      { name: 'GitHub', field: 'github', icon: <GitHubIcon color="action" /> },
                      { name: 'Página Web Secundaria', field: 'website', icon: <LanguageIcon color="action" /> }
                    ].map((platform) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={platform.field}>
                        <TextField
                          fullWidth
                          size="small"
                          label={platform.name}
                          placeholder="Introduce tu URL..."
                          value={bioData.socials[platform.field as keyof typeof bioData.socials] || ''}
                          onChange={(e) => handleSocialChange(platform.field, e.target.value)}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  {platform.icon}
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* SECCIÓN 4: ADMINISTRADOR DE BLOQUES DE CONTENIDO */}
              <Accordion variant="outlined" sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'grey.50', py: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    🔗 Bloques de Contenido y Jerarquía Visual
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 2 }}>
                  {/* Administrador de Enlaces we did in prompt 23 */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Agrega diferentes tipos de bloques optimizados para captar clientes, ventas de infoproductos o reproducción de medios.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddBlock('link')}
                        sx={{ py: 1, px: 2, textTransform: 'none', borderRadius: 2 }}
                      >
                        + Enlace Estándar
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        size="medium"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddBlock('store')}
                        sx={{ py: 1, px: 2, textTransform: 'none', borderRadius: 2 }}
                      >
                        + Tienda Digital
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="medium"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddBlock('media')}
                        sx={{ py: 1, px: 2, textTransform: 'none', borderRadius: 2 }}
                      >
                        + Reproductor
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        size="medium"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddBlock('email')}
                        sx={{ py: 1, px: 2, textTransform: 'none', borderRadius: 2 }}
                      >
                        + Boletín / Email
                      </Button>
                    </Box>
                  </Box>

                  <List sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: 0 }}>
                    {bioData.links.map((link, index) => (
                      <Paper
                        key={link.id}
                        elevation={0}
                        sx={{
                          p: 2.5,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 3,
                          bgcolor: '#fdfdfd',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                        }}
                      >
                        <Grid container spacing={2} sx={{ alignItems: 'flex-start' }}>
                          <Grid size={{ xs: 12 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Chip
                                label={
                                  link.type === 'store' ? '🏪 Tienda Digital' :
                                  link.type === 'media' ? '🎬 Reproductor' :
                                  link.type === 'email' ? '✉️ Captador' : '🔗 Enlace'
                                }
                                color={
                                  link.type === 'store' ? 'success' :
                                  link.type === 'media' ? 'secondary' :
                                  link.type === 'email' ? 'warning' : 'primary'
                                }
                                size="small"
                                sx={{ fontWeight: 700 }}
                              />
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => moveLink(index, 'up')}
                                  disabled={index === 0}
                                >
                                  <ArrowUpwardIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => moveLink(index, 'down')}
                                  disabled={index === bioData.links.length - 1}
                                >
                                  <ArrowDownwardIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteLink(link.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Grid>

                          {/* Campos Dinámicos según tipo */}
                          {(!link.type || link.type === 'link') && (
                            <>
                              <Grid size={{ xs: 12, sm: 5 }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Texto del Botón"
                                  value={link.label}
                                  onChange={(e) => handleLinkChange(link.id, 'label', e.target.value)}
                                  required
                                />
                              </Grid>
                              <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="URL de Destino"
                                  value={link.url}
                                  onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                                  required
                                />
                              </Grid>
                              <Grid size={{ xs: 12, sm: 3 }}>
                                <FormControl fullWidth size="small">
                                  <FormLabel sx={{ fontSize: '0.75rem', mb: 0.2 }}>Estilo</FormLabel>
                                  <RadioGroup
                                    row
                                    value={link.style || 'solid'}
                                    onChange={(e) => handleLinkFieldChange(link.id, 'style', e.target.value)}
                                  >
                                    <FormControlLabel value="solid" control={<Radio size="small" />} label={<Typography variant="caption">Solid</Typography>} />
                                    <FormControlLabel value="outline" control={<Radio size="small" />} label={<Typography variant="caption">Outline</Typography>} />
                                    <FormControlLabel value="glass" control={<Radio size="small" />} label={<Typography variant="caption">Glass</Typography>} />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                            </>
                          )}

                          {link.type === 'store' && (
                            <>
                              <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Título Producto / Curso"
                                  value={link.label}
                                  onChange={(e) => handleLinkChange(link.id, 'label', e.target.value)}
                                  required
                                />
                              </Grid>
                              <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="URL de Venta / Descarga"
                                  value={link.url}
                                  onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                                  required
                                />
                              </Grid>
                              <Grid size={{ xs: 12, sm: 2 }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Precio"
                                  value={link.price || ''}
                                  onChange={(e) => handleLinkFieldChange(link.id, 'price', e.target.value)}
                                  placeholder="USD 9.99"
                                />
                              </Grid>
                              <Grid size={{ xs: 12, sm: 2 }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="CTA"
                                  value={link.cta || ''}
                                  onChange={(e) => handleLinkFieldChange(link.id, 'cta', e.target.value)}
                                  placeholder="Comprar"
                                />
                              </Grid>
                            </>
                          )}

                          {link.type === 'media' && (
                            <>
                              <Grid size={{ xs: 12, sm: 4 }}>
                                <FormControl fullWidth size="small">
                                  <FormLabel sx={{ fontSize: '0.75rem', mb: 0.2 }}>Proveedor</FormLabel>
                                  <RadioGroup
                                    row
                                    value={link.provider || 'YouTube'}
                                    onChange={(e) => handleLinkFieldChange(link.id, 'provider', e.target.value)}
                                  >
                                    <FormControlLabel value="YouTube" control={<Radio size="small" />} label={<Typography variant="caption">YouTube</Typography>} />
                                    <FormControlLabel value="Spotify" control={<Radio size="small" />} label={<Typography variant="caption">Spotify</Typography>} />
                                    <FormControlLabel value="Twitch" control={<Radio size="small" />} label={<Typography variant="caption">Twitch</Typography>} />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                              <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Enlace del Video, Álbum o Canal"
                                  placeholder="https://youtube.com/watch?v=..."
                                  value={link.url}
                                  onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                                  required
                                />
                              </Grid>
                            </>
                          )}

                          {link.type === 'email' && (
                            <>
                              <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Llamado a la Acción"
                                  value={link.label}
                                  onChange={(e) => handleLinkChange(link.id, 'label', e.target.value)}
                                  placeholder="Suscríbete a mi newsletter"
                                />
                              </Grid>
                              <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Ayuda (Placeholder)"
                                  value={link.input_placeholder || ''}
                                  onChange={(e) => handleLinkFieldChange(link.id, 'input_placeholder', e.target.value)}
                                  placeholder="Tu correo aquí"
                                />
                              </Grid>
                              <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Texto Botón"
                                  value={link.submit_button || ''}
                                  onChange={(e) => handleLinkFieldChange(link.id, 'submit_button', e.target.value)}
                                  placeholder="Suscribirse"
                                />
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Paper>
                    ))}
                    {bioData.links.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                        No tienes bloques de contenido agregados. ¡Haz clic en los botones de arriba para comenzar!
                      </Typography>
                    )}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Box>

            {/* Código QR de tu Bio */}
            <Card variant="outlined" sx={{ borderRadius: 3, mt: 1 }}>
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 6, mt: 1 }}>
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
                fontFamily: getFontFamily(bioData.typography)
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

              {/* Dynamic canvas top banner */}
              {['banner', 'banner-avatar'].includes(bioData.headerLayout || 'default') && (
                <Box
                  sx={{
                    width: '100%',
                    height: 80,
                    backgroundImage: `url(${bioData.bannerURL || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                  }}
                />
              )}

              <Box
                sx={{
                  overflowY: 'auto',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  pt: ['banner', 'banner-avatar'].includes(bioData.headerLayout || 'default') ? 5 : 0,
                  zIndex: 2,
                  position: 'relative',
                  '&::-webkit-scrollbar': { display: 'none' }, // ocultar barra
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}
              >
                {/* Avatar focus template layouts */}
                {['default', 'banner-avatar', 'solo-avatar'].includes(bioData.headerLayout || 'default') && (
                  <Avatar
                    src={bioData.photoURL}
                    sx={{
                      width: 75,
                      height: 75,
                      border: `3px solid ${bioData.avatarBorderColor || activeTheme.text}`,
                      borderRadius: bioData.avatarShape === 'rounded' ? '16px' : '50%',
                      mb: 1.5,
                      fontSize: '1.8rem',
                      bgcolor: 'secondary.main',
                      color: '#ffffff',
                      zIndex: 3,
                      mt: bioData.headerLayout === 'banner-avatar' ? 4 : 0,
                      boxShadow: bioData.headerLayout === 'banner-avatar' ? '0px 4px 12px rgba(0,0,0,0.15)' : 'none',
                    }}
                  >
                    {bioData.title?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                )}

                {/* Título de Bio */}
                <Typography variant="body1" sx={{ fontWeight: 800, mb: 0.5, textAlign: 'center', fontSize: '1.05rem', fontFamily: 'inherit', zIndex: 3 }}>
                  {bioData.title || 'Mi Nombre'}
                </Typography>

                {/* Intro de Bio */}
                {bioData.intro && (
                  <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, textAlign: 'center', opacity: 0.9, px: 1, display: 'block', fontFamily: 'inherit', zIndex: 3 }}>
                    {bioData.intro}
                  </Typography>
                )}

                {/* Bio text */}
                <Typography variant="caption" sx={{ mb: 2, opacity: 0.85, textAlign: 'center', px: 1, display: 'block', maxHeight: 40, overflow: 'hidden', fontFamily: 'inherit', zIndex: 3 }}>
                  {bioData.bio || 'Mi biografía...'}
                </Typography>

                {/* Socials en Mockup */}
                {Object.keys(bioData.socials).some((k) => bioData.socials[k as keyof typeof bioData.socials]) && (
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, justifyContent: 'center', flexWrap: 'wrap', zIndex: 3 }}>
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
                          {platform === 'github' && <GitHubIcon />}
                          {platform === 'website' && <LanguageIcon />}
                        </Box>
                      );
                    })}
                  </Box>
                )}

                {/* Custom website inline redirection link */}
                {bioData.customWebsiteURL && bioData.customWebsiteLabel && (
                  <Box
                    sx={{
                      width: '100%',
                      py: 0.8,
                      px: 1.5,
                      borderRadius: getBorderRadius(bioData.buttonStyle),
                      bgcolor: 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(10px)',
                      color: activeTheme.text,
                      border: `1.5px dashed ${activeTheme.text}`,
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      textAlign: 'center',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.5,
                      fontFamily: 'inherit',
                      zIndex: 3
                    }}
                  >
                    🌐 {bioData.customWebsiteLabel}
                  </Box>
                )}

                {/* Links / Bloques en Mockup */}
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5, px: 0.5, zIndex: 3 }}>
                  {bioData.links.map((link) => {
                    const blockType = link.type || 'link';

                    if (blockType === 'link') {
                      const isGlass = link.style === 'glass';
                      const isOutline = link.style === 'outline';
                      return (
                        <Box
                          key={link.id}
                          sx={{
                            py: 1,
                            px: 1.5,
                            borderRadius: getBorderRadius(bioData.buttonStyle),
                            bgcolor: isOutline ? 'transparent' : isGlass ? 'rgba(255, 255, 255, 0.12)' : activeTheme.buttonBg,
                            backdropFilter: isGlass ? 'blur(6px)' : 'none',
                            color: isOutline ? activeTheme.text : isGlass ? activeTheme.text : activeTheme.buttonText,
                            borderColor: activeTheme.text,
                            border: isOutline ? `2px solid ${activeTheme.text}` : isGlass ? '1px solid rgba(255, 255, 255, 0.25)' : activeTheme.buttonBorder,
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
                            fontFamily: 'inherit'
                          }}
                        >
                          {link.label || 'Enlace'}
                        </Box>
                      );
                    }

                    if (blockType === 'store') {
                      return (
                        <Box
                          key={link.id}
                          sx={{
                            p: 1.2,
                            borderRadius: 3,
                            bgcolor: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5,
                            fontFamily: 'inherit'
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.72rem', display: 'block', textAlign: 'left', lineHeight: 1.2, fontFamily: 'inherit' }}>
                            {link.label}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.65rem', fontFamily: 'inherit' }}>
                              {link.price || 'USD 0.00'}
                            </Typography>
                            <Box
                              sx={{
                                py: 0.2,
                                px: 1,
                                borderRadius: 1.5,
                                bgcolor: activeTheme.buttonBg,
                                color: activeTheme.buttonText,
                                fontSize: '0.6rem',
                                fontWeight: 700
                              }}
                            >
                              {link.cta || 'Comprar'}
                            </Box>
                          </Box>
                        </Box>
                      );
                    }

                    if (blockType === 'media') {
                      return (
                        <Box
                          key={link.id}
                          sx={{
                            p: 1,
                            borderRadius: 3,
                            bgcolor: 'rgba(0, 0, 0, 0.25)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            height: 48,
                            fontFamily: 'inherit'
                          }}
                        >
                          <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: 'secondary.main', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid white', ml: 0.3 }} />
                          </Box>
                          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.65rem', opacity: 0.9, fontFamily: 'inherit' }}>
                            [{link.provider || 'YouTube'}] {link.label}
                          </Typography>
                        </Box>
                      );
                    }

                    if (blockType === 'email') {
                      return (
                        <Box
                          key={link.id}
                          sx={{
                            p: 1,
                            borderRadius: 3,
                            bgcolor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px dashed rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.6,
                            fontFamily: 'inherit'
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem', opacity: 0.85, fontFamily: 'inherit' }}>
                            {link.label || 'Suscríbete a mi newsletter'}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Box sx={{ flexGrow: 1, height: 24, borderRadius: 1.5, bgcolor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255,255,255,0.15)', px: 1, display: 'flex', alignItems: 'center' }}>
                              <Typography variant="caption" sx={{ fontSize: '0.55rem', opacity: 0.5, fontFamily: 'inherit' }}>
                                {link.input_placeholder || 'Tu correo aquí'}
                              </Typography>
                            </Box>
                            <Box sx={{ py: 0.3, px: 1.2, borderRadius: 1.5, bgcolor: 'secondary.main', color: '#ffffff', fontSize: '0.55rem', fontWeight: 800 }}>
                              {link.submit_button || 'Unirse'}
                            </Box>
                          </Box>
                        </Box>
                      );
                    }

                    return null;
                  })}
                </Box>
              </Box>

              {/* Pie de página en Mockup */}
              {bioData.watermarkVisible !== false && (
                <Typography variant="caption" sx={{ mt: 'auto', opacity: 0.6, fontSize: '0.55rem', letterSpacing: '0.05rem', textAlign: 'center', textTransform: 'uppercase', fontWeight: 700, fontFamily: 'inherit', zIndex: 3 }}>
                  {bioData.watermarkText || 'Powered by Beacons'}
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}