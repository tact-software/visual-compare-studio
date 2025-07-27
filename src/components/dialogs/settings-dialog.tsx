import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Chip,
  Stack,
} from '@mui/material';
import {
  Close,
  Language,
  Palette,
  Image,
  CompareArrows,
  Mouse,
  Info,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useSettingsStore } from '../../stores/settings-store';
import { useBoundaryStore } from '../../stores/boundary-store';
import { useTheme } from '../../hooks/use-theme';

// セクションタイプ
type SettingsSection = 'general' | 'display' | 'imageDisplay' | 'compare' | 'operation' | 'info';

const sectionIcons: Record<SettingsSection, React.ReactElement> = {
  general: <Language />,
  display: <Palette />,
  imageDisplay: <Image />,
  compare: <CompareArrows />,
  operation: <Mouse />,
  info: <Info />,
};

// 翻訳対応で動的にラベルを取得するため、関数内で定義

export const SettingsDialog: React.FC = () => {
  const { t } = useTranslation();
  const {
    general,
    display,
    imageDisplay,
    compare,
    operation,
    isSettingsDialogOpen,
    updateGeneralSettings,
    updateDisplaySettings,
    updateImageDisplaySettings,
    updateCompareSettings,
    updateOperationSettings,
    closeSettingsDialog,
    resetAllSettings,
  } = useSettingsStore();

  const { setBoundarySettings } = useBoundaryStore();
  const { setTheme } = useTheme();

  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [hasChanges, setHasChanges] = useState(false);

  // 一時的な設定値
  const [tempSettings, setTempSettings] = useState({
    general: { ...general },
    display: { ...display },
    imageDisplay: { ...imageDisplay },
    compare: { ...compare },
    operation: { ...operation },
  });

  // 設定を変更
  const handleSettingChange = (section: keyof typeof tempSettings, key: string, value: unknown) => {
    setTempSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  // 設定を適用
  const handleApply = () => {
    // 各セクションの設定を更新
    updateGeneralSettings(tempSettings.general);
    updateDisplaySettings(tempSettings.display);
    updateImageDisplaySettings(tempSettings.imageDisplay);
    updateCompareSettings(tempSettings.compare);
    updateOperationSettings(tempSettings.operation);

    // テーマを即座に適用
    setTheme(tempSettings.display.theme);

    // 境界線設定を同期
    setBoundarySettings({
      color: tempSettings.compare.boundaryColor,
      width: tempSettings.compare.boundaryWidth,
    });

    // デフォルト設定は即時適用しない（新しいセッション時に適用される）

    setHasChanges(false);
    closeSettingsDialog();
  };

  // リセット
  const handleReset = () => {
    if (confirm(t('settings.confirmReset'))) {
      resetAllSettings();
      closeSettingsDialog();
    }
  };

  // セクションラベルを翻訳対応で取得
  const getSectionLabel = (section: SettingsSection): string => {
    switch (section) {
      case 'general':
        return t('settings.general');
      case 'display':
        return t('settings.display');
      case 'imageDisplay':
        return t('settings.imageDisplay');
      case 'compare':
        return t('settings.compare');
      case 'operation':
        return t('settings.operation');
      case 'info':
        return t('settings.appInfo.version');
      default:
        return section;
    }
  };

  // キャンセル
  const handleCancel = () => {
    closeSettingsDialog();
  };

  // セクションレンダリング
  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('settings.general')}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>{t('settings.language.title')}</InputLabel>
              <Select
                value={tempSettings.general.language}
                label={t('settings.language.title')}
                onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
              >
                <MenuItem value="ja">{t('settings.language.japanese')}</MenuItem>
                <MenuItem value="en">{t('settings.language.english')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      case 'display':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('settings.display')}
            </Typography>
            <FormControl sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('settings.theme.title')}
              </Typography>
              <RadioGroup
                value={tempSettings.display.theme}
                onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
              >
                <FormControlLabel
                  value="light"
                  control={<Radio />}
                  label={t('settings.theme.light')}
                />
                <FormControlLabel
                  value="dark"
                  control={<Radio />}
                  label={t('settings.theme.dark')}
                />
                <FormControlLabel
                  value="system"
                  control={<Radio />}
                  label={t('settings.theme.system')}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 'imageDisplay':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('settings.imageDisplay.title')}
            </Typography>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>{t('settings.imageDisplay.defaultMode')}</InputLabel>
                <Select
                  value={tempSettings.imageDisplay.defaultMode}
                  label={t('settings.imageDisplay.defaultMode')}
                  onChange={(e) =>
                    handleSettingChange('imageDisplay', 'defaultMode', e.target.value)
                  }
                >
                  <MenuItem value="file">{t('mode.file')}</MenuItem>
                  <MenuItem value="folder">{t('mode.folder')}</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>{t('settings.imageDisplay.defaultLayout')}</InputLabel>
                <Select
                  value={tempSettings.imageDisplay.defaultLayout}
                  label={t('settings.imageDisplay.defaultLayout')}
                  onChange={(e) =>
                    handleSettingChange('imageDisplay', 'defaultLayout', e.target.value)
                  }
                >
                  <MenuItem value="side-by-side">{t('layout.sideBySide')}</MenuItem>
                  <MenuItem value="top-bottom">{t('layout.topBottom')}</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>{t('settings.imageDisplay.defaultViewMode')}</InputLabel>
                <Select
                  value={tempSettings.imageDisplay.defaultViewMode}
                  label={t('settings.imageDisplay.defaultViewMode')}
                  onChange={(e) =>
                    handleSettingChange('imageDisplay', 'defaultViewMode', e.target.value)
                  }
                >
                  <MenuItem value="split">{t('layout.split')}</MenuItem>
                  <MenuItem value="swipe">{t('layout.swipe')}</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
        );

      case 'compare':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('settings.compare.title')}
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
              {t('settings.compare.boundary')}
            </Typography>
            <Stack spacing={3}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('settings.compare.color')}: {tempSettings.compare.boundaryColor}
                </Typography>
                <input
                  type="color"
                  value={tempSettings.compare.boundaryColor}
                  onChange={(e) => handleSettingChange('compare', 'boundaryColor', e.target.value)}
                  style={{
                    width: '100%',
                    height: 40,
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('settings.compare.width')}: {tempSettings.compare.boundaryWidth}px
                </Typography>
                <Slider
                  value={tempSettings.compare.boundaryWidth}
                  onChange={(_, value) => handleSettingChange('compare', 'boundaryWidth', value)}
                  min={1}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel>{t('settings.compare.style')}</InputLabel>
                <Select
                  value={tempSettings.compare.boundaryStyle}
                  label={t('settings.compare.style')}
                  onChange={(e) => handleSettingChange('compare', 'boundaryStyle', e.target.value)}
                >
                  <MenuItem value="solid">{t('settings.compare.solid')}</MenuItem>
                  <MenuItem value="dashed">{t('settings.compare.dashed')}</MenuItem>
                  <MenuItem value="dotted">{t('settings.compare.dotted')}</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
        );

      case 'operation':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('settings.operation.title')}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('settings.operation.keyboardShortcuts')}
              </Typography>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {t('settings.operation.customizeNotAvailable')}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {Object.entries(tempSettings.operation.shortcuts).map(([key, value]) => (
                  <Box
                    key={key}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1,
                      p: 1,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">
                      {t(
                        `settings.operation.shortcuts.${key.replace(/-/g, '')}`,
                        key.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                      )}
                    </Typography>
                    <Chip label={value} size="small" variant="outlined" />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        );

      case 'info':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('settings.appInfo.version')}
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="subtitle2">{t('settings.appInfo.version')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.appInfo.appName')} {t('settings.appInfo.versionNumber')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">{t('settings.appInfo.developer')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.appInfo.copyright')}
                </Typography>
              </Box>
            </Stack>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={isSettingsDialogOpen}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: '80vh' },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <SettingsIcon />
            {t('common.settings')}
          </Box>
          <IconButton size="small" onClick={handleCancel}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', p: 0 }}>
        {/* サイドバー */}
        <Box
          sx={{
            width: 200,
            borderRight: 1,
            borderColor: 'divider',
            flexShrink: 0,
          }}
        >
          <List disablePadding>
            {(
              [
                'general',
                'display',
                'imageDisplay',
                'compare',
                'operation',
                'info',
              ] as SettingsSection[]
            ).map((section) => (
              <ListItem key={section} disablePadding>
                <ListItemButton
                  selected={activeSection === section}
                  onClick={() => setActiveSection(section)}
                >
                  <ListItemIcon>{sectionIcons[section]}</ListItemIcon>
                  <ListItemText primary={getSectionLabel(section)} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* コンテンツ */}
        <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>{renderSection()}</Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} color="error">
          {t('settings.resetAll')}
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={handleCancel} color="inherit">
          {t('common.cancel')}
        </Button>
        <Button onClick={handleApply} variant="contained" disabled={!hasChanges}>
          {t('common.apply')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
