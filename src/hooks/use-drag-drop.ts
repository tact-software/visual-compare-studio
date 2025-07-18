import { useCallback, useState, DragEvent } from 'react';
import { useFileStore } from '../stores/file-store';
import { logger } from '../utils/logger';
import { getFileMetadata, readImageFile } from '../utils/tauri-api-exports';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'bmp', 'gif'];

export function useDragDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const { addFiles } = useFileStore();

  // Helper function to traverse file tree
  const traverseFileTree = useCallback(
    async (entry: FileSystemEntry, paths: string[], path = ''): Promise<void> => {
      if (entry.isFile) {
        paths.push(entry.fullPath);
      } else if (entry.isDirectory) {
        const dirEntry = entry as FileSystemDirectoryEntry;
        const reader = dirEntry.createReader();

        return new Promise((resolve) => {
          reader.readEntries((entries) => {
            void (async () => {
              for (const childEntry of entries) {
                await traverseFileTree(childEntry, paths, path + entry.name + '/');
              }
              resolve();
            })();
          });
        });
      }
    },
    []
  );

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      try {
        const items = Array.from(e.dataTransfer.items);
        const paths: string[] = [];

        for (const item of items) {
          if (item.kind === 'file') {
            const entry = item.webkitGetAsEntry();
            if (entry) {
              await traverseFileTree(entry, paths);
            }
          }
        }

        // Filter for image files
        const imagePaths = paths.filter((path) => {
          const ext = path.split('.').pop()?.toLowerCase();
          return ext && IMAGE_EXTENSIONS.includes(ext);
        });

        if (imagePaths.length === 0) {
          logger.warn('No image files found in dropped items');
          return;
        }

        // Load file metadata and content
        const filePromises = imagePaths.map(async (path) => {
          try {
            const metadata = await getFileMetadata(path);
            const imageData = await readImageFile(path);

            return {
              id: crypto.randomUUID(),
              name: path.split('/').pop() || 'Unknown',
              path,
              size: metadata.size,
              lastModified: metadata.modified,
              type: `image/${path.split('.').pop()?.toLowerCase() || 'unknown'}`,
              imageData,
              modifiedAt: new Date(metadata.modified),
            };
          } catch (error) {
            logger.error(`Failed to load file: ${path}`, error);
            return null;
          }
        });

        const results = await Promise.all(filePromises);
        const files = results.filter((f): f is NonNullable<typeof f> => f !== null);

        if (files.length > 0) {
          addFiles(files);
          logger.info(`Added ${files.length} files via drag and drop`);
        }
      } catch (error) {
        logger.error('Failed to process dropped files', error);
      }
    },
    [addFiles, traverseFileTree]
  );

  return {
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}
