import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import BarChartIcon from '@mui/icons-material/BarChart';
import { QRCodeCanvas } from 'qrcode.react';

import { useAuth } from '../../hooks/useAuth';
import { useFirestore, UrlData } from '../../hooks/useFirestore';
import { generateShortCode } from '../../utils/generateShortCode';

export default function URLShortenerWidget() {
  const { user } = useAuth();
  const { addUrl, getUserUrls, deleteUrl, getUrl } = useFirestore();

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

  // Historial de Enlaces
  const [userUrls, setUserUrls] = useState<UrlData[]>([]);
  const [copiedUrlCode, setCopiedUrlCode] = useState<string | null>(null);

  // Session-based anonymous URLs
  const [anonUrls, setAnonUrls] = useState<UrlData[]>([]);

  const fetchUserUrls = useCallback(async () => {
    if (!user) return;
    try {
      const urls = await getUserUrls(user.uid);
      setUserUrls(urls);
    } catch (err) {
      console.error('Error al cargar enlaces:', err);
    }
  }, [user, getUserUrls]);

  useEffect(() => {
    if (user) {
      fetchUserUrls();
    } else {
      setUserUrls([]);
    }
  }, [user, fetchUserUrls]);

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

      const newUrlData: UrlData = {
        originalUrl,
        shortCode,
        userId: user ? user.uid : 'anonymous',
        createdAt: new Date().toISOString(),
        clicks: 0,
      };

      // Save in Firestore
      await addUrl(newUrlData);

      setShortUrl(shortUrlFull);

      if (user) {
        setUserUrls((prev) => [newUrlData, ...prev]);
      } else {
        setAnonUrls((prev) => [newUrlData, ...prev]);
      }

      setOriginalUrl('');
    } catch (err) {
      setError(err instanceof Error && err.message.includes('URL') 
        ? 'URL inválida. Asegúrate de incluir http:// o https://' 
        : 'Error al acortar el enlace. Intenta de nuevo.');
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
    if (!/^[a-z0-9-_]+$/.test(aliasClean)) {
      setCustomError('El alias solo puede contener letras minúsculas, números, guiones y guiones bajos.');
      setCustomLoading(false);
      return;
    }

    try {
      new URL(customOriginalUrl);

      // Check if alias is already taken
      const existing = await getUrl(aliasClean);
      if (existing) {
        setCustomError('Este alias personalizado ya está en uso. Elige otro.');
        setCustomLoading(false);
        return;
      }

      const shortUrlFull = `${window.location.origin}/${aliasClean}`;

      const newUrlData: UrlData = {
        originalUrl: customOriginalUrl,
        shortCode: aliasClean,
        userId: user ? user.uid : 'anonymous',
        createdAt: new Date().toISOString(),
        clicks: 0,
      };

      // Save in Firestore
      await addUrl(newUrlData);

      setCustomShortUrl(shortUrlFull);

      if (user) {
        setUserUrls((prev) => [newUrlData, ...prev]);
      } else {
        setAnonUrls((prev) => [newUrlData, ...prev]);
      }

      setCustomOriginalUrl('');
      setCustomAlias('');
    } catch (err) {
      setCustomError(err instanceof Error && err.message.includes('URL') 
        ? 'URL inválida. Asegúrate de incluir http:// o https://' 
        : 'Error al crear el alias. Intenta de nuevo.');
    } finally {
      setCustomLoading(false);
    }
  };

  const handleDeleteUrl = async (shortCode: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este enlace acortado?')) return;
    try {
      await deleteUrl(shortCode);
      setUserUrls((prev) => prev.filter((u) => u.shortCode !== shortCode));
      setAnonUrls((prev) => prev.filter((u) => u.shortCode !== shortCode));
      if (shortUrl.endsWith(shortCode)) setShortUrl('');
      if (customShortUrl.endsWith(shortCode)) setCustomShortUrl('');
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
    const canvas = document.getElementById(`qr-canvas-history-${code}`) as HTMLCanvasElement | null;
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

  const downloadWidgetQR = (canvasId: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
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

  const activeUrls = user ? userUrls : anonUrls;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Selector de tipo */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
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

      {/* Formulario de Acortado Simple */}
      {shortenType === 'simple' ? (
        <Box component="form" onSubmit={handleShortenSubmit} noValidate>
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            label="Pega tu URL larga aquí"
            placeholder="https://ejemplo.com/mi-pagina-super-larga-e-increible"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
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
            {loading ? 'Acortando...' : 'Acortar Enlace'}
          </Button>

          {/* Resultado Simple */}
          {shortUrl && (
            <Paper variant="outlined" sx={{ mt: 4, p: 3, borderRadius: 3, bgcolor: 'rgba(238, 97, 35, 0.02)', borderColor: 'secondary.light' }}>
              <Typography variant="subtitle2" color="secondary.main" sx={{ fontWeight: 800, mb: 1.5 }}>
                ¡Enlace acortado con éxito!
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField
                 fullWidth
                 size="small"
                 value={shortUrl}
                 slotProps={{ input: { readOnly: true } }}
                 sx={{ bgcolor: '#ffffff' }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(shortUrl);
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 2000);
                  }}
                  startIcon={linkCopied ? <CheckIcon /> : <ContentCopyIcon />}
                >
                  {linkCopied ? 'Copiado' : 'Copiar'}
                </Button>
              </Box>

              <Grid container spacing={3} sx={{ alignItems: 'center' }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#ffffff', border: '1px solid', borderColor: 'grey.200', borderRadius: 2, display: 'inline-flex' }}>
                    <QRCodeCanvas
                      id="shortened-qr-canvas-simple"
                      value={shortUrl}
                      size={110}
                      includeMargin={true}
                    />
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Escanea este código QR para abrir el enlace de manera inmediata desde un dispositivo móvil.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => downloadWidgetQR('shortened-qr-canvas-simple')}
                  >
                    Descargar QR
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>
      ) : (
        /* Formulario de Alias Personalizado */
        <Box component="form" onSubmit={handleCustomShortenSubmit} noValidate>
          {customError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{customError}</Alert>}
          <TextField
            fullWidth
            label="Pega tu URL larga aquí"
            placeholder="https://ejemplo.com/mi-pagina-super-larga-e-increible"
            value={customOriginalUrl}
            onChange={(e) => setCustomOriginalUrl(e.target.value)}
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

          <TextField
            fullWidth
            label="Escribe tu alias personalizado"
            placeholder="mi-marca"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            required
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                      tekforge.app/
                    </Typography>
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
            {customLoading ? 'Creando...' : 'Crear Alias Personalizado'}
          </Button>

          {/* Resultado de Alias Personalizado */}
          {customShortUrl && (
            <Paper variant="outlined" sx={{ mt: 4, p: 3, borderRadius: 3, bgcolor: 'rgba(238, 97, 35, 0.02)', borderColor: 'secondary.light' }}>
              <Typography variant="subtitle2" color="secondary.main" sx={{ fontWeight: 800, mb: 1.5 }}>
                ¡Alias personalizado creado con éxito!
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={customShortUrl}
                  slotProps={{ input: { readOnly: true } }}
                  sx={{ bgcolor: '#ffffff' }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(customShortUrl);
                    setCustomLinkCopied(true);
                    setTimeout(() => setCustomLinkCopied(false), 2000);
                  }}
                  startIcon={customLinkCopied ? <CheckIcon /> : <ContentCopyIcon />}
                >
                  {customLinkCopied ? 'Copiado' : 'Copiar'}
                </Button>
              </Box>

              <Grid container spacing={3} sx={{ alignItems: 'center' }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#ffffff', border: '1px solid', borderColor: 'grey.200', borderRadius: 2, display: 'inline-flex' }}>
                    <QRCodeCanvas
                      id="shortened-qr-canvas-custom"
                      value={customShortUrl}
                      size={110}
                      includeMargin={true}
                    />
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Escanea este código QR para abrir el enlace con alias personalizado inmediatamente.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => downloadWidgetQR('shortened-qr-canvas-custom')}
                  >
                    Descargar QR
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>
      )}

      {/* Historial de enlaces (Sencillo y hermoso, renderiza el historial local del usuario o el de la sesión) */}
      {activeUrls.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, borderBottom: '1px solid', borderColor: 'grey.200', pb: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              {user ? 'Tu Historial de Enlaces Acortados' : 'Enlaces creados en esta sesión'}
            </Typography>
          </Box>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Enlace Acortado</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Original</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, py: 1.5 }}>Clics</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, py: 1.5 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeUrls.map((url) => {
                  const fullUrl = `${window.location.origin}/${url.shortCode}`;
                  const isCopied = copiedUrlCode === url.shortCode;

                  return (
                    <TableRow key={url.shortCode} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                      <TableCell sx={{ fontWeight: 700, color: 'secondary.main', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {fullUrl.replace('http://', '').replace('https://', '')}
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {url.originalUrl}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <BarChartIcon fontSize="inherit" color="action" />
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {url.clicks}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Tooltip title="Copiar enlace acortado">
                            <IconButton size="small" onClick={() => handleCopyHistoryLink(url.shortCode, fullUrl)}>
                              {isCopied ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Probar enlace">
                            <IconButton size="small" component="a" href={fullUrl} target="_blank" rel="noopener noreferrer">
                              <OpenInNewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Descargar código QR">
                            <IconButton size="small" onClick={() => downloadHistoryQR(url.shortCode)}>
                              <DownloadIcon fontSize="small" />
                              {/* Invisible canvas for historical download */}
                              <Box sx={{ display: 'none' }}>
                                <QRCodeCanvas
                                  id={`qr-canvas-history-${url.shortCode}`}
                                  value={fullUrl}
                                  size={256}
                                  includeMargin={true}
                                />
                              </Box>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar enlace acortado">
                            <IconButton size="small" color="error" onClick={() => handleDeleteUrl(url.shortCode)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}