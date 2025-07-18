# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules
レスポンスは日本語ですること。
このリポジトリはパブリックリポジトリであるため、セキュリティに配慮した回答・実装を行うこと。

## Project Overview

Visual Compare Studio (VCS) is a desktop application for comparing and analyzing images, built with Tauri 2.0 + React + TypeScript. The project is currently in Sprint 2 of development (completed) with a 12-sprint roadmap spanning 6 months.

## Package Manager

This project uses **bun** as the package manager, not npm or yarn. The mise.toml file configures bun and rust as the required tools.

## Development Commands

### Core Development
```bash
# Start development server
bun run dev

# Build for production
bun run build

# Build Tauri app
bun run tauri build

# Start Tauri development mode
bun run tauri dev
```

### Code Quality
```bash
# Run all quality checks (recommended before commits)
bun run test:all

# Individual quality checks
bun run typecheck           # TypeScript type checking
bun run lint               # ESLint (strict, max-warnings 0)
bun run lint:fix           # Auto-fix ESLint issues
bun run format             # Prettier formatting
bun run format:check       # Check formatting without fixing
```

### Testing
```bash
# Frontend tests
bun run test              # Watch mode
bun run test:run          # Single run
bun run test:ui           # Browser-based test UI
bun run test:coverage     # With coverage report

# Backend tests
bun run test:rust         # Rust unit tests
bun run test:rust:coverage # Rust tests with coverage

# Run everything
bun run test:all          # All tests + linting + typecheck
```

## Architecture

### Frontend Structure
- **UI Framework**: Material-UI v7 (migrated from Tailwind CSS)
- **State Management**: Zustand with persistence and devtools
- **Key Stores**: 
  - `useAppStore`: Global app state, settings, theme, layout modes
  - `useFileStore`: File management, selection, history
- **Components**: Organized by domain (sidebar, toolbar, viewer, etc.)

### Backend Structure
- **Framework**: Tauri 2.0 with Rust backend
- **Key Commands**: File operations, image processing, metadata extraction
- **Plugins**: dialog, process, fs, opener

### Communication Layer
- **Tauri Commands**: Centralized in `src/utils/tauri-api.ts`
- **API Exports**: Convenience functions in `src/utils/tauri-api-exports.ts`
- **Type Safety**: Shared interfaces between frontend and backend

## Key Implementation Details

### State Management Pattern
The app uses Zustand with two main stores:
1. `AppStore` - Persisted settings, theme, layout, loading states
2. `FileStore` - File management, selection, history (max 50 items)

### File Handling
- Supports drag & drop with recursive directory traversal
- Image formats: JPG, PNG, WebP, AVIF, BMP, GIF
- Metadata extraction includes size, timestamps, MIME types
- Base64 encoding for image data transfer

### Layout System
Four view modes implemented:
- `side-by-side`: Split pane comparison
- `top-bottom`: Vertical split
- `grid`: 2x2 grid view
- `swipe`: Overlay comparison (placeholder)

### Theme System
- Light/dark/system theme modes
- Material-UI theming with Emotion
- Persistent theme settings via Zustand

## Development Workflow

### Pre-commit Hooks
Husky is configured to run `test:all` before commits, which includes:
- TypeScript type checking
- ESLint with zero warnings policy
- Prettier formatting
- All frontend and backend tests

### Testing Strategy
- Frontend: Vitest with React Testing Library
- Backend: Standard Rust unit tests with tokio-test
- Custom render utilities for MUI components in tests

### Error Handling
- Centralized error handling and logging utilities
- Loading states managed through AppStore
- Promise-based async operations with proper error boundaries

## Important Notes

- The project migrated from Tailwind CSS to Material-UI v7 due to configuration issues
- All async event handlers use `void` wrapper to satisfy ESLint promise rules
- File paths must be absolute when using file system operations
- Bundle identifier warning exists (ends with .app) but doesn't affect functionality

## Development Status

Sprint 1 & 2 completed:
- ✅ Core infrastructure and Material-UI setup
- ✅ File system operations (dialog, drag & drop)
- ✅ Basic UI components (sidebar, toolbar, status bar)
- ✅ State management and theme system

Next: Sprint 3 focuses on image display and layout system implementation.