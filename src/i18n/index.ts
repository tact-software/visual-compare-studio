import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en.json';
import ja from '../locales/ja.json';

const resources = {
  en: {
    translation: en,
  },
  ja: {
    translation: ja,
  },
};

void i18n.use(initReactI18next).init({
  resources,
  lng: 'ja', // デフォルト言語
  fallbackLng: 'en', // フォールバック言語

  interpolation: {
    escapeValue: false, // React already escapes values
  },

  // デバッグモード（開発時のみ）
  debug: false, // デバッグモードを無効化

  // 名前空間を使用しない
  defaultNS: 'translation',
  ns: ['translation'],
});

export default i18n;
