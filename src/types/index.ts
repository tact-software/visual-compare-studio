export interface ImageFile {
  id: string;
  path: string;
  name: string;
  size: number;
  width?: number;
  height?: number;
  lastModified: number;
  type: string;
  imageData?: string; // Base64 encoded image
  modifiedAt?: Date;
}

export interface LayoutMode {
  type: 'side-by-side' | 'top-bottom';
  viewMode?: 'split' | 'swipe';
}

export interface ViewerState {
  zoom: number;
  panX: number;
  panY: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  syncZoom: boolean;
  syncPan: boolean;
  defaultLayout: LayoutMode;
}
