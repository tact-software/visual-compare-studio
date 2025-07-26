import { useCallback } from 'react';
import { useViewerStore } from '../stores/viewer-store';

/**
 * ビューア操作の共通フック
 * スプリットモード、スワイプモードで統一された操作を提供
 */
export function useViewerOperations() {
  const { leftViewer, syncZoomToAll, syncPanToAll } = useViewerStore();

  // ズーム操作（常に同期）
  const handleZoom = useCallback(
    (deltaY: number) => {
      const zoomFactor = deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(10, leftViewer.zoom * zoomFactor));
      syncZoomToAll(newZoom);
    },
    [leftViewer.zoom, syncZoomToAll]
  );

  // 横方向パン操作（常に同期、deltaYまたはdeltaXを使用）
  const handlePanX = useCallback(
    (deltaY: number, deltaX?: number) => {
      // macOSでは水平スクロールの場合deltaXが使われることが多い
      const primaryDelta = deltaX !== undefined ? deltaX : deltaY;
      const panDelta = primaryDelta > 0 ? -20 : 20;

      console.log('PanX delta:', { deltaY, deltaX, primaryDelta, panDelta });

      syncPanToAll(leftViewer.panX + panDelta, leftViewer.panY);
    },
    [leftViewer.panX, leftViewer.panY, syncPanToAll]
  );

  // 縦方向パン操作（常に同期）
  const handlePanY = useCallback(
    (deltaY: number) => {
      const panDelta = deltaY > 0 ? -20 : 20;
      syncPanToAll(leftViewer.panX, leftViewer.panY + panDelta);
    },
    [leftViewer.panX, leftViewer.panY, syncPanToAll]
  );

  // ドラッグ操作（常に同期）
  const handleDragPan = useCallback(
    (deltaX: number, deltaY: number, startPanX: number, startPanY: number) => {
      const newPanX = startPanX + deltaX;
      const newPanY = startPanY + deltaY;
      syncPanToAll(newPanX, newPanY);
    },
    [syncPanToAll]
  );

  // 統一されたホイールイベントハンドラー（境界移動なし）
  const createWheelHandler = useCallback(
    () => (e: React.WheelEvent) => {
      e.preventDefault();

      // デバッグ情報（開発時のみ）
      console.log('Wheel event:', {
        altKey: e.altKey,
        optionKey: e.getModifierState?.('Alt'),
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey,
        deltaY: e.deltaY,
        deltaX: e.deltaX,
      });

      // macOSのOptionキー（Alt）検出 - ここでは無視
      const isOptionPressed = e.altKey || e.getModifierState?.('Alt');
      if (isOptionPressed) {
        return;
      }

      // Ctrl + スクロールホイールでズーム
      if (e.ctrlKey || e.metaKey) {
        handleZoom(e.deltaY);
        return;
      }

      // Shift + スクロールホイールで横移動
      if (e.shiftKey) {
        handlePanX(e.deltaY, e.deltaX);
        return;
      }

      // スクロールホイール単体で縦移動
      handlePanY(e.deltaY);
    },
    [handleZoom, handlePanX, handlePanY]
  );

  // 統一されたマウスダウンハンドラー
  const createMouseDownHandler = useCallback(
    () => (e: React.MouseEvent) => {
      if (e.button !== 0) return; // 左クリックのみ

      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startPanX = leftViewer.panX;
      const startPanY = leftViewer.panY;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        handleDragPan(deltaX, deltaY, startPanX, startPanY);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [leftViewer.panX, leftViewer.panY, handleDragPan]
  );

  return {
    handleZoom,
    handlePanX,
    handlePanY,
    handleDragPan,
    createWheelHandler,
    createMouseDownHandler,
  };
}
