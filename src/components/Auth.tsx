import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Button,
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Auth() {
  const { user, signInWithGoogle, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {user ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography
            variant="body1"
            sx={{
              display: { xs: 'none', sm: 'block' },
              color: 'inherit',
              fontWeight: 500,
            }}
          >
            {user.displayName || user.email}
          </Typography>
          <Tooltip title="Opciones de cuenta">
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ ml: 1 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar
                alt={user.displayName || 'User'}
                src={user.photoURL || undefined}
                sx={{ width: 36, height: 36, bgcolor: 'secondary.main' }}
              >
                {!user.photoURL && (user.displayName?.[0] || user.email?.[0] || 'U')}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                elevation: 3,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              },
            }}
          >
            <MenuItem disabled sx={{ opacity: '1 !important' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user.displayName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Box>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          startIcon={<GoogleIcon />}
          onClick={signInWithGoogle}
          sx={{
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
              bgcolor: 'secondary.dark',
            },
          }}
        >
          Iniciar sesión con Google
        </Button>
      )}
    </Box>
  );
}