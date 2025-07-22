import { imageCache } from './image-cache';

interface MemoryStats {
  used: number;
  total: number;
  percentage: number;
}

class MemoryManager {
  private memoryThreshold = 0.8; // 80%使用時にクリーンアップ
  private cleanupInterval: number | null = null;
  private isRunning = false;

  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.cleanupInterval = setInterval(() => {
      this.performCleanup();
    }, 30000); // 30秒ごとにチェック
  }

  stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.isRunning = false;
  }

  getMemoryStats(): MemoryStats {
    if ('memory' in performance) {
      const memory = (
        performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }
      ).memory;
      if (memory) {
        return {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          percentage: memory.usedJSHeapSize / memory.totalJSHeapSize,
        };
      }
    }

    // Fallback for environments without memory API
    return {
      used: 0,
      total: 0,
      percentage: 0,
    };
  }

  forceCleanup(): void {
    this.performCleanup();
  }

  private performCleanup(): void {
    const stats = this.getMemoryStats();

    // メモリ使用量が閾値を超えた場合のみクリーンアップ
    if (stats.percentage > this.memoryThreshold) {
      this.cleanupUnusedImages();
      this.suggestGarbageCollection();
    }
  }

  private cleanupUnusedImages(): void {
    // 画像キャッシュの統計を取得
    const cacheStats = imageCache.getStats();

    // キャッシュが大きすぎる場合は一部を削除
    if (cacheStats.size > 50 * 1024 * 1024) {
      // 50MB以上の場合
      // 最も古いエントリの25%を削除
      const targetReduction = Math.floor(cacheStats.count * 0.25);

      for (let i = 0; i < targetReduction; i++) {
        // ImageCacheクラスで最も古いエントリを削除
        // 実際の実装では、ImageCacheクラスにevictOldestメソッドを追加する必要がある
      }
    }
  }

  private suggestGarbageCollection(): void {
    // 強制的なガベージコレクションの実行を試行
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as { gc?: () => void }).gc?.();
    }
  }

  // 使用していない画像要素を検出してメモリを解放
  cleanupUnusedImageElements(): void {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      // 画面外の画像で、最近使用されていないものを検出
      const rect = img.getBoundingClientRect();
      const isVisible =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth;

      if (!isVisible) {
        // 画像のsrcを空にしてメモリを解放
        // ただし、これはキャッシュに残しておく
        const originalSrc = img.src;
        img.src = '';
        img.dataset.originalSrc = originalSrc;
      }
    });
  }

  // 遅延読み込みで画像を復元
  restoreImageElement(img: HTMLImageElement): void {
    if (img.dataset.originalSrc && !img.src) {
      img.src = img.dataset.originalSrc;
      delete img.dataset.originalSrc;
    }
  }
}

export const memoryManager = new MemoryManager();

// 自動でメモリ管理を開始
if (typeof window !== 'undefined') {
  memoryManager.start();

  // ページが非表示になったときにクリーンアップ
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      memoryManager.cleanupUnusedImageElements();
    }
  });
}
