import React from 'react';
import { Box } from '@mui/material';
import { Sidebar } from '../sidebar/sidebar';
import { Toolbar } from '../toolbar/toolbar';
import { StatusBar } from '../status-bar/status-bar';
import { DropZone } from '../common/drop-zone';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <DropZone>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar />
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <Toolbar />
            <Box sx={{ flex: 1, overflow: 'hidden' }}>{children}</Box>
          </Box>
        </Box>
        <StatusBar />
      </Box>
    </DropZone>
  );
};
