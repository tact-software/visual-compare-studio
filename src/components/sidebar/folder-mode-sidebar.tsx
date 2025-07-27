import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  LinearProgress,
} from '@mui/material';
import { NavigateBefore, NavigateNext, FolderOpen, Compare } from '@mui/icons-material';
import { useFolderStore } from '../../stores/folder-store';
import { useFileStore } from '../../stores/file-store';
import { useFileDialog } from '../../hooks/use-file-dialog';

export const FolderModeSidebar: React.FC = () => {
  const { t } = useTranslation();
  const {
    folder1Path,
    folder2Path,
    matchedFiles,
    currentMatchIndex,
    isAnalyzed,
    isLoading,
    loadingProgress,
    loadingMessage,
    error,
    analyzeFolders,
    cancelAnalysis,
    navigateToNext,
    navigateToPrevious,
    navigateToIndex,
    loadImageData,
  } = useFolderStore();

  const { addFiles, clearFiles, setSelectedFiles } = useFileStore();
  const { openFolder } = useFileDialog();

  // 現在のファイルが変更されたら自動的に読み込んで表示
  useEffect(() => {
    if (isAnalyzed && matchedFiles.length > 0) {
      const currentMatch = matchedFiles[currentMatchIndex];
      if (currentMatch && currentMatch.fileName) {
        // 直接実行する代わりに、非同期処理をvoidで包む
        void (async () => {
          await loadAndDisplayCurrentMatch();
        })();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMatchIndex, isAnalyzed]);

  const loadAndDisplayCurrentMatch = useCallback(async () => {
    // getState()を使って最新の状態を取得
    const state = useFolderStore.getState();
    const currentMatch = state.matchedFiles[state.currentMatchIndex];
    if (!currentMatch) return;

    try {
      // 画像データをロード
      await loadImageData(currentMatch.fileName);

      // 更新されたマッチを取得
      const updatedState = useFolderStore.getState();
      const updatedMatch = updatedState.matchedFiles[updatedState.currentMatchIndex];

      if (updatedMatch) {
        // ファイルストアをクリアしてから追加
        clearFiles();

        // 画像データがロードされたファイルを追加
        const filesToAdd = [];
        if (updatedMatch.file1.imageData) {
          filesToAdd.push(updatedMatch.file1);
        }
        if (updatedMatch.file2.imageData) {
          filesToAdd.push(updatedMatch.file2);
        }

        if (filesToAdd.length > 0) {
          addFiles(filesToAdd);
          // ファイルを選択状態にする
          setSelectedFiles(filesToAdd.map((f) => f.id));
        }
      }
    } catch {
      // エラーは静かに無視
    }
  }, [loadImageData, clearFiles, addFiles, setSelectedFiles]);

  const handleAnalyze = () => {
    void analyzeFolders();
  };

  const handleFileClick = (index: number) => {
    navigateToIndex(index);
  };

  const handleOpenFolder1 = async () => {
    await openFolder('folder1');
  };

  const handleOpenFolder2 = async () => {
    await openFolder('folder2');
  };

  return (
    <Box
      sx={{
        width: 256,
        borderRight: 1,
        borderColor: 'divider',
        p: 2,
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflow: 'auto' }}>
        {/* フォルダ選択 */}
        <Card>
          <CardHeader
            title={<Typography variant="h6">{t('sidebar.folderSelection')}</Typography>}
            sx={{ pb: 1 }}
          />
          <CardContent sx={{ pt: 0 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('sidebar.folder1')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={folder1Path || ''}
                  >
                    {folder1Path ? folder1Path.split('/').pop() : t('sidebar.notSelected')}
                  </Typography>
                  <IconButton size="small" onClick={() => void handleOpenFolder1()}>
                    <FolderOpen fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('sidebar.folder2')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={folder2Path || ''}
                  >
                    {folder2Path ? folder2Path.split('/').pop() : t('sidebar.notSelected')}
                  </Typography>
                  <IconButton size="small" onClick={() => void handleOpenFolder2()}>
                    <FolderOpen fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {folder1Path && folder2Path && !isAnalyzed && (
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Compare />}
                  onClick={handleAnalyze}
                  disabled={isLoading}
                >
                  {t('sidebar.analyze')}
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* エラー表示 */}
        {error && (
          <Alert severity="error" onClose={() => {}}>
            {error}
          </Alert>
        )}

        {/* ローディング表示 */}
        {isLoading && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {loadingMessage}
                </Typography>
                <Box sx={{ width: '100%' }}>
                  <LinearProgress
                    variant="determinate"
                    value={loadingProgress}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block', textAlign: 'center' }}
                  >
                    {loadingProgress}%
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={cancelAnalysis}
                  sx={{ mt: 1 }}
                >
                  {t('common.cancel')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* ナビゲーション */}
        {isAnalyzed && matchedFiles.length > 0 && (
          <Card>
            <CardHeader
              title={<Typography variant="h6">{t('sidebar.navigation')}</Typography>}
              sx={{ pb: 1 }}
              action={
                <Chip
                  label={`${currentMatchIndex + 1} / ${matchedFiles.length}`}
                  size="small"
                  color="primary"
                />
              }
            />
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <IconButton
                  onClick={navigateToPrevious}
                  disabled={currentMatchIndex === 0}
                  size="small"
                >
                  <NavigateBefore />
                </IconButton>
                <Typography variant="body2">{matchedFiles[currentMatchIndex]?.fileName}</Typography>
                <IconButton
                  onClick={navigateToNext}
                  disabled={currentMatchIndex === matchedFiles.length - 1}
                  size="small"
                >
                  <NavigateNext />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* ファイル一覧 */}
        {isAnalyzed && matchedFiles.length > 0 && (
          <Card>
            <CardHeader
              title={<Typography variant="h6">{t('sidebar.matchedFiles')}</Typography>}
              sx={{ pb: 1 }}
            />
            <CardContent sx={{ pt: 0 }}>
              <List dense>
                {matchedFiles.map((match, index) => (
                  <ListItem
                    key={match.fileName}
                    sx={{
                      px: 1,
                      bgcolor: index === currentMatchIndex ? 'action.selected' : 'transparent',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => handleFileClick(index)}
                  >
                    <ListItemText
                      primary={match.fileName}
                      secondary={
                        match.file1.size > 0 && match.file2.size > 0
                          ? `${(match.file1.size / 1024 / 1024).toFixed(2)} MB / ${(
                              match.file2.size /
                              1024 /
                              1024
                            ).toFixed(2)} MB`
                          : t('sidebar.loadingData')
                      }
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};
