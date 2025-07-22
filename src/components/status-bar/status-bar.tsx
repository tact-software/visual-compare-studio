import React from 'react';
import { Box, Typography, Chip, LinearProgress } from '@mui/material';
import { Image, Memory, Folder } from '@mui/icons-material';
import { useFileStore } from '../../stores/file-store';
import { useAppStore } from '../../stores/app-store';

export const StatusBar: React.FC = () => {
  const { files, selectedFiles } = useFileStore();
  const { isLoading } = useAppStore();

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const selectedCount = selectedFiles.length;

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <Box
      sx={{
        height: 32,
        minHeight: 32,
        flexShrink: 0,
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        gap: 2,
        bgcolor: 'background.paper',
        position: 'relative',
      }}
    >
      {isLoading && (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
          }}
        />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Folder fontSize="small" />
        <Typography variant="caption" color="text.secondary">
          {files.length} files
        </Typography>
      </Box>

      {selectedCount > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Image fontSize="small" />
          <Typography variant="caption" color="text.secondary">
            {selectedCount} selected
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
        <Memory fontSize="small" />
        <Typography variant="caption" color="text.secondary">
          Total: {formatSize(totalSize)}
        </Typography>
      </Box>

      {import.meta.env.DEV && (
        <Chip label="DEV" size="small" color="warning" sx={{ height: 20, fontSize: '0.7rem' }} />
      )}
    </Box>
  );
};
