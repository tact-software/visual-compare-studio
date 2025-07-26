import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slider,
  IconButton,
} from '@mui/material';
import { Close, Refresh } from '@mui/icons-material';
import { useBoundaryStore } from '../../stores/boundary-store';

// プリセットカラー
const presetColors = [
  '#FF0000', // 赤
  '#00FF00', // 緑
  '#0000FF', // 青
  '#FFFF00', // 黄
  '#FF00FF', // マゼンタ
  '#00FFFF', // シアン
  '#FFFFFF', // 白
  '#000000', // 黒
  '#666666', // グレー（デフォルト）
  '#FF6B6B', // ライトレッド
  '#4ECDC4', // ティール
  '#45B7D1', // スカイブルー
  '#96CEB4', // ミントグリーン
  '#FECA57', // イエローオレンジ
  '#FF9FF3', // ピンク
  '#54A0FF', // ブルー
];

export const BoundarySettingsDialog: React.FC = () => {
  const {
    boundarySettings,
    isSettingsDialogOpen,
    setBoundarySettings,
    closeSettingsDialog,
    resetBoundarySettings,
  } = useBoundaryStore();

  const [tempColor, setTempColor] = useState(boundarySettings.color);
  const [tempWidth, setTempWidth] = useState(boundarySettings.width);

  // ダイアログが開いたときに現在の設定を読み込む
  React.useEffect(() => {
    if (isSettingsDialogOpen) {
      setTempColor(boundarySettings.color);
      setTempWidth(boundarySettings.width);
    }
  }, [isSettingsDialogOpen, boundarySettings]);

  const handleColorChange = (color: string) => {
    setTempColor(color);
  };

  const handleWidthChange = (_: Event, value: number | number[]) => {
    setTempWidth(Array.isArray(value) ? value[0] : value);
  };

  const handleApply = () => {
    setBoundarySettings({
      color: tempColor,
      width: tempWidth,
    });
    closeSettingsDialog();
  };

  const handleReset = () => {
    resetBoundarySettings();
    setTempColor('#666666');
    setTempWidth(1);
  };

  const handleCancel = () => {
    closeSettingsDialog();
  };

  return (
    <Dialog open={isSettingsDialogOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          境界線設定
          <IconButton size="small" onClick={handleCancel}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ py: 2 }}>
          {/* 色設定 */}
          <Typography variant="subtitle2" gutterBottom>
            色
          </Typography>
          <Box sx={{ mb: 3 }}>
            {/* カラーピッカー */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                カスタムカラー:
              </Typography>
              <input
                type="color"
                value={tempColor}
                onChange={(e) => handleColorChange(e.target.value)}
                style={{
                  width: 60,
                  height: 40,
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {tempColor}
              </Typography>
            </Box>

            {/* プリセットカラー */}
            <Typography variant="body2" color="text.secondary" gutterBottom>
              プリセットカラー:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {presetColors.map((color) => (
                <Box
                  key={color}
                  onClick={() => handleColorChange(color)}
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: color,
                    border: tempColor === color ? '3px solid' : '1px solid',
                    borderColor: tempColor === color ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* 太さ設定 */}
          <Typography variant="subtitle2" gutterBottom>
            太さ
          </Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={tempWidth}
              onChange={handleWidthChange}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                1px
              </Typography>
              <Typography variant="body2">現在: {tempWidth}px</Typography>
              <Typography variant="caption" color="text.secondary">
                10px
              </Typography>
            </Box>
          </Box>

          {/* プレビュー */}
          <Box sx={{ mt: 4, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              プレビュー
            </Typography>
            <Box
              sx={{
                position: 'relative',
                height: 100,
                backgroundColor: 'action.hover',
                borderRadius: 1,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: `${tempWidth}px`,
                  height: '100%',
                  backgroundColor: tempColor,
                  transform: 'translateX(-50%)',
                }}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<Refresh />} onClick={handleReset} color="inherit">
          リセット
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={handleCancel} color="inherit">
          キャンセル
        </Button>
        <Button onClick={handleApply} variant="contained">
          適用
        </Button>
      </DialogActions>
    </Dialog>
  );
};
