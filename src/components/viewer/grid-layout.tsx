import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { SingleImageViewer } from './single-image-viewer';
import { useFileStore } from '../../stores/file-store';
import { useAppStore } from '../../stores/app-store';

interface GridLayoutProps {
  sx?: Record<string, unknown>;
}

export const GridLayout: React.FC<GridLayoutProps> = ({ sx }) => {
  const { files, selectedFiles } = useFileStore();
  const { currentLayout } = useAppStore();

  // グリッドサイズを取得（デフォルトは2x2）
  const gridSize = currentLayout.gridSize || '2x2';
  const gridDimensions = gridSize === '3x3' ? 3 : 2;
  const totalCells = gridDimensions * gridDimensions;

  // 選択されたファイルを取得
  const selectedImages = selectedFiles
    .slice(0, totalCells)
    .map((id) => files.find((f) => f.id === id));

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        p: 1,
        ...sx,
      }}
    >
      <Grid container spacing={1} sx={{ height: '100%' }}>
        {Array.from({ length: totalCells }).map((_, index) => (
          <Grid size={12 / gridDimensions} key={index} sx={{ height: `${100 / gridDimensions}%` }}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {selectedImages[index] ? (
                <SingleImageViewer
                  imageFile={selectedImages[index]}
                  viewerType="left" // グリッドでは同期は無効
                  sx={{ width: '100%', height: '100%' }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'grey.100',
                    color: 'text.secondary',
                  }}
                >
                  <Typography variant="body2">Empty slot {index + 1}</Typography>
                </Box>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
