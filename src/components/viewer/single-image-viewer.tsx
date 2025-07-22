import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useViewerStore } from '../../stores/viewer-store';
import { ImageFile } from '../../types';

interface SingleImageViewerProps {
  imageFile?: ImageFile;
  viewerType: 'left' | 'right' | 'top' | 'bottom';
  sx?: Record<string, unknown>;
}

export const SingleImageViewer: React.FC<SingleImageViewerProps> = ({
  imageFile,
  viewerType,
  sx,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

  const viewerState = useViewerStore((state) => {
    switch (viewerType) {
      case 'left':
        return state.leftViewer;
      case 'right':
        return state.rightViewer;
      case 'top':
        return state.topViewer;
      case 'bottom':
        return state.bottomViewer;
      default:
        return state.leftViewer;
    }
  });

  const setViewerState = useViewerStore((state) => {
    switch (viewerType) {
      case 'left':
        return state.setLeftViewer;
      case 'right':
        return state.setRightViewer;
      case 'top':
        return state.setTopViewer;
      case 'bottom':
        return state.setBottomViewer;
      default:
        return state.setLeftViewer;
    }
  });

  // 画像をロード
  useEffect(() => {
    if (!imageFile?.imageData) {
      setImageElement(null);
      return;
    }

    setIsLoading(true);
    const img = new Image();
    img.onload = () => {
      setImageElement(img);
      setIsLoading(false);
    };
    img.onerror = () => {
      setImageElement(null);
      setIsLoading(false);
    };
    // 画像のMIMEタイプを取得してData URLを構成
    const mimeType = imageFile.type || 'image/jpeg';
    img.src = `data:${mimeType};base64,${imageFile.imageData}`;
  }, [imageFile?.imageData, imageFile?.name, imageFile?.type]);

  // キャンバスに画像を描画
  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !imageElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスサイズをコンテナに合わせる
    const rect = container.getBoundingClientRect();
    const devicePixelRatio = window.devicePixelRatio || 1;

    // 高DPI対応とパフォーマンス最適化
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.scale(devicePixelRatio, devicePixelRatio);

    // 背景をクリア（画像領域外は黒にして境界を明確に）
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // 固定の基準サイズを使用（ウィンドウの半分）
    const referenceWidth = window.innerWidth / 2;
    const referenceHeight = window.innerHeight - 100; // ツールバー分を引く

    // 画像のアスペクト比を考慮した初期スケール計算
    const imageAspect = imageElement.width / imageElement.height;
    const referenceAspect = referenceWidth / referenceHeight;

    let baseScale = 1;
    if (viewerState.zoom === 1) {
      // 初期表示時は画像を基準サイズに収める（すべてのビューアーで同じスケール）
      if (imageAspect > referenceAspect) {
        baseScale = referenceWidth / imageElement.width;
      } else {
        baseScale = referenceHeight / imageElement.height;
      }
    }

    // 画像のスケールを計算
    const finalScale = baseScale * viewerState.zoom;
    const drawWidth = imageElement.width * finalScale;
    const drawHeight = imageElement.height * finalScale;

    // 変換行列を設定（左上原点）
    ctx.save();
    ctx.translate(viewerState.panX, viewerState.panY);

    // 回転・反転の中心を画像の中心に設定
    if (viewerState.rotation !== 0 || viewerState.flipX || viewerState.flipY) {
      ctx.translate(drawWidth / 2, drawHeight / 2);
      ctx.rotate((viewerState.rotation * Math.PI) / 180);
      ctx.scale(viewerState.flipX ? -1 : 1, viewerState.flipY ? -1 : 1);
      ctx.translate(-drawWidth / 2, -drawHeight / 2);
    }

    // 画像を左上原点で描画
    ctx.drawImage(imageElement, 0, 0, drawWidth, drawHeight);

    ctx.restore();
  }, [imageElement, viewerState]);

  // 画像が変更されたときに再描画
  useEffect(() => {
    drawImage();
  }, [drawImage]);

  // ホイールイベントでズーム
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(10, viewerState.zoom * zoomFactor));
      setViewerState({ zoom: newZoom });
    },
    [viewerState.zoom, setViewerState]
  );

  // マウスダウンでドラッグ開始
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0) {
        // 左クリック
        setIsDragging(true);
        setDragStart({ x: e.clientX - viewerState.panX, y: e.clientY - viewerState.panY });
      }
    },
    [viewerState.panX, viewerState.panY]
  );

  // マウス移動でパン
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      const newPanX = e.clientX - dragStart.x;
      const newPanY = e.clientY - dragStart.y;
      setViewerState({ panX: newPanX, panY: newPanY });
    },
    [isDragging, dragStart, setViewerState]
  );

  // マウスアップでドラッグ終了
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // マウスリーブでドラッグ終了
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // ダブルクリックでリセット（画像を左上に配置）
  const handleDoubleClick = useCallback(() => {
    setViewerState({ zoom: 1, panX: 0, panY: 0 });
  }, [setViewerState]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        ...sx,
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />

      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Loading image...
          </Typography>
        </Box>
      )}

      {!imageFile && !isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No image selected
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select an image from the sidebar
          </Typography>
        </Box>
      )}

      {imageFile && !imageElement && !isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" color="error.main">
            Failed to load image
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {imageFile.name} - Check console for details
          </Typography>
        </Box>
      )}
    </Box>
  );
};
