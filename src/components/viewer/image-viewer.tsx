import React from 'react';
import { Box, Fade } from '@mui/material';
import { useAppStore } from '../../stores/app-store';
import { SideBySideLayout } from './side-by-side-layout';
import { TopBottomLayout } from './top-bottom-layout';
import { SwipeLayout } from './swipe-layout';
import { TopBottomSwipeLayout } from './top-bottom-swipe-layout';

export const ImageViewer: React.FC = () => {
  const { currentLayout } = useAppStore();

  const renderLayout = () => {
    const viewMode = currentLayout.viewMode || 'split';

    switch (currentLayout.type) {
      case 'side-by-side':
        if (viewMode === 'swipe') {
          return <SwipeLayout />;
        } else {
          return <SideBySideLayout />;
        }
      case 'top-bottom':
        if (viewMode === 'swipe') {
          return <TopBottomSwipeLayout />;
        } else {
          return <TopBottomLayout />;
        }
      default:
        return null;
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%', p: 2, overflow: 'hidden' }}>
      <Fade in key={`${currentLayout.type}-${currentLayout.viewMode || 'split'}`} timeout={300}>
        <Box sx={{ height: '100%', width: '100%', overflow: 'hidden' }}>{renderLayout()}</Box>
      </Fade>
    </Box>
  );
};
