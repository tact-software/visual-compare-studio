import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AppSettings, LayoutMode } from '../types';

interface AppStore {
  settings: AppSettings;
  currentLayout: LayoutMode;
  setTheme: (theme: AppSettings['theme']) => void;
  setSyncZoom: (sync: boolean) => void;
  setSyncPan: (sync: boolean) => void;
  setLayout: (layout: LayoutMode) => void;
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
      }),
      {
        name: 'vcs-app-store',
      }
    )
  )
);
