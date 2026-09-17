import React from 'react';
import { Box, Container } from '@mui/material';

interface BodyProps {
  children: React.ReactNode;
}

export default function Body({ children }: BodyProps) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: { xs: 4, md: 6 },
        px: 2,
        bgcolor: 'background.default',
        minHeight: 'calc(100vh - 180px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Container>
    </Box>
  );
}