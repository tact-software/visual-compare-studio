interface CacheItem {
  data: string;
  timestamp: number;
  size: number;
}

class ImageCache {
  private cache = new Map<string, CacheItem>();
  private maxSize = 100 * 1024 * 1024; // 100MB
  private currentSize = 0;

  set(key: string, data: string): void {
    const size = this.getDataSize(data);

    // キャッシュサイズを超える場合は古いエントリを削除
    this.evictIfNecessary(size);

    // 既存のエントリがある場合は削除
    if (this.cache.has(key)) {
      const existing = this.cache.get(key)!;
      this.currentSize -= existing.size;
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      size,
    });

    this.currentSize += size;
  }

  get(key: string): string | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // アクセス時刻を更新（LRU実装）
    item.timestamp = Date.now();
    return item.data;
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    this.currentSize -= item.size;
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
  }

  getStats(): { count: number; size: number; maxSize: number } {
    return {
      count: this.cache.size,
      size: this.currentSize,
      maxSize: this.maxSize,
    };
  }

  private getDataSize(data: string): number {
    // Base64文字列のサイズを概算
    return data.length * 0.75; // Base64は元データの約4/3のサイズ
  }

  private evictIfNecessary(newItemSize: number): void {
    // 新しいアイテムがキャッシュに入らない場合は、古いアイテムを削除
    while (this.currentSize + newItemSize > this.maxSize && this.cache.size > 0) {
      this.evictLeastRecentlyUsed();
    }
  }

  private evictLeastRecentlyUsed(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, item] of this.cache) {
      if (item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }
}

// シングルトンインスタンス
export const imageCache = new ImageCache();

// キャッシュキーを生成するヘルパー関数
export const generateCacheKey = (filePath: string, size?: number): string => {
  const sizeStr = size ? `_${size}` : '';
  return `${filePath}${sizeStr}`;
};

// 画像データをキャッシュから取得または読み込み
export const getCachedImageData = async (
  filePath: string,
  loader: () => Promise<string>
): Promise<string> => {
  const cacheKey = generateCacheKey(filePath);

  // キャッシュにある場合は返す
  const cached = imageCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // キャッシュにない場合は読み込み
  const data = await loader();
  imageCache.set(cacheKey, data);

  return data;
};
