import React, { useState, useCallback, useRef } from 'react';
import { Box, Slider, Typography } from '@mui/material';
import { SwipeImageViewer } from './swipe-image-viewer';
import { useFileStore } from '../../stores/file-store';
import { useViewerOperations } from '../../hooks/use-viewer-operations';

interface SwipeLayoutProps {
  sx?: Record<string, unknown>;
}

export const SwipeLayout: React.FC<SwipeLayoutProps> = ({ sx }) => {
  const { files, selectedFiles } = useFileStore();
  const [swipePosition, setSwipePosition] = useState(50); // パーセンテージ
  const containerRef = useRef<HTMLDivElement>(null);

  // 共通操作ハンドラーを使用
  const { createWheelHandler, createMouseDownHandler } = useViewerOperations();

  // 選択されたファイルを取得
  const selectedFileObjects = files.filter((file) => selectedFiles.includes(file.id));
  const leftImage = selectedFileObjects[0];
  const rightImage = selectedFileObjects[1];

  // 共通の画像ビューア操作ハンドラー（境界移動は除外）
  const handleImageWheel = createWheelHandler();
  const handleImageMouseDown = createMouseDownHandler();

  // スワイプバーでの境界移動を処理（Option + スクロール）
  const handleSwipeBarWheel = useCallback(
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

  if (!leftImage || !rightImage) {
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
          Use the sidebar to select exactly two images for swipe comparison
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {/* メインビューア */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'grab', // ドラッグ可能を示すカーソル
          '&:active': {
            cursor: 'grabbing',
          },
        }}
        onWheel={handleImageWheel}
        onMouseDown={handleImageMouseDown}
      >
        {/* ベース画像（右側の画像） */}
        <Box sx={{ position: 'absolute', width: '100%', height: '100%' }}>
          <SwipeImageViewer imageFile={rightImage} viewerType="right" />
        </Box>

        {/* オーバーレイ画像（左側の画像） */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${swipePosition}%`,
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: `${100 / (swipePosition / 100)}%`,
              height: '100%',
            }}
          >
            <SwipeImageViewer imageFile={leftImage} viewerType="left" />
          </Box>
        </Box>

        {/* 境界ライン（表示のみ、操作不可の単純なライン） */}
        <div
          style={{
            position: 'absolute',
            left: `${swipePosition}%`,
            top: 0,
            width: '1px',
            height: '100%',
            backgroundColor: '#666666',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            opacity: 0.7,
            zIndex: 1,
          }}
        />
      </Box>

      {/* スワイプバー（境界操作専用エリア） */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'action.hover',
        }}
        onWheel={handleSwipeBarWheel}
      >
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Swipe Position: {Math.round(swipePosition)}%
          <Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 1 }}>
            (Option + Scroll to adjust)
          </Typography>
        </Typography>
        <Slider
          value={swipePosition}
          onChange={(_, value: number | number[]) => {
            if (Array.isArray(value)) {
              setSwipePosition(value[0]);
            } else {
              setSwipePosition(value);
            }
          }}
          min={0}
          max={100}
          step={1}
          sx={{
            mt: 1,
            '& .MuiSlider-thumb': {
              width: 20,
              height: 20,
            },
            '& .MuiSlider-track': {
              height: 4,
            },
            '& .MuiSlider-rail': {
              height: 4,
            },
          }}
        />
      </Box>
    </Box>
  );
};
