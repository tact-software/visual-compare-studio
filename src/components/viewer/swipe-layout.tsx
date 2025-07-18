import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Slider, Typography } from '@mui/material';
import { SingleImageViewer } from './single-image-viewer';
import { useFileStore } from '../../stores/file-store';

interface SwipeLayoutProps {
  sx?: Record<string, unknown>;
}

export const SwipeLayout: React.FC<SwipeLayoutProps> = ({ sx }) => {
  const { files, selectedFiles } = useFileStore();
  const [swipePosition, setSwipePosition] = useState(50); // パーセンテージ
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 選択されたファイルを取得
  const selectedFileObjects = files.filter((file) => selectedFiles.includes(file.id));
  const leftImage = selectedFileObjects[0];
  const rightImage = selectedFileObjects[1];

  // マウスドラッグでスワイプ位置を変更
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
      setSwipePosition(Math.max(0, Math.min(100, newPosition)));
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // グローバルマウスイベントリスナー
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
      setSwipePosition(Math.max(0, Math.min(100, newPosition)));
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', ...sx }}>
      {/* メインビューア */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* ベース画像（右側の画像） */}
        <Box sx={{ position: 'absolute', width: '100%', height: '100%' }}>
          <SingleImageViewer imageFile={rightImage} viewerType="right" />
        </Box>

        {/* オーバーレイ画像（左側の画像） */}
        <Box
          sx={{
            position: 'absolute',
            width: `${swipePosition}%`,
            height: '100%',
            overflow: 'hidden',
            clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
          }}
        >
          <Box sx={{ width: '100vw', height: '100%' }}>
            <SingleImageViewer imageFile={leftImage} viewerType="left" />
          </Box>
        </Box>

        {/* スワイプライン */}
        <Box
          sx={{
            position: 'absolute',
            left: `${swipePosition}%`,
            top: 0,
            width: '2px',
            height: '100%',
            backgroundColor: 'primary.main',
            transform: 'translateX(-50%)',
            cursor: 'ew-resize',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            },
          }}
        />
      </Box>

      {/* スライダーコントロール */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Swipe Position: {Math.round(swipePosition)}%
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
          sx={{ mt: 1 }}
        />
      </Box>
    </Box>
  );
};
