import React from 'react';
import { Box } from '@mui/material';
import { SingleImageViewer } from './single-image-viewer';
import { useFileStore } from '../../stores/file-store';

interface TopBottomLayoutProps {
  sx?: Record<string, unknown>;
}

export const TopBottomLayout: React.FC<TopBottomLayoutProps> = ({ sx }) => {
  const { files, selectedFiles } = useFileStore();

  // 選択されたファイルを取得
  const topImage =
    selectedFiles.length > 0 ? files.find((f) => f.id === selectedFiles[0]) : undefined;
  const bottomImage =
    selectedFiles.length > 1 ? files.find((f) => f.id === selectedFiles[1]) : undefined;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        ...sx,
      }}
    >
      <Box
        data-splitter-container
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          gap: 0,
        }}
      >
        {/* 上パネル */}
        <Box
          sx={{
            width: '100%',
            flex: '1 0 0',
            overflow: 'hidden',
            minHeight: 0,
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
            flexShrink: 0,
            backgroundColor: 'divider',
          }}
        />

        {/* 下パネル */}
        <Box
          sx={{
            width: '100%',
            flex: '1 0 0',
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          <SingleImageViewer
            imageFile={bottomImage}
            viewerType="bottom"
            sx={{ width: '100%', height: '100%' }}
          />
        </Box>
      </Box>
    </Box>
  );
};
