import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { SingleImageViewer } from './single-image-viewer';
import { useFileStore } from '../../stores/file-store';

interface TopBottomLayoutProps {
  sx?: Record<string, unknown>;
}

export const TopBottomLayout: React.FC<TopBottomLayoutProps> = ({ sx }) => {
  const { files, selectedFiles } = useFileStore();
  const [splitterPosition, setSplitterPosition] = useState(50); // パーセンテージ
  const [isDragging, setIsDragging] = useState(false);

  // 選択されたファイルを取得
  const topImage =
    selectedFiles.length > 0 ? files.find((f) => f.id === selectedFiles[0]) : undefined;
  const bottomImage =
    selectedFiles.length > 1 ? files.find((f) => f.id === selectedFiles[1]) : undefined;

  // スプリッターのドラッグ開始
  const handleSplitterMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      const container = (e.target as Element).closest('[data-splitter-container]');
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const percentage = Math.max(10, Math.min(90, (y / rect.height) * 100));
      setSplitterPosition(percentage);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <Box
      data-splitter-container
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        ...sx,
      }}
    >
      {/* 上パネル */}
      <Box
        sx={{
          width: '100%',
          height: `${splitterPosition}%`,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          mb: 0.5,
        }}
      >
        <SingleImageViewer
          imageFile={topImage}
          viewerType="top"
          sx={{ width: '100%', height: '100%' }}
        />
      </Box>

      {/* スプリッター */}
      <Box
        sx={{
          width: '100%',
          height: 4,
          backgroundColor: 'divider',
          cursor: 'row-resize',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: 'primary.main',
          },
          ...(isDragging && {
            backgroundColor: 'primary.main',
          }),
        }}
        onMouseDown={handleSplitterMouseDown}
      >
        {/* スプリッターのグリップ */}
        <Box
          sx={{
            width: 40,
            height: 2,
            backgroundColor: 'background.paper',
            borderRadius: 1,
            boxShadow: 1,
          }}
        />
      </Box>

      {/* 下パネル */}
      <Box
        sx={{
          width: '100%',
          height: `${100 - splitterPosition}%`,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          mt: 0.5,
        }}
      >
        <SingleImageViewer
          imageFile={bottomImage}
          viewerType="bottom"
          sx={{ width: '100%', height: '100%' }}
        />
      </Box>
    </Box>
  );
};
