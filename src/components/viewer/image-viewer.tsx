import React from 'react';
import { Box, Fade } from '@mui/material';
import { useAppStore } from '../../stores/app-store';
import { SideBySideLayout } from './side-by-side-layout';
import { TopBottomLayout } from './top-bottom-layout';
import { GridLayout } from './grid-layout';
import { SwipeLayout } from './swipe-layout';

export const ImageViewer: React.FC = () => {
  const { currentLayout } = useAppStore();

  const renderLayout = () => {
    switch (currentLayout.type) {
      case 'side-by-side':
        return <SideBySideLayout />;
      case 'top-bottom':
        return <TopBottomLayout />;
      case 'grid':
        return <GridLayout />;
      case 'swipe':
        return <SwipeLayout />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%', p: 2, overflow: 'hidden' }}>
      <Fade in key={currentLayout.type} timeout={300}>
        <Box sx={{ height: '100%', width: '100%', overflow: 'hidden' }}>{renderLayout()}</Box>
      </Fade>
    </Box>
  );
};
