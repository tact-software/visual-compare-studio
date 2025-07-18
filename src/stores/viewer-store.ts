import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ViewerState {
  zoom: number;
  panX: number;
  panY: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
}

export interface ViewerStore {
  // 左右分割時の各パネルの状態
  leftViewer: ViewerState;
  rightViewer: ViewerState;

  // 上下分割時の各パネルの状態
  topViewer: ViewerState;
  bottomViewer: ViewerState;

  // 同期設定
  syncZoom: boolean;
  syncPan: boolean;
  syncRotation: boolean;
  syncScroll: boolean;

  // アクション
  setLeftViewer: (state: Partial<ViewerState>) => void;
  setRightViewer: (state: Partial<ViewerState>) => void;
  setTopViewer: (state: Partial<ViewerState>) => void;
  setBottomViewer: (state: Partial<ViewerState>) => void;

  // 同期アクション
  setSyncZoom: (enabled: boolean) => void;
  setSyncPan: (enabled: boolean) => void;
  setSyncRotation: (enabled: boolean) => void;
  setSyncScroll: (enabled: boolean) => void;

  // 便利なアクション
  resetViewer: (viewer: 'left' | 'right' | 'top' | 'bottom') => void;
  resetAllViewers: () => void;

  // 同期されたアクション
  syncZoomToAll: (zoom: number) => void;
  syncPanToAll: (panX: number, panY: number) => void;
  syncRotationToAll: (rotation: number) => void;
}

const defaultViewerState: ViewerState = {
  zoom: 1,
  panX: 0,
  panY: 0,
  rotation: 0,
  flipX: false,
  flipY: false,
};

