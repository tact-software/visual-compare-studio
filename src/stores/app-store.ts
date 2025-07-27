import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AppSettings, LayoutMode } from '../types';

interface AppStore {
  settings: AppSettings;
  currentLayout: LayoutMode;
  isLoading: boolean;
  loadingMessage?: string;
  isFolderMode: boolean;
  isAboutDialogOpen: boolean;
  setTheme: (theme: AppSettings['theme']) => void;
  setSyncZoom: (sync: boolean) => void;
  setSyncPan: (sync: boolean) => void;
  setLayout: (layout: LayoutMode) => void;
  setLoading: (loading: boolean, message?: string) => void;
  setFolderMode: (isFolderMode: boolean) => void;
  openAboutDialog: () => void;
  closeAboutDialog: () => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        settings: {
          theme: 'system',
          syncZoom: true,
          syncPan: true,
          defaultLayout: { type: 'side-by-side' },
        },
        currentLayout: { type: 'side-by-side' },
        isLoading: false,
        loadingMessage: undefined,
        isFolderMode: false,
        isAboutDialogOpen: false,
        setTheme: (theme) =>
          set((state) => ({
            settings: { ...state.settings, theme },
          })),
        setSyncZoom: (syncZoom) =>
          set((state) => ({
            settings: { ...state.settings, syncZoom },
          })),
        setSyncPan: (syncPan) =>
          set((state) => ({
            settings: { ...state.settings, syncPan },
          })),
        setLayout: (layout) => set({ currentLayout: layout }),
        setLoading: (loading, message) => set({ isLoading: loading, loadingMessage: message }),
        setFolderMode: (isFolderMode) => set({ isFolderMode }),
        openAboutDialog: () => set({ isAboutDialogOpen: true }),
        closeAboutDialog: () => set({ isAboutDialogOpen: false }),
      }),
      {
        name: 'vcs-app-store',
      }
    )
  )
);
