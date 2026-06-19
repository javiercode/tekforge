import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UrlShortener from './components/UrlShortener';
import RedirectHandler from './components/RedirectHandler';
import BioPublicPage from './components/BioPublicPage';
import Auth from './components/Auth';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';

function App() {
  return (
    <BrowserRouter>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <AppBar position="static" color="primary" elevation={0} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkIcon sx={{ fontSize: 28, color: 'secondary.main' }} />
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="/"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '.1rem',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '1.3rem',
                  }}
                >
                  TEKFORGE
                </Typography>
              </Box>
              <Auth />
            </Toolbar>
          </Container>
        </AppBar>
        <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 6 }, px: 2 }}>
          <Routes>
            <Route path="/" element={<UrlShortener />} />
            <Route path="/bio/:username" element={<BioPublicPage />} />
            <Route path="/:shortCode" element={<RedirectHandler />} />
          </Routes>
        </Box>
        <Box
          component="footer"
          sx={{
            py: 4,
            px: 2,
            mt: 'auto',
            bgcolor: 'primary.main',
            color: '#ffffff',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkIcon sx={{ fontSize: 22, color: 'secondary.main' }} />
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '.05rem',
                    color: '#ffffff',
                    fontSize: '1rem',
                  }}
                >
                  TEKFORGE
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center' }}>
                &copy; {new Date().getFullYear()} TekForge. Todos los derechos reservados.
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'flex', gap: 1.5 }}>
                <Typography component="span" variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Privacidad
                </Typography>
                &bull;
                <Typography component="span" variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Términos
                </Typography>
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;