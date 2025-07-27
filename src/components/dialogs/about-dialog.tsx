import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Stack,
  Avatar,
} from '@mui/material';
import { Close, Code } from '@mui/icons-material';

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({ open, onClose }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Code />
            </Avatar>
            <Typography variant="h6">{t('settings.appInfo.appName')}</Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ py: 2 }}>
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom>
              {t('settings.appInfo.versionNumber')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('about.description')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {t('settings.appInfo.developer')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('settings.appInfo.copyright')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {t('about.technologyStack')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('about.technologyDescription')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {t('about.features')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • {t('about.featuresList.sideBySide')}
              <br />• {t('about.featuresList.folderBased')}
              <br />• {t('about.featuresList.synchronized')}
              <br />• {t('about.featuresList.customizable')}
              <br />• {t('about.featuresList.multiLanguage')}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
