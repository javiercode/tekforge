import React, { useState } from 'react';
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
  Chip,
  Avatar,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import QrCodeIcon from '@mui/icons-material/QrCode';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRGeneratorWidget() {
  // QR Code Generator State
  const [qrType, setQrType] = useState<'url' | 'text'>('url');
  const [qrInputUrl, setQrInputUrl] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrSize, setQrSize] = useState(256);
  const [qrLogoUrl, setQrLogoUrl] = useState('');
  const [error, setError] = useState('');

  const handleQrTypeChange = (type: 'url' | 'text') => {
    setQrType(type);
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

  const downloadQR = () => {
    const canvas = document.getElementById('qr-canvas-widget') as HTMLCanvasElement | null;
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

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

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
            helperText={`${qrInputUrl.length} / ${qrSize === 128 ? 150 : qrSize === 256 ? 300 : 600} caracteres`}
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
            <Chip
              avatar={<Avatar src="https://img.icons8.com/color/48/stethoscope.png" />}
              label="Salud"
              onClick={() => setQrLogoUrl('https://img.icons8.com/color/48/stethoscope.png')}
              color={qrLogoUrl === 'https://img.icons8.com/color/48/stethoscope.png' ? 'secondary' : 'default'}
              variant={qrLogoUrl === 'https://img.icons8.com/color/48/stethoscope.png' ? 'filled' : 'outlined'}
              clickable
            />
            <Chip
              avatar={<Avatar src="https://img.icons8.com/color/48/tooth.png" />}
              label="Dentista"
              onClick={() => setQrLogoUrl('https://img.icons8.com/color/48/tooth.png')}
              color={qrLogoUrl === 'https://img.icons8.com/color/48/tooth.png' ? 'secondary' : 'default'}
              variant={qrLogoUrl === 'https://img.icons8.com/color/48/tooth.png' ? 'filled' : 'outlined'}
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
              id="qr-canvas-widget"
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
  );
}