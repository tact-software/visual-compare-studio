# Visual Compare Studio

<div align="center">
  <img src="./assets/logo.png" alt="Visual Compare Studio Logo" width="200"/>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Tauri](https://img.shields.io/badge/Tauri-2.0+-blue.svg)](https://tauri.app/)
  [![React](https://img.shields.io/badge/React-18.3+-61dafb.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178c6.svg)](https://www.typescriptlang.org/)
  
  **複数の画像を効率的に比較・分析するための高機能デスクトップアプリケーション**
  
  [English](./README.en.md) | 日本語
</div>

## 🎯 概要

Visual Compare Studio (VCS) は、開発者、デザイナー、品質管理担当者向けの画像比較ツールです。複数の画像を様々なレイアウトで表示し、AI/MLを活用した差分検出機能により、効率的な画像比較作業を実現します。

## ✨ 主な機能

### 🖼️ 多彩な表示レイアウト
- **左右/上下分割表示** - 2つの画像を並べて比較
- **グリッド表示** - 最大9枚の画像を同時比較
- **SwipeCompare** - スライダーで画像を重ねて比較
- **同期ズーム/パン** - 複数画像の表示を同期

### 📁 スマートなファイル管理
- ドラッグ&ドロップでの簡単読み込み
- フォルダ単位での一括比較
- ファイル名による自動マッチング
- 履歴管理機能

### 🤖 AI/ML機能
- **差分検出** - ピクセル差分とSSIMによる構造的差分
- **変更箇所ハイライト** - ヒートマップ表示
- **画像品質評価** - ブラー、露出、ノイズの自動評価
- **軽量実装** - モバイル環境でも動作可能

### 🛠️ 便利な追加機能
- 計測ツール（距離、角度、面積）
- アノテーション機能
- 比較結果のエクスポート
- ダークモード対応

## 🚀 クイックスタート

### 動作環境
- OS: Windows 10+, macOS 11+, Linux (Ubuntu 20.04+)
- メモリ: 4GB以上推奨
- ディスプレイ: 1280x720px以上

### インストール

#### リリース版のインストール
1. [Releases](https://github.com/yourusername/visual-compare-studio/releases)から最新版をダウンロード
2. OSに応じたインストーラーを実行
   - Windows: `.msi` ファイル
   - macOS: `.dmg` ファイル
   - Linux: `.AppImage` または `.deb` ファイル

#### ソースからのビルド

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/visual-compare-studio.git
cd visual-compare-studio

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run tauri dev

# ビルド
npm run tauri build
```

### 必要な環境
- Node.js 18+
- Rust 1.70+
- npm または yarn

## 📖 使い方

### 基本的な使い方

1. **画像の読み込み**
   - ファイルをドラッグ&ドロップ
   - またはファイルメニューから選択

2. **レイアウトの選択**
   - ツールバーのレイアウトボタンをクリック
   - ショートカット: `Ctrl/Cmd + L`

3. **差分検出の実行**
   - AIボタンをクリックして差分検出を開始
   - 結果は右側のパネルに表示

### キーボードショートカット

| 機能 | Windows/Linux | macOS |
|------|--------------|-------|
| ファイルを開く | `Ctrl + O` | `Cmd + O` |
| フォルダを開く | `Ctrl + Shift + O` | `Cmd + Shift + O` |
| レイアウト切替 | `Ctrl + L` | `Cmd + L` |
| ズームイン | `Ctrl + +` | `Cmd + +` |
| ズームアウト | `Ctrl + -` | `Cmd + -` |
| リセット | `Ctrl + 0` | `Cmd + 0` |
| 次の画像 | `→` | `→` |
| 前の画像 | `←` | `←` |

## 🏗️ アーキテクチャ

```
visual-compare-studio/
├── src/                 # Reactアプリケーション
│   ├── components/      # UIコンポーネント
│   ├── hooks/          # カスタムフック
│   ├── stores/         # 状態管理（Zustand）
│   └── workers/        # Web Worker
├── src-tauri/          # Tauriバックエンド
│   └── src/           # Rustコード
└── tests/             # テストコード
```

### 技術スタック
- **フロントエンド**: React 18 + TypeScript + Vite
- **バックエンド**: Tauri 2.0 + Rust
- **UI**: Radix UI + Tailwind CSS
- **AI/ML**: TensorFlow.js Lite + ONNX Runtime Web

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

詳細は[CONTRIBUTING.md](./CONTRIBUTING.md)をご覧ください。

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](./LICENSE)ファイルをご覧ください。

## 🙏 謝辞

- [Tauri](https://tauri.app/) - 素晴らしいデスクトップアプリフレームワーク
- [React](https://reactjs.org/) - UIライブラリ
- [TensorFlow.js](https://www.tensorflow.org/js) - ブラウザでのML実行
- すべてのコントリビューターの皆様

## 📞 サポート

- **Issues**: [GitHub Issues](https://github.com/yourusername/visual-compare-studio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/visual-compare-studio/discussions)
- **Email**: support@visual-compare-studio.dev

## 🗺️ ロードマップ

### v1.1 (予定)
- [ ] プラグインシステム
- [ ] クラウドストレージ連携
- [ ] バッチ処理機能

### v2.0 (予定)
- [ ] モバイルアプリ版
- [ ] リアルタイムコラボレーション
- [ ] 高度なAI差分検出

詳細は[プロジェクトボード](https://github.com/yourusername/visual-compare-studio/projects)をご覧ください。

---

<div align="center">
  Made with ❤️ by Visual Compare Studio Team
</div>