# Test Commands Documentation

## 🧪 テストコマンド一覧

### 基本テストコマンド

#### フロントエンド（React/TypeScript）
```bash
# テストを実行（ウォッチモード）
bun run test

# テストを1回実行
bun run test:run

# テストをウォッチモード（明示的）
bun run test:watch

# テストUI（ブラウザでテスト結果を確認）
bun run test:ui

# テストカバレッジ付きで実行
bun run test:coverage
```

#### バックエンド（Rust）
```bash
# Rustテストを実行
bun run test:rust

# Rustテストカバレッジ付きで実行
bun run test:rust:coverage
```

### コード品質チェックコマンド

```bash
# ESLintによるコード品質チェック
bun run lint

# ESLintによる自動修正
bun run lint:fix

# Prettierによるコードフォーマット
bun run format

# Prettierによるフォーマットチェック（修正なし）
bun run format:check

# TypeScriptの型チェック
bun run typecheck
```

### 一括実行コマンド

```bash
# すべてのテスト実行（型チェック + lint + フロントエンド・バックエンドテスト）
bun run test:all

# 全品質チェック実行（型チェック + lint + フォーマット + 全テスト）
bun run check

# CI用コマンド（checkのエイリアス）
bun run ci
```

## 📋 コマンドの詳細

### `bun run test`
- Vitestをウォッチモードで実行
- ファイルの変更を監視して自動でテストを再実行
- 開発中に最適

### `bun run test:run`
- テストを1回実行して終了
- CI環境やテスト結果だけを知りたい場合に使用

### `bun run test:ui`
- Vitest UIを起動してブラウザでテスト結果を確認
- テストの詳細な結果や実行状況を視覚的に確認可能
- `http://localhost:51204/__vitest__/` でアクセス可能

### `bun run test:coverage`
- テストカバレッジを含めてテストを実行
- `coverage/` ディレクトリにHTML形式のレポートを生成
- カバレッジ率80%以上を目標

### `bun run test:rust`
- Rustで書かれたバックエンドのテストを実行
- Tauri APIコマンドのテストを含む
- 現在6つのテストケースを実行

### `bun run test:rust:coverage`
- Rustテストをカバレッジ付きで実行
- 詳細なカバレッジレポートを生成

### `bun run check`
- プロジェクトの品質を全面的にチェック
- 型チェック、lint、フォーマット、フロントエンド・バックエンドテストを順次実行
- 全てパスしたらコミット可能

## 🔧 設定ファイル

- **Vitest設定**: `vite.config.test.ts`
- **テストセットアップ**: `src/test/setup.ts`
- **テストユーティリティ**: `src/test/utils.tsx`

## 📊 テストカバレッジ

カバレッジレポートは以下の場所に生成されます：

- **HTML**: `coverage/index.html` - ブラウザで確認
- **JSON**: `coverage/coverage-final.json` - 詳細データ
- **テキスト**: ターミナルに出力

## 🚀 CI/CDでの使用

GitHub Actionsやその他のCI環境では以下のコマンドを使用：

```bash
# 依存関係のインストール
bun install

# すべてのチェックを実行
bun run ci
```

## 🛠️ トラブルシューティング

### テストが失敗する場合

1. **型エラー**: `bun run typecheck` で型チェック
2. **Lintエラー**: `bun run lint:fix` で自動修正
3. **フォーマットエラー**: `bun run format` で自動フォーマット

### テストが動かない場合

1. `bun install` で依存関係を再インストール
2. `rm -rf node_modules/.cache` でキャッシュをクリア
3. `src/test/setup.ts` の設定を確認

## 📝 テストファイルの作成

テストファイルは以下の命名規則に従ってください：

- `*.test.ts` - ユニットテスト
- `*.test.tsx` - Reactコンポーネントテスト
- `*.spec.ts` - 統合テスト

例：
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/utils';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```