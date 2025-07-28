import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { useFileDialog } from './use-file-dialog';
import { useViewerStore } from '../stores/viewer-store';
import { useAppStore } from '../stores/app-store';
import { useSettingsStore } from '../stores/settings-store';

export function useMenuEvents() {
  const { openFiles, openFolder } = useFileDialog();
  const { resetAllViewers, syncZoomToAll, leftViewer } = useViewerStore();
  const { setFolderMode, openAboutDialog, toggleLayout, toggleViewMode } = useAppStore();
  const { openSettingsDialog } = useSettingsStore();

  useEffect(() => {
    const unsubscribe = listen<string>('menu-action', (event) => {
      void (async () => {
        switch (event.payload) {
          case 'open-files':
            // ファイルを開く場合は自動的にファイルモードに切り替え
            setFolderMode(false);
            await openFiles();
            break;
          case 'open-folder1':
            // フォルダを開く場合は自動的にフォルダモードに切り替え
            setFolderMode(true);
            await openFolder('folder1');
            break;
          case 'open-folder2':
            // フォルダを開く場合は自動的にフォルダモードに切り替え
            setFolderMode(true);
            await openFolder('folder2');
            break;
          case 'reset-zoom':
            resetAllViewers();
            break;
          case 'zoom-in':
            syncZoomToAll(Math.min(10, leftViewer.zoom * 1.2));
            break;
          case 'zoom-out':
            syncZoomToAll(Math.max(0.1, leftViewer.zoom / 1.2));
            break;
          case 'about':
            openAboutDialog();
            break;
          case 'settings':
            openSettingsDialog();
            break;
          case 'toggle-layout':
            toggleLayout();
            break;
          case 'toggle-view':
            toggleViewMode();
            break;
        }
      })();
    });

    return () => {
      void unsubscribe.then((fn) => fn());
    };
  }, [
    openFiles,
    openFolder,
    resetAllViewers,
    syncZoomToAll,
    leftViewer.zoom,
    setFolderMode,
    openAboutDialog,
    openSettingsDialog,
    toggleLayout,
    toggleViewMode,
  ]);
}
