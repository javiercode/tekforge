import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore } from '../hooks/useFirestore';
import { Box, CircularProgress, Typography, Alert, Container, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

export default function RedirectHandler() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [error, setError] = useState<string | null>(null);
  const { getUrl, incrementClicks } = useFirestore();

  useEffect(() => {
    const redirect = async () => {
      if (!shortCode) return;
      try {
        const urlData = await getUrl(shortCode);
        if (urlData) {
          await incrementClicks(shortCode);
          window.location.href = urlData.originalUrl;
        } else {
          setError('La URL corta especificada no existe o ha sido eliminada.');
        }
      } catch (err) {
        setError('Ocurrió un error al procesar la redirección.');
      }
    };
    redirect();
  }, [shortCode, getUrl, incrementClicks]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '40vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        {error ? (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Alert severity="error" sx={{ borderRadius: 2, textAlign: 'left' }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              color="primary"
              startIcon={<HomeIcon />}
              href="/"
              sx={{ alignSelf: 'center' }}
            >
              Volver al Inicio
            </Button>
          </Box>
        ) : (
          <>
            <CircularProgress color="secondary" size={60} thickness={4.5} />
            <Box>
              <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700, mb: 1 }}>
                Redirigiendo...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Por favor, espera un momento mientras te conectamos con el destino.
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}