import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Typography,
  Divider,
  Toolbar as MUIToolbar,
  AppBar,
} from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  CenterFocusStrong,
  Brightness4,
  Brightness7,
  Computer,
} from '@mui/icons-material';
import { useAppStore } from '../../stores/app-store';
import { useTheme } from '../../hooks/use-theme';

export const Toolbar: React.FC = () => {
  const { currentLayout, setLayout } = useAppStore();
  const { theme, setTheme } = useTheme();

  const layoutOptions = [
    { type: 'side-by-side', label: 'Side by Side' },
    { type: 'top-bottom', label: 'Top/Bottom' },
    { type: 'grid', label: 'Grid' },
    { type: 'swipe', label: 'Swipe' },
  ] as const;

  const handleThemeToggle = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Brightness7 />;
      case 'dark':
        return <Brightness4 />;
      case 'system':
        return <Computer />;
      default:
        return <Brightness7 />;
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <MUIToolbar variant="dense">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Layout:
          </Typography>
          <ButtonGroup size="small" variant="outlined">
            {layoutOptions.map((layout) => (
              <Button
                key={layout.type}
                variant={currentLayout.type === layout.type ? 'contained' : 'outlined'}
                onClick={() => setLayout({ type: layout.type })}
              >
                {layout.label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" color="primary">
            <ZoomIn />
          </IconButton>
          <IconButton size="small" color="primary">
            <ZoomOut />
          </IconButton>
          <IconButton size="small" color="primary">
            <CenterFocusStrong />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <IconButton size="small" onClick={handleThemeToggle}>
            {getThemeIcon()}
          </IconButton>
        </Box>
      </MUIToolbar>
    </AppBar>
  );
};
