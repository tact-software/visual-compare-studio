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
} from '@mui/material';
import { FolderOpen, InsertDriveFile, Close, Delete } from '@mui/icons-material';
import { useFileStore } from '../../stores/file-store';
import { useFileDialog } from '../../hooks/use-file-dialog';

export const Sidebar: React.FC = () => {
  const { files, selectedFiles, history, removeFile, clearFiles, selectFile, deselectFile } =
    useFileStore();
  const { openFiles, openFolder } = useFileDialog();

  const handleFileClick = (fileId: string) => {
    if (selectedFiles.includes(fileId)) {
      deselectFile(fileId);
    } else {
      selectFile(fileId);
    }
  };

  return (
    <Box sx={{ width: 256, borderRight: 1, borderColor: 'divider', p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
              <Button
                variant="outlined"
                startIcon={<FolderOpen />}
                fullWidth
                size="small"
                onClick={() => void openFolder()}
              >
                Open Folder
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
                      primary={file.name}
                      secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title={<Typography variant="h6">Recent Files</Typography>} sx={{ pb: 1 }} />
          <CardContent sx={{ pt: 0 }}>
            {history.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No recent files
              </Typography>
            ) : (
              <List dense>
                {history.slice(0, 5).map((file) => (
                  <ListItem key={file.id} sx={{ px: 1, cursor: 'pointer' }}>
                    <ListItemText
                      primary={file.name}
                      primaryTypographyProps={{ variant: 'body2' }}
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
