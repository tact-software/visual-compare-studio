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
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  CenterFocusStrong,
  Brightness4,
  Brightness7,
  Computer,
  PanTool,
} from '@mui/icons-material';
import { useAppStore } from '../../stores/app-store';
import { useTheme } from '../../hooks/use-theme';
import { useViewerStore } from '../../stores/viewer-store';
import { AppMenu } from '../menu/app-menu';

export const Toolbar: React.FC = () => {
  const { currentLayout, setLayout } = useAppStore();
  const { theme, setTheme } = useTheme();
  const { leftViewer, syncZoom, syncPan, setSyncZoom, setSyncPan, resetAllViewers, syncZoomToAll } =
    useViewerStore();

  const layoutOptions = [
    { type: 'side-by-side', label: 'Side by Side' },
    { type: 'top-bottom', label: 'Top/Bottom' },
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
    <AppBar position="static" color="default" elevation={1} sx={{ flexShrink: 0 }}>
      <MUIToolbar variant="dense" sx={{ minHeight: 48 }}>
        <AppMenu />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 'auto' }}>
            Layout:
          </Typography>
          <ButtonGroup size="small" variant="outlined">
            {layoutOptions.map((layout) => (
              <Button
                key={layout.type}
                variant={currentLayout.type === layout.type ? 'contained' : 'outlined'}
                onClick={() => setLayout({ type: layout.type })}
                sx={{ px: 1, py: 0.5, fontSize: '0.75rem' }}
              >
                {layout.label}
              </Button>
            ))}
          </ButtonGroup>

          {/* View Mode切り替え */}
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 'auto' }}>
            Mode:
          </Typography>
          <ButtonGroup size="small" variant="outlined">
            <Button
              variant={
                currentLayout.viewMode === 'split' || !currentLayout.viewMode
                  ? 'contained'
                  : 'outlined'
              }
              onClick={() => setLayout({ ...currentLayout, viewMode: 'split' })}
              sx={{ px: 1, py: 0.5, fontSize: '0.75rem', minWidth: 'auto' }}
            >
              Split
            </Button>
            <Button
              variant={currentLayout.viewMode === 'swipe' ? 'contained' : 'outlined'}
              onClick={() => setLayout({ ...currentLayout, viewMode: 'swipe' })}
              sx={{ px: 1, py: 0.5, fontSize: '0.75rem', minWidth: 'auto' }}
            >
              Swipe
            </Button>
          </ButtonGroup>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* ズームコントロール */}
          <Tooltip title="Zoom In">
            <IconButton
              size="small"
              color="primary"
              onClick={() => syncZoomToAll(Math.min(10, leftViewer.zoom * 1.2))}
            >
              <ZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton
              size="small"
              color="primary"
              onClick={() => syncZoomToAll(Math.max(0.1, leftViewer.zoom / 1.2))}
            >
              <ZoomOut />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset View">
            <IconButton size="small" color="primary" onClick={resetAllViewers}>
              <CenterFocusStrong />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* 同期コントロール */}
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 'auto' }}>
            Sync:
          </Typography>
          <ToggleButtonGroup
            size="small"
            value={[...(syncZoom ? ['zoom'] : []), ...(syncPan ? ['pan'] : [])]}
            onChange={(_, newValue: string[]) => {
              setSyncZoom(newValue.includes('zoom'));
              setSyncPan(newValue.includes('pan'));
            }}
          >
            <ToggleButton value="zoom" aria-label="sync zoom">
              <Tooltip title="Sync Zoom">
                <ZoomIn fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="pan" aria-label="sync pan">
              <Tooltip title="Sync Pan">
                <PanTool fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <IconButton size="small" onClick={handleThemeToggle}>
            {getThemeIcon()}
          </IconButton>
        </Box>
      </MUIToolbar>
    </AppBar>
  );
};
