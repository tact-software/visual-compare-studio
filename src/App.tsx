import React from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { MainLayout } from './components/layout/main-layout';
import { ImageViewer } from './components/viewer/image-viewer';
import { ThemeProvider } from './components/common/theme-provider';
import { useTheme } from './hooks/use-theme';
import { useMenuEvents } from './hooks/use-menu-events';
import { useAppInit } from './hooks/use-app-init';
import { SettingsDialog } from './components/dialogs/settings-dialog';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const muiTheme = theme === 'dark' ? darkTheme : lightTheme;

  // Initialize menu event listeners
  useMenuEvents();

  // Initialize app with default settings
  useAppInit();

  return (
    <MUIThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <MainLayout>
          <ImageViewer />
        </MainLayout>
        <SettingsDialog />
      </Box>
    </MUIThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
