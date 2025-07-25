import React from 'react';
import { useAppStore } from '../../stores/app-store';
import { FileModeSidebar } from './file-mode-sidebar';
import { FolderModeSidebar } from './folder-mode-sidebar';

export const Sidebar: React.FC = () => {
  const { isFolderMode } = useAppStore();

  return isFolderMode ? <FolderModeSidebar /> : <FileModeSidebar />;
};
