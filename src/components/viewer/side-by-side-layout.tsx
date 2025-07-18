import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { SingleImageViewer } from './single-image-viewer';
import { useFileStore } from '../../stores/file-store';

interface SideBySideLayoutProps {
  sx?: Record<string, unknown>;
}

export const SideBySideLayout: React.FC<SideBySideLayoutProps> = ({ sx }) => {
  const { files, selectedFiles } = useFileStore();
  const [splitterPosition, setSplitterPosition] = useState(50); // パーセンテージ
  const [isDragging, setIsDragging] = useState(false);

  // 選択されたファイルを取得
  const leftImage =
    selectedFiles.length > 0 ? files.find((f) => f.id === selectedFiles[0]) : undefined;
  const rightImage =
    selectedFiles.length > 1 ? files.find((f) => f.id === selectedFiles[1]) : undefined;

  // スプリッターのドラッグ開始
  const handleSplitterMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      const container = (e.target as Element).closest('[data-splitter-container]');
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(10, Math.min(90, (x / rect.width) * 100));
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
        flexDirection: 'row',
        position: 'relative',
        ...sx,
      }}
    >
      {/* 左パネル */}
      <Box
        sx={{
          width: `${splitterPosition}%`,
          height: '100%',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          mr: 0.5,
        }}
      >
        <SingleImageViewer
          imageFile={leftImage}
          viewerType="left"
          sx={{ width: '100%', height: '100%' }}
        />
      </Box>

      {/* スプリッター */}
      <Box
        sx={{
          width: 4,
          height: '100%',
          backgroundColor: 'divider',
          cursor: 'col-resize',
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
            width: 2,
            height: 40,
            backgroundColor: 'background.paper',
            borderRadius: 1,
            boxShadow: 1,
          }}
        />
      </Box>

      {/* 右パネル */}
      <Box
        sx={{
          width: `${100 - splitterPosition}%`,
          height: '100%',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          ml: 0.5,
        }}
      >
        <SingleImageViewer
          imageFile={rightImage}
          viewerType="right"
          sx={{ width: '100%', height: '100%' }}
        />
      </Box>
    </Box>
  );
};
