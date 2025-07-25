import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ImageFile } from '../types';
import { commands } from '../utils/tauri-api';

interface MatchedFile {
  fileName: string;
  file1: ImageFile;
  file2: ImageFile;
}

interface FolderStore {
  // State
  folder1Path: string | null;
  folder2Path: string | null;
  matchedFiles: MatchedFile[];
  currentMatchIndex: number;
  isAnalyzed: boolean;
  isLoading: boolean;
  loadingProgress: number;
  loadingMessage: string;
  error: string | null;
  abortController: AbortController | null;

  // Actions
  setFolder1: (path: string) => void;
  setFolder2: (path: string) => void;
  analyzeFolders: () => Promise<void>;
  cancelAnalysis: () => void;
  navigateToNext: () => void;
  navigateToPrevious: () => void;
  navigateToIndex: (index: number) => void;
  loadImageData: (fileName: string) => Promise<void>;
  clearFolders: () => void;
  resetAnalysis: () => void;
  getCurrentMatch: () => MatchedFile | null;
}

// Note: createImageFileFromPath function removed as we now create lightweight objects directly

export const useFolderStore = create<FolderStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      folder1Path: null,
      folder2Path: null,
      matchedFiles: [],
      currentMatchIndex: 0,
      isAnalyzed: false,
      isLoading: false,
      loadingProgress: 0,
      loadingMessage: '',
      error: null,
      abortController: null,

      // Set folder 1
      setFolder1: (path: string) => {
        set({
          folder1Path: path,
          isAnalyzed: false,
          matchedFiles: [],
          currentMatchIndex: 0,
        });
      },

      // Set folder 2
      setFolder2: (path: string) => {
        set({
          folder2Path: path,
          isAnalyzed: false,
          matchedFiles: [],
          currentMatchIndex: 0,
        });
      },

      // Cancel analysis
      cancelAnalysis: () => {
        const { abortController } = get();
        if (abortController) {
          abortController.abort();
        }
        set({
          isLoading: false,
          loadingProgress: 0,
          loadingMessage: '',
          abortController: null,
        });
      },

      // Analyze both folders and find matching files (lightweight - only file names)
      analyzeFolders: async () => {
        const { folder1Path, folder2Path } = get();

        if (!folder1Path || !folder2Path) {
          set({ error: '2つのフォルダを選択してください' });
          return;
        }

        // Create new abort controller
        const abortController = new AbortController();

        set({
          isLoading: true,
          error: null,
          loadingProgress: 0,
          loadingMessage: 'フォルダをスキャンしています...',
          abortController,
        });

        try {
          // Scan both folders with timeout and yielding
          set({ loadingProgress: 20, loadingMessage: 'フォルダ1をスキャンしています...' });

          // Allow UI to update before starting scan
          await new Promise((resolve) => setTimeout(resolve, 100));

          const folder1Files = await commands.scanFolderForImages(folder1Path);

          set({ loadingProgress: 50, loadingMessage: 'フォルダ2をスキャンしています...' });

          // Allow UI to update before starting second scan
          await new Promise((resolve) => setTimeout(resolve, 100));

          const folder2Files = await commands.scanFolderForImages(folder2Path);

          set({ loadingProgress: 70, loadingMessage: '同名ファイルを検索しています...' });

          // Allow UI to update
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Create maps for quick lookup
          const folder1Map = new Map<string, string>();
          const folder2Map = new Map<string, string>();

          // Process in chunks to avoid blocking
          const chunkSize = 1000;
          for (let i = 0; i < folder1Files.length; i += chunkSize) {
            // Check if cancelled
            if (abortController.signal.aborted) {
              throw new Error('Analysis cancelled');
            }

            const chunk = folder1Files.slice(i, i + chunkSize);
            chunk.forEach((path) => {
              const fileName = path.split('/').pop() || '';
              folder1Map.set(fileName, path);
            });
            if (i + chunkSize < folder1Files.length) {
              await new Promise((resolve) => setTimeout(resolve, 0)); // Yield to UI
            }
          }

          for (let i = 0; i < folder2Files.length; i += chunkSize) {
            // Check if cancelled
            if (abortController.signal.aborted) {
              throw new Error('Analysis cancelled');
            }

            const chunk = folder2Files.slice(i, i + chunkSize);
            chunk.forEach((path) => {
              const fileName = path.split('/').pop() || '';
              folder2Map.set(fileName, path);
            });
            if (i + chunkSize < folder2Files.length) {
              await new Promise((resolve) => setTimeout(resolve, 0)); // Yield to UI
            }
          }

          // Find matching files - create lightweight MatchedFile objects
          const matchedFiles: MatchedFile[] = [];
          for (const [fileName] of folder1Map) {
            if (folder2Map.has(fileName)) {
              const path1 = folder1Map.get(fileName)!;
              const path2 = folder2Map.get(fileName)!;

              // Create minimal ImageFile objects without metadata or image data
              const file1: ImageFile = {
                id: path1,
                path: path1,
                name: fileName,
                size: 0, // Will be loaded when needed
                width: 0, // Will be loaded when needed
                height: 0, // Will be loaded when needed
                lastModified: 0, // Will be loaded when needed
                type: 'image/' + (fileName.split('.').pop()?.toLowerCase() || 'jpeg'),
                modifiedAt: new Date(), // Will be loaded when needed
                // imageData is undefined - will be loaded when selected
              };

              const file2: ImageFile = {
                id: path2,
                path: path2,
                name: fileName,
                size: 0, // Will be loaded when needed
                width: 0, // Will be loaded when needed
                height: 0, // Will be loaded when needed
                lastModified: 0, // Will be loaded when needed
                type: 'image/' + (fileName.split('.').pop()?.toLowerCase() || 'jpeg'),
                modifiedAt: new Date(), // Will be loaded when needed
                // imageData is undefined - will be loaded when selected
              };

              matchedFiles.push({
                fileName,
                file1,
                file2,
              });
            }
          }

          set({ loadingProgress: 95, loadingMessage: 'ファイルをソートしています...' });

          // Sort by file name
          matchedFiles.sort((a, b) => a.fileName.localeCompare(b.fileName));

          set({
            matchedFiles,
            currentMatchIndex: 0,
            isAnalyzed: true,
            isLoading: false,
            loadingProgress: 100,
            loadingMessage: '',
            error: matchedFiles.length === 0 ? '同名のファイルが見つかりませんでした' : null,
            abortController: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

          // Don't show error if cancelled
          if (errorMessage !== 'Analysis cancelled') {
            set({
              isLoading: false,
              loadingProgress: 0,
              loadingMessage: '',
              error: `フォルダの解析に失敗しました: ${errorMessage}`,
              abortController: null,
            });
          }
        }
      },

      // Navigate to next matched file
      navigateToNext: () => {
        set((state) => {
          const nextIndex = Math.min(state.currentMatchIndex + 1, state.matchedFiles.length - 1);
          return { currentMatchIndex: nextIndex };
        });
      },

      // Navigate to previous matched file
      navigateToPrevious: () => {
        set((state) => {
          const prevIndex = Math.max(state.currentMatchIndex - 1, 0);
          return { currentMatchIndex: prevIndex };
        });
      },

      // Navigate to specific index
      navigateToIndex: (index: number) => {
        set((state) => {
          const clampedIndex = Math.max(0, Math.min(index, state.matchedFiles.length - 1));
          return { currentMatchIndex: clampedIndex };
        });
      },

      // Load image data and metadata for a specific matched file
      loadImageData: async (fileName: string) => {
        const state = get();
        const matchedFile = state.matchedFiles.find((m) => m.fileName === fileName);

        if (!matchedFile) {
          return;
        }

        try {
          // Load metadata and image data for both files if not already loaded
          const loadPromises = [];

          if (!matchedFile.file1.imageData) {
            loadPromises.push(
              Promise.all([
                commands.getImageInfo(matchedFile.file1.path),
                commands.readImageFile(matchedFile.file1.path),
              ]).then(([imageInfo, imageData]) => ({
                file: 'file1' as const,
                imageInfo,
                imageData,
              }))
            );
          }

          if (!matchedFile.file2.imageData) {
            loadPromises.push(
              Promise.all([
                commands.getImageInfo(matchedFile.file2.path),
                commands.readImageFile(matchedFile.file2.path),
              ]).then(([imageInfo, imageData]) => ({
                file: 'file2' as const,
                imageInfo,
                imageData,
              }))
            );
          }

          const results = await Promise.all(loadPromises);

          set((state) => ({
            matchedFiles: state.matchedFiles.map((m) => {
              if (m.fileName === fileName) {
                const updated = { ...m };
                results.forEach(({ file, imageInfo, imageData }) => {
                  if (file === 'file1') {
                    updated.file1 = {
                      ...updated.file1,
                      size: imageInfo.size,
                      width: imageInfo.width,
                      height: imageInfo.height,
                      lastModified: imageInfo.lastModified,
                      modifiedAt: new Date(imageInfo.lastModified),
                      type: imageInfo.format,
                      imageData,
                    };
                  } else {
                    updated.file2 = {
                      ...updated.file2,
                      size: imageInfo.size,
                      width: imageInfo.width,
                      height: imageInfo.height,
                      lastModified: imageInfo.lastModified,
                      modifiedAt: new Date(imageInfo.lastModified),
                      type: imageInfo.format,
                      imageData,
                    };
                  }
                });
                return updated;
              }
              return m;
            }),
          }));
        } catch (error) {
          console.error(`Failed to load image data for ${fileName}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          set({
            error: `画像データの読み込みに失敗しました: ${errorMessage}`,
          });
        }
      },

      // Clear folders
      clearFolders: () => {
        set({
          folder1Path: null,
          folder2Path: null,
          matchedFiles: [],
          currentMatchIndex: 0,
          isAnalyzed: false,
          error: null,
        });
      },

      // Reset analysis
      resetAnalysis: () => {
        set({
          matchedFiles: [],
          currentMatchIndex: 0,
          isAnalyzed: false,
          error: null,
        });
      },

      // Get current match
      getCurrentMatch: () => {
        const state = get();
        return state.matchedFiles[state.currentMatchIndex] || null;
      },
    }),
    {
      name: 'folder-store',
    }
  )
);
