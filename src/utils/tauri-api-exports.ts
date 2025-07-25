// Export convenience functions from commands
import { commands } from './tauri-api';

export const getFileMetadata = (path: string) => {
  return commands.getFileMetadata(path);
};

export const readImageFile = (path: string) => {
  return commands.readImageFile(path);
};

export const getImageInfo = (path: string) => {
  return commands.getImageInfo(path);
};

export const generateThumbnail = (path: string, maxSize: number) => {
  return commands.generateThumbnail(path, maxSize);
};

export const scanFolderForImages = (folderPath: string) => {
  return commands.scanFolderForImages(folderPath);
};
