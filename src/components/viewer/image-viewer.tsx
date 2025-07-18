import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { useAppStore } from '../../stores/app-store';

export const ImageViewer: React.FC = () => {
  const { currentLayout } = useAppStore();

  const renderLayout = () => {
    switch (currentLayout.type) {
      case 'side-by-side':
        return (
          <Box sx={{ display: 'flex', gap: 2, height: '100%' }}>
            <Card sx={{ flex: 1 }}>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Image 1
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Image 2
                </Typography>
              </CardContent>
            </Card>
          </Box>
        );
      case 'top-bottom':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
            <Card sx={{ flex: 1 }}>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Image 1
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Image 2
                </Typography>
              </CardContent>
            </Card>
          </Box>
        );
      case 'grid':
        return (
          <Grid container spacing={2} sx={{ height: '100%' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid size={6} key={i}>
                <Card sx={{ height: '100%' }}>
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      Image {i + 1}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      case 'swipe':
        return (
          <Card sx={{ height: '100%' }}>
            <CardContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Swipe Compare View
              </Typography>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return <Box sx={{ height: '100%', p: 2 }}>{renderLayout()}</Box>;
};
