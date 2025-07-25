import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { listen } from '@tauri-apps/api/event';

export interface FileMetadata {
  path: string;
  name: string;
  size: number;
  lastModified: number;
  modified: number;
  created: number;
  accessed: number;
  is_file: boolean;
  is_dir: boolean;
  is_symlink: boolean;
  permissions: {
    readonly: boolean;
  };
}

export interface ImageInfo extends FileMetadata {
  width: number;
  height: number;
  format: string;
}

// Commands
export const commands = {
  async getImageInfo(path: string): Promise<ImageInfo> {
    return await invoke<ImageInfo>('get_image_info', { path });
  },

  async readImageFile(path: string): Promise<string> {
    return await invoke<string>('read_image_file', { path });
  },

  async getFileMetadata(path: string): Promise<FileMetadata> {
    return await invoke<FileMetadata>('get_file_metadata', { path });
  },

  async generateThumbnail(path: string, maxSize: number): Promise<string> {
    return await invoke<string>('generate_thumbnail', { path, maxSize });
  },

  async scanFolderForImages(folderPath: string): Promise<string[]> {
    return await invoke<string[]>('scan_folder_for_images', { folderPath });
  },
};

// Events
export const events = {
  FILE_DROPPED: 'file-dropped',
  THEME_CHANGED: 'theme-changed',
  PROGRESS_UPDATE: 'progress-update',
};

// Event listeners
export const eventListeners = {
  onFileDropped(handler: (paths: string[]) => void) {
    return listen<string[]>(events.FILE_DROPPED, (event) => {
      handler(event.payload);
    });
  },

  onThemeChanged(handler: (theme: 'light' | 'dark') => void) {
    return listen<'light' | 'dark'>(events.THEME_CHANGED, (event) => {
      handler(event.payload);
    });
  },

  onProgressUpdate(handler: (progress: number) => void) {
    return listen<number>(events.PROGRESS_UPDATE, (event) => {
      handler(event.payload);
    });
  },
};

// Utility functions
export const openFileDialog = async (): Promise<string[] | null> => {
  try {
    const selected = await open({
      multiple: true,
      directory: false,
      filters: [
        {
          name: 'Images',
          extensions: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'bmp', 'gif'],
        },
      ],
    });
    return selected ? (Array.isArray(selected) ? selected : [selected]) : null;
  } catch (error) {
    console.error('Error opening file dialog:', error);
    return null;
  }
};

export const openFolderDialog = async (): Promise<string | null> => {
  try {
    const selected = await open({
      multiple: false,
      directory: true,
    });
    return selected ? String(selected) : null;
  } catch (error) {
    console.error('Error opening folder dialog:', error);
    return null;
  }
};
