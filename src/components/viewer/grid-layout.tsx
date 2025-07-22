import React, { useState, useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close, Add } from '@mui/icons-material';
import { SingleImageViewer } from './single-image-viewer';
import { useFileStore } from '../../stores/file-store';
import { useAppStore } from '../../stores/app-store';

interface GridLayoutProps {
  sx?: Record<string, unknown>;
}

export const GridLayout: React.FC<GridLayoutProps> = ({ sx }) => {
  const { files, selectedFiles, deselectFile } = useFileStore();
  const { currentLayout } = useAppStore();
  const [draggedFile, setDraggedFile] = useState<string | null>(null);
  const [dragOverCell, setDragOverCell] = useState<number | null>(null);

  // グリッドサイズを取得（デフォルトは2x2）
  const gridSize = currentLayout.gridSize || '2x2';
  const gridDimensions = gridSize === '3x3' ? 3 : 2;
  const totalCells = gridDimensions * gridDimensions;

  // グリッドセルの配置管理
  const [cellAssignments, setCellAssignments] = useState<(string | null)[]>(
    Array(totalCells).fill(null)
  );

  // 選択されたファイルをセルに配置
  React.useEffect(() => {
    const newAssignments = Array(totalCells).fill(null);
    selectedFiles.slice(0, totalCells).forEach((fileId, index) => {
      newAssignments[index] = fileId;
    });
    setCellAssignments(newAssignments);
  }, [selectedFiles, totalCells]);

  // セルからファイルを取得
  const getCellImage = useCallback(
    (cellIndex: number) => {
      const fileId = cellAssignments[cellIndex];
      return fileId ? files.find((f) => f.id === fileId) : undefined;
    },
    [cellAssignments, files]
  );

  // セルにファイルを配置
  const assignFileToCell = useCallback(
    (fileId: string, cellIndex: number) => {
      const newAssignments = [...cellAssignments];
      // 既存の配置を削除
      const existingIndex = newAssignments.indexOf(fileId);
      if (existingIndex !== -1) {
        newAssignments[existingIndex] = null;
      }
      // 新しい位置に配置
      newAssignments[cellIndex] = fileId;
      setCellAssignments(newAssignments);
    },
    [cellAssignments]
  );

  // セルからファイルを削除
  const removeFileFromCell = useCallback(
    (cellIndex: number) => {
      const newAssignments = [...cellAssignments];
      const fileId = newAssignments[cellIndex];
      newAssignments[cellIndex] = null;
      setCellAssignments(newAssignments);

      // 選択からも削除
      if (fileId) {
        deselectFile(fileId);
      }
    },
    [cellAssignments, deselectFile]
  );

  // ドラッグ開始
  const handleDragStart = useCallback((e: React.DragEvent, fileId: string) => {
    setDraggedFile(fileId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', fileId);
  }, []);

  // ドラッグオーバー
  const handleDragOver = useCallback((e: React.DragEvent, cellIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCell(cellIndex);
  }, []);

  // ドラッグ終了
  const handleDragEnd = useCallback(() => {
    setDraggedFile(null);
    setDragOverCell(null);
  }, []);

  // ドロップ
  const handleDrop = useCallback(
    (e: React.DragEvent, cellIndex: number) => {
      e.preventDefault();
      const fileId = e.dataTransfer.getData('text/plain') || draggedFile;
      if (fileId) {
        assignFileToCell(fileId, cellIndex);
      }
      setDraggedFile(null);
      setDragOverCell(null);
    },
    [draggedFile, assignFileToCell]
  );

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridDimensions}, 1fr)`,
          gridTemplateRows: `repeat(${gridDimensions}, 1fr)`,
          gap: 1,
          height: '100%',
        }}
      >
        {Array.from({ length: totalCells }).map((_, index) => {
          const image = getCellImage(index);
          const isDragOver = dragOverCell === index;

          return (
            <Box
              key={index}
              sx={{
                width: '100%',
                height: '100%',
                border: '1px solid',
                borderColor: isDragOver ? 'primary.main' : 'divider',
                overflow: 'hidden',
                position: 'relative',
                transition: 'border-color 0.2s ease',
              }}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragLeave={() => setDragOverCell(null)}
            >
              {image ? (
                <>
                  <Box
                    draggable
                    onDragStart={(e) => handleDragStart(e, image.id)}
                    onDragEnd={handleDragEnd}
                    sx={{
                      width: '100%',
                      height: '100%',
                      cursor: 'move',
                      position: 'relative',
                      '&:active': {
                        cursor: 'grabbing',
                      },
                    }}
                  >
                    <SingleImageViewer
                      imageFile={image}
                      viewerType="left" // グリッドでは同期は無効
                      sx={{
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none', // ドラッグ操作を親に委譲
                      }}
                    />
                  </Box>
                  {/* 削除ボタン */}
                  <IconButton
                    size="small"
                    onClick={() => removeFileFromCell(index)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      },
                      width: 24,
                      height: 24,
                      pointerEvents: 'auto', // ボタンのクリックを有効化
                      zIndex: 10,
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isDragOver ? 'primary.50' : 'grey.100',
                    color: 'text.secondary',
                    transition: 'background-color 0.2s ease',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Add fontSize="large" />
                  <Typography variant="body2">
                    {isDragOver ? 'Drop here' : `Empty slot ${index + 1}`}
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
