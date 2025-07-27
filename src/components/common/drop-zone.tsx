import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Paper, alpha, useTheme } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useDragDrop } from '../../hooks/use-drag-drop';

interface DropZoneProps {
  children: React.ReactNode;
}

export const DropZone: React.FC<DropZoneProps> = ({ children }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } =
    useDragDrop();

  return (
    <Box
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={(e) => void handleDrop(e)}
      sx={{ position: 'relative', height: '100%' }}
    >
      {children}
      {isDragging && (
        <Paper
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            border: `2px dashed ${theme.palette.primary.main}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
          elevation={0}
        >
          <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" color="primary">
            {t('dropZone.dropImagesHere')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('dropZone.supportedFormats')}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
