import { open } from '@tauri-apps/plugin-dialog';
import { useFileStore } from '../stores/file-store';
import { useAppStore } from '../stores/app-store';
import { useCallback } from 'react';
import { logger } from '../utils/logger';
import { getFileMetadata, readImageFile } from '../utils/tauri-api-exports';

export function useFileDialog() {
  const { addFiles, clearFiles } = useFileStore();
  const { setLoading } = useAppStore();

  const openFiles = useCallback(async () => {
    try {
      const selected = await open({
        multiple: true,
        filters: [
          {
            name: 'Images',
            extensions: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'bmp', 'gif'],
          },
          {
            name: 'All Files',
            extensions: ['*'],
          },
        ],
      });

      if (!selected) return;

      const paths = Array.isArray(selected) ? selected : [selected];

      setLoading(true, `Loading ${paths.length} file${paths.length > 1 ? 's' : ''}...`);

      // Load file metadata and content
      const filePromises = paths.map(async (path) => {
        const metadata = await getFileMetadata(path);
        const imageData = await readImageFile(path);

        return {
          id: crypto.randomUUID(),
          name: path.split('/').pop() || 'Unknown',
          path,
          size: metadata.size,
          modifiedAt: new Date(metadata.modified),
          lastModified: metadata.modified,
          type: `image/${path.split('.').pop()?.toLowerCase() || 'unknown'}`,
          imageData,
        };
      });

      const files = await Promise.all(filePromises);
      addFiles(files);

      logger.info(`Loaded ${files.length} files`);
      setLoading(false);
    } catch (error) {
      logger.error('Failed to open files', error);
      setLoading(false);
    }
  }, [addFiles, setLoading]);

  const openFolder = useCallback(async () => {
    try {
      const selected = await open({
        directory: true,
      });

      if (!selected || typeof selected !== 'string') return;

      // TODO: Implement folder scanning for images
      logger.info(`Selected folder: ${selected}`);
    } catch (error) {
      logger.error('Failed to open folder', error);
    }
  }, []);

  const clearAllFiles = useCallback(() => {
    clearFiles();
    logger.info('Cleared all files');
  }, [clearFiles]);

  return {
    openFiles,
    openFolder,
    clearAllFiles,
  };
}
