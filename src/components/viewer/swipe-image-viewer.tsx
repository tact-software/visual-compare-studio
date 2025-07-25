import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useViewerStore } from '../../stores/viewer-store';
import { ImageFile } from '../../types';

interface SwipeImageViewerProps {
  imageFile?: ImageFile;
  viewerType: 'left' | 'right' | 'top' | 'bottom';
  sx?: Record<string, unknown>;
}

export const SwipeImageViewer: React.FC<SwipeImageViewerProps> = ({
  imageFile,
  viewerType,
  sx,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
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

    // 実際のコンテナサイズを使用して、長辺が収まるように計算
    // 画像の長辺が表示領域に収まるようにスケールを計算
    const scaleX = rect.width / imageElement.width;
    const scaleY = rect.height / imageElement.height;
    // 長辺が収まるように、小さい方のスケールを使用
    const baseScale = Math.min(scaleX, scaleY);

    // Swipeモードでもズーム・パン機能を有効化
    const finalScale = baseScale * viewerState.zoom;
    const drawWidth = imageElement.width * finalScale;
    const drawHeight = imageElement.height * finalScale;

    // 画像をコンテナの中央に配置し、パンオフセットを適用
    const centerX = (rect.width - drawWidth) / 2 + viewerState.panX;
    const centerY = (rect.height - drawHeight) / 2 + viewerState.panY;

    // 変換行列を設定（中央配置）
    ctx.save();
    ctx.translate(centerX, centerY);

    // 回転・反転の中心を画像の中心に設定
    if (viewerState.rotation !== 0 || viewerState.flipX || viewerState.flipY) {
      ctx.translate(drawWidth / 2, drawHeight / 2);
      ctx.rotate((viewerState.rotation * Math.PI) / 180);
      ctx.scale(viewerState.flipX ? -1 : 1, viewerState.flipY ? -1 : 1);
      ctx.translate(-drawWidth / 2, -drawHeight / 2);
    }

    // 画像を描画
    ctx.drawImage(imageElement, 0, 0, drawWidth, drawHeight);

    ctx.restore();
  }, [
    imageElement,
    viewerState.rotation,
    viewerState.flipX,
    viewerState.flipY,
    viewerState.zoom,
    viewerState.panX,
    viewerState.panY,
  ]);

  // 画像が変更されたときに再描画
  useEffect(() => {
    drawImage();
  }, [drawImage]);

  // リサイズイベントハンドラ
  useEffect(() => {
    const handleResize = () => {
      drawImage();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [drawImage]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default', // Swipeモードではドラッグカーソルは不要
        ...sx,
      }}
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
