import React from 'react';
import { useTranslation } from 'react-i18next';
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
  Folder,
  InsertDriveFile,
  Settings,
} from '@mui/icons-material';
import { useAppStore } from '../../stores/app-store';
import { useTheme } from '../../hooks/use-theme';
import { useViewerStore } from '../../stores/viewer-store';
import { useFileStore } from '../../stores/file-store';
import { useFolderStore } from '../../stores/folder-store';
import { useSettingsStore } from '../../stores/settings-store';

export const Toolbar: React.FC = () => {
  const { t } = useTranslation();
  const { currentLayout, setLayout, isFolderMode, setFolderMode, setLoading } = useAppStore();
  const { theme, setTheme } = useTheme();
  const { leftViewer, resetAllViewers, syncZoomToAll } = useViewerStore();
  const { clearFiles } = useFileStore();
  const { clearFolders } = useFolderStore();
  const { openSettingsDialog } = useSettingsStore();

  const layoutOptions = [
    { type: 'side-by-side', label: t('layout.sideBySide') },
    { type: 'top-bottom', label: t('layout.topBottom') },
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          {/* モード切替 */}
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 'auto' }}>
            {t('toolbar.mode')}:
          </Typography>
          <ToggleButtonGroup
            size="small"
            value={isFolderMode ? 'folder' : 'file'}
            exclusive
            onChange={(_, value: string) => {
              if (value) {
                const newMode = value === 'folder';

                // モード切り替え時にリセット処理
                if (newMode !== isFolderMode) {
                  setLoading(false); // ローディング状態をリセット
                  clearFiles(); // ファイルストアをクリア

                  if (newMode) {
                    // フォルダモードに切り替える場合
                    clearFolders(); // フォルダ状態をクリア
                  } else {
                    // ファイルモードに切り替える場合
                    clearFolders(); // フォルダ状態をクリア
                  }
                }

                setFolderMode(newMode);
              }
            }}
          >
            <ToggleButton value="file" aria-label="file mode">
              <Tooltip title={t('mode.file')}>
                <InsertDriveFile fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="folder" aria-label="folder mode">
              <Tooltip title={t('mode.folder')}>
                <Folder fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          {/* レイアウト選択（全モード共通） */}
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 'auto' }}>
            {t('toolbar.layout')}:
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

          {/* View Mode切り替え（全モード共通） */}
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 'auto' }}>
            {t('toolbar.view')}:
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
              {t('layout.split')}
            </Button>
            <Button
              variant={currentLayout.viewMode === 'swipe' ? 'contained' : 'outlined'}
              onClick={() => setLayout({ ...currentLayout, viewMode: 'swipe' })}
              sx={{ px: 1, py: 0.5, fontSize: '0.75rem', minWidth: 'auto' }}
            >
              {t('layout.swipe')}
            </Button>
          </ButtonGroup>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* ズームコントロール（全モード共通） */}
          <Tooltip title={t('toolbar.zoomIn')}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => syncZoomToAll(Math.min(10, leftViewer.zoom * 1.2))}
            >
              <ZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('toolbar.zoomOut')}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => syncZoomToAll(Math.max(0.1, leftViewer.zoom / 1.2))}
            >
              <ZoomOut />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('toolbar.resetView')}>
            <IconButton size="small" color="primary" onClick={resetAllViewers}>
              <CenterFocusStrong />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <Tooltip title={t('common.settings')}>
            <IconButton size="small" onClick={openSettingsDialog}>
              <Settings />
            </IconButton>
          </Tooltip>

          <IconButton size="small" onClick={handleThemeToggle}>
            {getThemeIcon()}
          </IconButton>
        </Box>
      </MUIToolbar>
    </AppBar>
  );
};
