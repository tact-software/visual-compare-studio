import React, { useState, useCallback, useRef } from 'react';
import { Box, Slider, Typography } from '@mui/material';
import { SingleImageViewer } from './single-image-viewer';
import { useFileStore } from '../../stores/file-store';
import { useViewerOperations } from '../../hooks/use-viewer-operations';

interface TopBottomSwipeLayoutProps {
  sx?: Record<string, unknown>;
}

export const TopBottomSwipeLayout: React.FC<TopBottomSwipeLayoutProps> = ({ sx }) => {
  const { files, selectedFiles } = useFileStore();
  const [swipePosition, setSwipePosition] = useState(50); // パーセンテージ
  const containerRef = useRef<HTMLDivElement>(null);

  // 共通の画像操作ハンドラー
  const { createWheelHandler, createMouseDownHandler } = useViewerOperations();
  const handleImageWheel = createWheelHandler();
  const handleImageMouseDown = createMouseDownHandler();

  // 選択されたファイルを取得
  const selectedFileObjects = files.filter((file) => selectedFiles.includes(file.id));
  const topImage = selectedFileObjects[0];
  const bottomImage = selectedFileObjects[1];

  // スライダーエリアでの境界移動を処理（Option + スクロール）
  const handleSliderWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // macOSのOptionキー（Alt）検出
      const isOptionPressed = e.altKey || e.getModifierState?.('Alt');

      if (isOptionPressed) {
        const delta = e.deltaY > 0 ? 2 : -2;
        setSwipePosition((prev) => Math.max(0, Math.min(100, prev + delta)));
      }
    },
    [setSwipePosition]
  );

  if (!topImage || !bottomImage) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          flexDirection: 'column',
          gap: 2,
          ...sx,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Select two images to compare
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Use the sidebar to select exactly two images for vertical swipe comparison
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'row', ...sx }}>
      {/* メインビューア */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'grab',
          '&:active': {
            cursor: 'grabbing',
          },
        }}
        onWheel={handleImageWheel}
        onMouseDown={handleImageMouseDown}
      >
        {/* ベース画像（下側の画像） */}
        <Box sx={{ position: 'absolute', width: '100%', height: '100%' }}>
          <SingleImageViewer imageFile={bottomImage} viewerType="bottom" />
        </Box>

        {/* オーバーレイ画像（上側の画像） */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: `${swipePosition}%`,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: `${100 / (swipePosition / 100)}%`,
            }}
          >
            <SingleImageViewer imageFile={topImage} viewerType="top" />
          </Box>
        </Box>

        {/* 境界ライン（表示のみ、操作不可の単純なライン） */}
        <div
          style={{
            position: 'absolute',
            top: `${swipePosition}%`,
            left: 0,
            width: '100%',
            height: '1px',
            backgroundColor: '#666666',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            opacity: 0.7,
            zIndex: 1,
          }}
        />
      </Box>

      {/* スライダーコントロール（右側） */}
      <Box
        sx={{
          width: 60,
          p: 1,
          borderLeft: 1,
          borderColor: 'divider',
          backgroundColor: 'action.hover',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onWheel={handleSliderWheel}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            mb: 1,
            fontSize: '0.7rem',
          }}
        >
          {Math.round(swipePosition)}%
        </Typography>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{
            mb: 1,
            fontSize: '0.6rem',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          Option + Scroll
        </Typography>
        <Slider
          value={100 - swipePosition}
          onChange={(_, value: number | number[]) => {
            const newValue = Array.isArray(value) ? value[0] : value;
            setSwipePosition(100 - newValue);
          }}
          min={0}
          max={100}
          step={1}
          orientation="vertical"
          sx={{
            flex: 1,
            '& .MuiSlider-thumb': {
              width: 16,
              height: 16,
            },
            '& .MuiSlider-rail': {
              width: 4,
            },
            '& .MuiSlider-track': {
              width: 4,
            },
          }}
        />
      </Box>
    </Box>
  );
};
