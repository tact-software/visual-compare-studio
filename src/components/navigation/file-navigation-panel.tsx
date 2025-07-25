import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
  Tooltip,
  Chip,
  Avatar,
  Stack,
} from '@mui/material';
import { NavigateBefore, NavigateNext, FirstPage, LastPage } from '@mui/icons-material';
import type { ImageFile } from '../../types';

interface FileNavigationPanelProps {
  files: ImageFile[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  maxThumbnails?: number;
}

export const FileNavigationPanel: React.FC<FileNavigationPanelProps> = ({
  files,
  currentIndex,
  onNavigate,
  onPrevious,
  onNext,
  maxThumbnails = 5,
}) => {
  const currentFile = files[currentIndex];
  const totalFiles = files.length;

  // 現在の画像を中心にサムネイル表示範囲を計算
  const getThumbnailRange = () => {
    const half = Math.floor(maxThumbnails / 2);
    let start = Math.max(0, currentIndex - half);
    const end = Math.min(totalFiles - 1, start + maxThumbnails - 1);

    // 終端に近い場合の調整
    if (end - start < maxThumbnails - 1) {
      start = Math.max(0, end - maxThumbnails + 1);
    }

    return { start, end };
  };

  const { start, end } = getThumbnailRange();
  const visibleFiles = files.slice(start, end + 1);

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < totalFiles - 1;

  const handleThumbnailClick = (index: number) => {
    onNavigate(start + index);
  };

  const handleFirstPage = () => {
    onNavigate(0);
  };

  const handleLastPage = () => {
    onNavigate(totalFiles - 1);
  };

  if (totalFiles === 0) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 120,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          画像が選択されていません
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minHeight: 120,
      }}
    >
      {/* 現在のファイル情報とカウンター */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          label={`${currentIndex + 1} / ${totalFiles}`}
          size="small"
          color="primary"
          variant="outlined"
        />
        <Typography
          variant="body2"
          sx={{
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={currentFile?.name}
        >
          {currentFile?.name}
        </Typography>
      </Box>

      {/* ナビゲーションボタン */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Tooltip title="最初の画像">
          <span>
            <IconButton size="small" onClick={handleFirstPage} disabled={!canGoPrevious}>
              <FirstPage fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="前の画像">
          <span>
            <IconButton size="small" onClick={onPrevious} disabled={!canGoPrevious}>
              <NavigateBefore fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {currentFile?.width && currentFile?.height
              ? `${currentFile.width} × ${currentFile.height}`
              : '寸法不明'}
          </Typography>
        </Box>

        <Tooltip title="次の画像">
          <span>
            <IconButton size="small" onClick={onNext} disabled={!canGoNext}>
              <NavigateNext fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="最後の画像">
          <span>
            <IconButton size="small" onClick={handleLastPage} disabled={!canGoNext}>
              <LastPage fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* サムネイル表示 */}
      <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
        {visibleFiles.map((file, index) => {
          const actualIndex = start + index;
          const isActive = actualIndex === currentIndex;

          return (
            <Tooltip key={file.id} title={file.name}>
              <Button
                variant={isActive ? 'contained' : 'outlined'}
                onClick={() => handleThumbnailClick(index)}
                sx={{
                  minWidth: 60,
                  width: 60,
                  height: 60,
                  p: 0.5,
                  borderRadius: 1,
                  position: 'relative',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'transform 0.2s ease-in-out',
                }}
              >
                {file.imageData ? (
                  <Box
                    component="img"
                    src={`data:${file.type};base64,${file.imageData}`}
                    alt={file.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 0.5,
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: '100%',
                      height: '100%',
                      fontSize: '0.75rem',
                      borderRadius: 0.5,
                    }}
                  >
                    {file.name.charAt(0).toUpperCase()}
                  </Avatar>
                )}

                {/* アクティブなサムネイルの表示 */}
                {isActive && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      border: 2,
                      borderColor: 'primary.main',
                      borderRadius: 1,
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </Button>
            </Tooltip>
          );
        })}
      </Stack>

      {/* 表示範囲インジケーター（多くのファイルがある場合） */}
      {totalFiles > maxThumbnails && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {start + 1} - {end + 1} / {totalFiles} 表示中
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
