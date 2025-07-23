import React from 'react';
import { Box } from '@mui/material';
import { SingleImageViewer } from './single-image-viewer';
import { useFileStore } from '../../stores/file-store';

interface SideBySideLayoutProps {
  sx?: Record<string, unknown>;
}

export const SideBySideLayout: React.FC<SideBySideLayoutProps> = ({ sx }) => {
  const { files, selectedFiles } = useFileStore();

  // 選択されたファイルを取得
  const leftImage =
    selectedFiles.length > 0 ? files.find((f) => f.id === selectedFiles[0]) : undefined;
  const rightImage =
    selectedFiles.length > 1 ? files.find((f) => f.id === selectedFiles[1]) : undefined;

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
          flex: '1 0 0',
          height: '100%',
          overflow: 'hidden',
          minWidth: 0,
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
          flexShrink: 0,
        }}
      />

      {/* 右パネル */}
      <Box
        sx={{
          flex: '1 0 0',
          height: '100%',
          overflow: 'hidden',
          minWidth: 0,
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
