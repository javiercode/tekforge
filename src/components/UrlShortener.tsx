import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFirestore, UrlData } from '../hooks/useFirestore';
import { generateShortCode } from '../utils/generateShortCode';
import { QRCodeCanvas } from 'qrcode.react';
import BioEditor from './BioEditor';
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  Tooltip,
  Paper,
  Grid,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  Divider,
  CircularProgress,
  Chip,
  Avatar,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PortraitIcon from '@mui/icons-material/Portrait';
import DeleteIcon from '@mui/icons-material/Delete';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TextFieldsIcon from '@mui/icons-material/TextFields';

export default function UrlShortener() {
  // Navigation / Tabs State
  const [tabValue, setTabValue] = useState(0);

  // Link Shortener State
  const [shortenType, setShortenType] = useState<'simple' | 'custom'>('simple');
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  // Custom Alias State
  const [customOriginalUrl, setCustomOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [customShortUrl, setCustomShortUrl] = useState('');
  const [customLoading, setCustomLoading] = useState(false);
  const [customError, setCustomError] = useState('');
  const [customLinkCopied, setCustomLinkCopied] = useState(false);

  // QR Code Generator State
  const [qrType, setQrType] = useState<'url' | 'text'>('url');
  const [qrInputUrl, setQrInputUrl] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrSize, setQrSize] = useState(256);
  const [qrLogoUrl, setQrLogoUrl] = useState('');

  const { user, signInWithGoogle } = useAuth();
  const { addUrl, getUserUrls, deleteUrl, getUrl } = useFirestore();

  // Historial de Enlaces
  const [userUrls, setUserUrls] = useState<UrlData[]>([]);
  const [loadingUrls, setLoadingUrls] = useState(false);
  const [copiedUrlCode, setCopiedUrlCode] = useState<string | null>(null);

  const fetchUserUrls = useCallback(async () => {
    if (!user) return;
    setLoadingUrls(true);
    try {
      const urls = await getUserUrls(user.uid);
      setUserUrls(urls);
    } catch (err) {
      console.error('Error al cargar enlaces:', err);
    } finally {
      setLoadingUrls(false);
    }
  }, [user, getUserUrls]);

  useEffect(() => {
    if (user) {
      fetchUserUrls();
    } else {
      setUserUrls((prev) => prev.length === 0 ? prev : []);
    }
  }, [user, fetchUserUrls]);

  const handleDeleteUrl = async (shortCode: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este enlace acortado?')) return;
    try {
      await deleteUrl(shortCode);
      setUserUrls((prev) => prev.filter((u) => u.shortCode !== shortCode));
      if (shortUrl.endsWith(shortCode)) {
        setShortUrl('');
      }
    } catch (err) {
      setError('No se pudo eliminar el enlace.');
    }
  };

  const handleCopyHistoryLink = (code: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrlCode(code);
    setTimeout(() => setCopiedUrlCode(null), 2000);
  };

  const downloadHistoryQR = (code: string) => {
    const canvas = document.getElementById(`qr-canvas-${code}`) as HTMLCanvasElement | null;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qr_${code}_${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
  };

  const handleShortenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) return;

    setLoading(true);
    setError('');
    setShortUrl('');

    try {
      // Validate URL format
      new URL(originalUrl);
      const shortCode = generateShortCode();
      const shortUrlFull = `${window.location.origin}/${shortCode}`;

      // Save in Firestore
      await addUrl({
        originalUrl,
        shortCode,
        userId: user ? user.uid : 'anonymous',
        createdAt: new Date().toISOString(),
        clicks: 0,
      });

      setShortUrl(shortUrlFull);
      setOriginalUrl('');
      if (user) {
        fetchUserUrls();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'URL inválida. Asegúrate de incluir http:// o https://');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomShortenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customOriginalUrl || !customAlias) return;

    setCustomLoading(true);
    setCustomError('');
    setCustomShortUrl('');

    const aliasClean = customAlias.trim().toLowerCase();
    if (aliasClean.length < 3) {
      setCustomError('El alias debe tener al menos 3 caracteres.');
      setCustomLoading(false);
      return;
    }
    if (!/^[a-z0-9-_]+$/.test(aliasClean)) {
      setCustomError('El alias solo puede contener letras minúsculas, números, guiones y guiones bajos.');
      setCustomLoading(false);
      return;
    }

    try {
      // Validate URL format
      new URL(customOriginalUrl);

      // Check if alias is already taken
      const isTaken = await getUrl(aliasClean);
      if (isTaken) {
        setCustomError('Este alias personalizado ya está en uso. Por favor, elige otro.');
        setCustomLoading(false);
        return;
      }

      const shortUrlFull = `${window.location.origin}/${aliasClean}`;

      // Save in Firestore
      await addUrl({
        originalUrl: customOriginalUrl,
        shortCode: aliasClean,
        userId: user ? user.uid : 'anonymous',
        createdAt: new Date().toISOString(),
        clicks: 0,
      });

      setCustomShortUrl(shortUrlFull);
      setCustomOriginalUrl('');
      setCustomAlias('');
      if (user) {
        fetchUserUrls();
      }
    } catch (err) {
      setCustomError(err instanceof Error ? err.message : 'URL inválida. Asegúrate de incluir http:// o https://');
    } finally {
      setCustomLoading(false);
    }
  };

  const handleQrTypeChange = (newType: 'url' | 'text') => {
    setQrType(newType);
    setQrInputUrl('');
    setQrValue('');
    setError('');
  };

  const handleQrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInputUrl) return;

    if (qrType === 'url') {
      try {
        new URL(qrInputUrl);
        setQrValue(qrInputUrl);
        setError('');
      } catch (err) {
        setError('URL inválida. Asegúrate de incluir http:// o https://');
      }
    } else {
      const maxChars = qrSize === 128 ? 150 : qrSize === 256 ? 300 : 600;
      if (qrInputUrl.length > maxChars) {
        setError(`El texto es demasiado largo para un QR de ${qrSize}px. Máximo ${maxChars} caracteres.`);
        return;
      }
      setQrValue(qrInputUrl);
      setError('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement | null;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qr_code_${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const downloadShortenedQR = () => {
    const canvas = document.getElementById('shortened-qr-canvas') as HTMLCanvasElement | null;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qr_short_${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <Box sx={{ maxWidth: tabValue === 2 ? 1100 : 700, margin: '0 auto', px: 2, transition: 'max-width 0.3s' }}>
      {/* Title & Subtitle Section */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography
          variant="h4"
          component="h1"
          color="primary.main"
          sx={{ fontWeight: 800, mb: 1.5, fontSize: { xs: '1.8rem', sm: '2.5rem' } }}
        >
          Crea conexiones más fuertes
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 550, margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.5 }}
        >
          La plataforma todo en uno para acortar tus enlaces, generar códigos QR profesionales y conectar con tu audiencia.
        </Typography>
      </Box>

      {/* Main card */}
      <Card sx={{ width: '100%', borderRadius: 4, boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.05)' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTabs-flexContainer': {
              justifyContent: { xs: 'flex-start', sm: 'center' },
            },
            '& .MuiTab-root': {
              minWidth: { xs: 'auto', sm: 160 },
              py: { xs: 1.5, sm: 2 },
              fontWeight: 700,
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
            },
          }}
        >
          <Tab icon={<QrCodeIcon />} iconPosition="start" label="Código QR" />
          <Tab icon={<LinkIcon />} iconPosition="start" label="Acortar URL" />
          <Tab icon={<PortraitIcon />} iconPosition="start" label="Página de Enlace" />
        </Tabs>

        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* TAB 0: QR CODE GENERATOR */}
          {tabValue === 0 && (
            <Box>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem', textAlign: 'center' }}>
                    Tipo de Contenido para el QR
                  </FormLabel>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      icon={<LinkIcon />}
                      label="Enlace (URL)"
                      onClick={() => handleQrTypeChange('url')}
                      color={qrType === 'url' ? 'secondary' : 'default'}
                      variant={qrType === 'url' ? 'filled' : 'outlined'}
                      clickable
                    />
                    <Chip
                      icon={<TextFieldsIcon />}
                      label="Texto Libre"
                      onClick={() => handleQrTypeChange('text')}
                      color={qrType === 'text' ? 'secondary' : 'default'}
                      variant={qrType === 'text' ? 'filled' : 'outlined'}
                      clickable
                    />
                  </Box>
                </FormControl>
              </Box>

              <Box component="form" onSubmit={handleQrSubmit} noValidate>
                {qrType === 'url' ? (
                  <TextField
                    fullWidth
                    label="Introduce la URL para el código QR"
                    placeholder="https://ejemplo.com"
                    value={qrInputUrl}
                    onChange={(e) => setQrInputUrl(e.target.value)}
                    required
                    type="url"
                    variant="outlined"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkIcon color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ mb: 3 }}
                  />
                ) : (
                  <TextField
                    fullWidth
                    label="Introduce el texto para el código QR"
                    placeholder="Escribe el texto que deseas codificar en el código QR..."
                    value={qrInputUrl}
                    onChange={(e) => setQrInputUrl(e.target.value)}
                    required
                    multiline
                    rows={3}
                    variant="outlined"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                            <TextFieldsIcon color="action" />
                          </InputAdornment>
                        ),
                      },
                      htmlInput: {
                        maxLength: qrSize === 128 ? 150 : qrSize === 256 ? 300 : 600
                      }
                    }}
                    helperText={`${qrInputUrl.length} / ${qrSize === 128 ? 150 : qrSize === 256 ? 300 : 600} caracteres (límite adaptado al tamaño de la imagen de ${qrSize}px)`}
                    sx={{ mb: 3 }}
                  />
                )}

                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
                        Color del QR
                      </FormLabel>
                      <RadioGroup
                        row
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                      >
                        <FormControlLabel
                          value="#000000"
                          control={<Radio size="small" />}
                          label="Negro"
                        />
                        <FormControlLabel
                          value="#0c1a30"
                          control={<Radio size="small" />}
                          label="Navy Blue"
                        />
                        <FormControlLabel
                          value="#ee6123"
                          control={<Radio size="small" />}
                          label="Naranja"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
                        Tamaño (píxeles)
                      </FormLabel>
                      <RadioGroup
                        row
                        value={qrSize.toString()}
                        onChange={(e) => setQrSize(parseInt(e.target.value, 10))}
                      >
                        <FormControlLabel
                          value="128"
                          control={<Radio size="small" />}
                          label="128px"
                        />
                        <FormControlLabel
                          value="256"
                          control={<Radio size="small" />}
                          label="256px"
                        />
                        <FormControlLabel
                          value="512"
                          control={<Radio size="small" />}
                          label="512px"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 4, mt: 1 }}>
                  <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1.5, fontSize: '0.9rem', color: 'text.secondary' }}>
                    Logo en el centro del QR (Opcional)
                  </FormLabel>
                  <TextField
                    fullWidth
                    label="URL de la imagen del Logo"
                    placeholder="https://ejemplo.com/logo.png"
                    value={qrLogoUrl}
                    onChange={(e) => setQrLogoUrl(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label="Ninguno"
                      onClick={() => setQrLogoUrl('')}
                      color={qrLogoUrl === '' ? 'secondary' : 'default'}
                      variant={qrLogoUrl === '' ? 'filled' : 'outlined'}
                      clickable
                    />
                    <Chip
                      avatar={<Avatar src="https://img.icons8.com/color/48/link.png" />}
                      label="Enlace"
                      onClick={() => setQrLogoUrl('https://img.icons8.com/color/48/link.png')}
                      color={qrLogoUrl === 'https://img.icons8.com/color/48/link.png' ? 'secondary' : 'default'}
                      variant={qrLogoUrl === 'https://img.icons8.com/color/48/link.png' ? 'filled' : 'outlined'}
                      clickable
                    />
                    <Chip
                      avatar={<Avatar src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" />}
                      label="Google"
                      onClick={() => setQrLogoUrl('https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg')}
                      color={qrLogoUrl === 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' ? 'secondary' : 'default'}
                      variant={qrLogoUrl === 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' ? 'filled' : 'outlined'}
                      clickable
                    />
                    <Chip
                      avatar={<Avatar src="https://img.icons8.com/color/48/react-native.png" />}
                      label="React"
                      onClick={() => setQrLogoUrl('https://img.icons8.com/color/48/react-native.png')}
                      color={qrLogoUrl === 'https://img.icons8.com/color/48/react-native.png' ? 'secondary' : 'default'}
                      variant={qrLogoUrl === 'https://img.icons8.com/color/48/react-native.png' ? 'filled' : 'outlined'}
                      clickable
                    />
                  </Box>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  size="large"
                  disabled={!qrInputUrl}
                  endIcon={<QrCodeIcon />}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 'none',
                      bgcolor: 'secondary.dark',
                    },
                  }}
                >
                  Generar código QR
                </Button>
              </Box>

              {/* QR Code output */}
              {qrValue && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 4,
                    p: 4,
                    bgcolor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                    Tu código QR generado
                  </Typography>

                  {/* QR Canvas Wrapper */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: '#ffffff',
                      border: '1px solid',
                      borderColor: 'grey.300',
                      borderRadius: 3,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    <QRCodeCanvas
                      id="qr-canvas"
                      value={qrValue}
                      size={qrSize}
                      fgColor={qrColor}
                      bgColor="#ffffff"
                      level="H"
                      includeMargin={true}
                      imageSettings={qrLogoUrl ? {
                        src: qrLogoUrl,
                        x: undefined,
                        y: undefined,
                        height: Math.floor(qrSize * 0.2),
                        width: Math.floor(qrSize * 0.2),
                        excavate: true,
                        crossOrigin: 'anonymous',
                      } : undefined}
                    />
                  </Paper>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3, wordBreak: 'break-all', textAlign: 'center', maxWidth: '80%' }}
                  >
                    {qrType === 'url' ? 'Enlace:' : 'Texto:'} <strong>{qrValue}</strong>
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<DownloadIcon />}
                      onClick={downloadQR}
                      sx={{ px: 3 }}
                    >
                      Descargar PNG
                    </Button>
                    {qrType === 'url' && (
                      <Button
                        variant="outlined"
                        color="primary"
                        component="a"
                        href={qrValue}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<OpenInNewIcon />}
                      >
                        Probar enlace
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* TAB 1: SHORTEN URL (UNIFIED SIMPLE & CUSTOM ALIAS) */}
          {tabValue === 1 && (
            <Box>
              {!user ? (
                <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
                  <Alert severity="warning" sx={{ mb: 4, borderRadius: 3, textAlign: 'left', fontSize: '1rem', py: 2 }}>
                    La función de acortar URLs requiere iniciar sesión en este momento. Por favor, inicia sesión con Google para poder acortar tus enlaces, generar códigos QR personalizados y ver el historial y estadísticas de clics de tus enlaces.
                  </Alert>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={signInWithGoogle}
                    sx={{
                      py: 1.8,
                      px: 5,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 3,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                    }}
                  >
                    Iniciar Sesión con Google
                  </Button>
                </Box>
              ) : (
                <>
                  {/* Selector of Shorten Link Type via Radio Buttons */}
                  <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend" sx={{ fontWeight: 700, mb: 1, fontSize: '0.95rem', textAlign: 'center', color: 'text.primary' }}>
                        Tipo de Enlace Acortador
                      </FormLabel>
                      <RadioGroup
                        row
                        value={shortenType}
                        onChange={(e) => {
                          setShortenType(e.target.value as 'simple' | 'custom');
                          setError('');
                          setCustomError('');
                        }}
                      >
                        <FormControlLabel
                          value="simple"
                          control={<Radio color="secondary" size="small" />}
                          label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Enlace Simple (Automático)</Typography>}
                          sx={{ mr: { xs: 1, sm: 3 } }}
                        />
                        <FormControlLabel
                          value="custom"
                          control={<Radio color="secondary" size="small" />}
                          label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Alias Personalizado</Typography>}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>

                  {/* Render based on selected type */}
                  {shortenType === 'simple' ? (
                    <Box component="form" onSubmit={handleShortenSubmit} noValidate>
                      <TextField
                        fullWidth
                        label="Pega tu URL larga aquí"
                        placeholder="https://ejemplo.com/mi-pagina-super-larga-e-increible"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        disabled={loading}
                        required
                        variant="outlined"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <LinkIcon color="action" />
                              </InputAdornment>
                            ),
                          },
                        }}
                        sx={{ mb: 3 }}
                      />

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        size="large"
                        disabled={loading || !originalUrl}
                        endIcon={<KeyboardArrowRightIcon />}
                        sx={{
                          py: 1.5,
                          fontSize: '1.1rem',
                          boxShadow: 'none',
                          '&:hover': {
                            boxShadow: 'none',
                            bgcolor: 'secondary.dark',
                          },
                        }}
                      >
                        {loading ? 'Acortando...' : 'Acortar URL'}
                      </Button>
                    </Box>
                  ) : (
                    <Box component="form" onSubmit={handleCustomShortenSubmit} noValidate>
                      {customError && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                          {customError}
                        </Alert>
                      )}

                      <TextField
                        fullWidth
                        label="Pega tu URL larga aquí"
                        placeholder="https://ejemplo.com/mi-pagina-super-larga-e-increible"
                        value={customOriginalUrl}
                        onChange={(e) => setCustomOriginalUrl(e.target.value)}
                        disabled={customLoading}
                        required
                        variant="outlined"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <LinkIcon color="action" />
                              </InputAdornment>
                            ),
                          },
                        }}
                        sx={{ mb: 3 }}
                      />

                      <TextField
                        fullWidth
                        label="Escribe tu Alias Personalizado"
                        placeholder="ej: mi-portafolio, promo2026, etc."
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value)}
                        disabled={customLoading}
                        required
                        variant="outlined"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mr: 0.5 }}>
                                  {window.location.host}/
                                </Typography>
                              </InputAdornment>
                            ),
                          },
                        }}
                        helperText="Solo letras minúsculas, números, guiones y guiones bajos (mínimo 3 caracteres)."
                        sx={{ mb: 3 }}
                      />

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        size="large"
                        disabled={customLoading || !customOriginalUrl || !customAlias}
                        endIcon={<KeyboardArrowRightIcon />}
                        sx={{
                          py: 1.5,
                          fontSize: '1.1rem',
                          boxShadow: 'none',
                          '&:hover': {
                            boxShadow: 'none',
                            bgcolor: 'secondary.dark',
                          },
                        }}
                      >
                        {customLoading ? 'Creando enlace...' : 'Crear Enlace Personalizado'}
                      </Button>
                    </Box>
                  )}

                  {/* Short url output card for Simple shorten links */}
                  {shortenType === 'simple' && shortUrl && (
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 4,
                        p: { xs: 2, sm: 3 },
                        bgcolor: 'grey.50',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        borderRadius: 3,
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        ¡Tu enlace acortado está listo!
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'stretch', sm: 'center' },
                          gap: 2,
                          mt: 1,
                          mb: 3,
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="a"
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'secondary.main',
                            textDecoration: 'none',
                            wordBreak: 'break-all',
                            fontWeight: 700,
                            flexGrow: 1,
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {shortUrl}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Tooltip title={linkCopied ? '¡Copiado!' : 'Copiar enlace'}>
                            <Button
                              variant="outlined"
                              color={linkCopied ? 'success' : 'primary'}
                              onClick={copyToClipboard}
                              startIcon={linkCopied ? <CheckIcon /> : <ContentCopyIcon />}
                              sx={{ minWidth: 110 }}
                            >
                              {linkCopied ? 'Copiado' : 'Copiar'}
                            </Button>
                          </Tooltip>
                          <Tooltip title="Abrir enlace">
                            <IconButton
                              component="a"
                              href={shortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              color="primary"
                              sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}
                            >
                              <OpenInNewIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2.5 }} />

                      {/* QR Code Integrado para Enlace Corto */}
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            bgcolor: '#ffffff',
                            border: '1px solid',
                            borderColor: 'grey.300',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <QRCodeCanvas
                            id="shortened-qr-canvas"
                            value={shortUrl}
                            size={130}
                            fgColor="#0c1a30"
                            bgColor="#ffffff"
                            level="Q"
                            includeMargin={true}
                          />
                        </Paper>
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                            Código QR de tu Enlace Corto
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 350 }}>
                            Escanea o descarga este código QR asociado directamente a tu enlace acortado para compartirlo de manera impresa.
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<DownloadIcon />}
                            onClick={downloadShortenedQR}
                            size="small"
                          >
                            Descargar QR
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  )}

                  {/* Custom Short url output card */}
                  {shortenType === 'custom' && customShortUrl && (
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 4,
                        p: { xs: 2, sm: 3 },
                        bgcolor: 'grey.50',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        borderRadius: 3,
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        ¡Tu enlace personalizado está listo!
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'stretch', sm: 'center' },
                          gap: 2,
                          mt: 1,
                          mb: 3,
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="a"
                          href={customShortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'secondary.main',
                            textDecoration: 'none',
                            wordBreak: 'break-all',
                            fontWeight: 700,
                            flexGrow: 1,
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {customShortUrl}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Tooltip title={customLinkCopied ? '¡Copiado!' : 'Copiar enlace'}>
                            <Button
                              variant="outlined"
                              color={customLinkCopied ? 'success' : 'primary'}
                              onClick={() => {
                                navigator.clipboard.writeText(customShortUrl);
                                setCustomLinkCopied(true);
                                setTimeout(() => setCustomLinkCopied(false), 2000);
                              }}
                              startIcon={customLinkCopied ? <CheckIcon /> : <ContentCopyIcon />}
                              sx={{ minWidth: 110 }}
                            >
                              {customLinkCopied ? 'Copiado' : 'Copiar'}
                            </Button>
                          </Tooltip>
                          <Tooltip title="Abrir enlace">
                            <IconButton
                              component="a"
                              href={customShortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              color="primary"
                              sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}
                            >
                              <OpenInNewIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2.5 }} />

                      {/* QR Code Integrado para Enlace Personalizado */}
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            bgcolor: '#ffffff',
                            border: '1px solid',
                            borderColor: 'grey.300',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <QRCodeCanvas
                            id="custom-shortened-qr-canvas"
                            value={customShortUrl}
                            size={130}
                            fgColor="#0c1a30"
                            bgColor="#ffffff"
                            level="Q"
                            includeMargin={true}
                          />
                        </Paper>
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                            Código QR de tu Enlace Personalizado
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 350 }}>
                            Escanea o descarga este código QR asociado directamente a tu enlace personalizado para compartirlo.
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<DownloadIcon />}
                            onClick={() => {
                              const canvas = document.getElementById('custom-shortened-qr-canvas') as HTMLCanvasElement | null;
                              if (canvas) {
                                const pngUrl = canvas
                                  .toDataURL('image/png')
                                  .replace('image/png', 'image/octet-stream');
                                const downloadLink = document.createElement('a');
                                downloadLink.href = pngUrl;
                                downloadLink.download = `qr_custom_${Date.now()}.png`;
                                document.body.appendChild(downloadLink);
                                downloadLink.click();
                                document.body.removeChild(downloadLink);
                              }
                            }}
                            size="small"
                          >
                            Descargar QR
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  )}
                </>
              )}

              {/* Shared Link History at the bottom of Tab 1 */}
              {user && (
                <Box sx={{ mt: 5 }}>
                  <Divider sx={{ mb: 4 }} />
                  <Typography variant="h6" sx={{ fontWeight: 850, mb: 3 }}>
                    📊 Tus Enlaces Acortados
                  </Typography>

                  {loadingUrls ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress size={32} />
                    </Box>
                  ) : userUrls.length === 0 ? (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        border: '1px dashed',
                        borderColor: 'grey.300',
                        borderRadius: 3,
                        bgcolor: 'rgba(0, 0, 0, 0.01)',
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Aún no has acortado ningún enlace. ¡Pega una URL arriba para comenzar!
                      </Typography>
                    </Paper>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {userUrls.map((urlItem) => {
                        const fullShortUrl = `${window.location.origin}/${urlItem.shortCode}`;
                        return (
                          <Paper
                            key={urlItem.shortCode}
                            elevation={0}
                            sx={{
                              p: { xs: 2, sm: 3 },
                              border: '1px solid',
                              borderColor: 'grey.200',
                              borderRadius: 3,
                              bgcolor: 'background.paper',
                              '&:hover': {
                                boxShadow: '0px 4px 12px rgba(0,0,0,0.03)',
                                borderColor: 'grey.300',
                              },
                              transition: 'box-shadow 0.2s, border-color 0.2s',
                            }}
                          >
                            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                              {/* Left: Info */}
                              <Grid size={{ xs: 12, md: 7 }}>
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                  <LinkIcon color="primary" sx={{ mt: 0.5, display: { xs: 'none', sm: 'block' } }} />
                                  <Box sx={{ width: '100%', overflow: 'hidden' }}>
                                    <Typography
                                      variant="subtitle1"
                                      component="a"
                                      href={fullShortUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      sx={{
                                        fontWeight: 750,
                                        color: 'secondary.main',
                                        textDecoration: 'none',
                                        wordBreak: 'break-all',
                                        '&:hover': { textDecoration: 'underline' },
                                      }}
                                    >
                                      {fullShortUrl}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      noWrap
                                      sx={{
                                        mt: 0.5,
                                        display: 'block',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        maxWidth: '100%',
                                      }}
                                      title={urlItem.originalUrl}
                                    >
                                      Destino: {urlItem.originalUrl}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2.5, mt: 1, flexWrap: 'wrap' }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <BarChartIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                          {urlItem.clicks} {urlItem.clicks === 1 ? 'clic' : 'clics'}
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary">
                                          {new Date(urlItem.createdAt).toLocaleDateString()}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Grid>

                              {/* Right: Actions */}
                              <Grid size={{ xs: 12, md: 5 }}>
                                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1, flexWrap: 'wrap' }}>
                                  {/* Hidden QRCode for download */}
                                  <Box sx={{ display: 'none' }}>
                                    <QRCodeCanvas
                                      id={`qr-canvas-${urlItem.shortCode}`}
                                      value={fullShortUrl}
                                      size={256}
                                      level="H"
                                      includeMargin={true}
                                    />
                                  </Box>
                                  <Tooltip title={copiedUrlCode === urlItem.shortCode ? '¡Copiado!' : 'Copiar enlace'}>
                                    <IconButton
                                      color={copiedUrlCode === urlItem.shortCode ? 'success' : 'primary'}
                                      onClick={() => handleCopyHistoryLink(urlItem.shortCode, fullShortUrl)}
                                      sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}
                                    >
                                      {copiedUrlCode === urlItem.shortCode ? <CheckIcon /> : <ContentCopyIcon />}
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Abrir enlace">
                                    <IconButton
                                      component="a"
                                      href={fullShortUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      color="primary"
                                      sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}
                                    >
                                      <OpenInNewIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Descargar QR">
                                    <IconButton
                                      onClick={() => downloadHistoryQR(urlItem.shortCode)}
                                      color="primary"
                                      sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}
                                    >
                                      <DownloadIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Eliminar enlace">
                                    <IconButton
                                      onClick={() => handleDeleteUrl(urlItem.shortCode)}
                                      color="error"
                                      sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2, '&:hover': { bgcolor: '#ffebee' } }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Grid>
                            </Grid>
                          </Paper>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}

          {/* TAB 2: LINK-IN-BIO PAGES */}
          {tabValue === 2 && (
            <BioEditor />
          )}
        </CardContent>
      </Card>
    </Box>
  );
}