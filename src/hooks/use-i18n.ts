import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../stores/settings-store';

/**
 * 多言語対応フック
 * 設定ストアの言語設定と同期する
 */
export const useI18n = () => {
  const { i18n } = useTranslation();
  const { general } = useSettingsStore();

  useEffect(() => {
    if (general.language && i18n.language !== general.language) {
      void i18n.changeLanguage(general.language);
    }
  }, [general.language, i18n]);

  return { i18n };
};
