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
} from '@mui/material';
import { FolderOpen, InsertDriveFile } from '@mui/icons-material';
import { useFileStore } from '../../stores/file-store';

export const Sidebar: React.FC = () => {
  const { files, selectedFiles, history } = useFileStore();

  return (
    <Box sx={{ width: 256, borderRight: 1, borderColor: 'divider', p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card>
          <CardHeader title={<Typography variant="h6">Files</Typography>} sx={{ pb: 1 }} />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="outlined" startIcon={<InsertDriveFile />} fullWidth size="small">
                Open Files
              </Button>
              <Button variant="outlined" startIcon={<FolderOpen />} fullWidth size="small">
                Open Folder
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title={<Typography variant="h6">Current Files</Typography>} sx={{ pb: 1 }} />
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
                    }}
                  >
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
