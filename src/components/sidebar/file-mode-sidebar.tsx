import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
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
        p: 2,
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflow: 'auto' }}>
        <Card>
          <CardHeader title={<Typography variant="h6">Files</Typography>} sx={{ pb: 1 }} />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<InsertDriveFile />}
                fullWidth
                size="small"
                onClick={() => void openFiles()}
              >
                Open Files
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title={<Typography variant="h6">Current Files</Typography>}
            sx={{ pb: 1 }}
            action={
              files.length > 0 && (
                <IconButton size="small" onClick={clearFiles} title="Clear all files">
                  <Delete fontSize="small" />
                </IconButton>
              )
            }
          />
          <CardContent sx={{ pt: 0 }}>
            {files.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No files loaded
              </Typography>
            ) : (
              <List dense>
                {files.map((file) => (
                  <ListItem
                    key={file.id}
                    sx={{
                      px: 1,
                      bgcolor: selectedFiles.includes(file.id) ? 'action.selected' : 'transparent',
                      cursor: 'pointer',
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
                        title="Remove file"
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
                          <Typography variant="body2" component="span">
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
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
