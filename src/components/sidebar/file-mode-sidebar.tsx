import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Badge,
} from '@mui/material';
import { InsertDriveFile, Close, Delete } from '@mui/icons-material';
import { useFileStore } from '../../stores/file-store';
import { useFileDialog } from '../../hooks/use-file-dialog';

export const FileModeSidebar: React.FC = () => {
  const { t } = useTranslation();
  const { files, selectedFiles, removeFile, clearFiles, selectFile, deselectFile } = useFileStore();
  const { openFiles } = useFileDialog();

  const handleFileClick = (fileId: string) => {
    if (selectedFiles.includes(fileId)) {
      deselectFile(fileId);
    } else {
      // 最大2つまで選択可能
      if (selectedFiles.length >= 2) {
        // 最も古い選択を削除
        deselectFile(selectedFiles[0]);
      }
      selectFile(fileId);
    }
  };

  return (
    <Box
      sx={{
        width: 256,
        borderRight: 1,
        borderColor: 'divider',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ファイルを開くボタン - 固定高さ */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Button
          variant="outlined"
          startIcon={<InsertDriveFile />}
          fullWidth
          size="small"
          onClick={() => void openFiles()}
        >
          {t('toolbar.openFiles')}
        </Button>
      </Box>

      {/* ファイルリスト - 残りの高さを使用してスクロール可能 */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 48,
          }}
        >
          <Typography variant="subtitle2">{t('sidebar.files')}</Typography>
          {files.length > 0 && (
            <IconButton size="small" onClick={clearFiles} title={t('common.clear')}>
              <Delete fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 1 }}>
          {files.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('sidebar.noFiles')}
            </Typography>
          ) : (
            <List dense sx={{ py: 0 }}>
              {files.map((file) => (
                <ListItem
                  key={file.id}
                  sx={{
                    px: 1,
                    bgcolor: selectedFiles.includes(file.id) ? 'action.selected' : 'transparent',
                    cursor: 'pointer',
                    borderRadius: 1,
                    mb: 0.5,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                  onClick={() => handleFileClick(file.id)}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      title={t('common.remove')}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {selectedFiles.includes(file.id) && (
                          <Badge
                            badgeContent={selectedFiles.indexOf(file.id) + 1}
                            color="primary"
                            sx={{
                              '& .MuiBadge-badge': {
                                fontSize: '0.7rem',
                                height: 18,
                                minWidth: 18,
                              },
                            }}
                          />
                        )}
                        <Typography
                          variant="body2"
                          component="span"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '160px',
                          }}
                        >
                          {file.name}
                        </Typography>
                      </Box>
                    }
                    secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Box>
  );
};
