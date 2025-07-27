import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useViewerStore } from '../../stores/viewer-store';
import { useViewerOperations } from '../../hooks/use-viewer-operations';
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
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

  // 共通操作ハンドラーを使用
  const { createWheelHandler, createMouseDownHandler } = useViewerOperations();

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

    // 実際のコンテナサイズを使用して、長辺が収まるように計算
    // 画像の長辺が表示領域に収まるようにスケールを計算
    const scaleX = rect.width / imageElement.width;
    const scaleY = rect.height / imageElement.height;
    // 長辺が収まるように、小さい方のスケールを使用
    const baseScale = Math.min(scaleX, scaleY);

    // 画像のスケールを計算（ズーム1.0 = 画像がフィットするサイズ）
    const finalScale = baseScale * viewerState.zoom;
    const drawWidth = imageElement.width * finalScale;
    const drawHeight = imageElement.height * finalScale;

    // 画像をコンテナの中央に配置する計算
    const centerX = (rect.width - drawWidth) / 2;
    const centerY = (rect.height - drawHeight) / 2;

    // 変換行列を設定（中央配置）
    ctx.save();
    ctx.translate(centerX + viewerState.panX, centerY + viewerState.panY);

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
  }, [imageElement, viewerState]);

  // 画像が変更されたときに再描画
  useEffect(() => {
    drawImage();
  }, [drawImage]);

  // 共通ハンドラーを取得
  const handleWheel = createWheelHandler();
  const handleMouseDown = createMouseDownHandler();

  // ダブルクリックでリセット（画像を中央に配置）
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
        cursor: 'grab',
        '&:active': {
          cursor: 'grabbing',
        },
        ...sx,
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
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
            {t('viewer.loadingImage')}
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
            {t('viewer.noImageSelected')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('viewer.selectFromSidebar')}
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
            {t('viewer.failedToLoadImage')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {imageFile.name} - {t('viewer.checkConsole')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
