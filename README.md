# Visual Compare Studio

<div align="center">
  <img src="assets/visual-compare-studio-logo.svg" alt="Visual Compare Studio Logo" width="256" height="256">
  
  **Visual Compare Studio (VCS)** は、画像の比較・分析に特化したデスクトップアプリケーションです。直感的なインターフェースと高度な比較機能により、効率的な画像比較作業を実現します。
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Tauri](https://img.shields.io/badge/Tauri-2.0-blue.svg)](https://tauri.app/)
  [![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
</div>

## 🌟 主な機能

### 📁 二つの表示モード
- **ファイルモード**: 個別の画像ファイルを選択して比較
- **フォルダモード**: フォルダ単位での一括比較・分析

### 🖼️ 多彩な比較レイアウト
- **サイドバイサイド**: 画像を左右に並べて表示
- **上下分割**: 画像を上下に配置して比較
- **スプリットビュー**: ドラッグ可能な境界線で画像を分割表示
- **スワイプビュー**: オーバーレイ表示でスワイプ比較

### 🎨 高度な表示機能
- **同期ズーム・パン**: 複数画像の拡大・移動を同期
- **ドラッグ&ドロップ**: 直感的なファイル読み込み
- **リアルタイムプレビュー**: 高速な画像表示
- **メタデータ表示**: ファイルサイズ、寸法、更新日時などの詳細情報

### 🌍 多言語対応
- **日本語・英語**: 完全な多言語UI
- **テーマシステム**: ライト・ダーク・システム連動テーマ
- **カスタマイズ可能**: 境界線色・太さ・スタイルの調整

### ⚡ 高性能
- **Rust + React**: Tauriによる高速・軽量なデスクトップアプリ
- **メモリ効率**: 大量画像の効率的な処理
- **マルチプラットフォーム**: Windows, macOS, Linux対応

## 📸 対応画像形式

- **JPEG** (*.jpg, *.jpeg)
- **PNG** (*.png)
- **WebP** (*.webp)
- **AVIF** (*.avif)
- **BMP** (*.bmp)
- **GIF** (*.gif)

## 🚀 インストール

### 必要環境
- **Node.js**: 18.x以上
- **Bun**: 最新版（パッケージマネージャー）
- **Rust**: 1.70以上
- **Tauri CLI**: 2.x

### 開発環境セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/your-username/visual-compare-studio.git
cd visual-compare-studio

# 依存関係のインストール
bun install

# 開発サーバーの起動
bun run dev

# Tauriアプリの起動
bun run tauri dev
```

### プロダクションビルド

```bash
# フロントエンドのビルド
bun run build

# Tauriアプリのビルド
bun run tauri build
```

## 🎯 使い方

### ファイル比較モード

1. **ファイルを開く**: 
   - ツールバーの「ファイルを開く」ボタン
   - サイドバーの「ファイルを開く」ボタン
   - ドラッグ&ドロップ

2. **画像を選択**: 
   - サイドバーから比較したい画像を2つ選択
   - 選択順序がバッジで表示されます

3. **レイアウト切り替え**: 
   - ツールバーまたはメニューからレイアウトを変更
   - スプリット/スワイプビューの切り替えも可能

### フォルダ比較モード

1. **フォルダを選択**: 
   - 「フォルダ1」「フォルダ2」ボタンで比較対象フォルダを選択

2. **分析実行**: 
   - 「分析」ボタンで同名ファイルの検索・マッチング実行
   - 進行状況はプログレスバーで表示

3. **ナビゲーション**: 
   - マッチしたファイルを順番に確認
   - 前後移動ボタンまたはファイル一覧から選択

### キーボードショートカット

| 機能 | ショートカット |
|------|----------------|
| ズームイン | `Ctrl` + `+` |
| ズームアウト | `Ctrl` + `-` |
| ビューリセット | `Ctrl` + `0` |
| ファイルを開く | `Ctrl` + `O` |
| フォルダ1を開く | `Ctrl` + `Shift` + `1` |
| フォルダ2を開く | `Ctrl` + `Shift` + `2` |
| モード切り替え | `Ctrl` + `M` |
| レイアウト切り替え | `Ctrl` + `L` |
| ビュー切り替え | `Ctrl` + `T` |

## ⚙️ 設定

### アクセス方法
- メニューバー: `ファイル` → `設定...`
- キーボード: `Ctrl` + `,`

### 設定項目

#### 一般設定
- **言語**: 日本語・英語の切り替え

#### 表示設定
- **テーマ**: ライト・ダーク・システム連動

#### 画像表示設定
- **デフォルト表示モード**: ファイル・フォルダ
- **デフォルトレイアウト**: サイドバイサイド・上下分割
- **デフォルトビューモード**: スプリット・スワイプ

#### 比較設定
- **境界線**: 色・太さ・スタイルのカスタマイズ

#### 操作設定
- **キーボードショートカット**: 各種操作のショートカット一覧

## 🏗️ 技術構成

### フロントエンド
- **React 18.3**: UIライブラリ
- **TypeScript 5.6**: 型安全な開発
- **Material-UI v7**: デザインシステム
- **Zustand**: 状態管理
- **i18next**: 国際化

### バックエンド
- **Tauri 2.0**: デスクトップアプリフレームワーク
- **Rust**: 高性能バックエンド
- **Tauri Plugins**: ファイルシステム・ダイアログ操作

### 開発ツール
- **Vite**: 高速ビルドツール
- **ESLint**: コード品質チェック
- **Prettier**: コードフォーマット
- **Vitest**: テストフレームワーク
- **Husky**: Git hooks

## 📁 プロジェクト構造

```
visual-compare-studio/
├── src/                          # フロントエンドソース
│   ├── components/               # Reactコンポーネント
│   │   ├── common/              # 共通コンポーネント
│   │   ├── dialogs/             # ダイアログ類
│   │   ├── layout/              # レイアウト
│   │   ├── sidebar/             # サイドバー
│   │   ├── toolbar/             # ツールバー
│   │   └── viewer/              # 画像ビューアー
│   ├── stores/                  # Zustand状態管理
│   ├── hooks/                   # カスタムフック
│   ├── utils/                   # ユーティリティ
│   ├── locales/                 # 多言語ファイル
│   └── types/                   # TypeScript型定義
├── src-tauri/                   # Rustバックエンド
│   ├── src/                     # Rustソースコード
│   ├── icons/                   # アプリアイコン
│   └── Cargo.toml              # Rust依存関係
├── assets/                      # アセット
│   ├── icon.svg                 # アプリアイコン
│   └── visual-compare-studio-logo.svg  # ロゴ
└── tests/                       # テストファイル
```

## 🧪 テスト

### すべてのテストを実行
```bash
bun run test:all
```

### 個別テスト実行
```bash
# フロントエンドテスト
bun run test

# バックエンドテスト
bun run test:rust

# 型チェック
bun run typecheck

# リント
bun run lint

# フォーマットチェック
bun run format:check
```

### カバレッジレポート
```bash
# フロントエンド
bun run test:coverage

# バックエンド
bun run test:rust:coverage
```

## 📋 開発ロードマップ

現在、12スプリント・6ヶ月の開発計画で進行中（Sprint 2完了）:

### ✅ Sprint 1-2（完了）
- 基盤インフラとMaterial-UI設定
- ファイルシステム操作（ダイアログ、ドラッグ&ドロップ）
- 基本UIコンポーネント（サイドバー、ツールバー、ステータスバー）
- 状態管理とテーマシステム

### 🔄 次期スプリント予定
- 画像表示とレイアウトシステム実装
- 差分検出機能の追加
- パフォーマンス最適化
- エクスポート機能

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### 開発ガイドライン
- コミット前に `bun run test:all` でテストを実行
- ESLintとPrettierの設定に従う
- TypeScriptの型安全性を保つ
- 日英両言語での機能追加を考慮

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🙏 謝辞

- [Tauri](https://tauri.app/) - 優れたデスクトップアプリフレームワーク
- [React](https://reactjs.org/) - パワフルなUIライブラリ
- [Material-UI](https://mui.com/) - 美しいデザインシステム
- [Rust](https://www.rust-lang.org/) - 安全で高速なシステムプログラミング言語

## 📞 サポート

質問やサポートが必要な場合は、以下の方法でお気軽にお問い合わせください:

- **Issues**: [GitHub Issues](https://github.com/your-username/visual-compare-studio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/visual-compare-studio/discussions)

---

<div align="center">
  Made with ❤️ using Tauri + React + TypeScript
</div>