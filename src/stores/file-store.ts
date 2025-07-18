import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ImageFile } from '../types';

interface FileStore {
  files: ImageFile[];
  selectedFiles: string[];
  history: ImageFile[];
  addFile: (file: ImageFile) => void;
  addFiles: (files: ImageFile[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  selectFile: (id: string) => void;
  deselectFile: (id: string) => void;
  setSelectedFiles: (ids: string[]) => void;
  addToHistory: (file: ImageFile) => void;
}

const MAX_HISTORY = 50;

export const useFileStore = create<FileStore>()(
  devtools((set) => ({
    files: [],
    selectedFiles: [],
    history: [],
    addFile: (file) =>
      set((state) => ({
        files: [...state.files, file],
        history: [file, ...state.history.filter((f) => f.id !== file.id)].slice(0, MAX_HISTORY),
      })),
    addFiles: (files) =>
      set((state) => ({
        files: [...state.files, ...files],
        history: [
          ...files,
          ...state.history.filter((f) => !files.some((nf) => nf.id === f.id)),
        ].slice(0, MAX_HISTORY),
      })),
    removeFile: (id) =>
      set((state) => ({
        files: state.files.filter((f) => f.id !== id),
        selectedFiles: state.selectedFiles.filter((fid) => fid !== id),
      })),
    clearFiles: () => set({ files: [], selectedFiles: [] }),
    selectFile: (id) =>
      set((state) => ({
        selectedFiles: [...state.selectedFiles, id],
      })),
    deselectFile: (id) =>
      set((state) => ({
        selectedFiles: state.selectedFiles.filter((fid) => fid !== id),
      })),
    setSelectedFiles: (ids) => set({ selectedFiles: ids }),
    addToHistory: (file) =>
      set((state) => ({
        history: [file, ...state.history.filter((f) => f.id !== file.id)].slice(0, MAX_HISTORY),
      })),
  }))
);