export const useViewerStore = create<ViewerStore>()(
  devtools((set, get) => ({
    leftViewer: { ...defaultViewerState },
    rightViewer: { ...defaultViewerState },
    topViewer: { ...defaultViewerState },
    bottomViewer: { ...defaultViewerState },

    syncZoom: true,
    syncPan: true,
    syncRotation: false,
    syncScroll: true,

    setLeftViewer: (state) =>
      set((prev) => {
        const newState = { ...prev.leftViewer, ...state };
        const result: Partial<ViewerStore> = { leftViewer: newState };

        // 同期が有効な場合は他のビューアも更新
        if (get().syncZoom && state.zoom !== undefined) {
          result.rightViewer = { ...prev.rightViewer, zoom: state.zoom };
          result.topViewer = { ...prev.topViewer, zoom: state.zoom };
          result.bottomViewer = { ...prev.bottomViewer, zoom: state.zoom };
        }

        if (get().syncPan && (state.panX !== undefined || state.panY !== undefined)) {
          const panX = state.panX ?? newState.panX;
          const panY = state.panY ?? newState.panY;
          result.rightViewer = { ...prev.rightViewer, panX, panY };
          result.topViewer = { ...prev.topViewer, panX, panY };
          result.bottomViewer = { ...prev.bottomViewer, panX, panY };
        }

        if (get().syncRotation && state.rotation !== undefined) {
          result.rightViewer = { ...prev.rightViewer, rotation: state.rotation };
          result.topViewer = { ...prev.topViewer, rotation: state.rotation };
          result.bottomViewer = { ...prev.bottomViewer, rotation: state.rotation };
        }

        return result;
      }),

    setRightViewer: (state) =>
      set((prev) => {
        const newState = { ...prev.rightViewer, ...state };
        const result: Partial<ViewerStore> = { rightViewer: newState };

        if (get().syncZoom && state.zoom !== undefined) {
          result.leftViewer = { ...prev.leftViewer, zoom: state.zoom };
          result.topViewer = { ...prev.topViewer, zoom: state.zoom };
          result.bottomViewer = { ...prev.bottomViewer, zoom: state.zoom };
        }

        if (get().syncPan && (state.panX !== undefined || state.panY !== undefined)) {
          const panX = state.panX ?? newState.panX;
          const panY = state.panY ?? newState.panY;
          result.leftViewer = { ...prev.leftViewer, panX, panY };
          result.topViewer = { ...prev.topViewer, panX, panY };
          result.bottomViewer = { ...prev.bottomViewer, panX, panY };
        }

        if (get().syncRotation && state.rotation !== undefined) {
          result.leftViewer = { ...prev.leftViewer, rotation: state.rotation };
          result.topViewer = { ...prev.topViewer, rotation: state.rotation };
          result.bottomViewer = { ...prev.bottomViewer, rotation: state.rotation };
        }

        return result;
      }),

    setTopViewer: (state) =>
      set((prev) => {
        const newState = { ...prev.topViewer, ...state };
        const result: Partial<ViewerStore> = { topViewer: newState };

        if (get().syncZoom && state.zoom !== undefined) {
          result.leftViewer = { ...prev.leftViewer, zoom: state.zoom };
          result.rightViewer = { ...prev.rightViewer, zoom: state.zoom };
          result.bottomViewer = { ...prev.bottomViewer, zoom: state.zoom };
        }

        if (get().syncPan && (state.panX !== undefined || state.panY !== undefined)) {
          const panX = state.panX ?? newState.panX;
          const panY = state.panY ?? newState.panY;
          result.leftViewer = { ...prev.leftViewer, panX, panY };
          result.rightViewer = { ...prev.rightViewer, panX, panY };
          result.bottomViewer = { ...prev.bottomViewer, panX, panY };
        }

        if (get().syncRotation && state.rotation !== undefined) {
          result.leftViewer = { ...prev.leftViewer, rotation: state.rotation };
          result.rightViewer = { ...prev.rightViewer, rotation: state.rotation };
          result.bottomViewer = { ...prev.bottomViewer, rotation: state.rotation };
        }

        return result;
      }),

    setBottomViewer: (state) =>
      set((prev) => {
        const newState = { ...prev.bottomViewer, ...state };
        const result: Partial<ViewerStore> = { bottomViewer: newState };

        if (get().syncZoom && state.zoom !== undefined) {
          result.leftViewer = { ...prev.leftViewer, zoom: state.zoom };
          result.rightViewer = { ...prev.rightViewer, zoom: state.zoom };
          result.topViewer = { ...prev.topViewer, zoom: state.zoom };
        }

        if (get().syncPan && (state.panX !== undefined || state.panY !== undefined)) {
          const panX = state.panX ?? newState.panX;
          const panY = state.panY ?? newState.panY;
          result.leftViewer = { ...prev.leftViewer, panX, panY };
          result.rightViewer = { ...prev.rightViewer, panX, panY };
          result.topViewer = { ...prev.topViewer, panX, panY };
        }

        if (get().syncRotation && state.rotation !== undefined) {
          result.leftViewer = { ...prev.leftViewer, rotation: state.rotation };
          result.rightViewer = { ...prev.rightViewer, rotation: state.rotation };
          result.topViewer = { ...prev.topViewer, rotation: state.rotation };
        }

        return result;
      }),

    setSyncZoom: (enabled) => set({ syncZoom: enabled }),
    setSyncPan: (enabled) => set({ syncPan: enabled }),
    setSyncRotation: (enabled) => set({ syncRotation: enabled }),
    setSyncScroll: (enabled) => set({ syncScroll: enabled }),

    resetViewer: (viewer) =>
      set(() => ({
        [viewer + 'Viewer']: { ...defaultViewerState },
      })),

    resetAllViewers: () =>
      set({
        leftViewer: { ...defaultViewerState },
        rightViewer: { ...defaultViewerState },
        topViewer: { ...defaultViewerState },
        bottomViewer: { ...defaultViewerState },
      }),

    syncZoomToAll: (zoom) =>
      set({
        leftViewer: { ...get().leftViewer, zoom },
        rightViewer: { ...get().rightViewer, zoom },
        topViewer: { ...get().topViewer, zoom },
        bottomViewer: { ...get().bottomViewer, zoom },
      }),

    syncPanToAll: (panX, panY) =>
      set({
        leftViewer: { ...get().leftViewer, panX, panY },
        rightViewer: { ...get().rightViewer, panX, panY },
        topViewer: { ...get().topViewer, panX, panY },
        bottomViewer: { ...get().bottomViewer, panX, panY },
      }),

    syncRotationToAll: (rotation) =>
      set({
        leftViewer: { ...get().leftViewer, rotation },
        rightViewer: { ...get().rightViewer, rotation },
        topViewer: { ...get().topViewer, rotation },
        bottomViewer: { ...get().bottomViewer, rotation },
      }),
  }))
);
