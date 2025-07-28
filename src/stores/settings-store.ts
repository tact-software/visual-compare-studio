import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import i18n from '../i18n';
import { emit } from '@tauri-apps/api/event';

export type Language = 'ja' | 'en';
export type ImageFitMode = 'fit' | 'actual' | 'width' | 'height';
export type BackgroundColor = 'black' | 'gray' | 'white' | 'checker';
export type BorderStyle = 'solid' | 'dashed' | 'dotted';
export interface GeneralSettings {
  language: Language;
}

export interface DisplaySettings {
  theme: 'light' | 'dark' | 'system';
}

export interface ImageDisplaySettings {
  defaultMode: 'file' | 'folder';
  defaultLayout: 'side-by-side' | 'top-bottom';
  defaultViewMode: 'split' | 'swipe';
}

export interface CompareSettings {
  boundaryColor: string;
  boundaryWidth: number;
  boundaryStyle: BorderStyle;
}

export interface OperationSettings {
  shortcuts: Record<string, string>;
}

export interface SettingsStore {
  // 設定
  general: GeneralSettings;
  display: DisplaySettings;
  imageDisplay: ImageDisplaySettings;
  compare: CompareSettings;
  operation: OperationSettings;

  // ダイアログの開閉状態
  isSettingsDialogOpen: boolean;

  // アクション
  updateGeneralSettings: (settings: Partial<GeneralSettings>) => void;
  updateDisplaySettings: (settings: Partial<DisplaySettings>) => void;
  updateImageDisplaySettings: (settings: Partial<ImageDisplaySettings>) => void;
  updateCompareSettings: (settings: Partial<CompareSettings>) => void;
  updateOperationSettings: (settings: Partial<OperationSettings>) => void;
  openSettingsDialog: () => void;
  closeSettingsDialog: () => void;
  resetAllSettings: () => void;
}

const defaultSettings = {
  general: {
    language: 'ja' as Language,
  },
  display: {
    theme: 'system' as const,
  },
  imageDisplay: {
    defaultMode: 'file' as const,
    defaultLayout: 'side-by-side' as const,
    defaultViewMode: 'split' as const,
  },
  compare: {
    boundaryColor: '#666666',
    boundaryWidth: 1,
    boundaryStyle: 'solid' as BorderStyle,
  },
  operation: {
    shortcuts: {
      'zoom-in': 'Ctrl+Plus',
      'zoom-out': 'Ctrl+Minus',
      'reset-view': 'Ctrl+0',
      'open-files': 'Ctrl+O',
      'open-folder1': 'Ctrl+Shift+1',
      'open-folder2': 'Ctrl+Shift+2',
      'toggle-mode': 'Ctrl+M',
      'toggle-layout': 'Ctrl+L',
      'toggle-view': 'Ctrl+T',
    },
  },
};

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        ...defaultSettings,
        isSettingsDialogOpen: false,

        updateGeneralSettings: (settings) =>
          set((state) => {
            const newGeneral = { ...state.general, ...settings };
            // 言語変更時にi18nも更新
            if (settings.language && settings.language !== state.general.language) {
              void i18n.changeLanguage(settings.language);
              // Tauriに言語変更を通知
              void emit('language-changed', settings.language);
            }
            return {
              general: newGeneral,
            };
          }),

        updateDisplaySettings: (settings) =>
          set((state) => ({
            display: { ...state.display, ...settings },
          })),

        updateImageDisplaySettings: (settings) =>
          set((state) => ({
            imageDisplay: { ...state.imageDisplay, ...settings },
          })),

        updateCompareSettings: (settings) =>
          set((state) => ({
            compare: { ...state.compare, ...settings },
          })),

        updateOperationSettings: (settings) =>
          set((state) => ({
            operation: { ...state.operation, ...settings },
          })),

        openSettingsDialog: () => set({ isSettingsDialogOpen: true }),
        closeSettingsDialog: () => set({ isSettingsDialogOpen: false }),

        resetAllSettings: () => set(defaultSettings),
      }),
      {
        name: 'app-settings',
        partialize: (state) => ({
          general: state.general,
          display: state.display,
          imageDisplay: state.imageDisplay,
          compare: state.compare,
          operation: state.operation,
        }),
      }
    )
  )
);
