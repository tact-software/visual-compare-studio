import React, { useState } from 'react';
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

const sectionLabels: Record<SettingsSection, string> = {
  general: '一般',
  display: '表示',
  imageDisplay: '画像表示',
  compare: '比較',
  operation: '操作',
  info: '情報',
};

export const SettingsDialog: React.FC = () => {
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
    if (confirm('すべての設定をデフォルトに戻しますか？')) {
      resetAllSettings();
      closeSettingsDialog();
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
              一般設定
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>言語</InputLabel>
              <Select
                value={tempSettings.general.language}
                label="言語"
                onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
              >
                <MenuItem value="ja">日本語</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      case 'display':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              表示設定
            </Typography>
            <FormControl sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                テーマ
              </Typography>
              <RadioGroup
                value={tempSettings.display.theme}
                onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
              >
                <FormControlLabel value="light" control={<Radio />} label="ライト" />
                <FormControlLabel value="dark" control={<Radio />} label="ダーク" />
                <FormControlLabel value="system" control={<Radio />} label="システム設定に従う" />
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 'imageDisplay':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              画像表示設定
            </Typography>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>デフォルトの表示モード</InputLabel>
                <Select
                  value={tempSettings.imageDisplay.defaultMode}
                  label="デフォルトの表示モード"
                  onChange={(e) =>
                    handleSettingChange('imageDisplay', 'defaultMode', e.target.value)
                  }
                >
                  <MenuItem value="file">ファイルモード</MenuItem>
                  <MenuItem value="folder">フォルダモード</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>デフォルトのレイアウト</InputLabel>
                <Select
                  value={tempSettings.imageDisplay.defaultLayout}
                  label="デフォルトのレイアウト"
                  onChange={(e) =>
                    handleSettingChange('imageDisplay', 'defaultLayout', e.target.value)
                  }
                >
                  <MenuItem value="side-by-side">横並び</MenuItem>
                  <MenuItem value="top-bottom">縦並び</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>デフォルトのビューモード</InputLabel>
                <Select
                  value={tempSettings.imageDisplay.defaultViewMode}
                  label="デフォルトのビューモード"
                  onChange={(e) =>
                    handleSettingChange('imageDisplay', 'defaultViewMode', e.target.value)
                  }
                >
                  <MenuItem value="split">スプリット</MenuItem>
                  <MenuItem value="swipe">スワイプ</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
        );

      case 'compare':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              比較設定
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
              境界線（スワイプモード）
            </Typography>
            <Stack spacing={3}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  色: {tempSettings.compare.boundaryColor}
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
                  太さ: {tempSettings.compare.boundaryWidth}px
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
                <InputLabel>スタイル</InputLabel>
                <Select
                  value={tempSettings.compare.boundaryStyle}
                  label="スタイル"
                  onChange={(e) => handleSettingChange('compare', 'boundaryStyle', e.target.value)}
                >
                  <MenuItem value="solid">実線</MenuItem>
                  <MenuItem value="dashed">破線</MenuItem>
                  <MenuItem value="dotted">点線</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
        );

      case 'operation':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              操作設定
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                キーボードショートカット
              </Typography>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                ※ 現在のバージョンではカスタマイズできません
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
                      {key.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
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
              情報
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="subtitle2">バージョン</Typography>
                <Typography variant="body2" color="text.secondary">
                  Visual Compare Studio v0.1.0
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">開発元</Typography>
                <Typography variant="body2" color="text.secondary">
                  © 2024 Visual Compare Studio
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
            設定
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
            {(Object.keys(sectionLabels) as SettingsSection[]).map((section) => (
              <ListItem key={section} disablePadding>
                <ListItemButton
                  selected={activeSection === section}
                  onClick={() => setActiveSection(section)}
                >
                  <ListItemIcon>{sectionIcons[section]}</ListItemIcon>
                  <ListItemText primary={sectionLabels[section]} />
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
          すべてリセット
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={handleCancel} color="inherit">
          キャンセル
        </Button>
        <Button onClick={handleApply} variant="contained" disabled={!hasChanges}>
          適用
        </Button>
      </DialogActions>
    </Dialog>
  );
};
