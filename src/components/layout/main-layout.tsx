import React from 'react';
import { Box } from '@mui/material';
import { Sidebar } from '../sidebar/sidebar';
import { Toolbar } from '../toolbar/toolbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Toolbar />
        <Box sx={{ flex: 1, overflow: 'hidden' }}>{children}</Box>
      </Box>
    </Box>
  );
};
