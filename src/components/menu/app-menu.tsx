import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  MenuList,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  FolderOpen,
  InsertDriveFile,
  Settings,
  Info,
  ExitToApp,
} from '@mui/icons-material';
import { useFileDialog } from '../../hooks/use-file-dialog';
import { exit } from '@tauri-apps/plugin-process';

export const AppMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { openFiles, openFolder } = useFileDialog();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenFiles = async () => {
    handleMenuClose();
    await openFiles();
  };

  const handleOpenFolder = async () => {
    handleMenuClose();
    await openFolder();
  };

  const handleSettings = () => {
    handleMenuClose();
    // TODO: Open settings dialog
  };

  const handleAbout = () => {
    handleMenuClose();
    // TODO: Open about dialog
  };

  const handleExit = async () => {
    await exit(0);
  };

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleMenuOpen}
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuList>
          <MenuItem onClick={() => void handleOpenFiles()}>
            <ListItemIcon>
              <InsertDriveFile />
            </ListItemIcon>
            <ListItemText>Open Files...</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => void handleOpenFolder()}>
            <ListItemIcon>
              <FolderOpen />
            </ListItemIcon>
            <ListItemText>Open Folder...</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleSettings}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleAbout}>
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText>About</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => void handleExit()}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText>Exit</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};
