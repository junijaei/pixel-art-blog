export interface CdnUploadRequest {
  imageUrl: string;
  fileName: string;
}

export interface CdnUploadResponse {
  url: string;
}

export interface ImageCacheEntry {
  blockId: string;
  lastEditedTime: string;
  cdnUrl: string;
  uploadedAt: string;
  originalFilename?: string;
}

export interface ImageCacheStore {
  version: string;
  lastUpdated: string;
  entries: Record<string, ImageCacheEntry>;
}

export interface ImageUploadResult {
  success: boolean;
  cdnUrl?: string;
  error?: string;
  fromCache?: boolean;
}

export interface ImageProcessingStats {
  totalImages: number;
  uploaded: number;
  cached: number;
  failed: number;
}
