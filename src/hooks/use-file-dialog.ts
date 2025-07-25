import { open } from '@tauri-apps/plugin-dialog';
import { useFileStore } from '../stores/file-store';
import { useAppStore } from '../stores/app-store';
import { useFolderStore } from '../stores/folder-store';
import { useCallback } from 'react';
import { logger } from '../utils/logger';
import { getFileMetadata, readImageFile } from '../utils/tauri-api-exports';
import { getCachedImageData } from '../utils/image-cache';

export function useFileDialog() {
  const { addFiles, clearFiles } = useFileStore();
  const { setLoading, isFolderMode } = useAppStore();
  const { setFolder1, setFolder2, folder1Path, folder2Path } = useFolderStore();

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

        // キャッシュから画像データを取得または読み込み
        const imageData = await getCachedImageData(path, () => readImageFile(path));

        const fileName = path.split('/').pop() || 'Unknown';
        const extension = path.split('.').pop()?.toLowerCase() || 'unknown';
        const mimeType = `image/${extension}`;

        return {
          id: crypto.randomUUID(),
          name: fileName,
          path,
          size: metadata.size,
          modifiedAt: new Date(metadata.modified),
          lastModified: metadata.modified,
          type: mimeType,
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

  const openFolder = useCallback(
    async (targetFolder?: 'folder1' | 'folder2') => {
      try {
        const selected = await open({
          directory: true,
        });

        if (!selected || typeof selected !== 'string') return selected;

        // フォルダモードの場合は、folder1かfolder2に設定
        if (isFolderMode) {
          if (targetFolder === 'folder1') {
            setFolder1(selected);
          } else if (targetFolder === 'folder2') {
            setFolder2(selected);
          } else {
            // targetFolderが指定されていない場合の自動判定ロジック
            if (!folder1Path) {
              setFolder1(selected);
            } else if (!folder2Path) {
              setFolder2(selected);
            } else {
              // 両方埋まっている場合は、folder1を上書き
              setFolder1(selected);
            }
          }
        }

        logger.info(`Opened folder: ${selected}`);
        return selected;
      } catch (error) {
        logger.error('Failed to open folder', error);
        return null;
      }
    },
    [isFolderMode, folder1Path, folder2Path, setFolder1, setFolder2]
  );

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
