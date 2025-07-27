import { useEffect } from 'react';
import { useAppStore } from '../stores/app-store';
import { useSettingsStore } from '../stores/settings-store';

/**
 * アプリケーション初期化フック
 * アプリ起動時にデフォルト設定を適用する
 */
export const useAppInit = () => {
  const { setFolderMode, setLayout } = useAppStore();
  const { imageDisplay } = useSettingsStore();

  useEffect(() => {
    // デフォルト設定を適用
    if (imageDisplay.defaultMode) {
      setFolderMode(imageDisplay.defaultMode === 'folder');
    }

    if (imageDisplay.defaultLayout && imageDisplay.defaultViewMode) {
      setLayout({
        type: imageDisplay.defaultLayout,
        viewMode: imageDisplay.defaultViewMode,
      });
    }
  }, [
    imageDisplay.defaultMode,
    imageDisplay.defaultLayout,
    imageDisplay.defaultViewMode,
    setFolderMode,
    setLayout,
  ]); // 設定変更時に再適用

  return null;
};
