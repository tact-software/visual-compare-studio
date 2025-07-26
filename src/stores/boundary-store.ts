import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface BoundarySettings {
  color: string;
  width: number;
}

export interface BoundaryStore {
  // 境界線の設定
  boundarySettings: BoundarySettings;

  // 設定ダイアログの開閉状態
  isSettingsDialogOpen: boolean;

  // アクション
  setBoundaryColor: (color: string) => void;
  setBoundaryWidth: (width: number) => void;
  setBoundarySettings: (settings: Partial<BoundarySettings>) => void;
  openSettingsDialog: () => void;
  closeSettingsDialog: () => void;
  resetBoundarySettings: () => void;
}

const defaultBoundarySettings: BoundarySettings = {
  color: '#666666',
  width: 1,
};

export const useBoundaryStore = create<BoundaryStore>()(
  devtools(
    persist(
      (set) => ({
        boundarySettings: defaultBoundarySettings,
        isSettingsDialogOpen: false,

        setBoundaryColor: (color) =>
          set((state) => ({
            boundarySettings: { ...state.boundarySettings, color },
          })),

        setBoundaryWidth: (width) =>
          set((state) => ({
            boundarySettings: { ...state.boundarySettings, width },
          })),

        setBoundarySettings: (settings) =>
          set((state) => ({
            boundarySettings: { ...state.boundarySettings, ...settings },
          })),

        openSettingsDialog: () => set({ isSettingsDialogOpen: true }),
        closeSettingsDialog: () => set({ isSettingsDialogOpen: false }),

        resetBoundarySettings: () => set({ boundarySettings: defaultBoundarySettings }),
      }),
      {
        name: 'boundary-settings',
        partialize: (state) => ({ boundarySettings: state.boundarySettings }),
      }
    )
  )
);
