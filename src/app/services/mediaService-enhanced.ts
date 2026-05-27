import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { MediaFile } from '../App';

export class EnhancedMediaService {
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second
  private readonly TIMEOUT_DURATION = 30000; // 30 seconds

  // Check if Firebase is properly configured
  private isFirebaseConfigured(): boolean {
    try {
      return !!storage && !!storage.app;
    } catch (error) {
      console.warn('Firebase Storage not configured:', error);
      return false;
    }
  }

  // Check network connectivity
  private async checkNetworkConnectivity(): Promise<boolean> {
    try {
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      return true;
    } catch (error) {
      console.warn('Network connectivity check failed:', error);
      return false;
    }
  }

  // Create a timeout promise
  private createTimeoutPromise(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Upload timeout')), ms);
    });
  }

  // Retry mechanism with exponential backoff
  private async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = this.MAX_RETRIES
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        console.warn(`Attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Exponential backoff: wait longer between retries
        const delay = this.RETRY_DELAY * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  }

  // Upload a single file with enhanced error handling
  async uploadFile(file: File, issueId: string, userId: string): Promise<MediaFile> {
    // Validate file first
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid file');
    }

    // Check if Firebase is configured
    if (!this.isFirebaseConfigured()) {
      console.warn('Firebase not configured, using mock upload');
      return this.createMockMediaFile(file);
    }

    // Check network connectivity
    const hasNetwork = await this.checkNetworkConnectivity();
    if (!hasNetwork) {
      console.warn('No network connectivity, using mock upload');
      return this.createMockMediaFile(file);
    }

    try {
      return await this.retryOperation(async () => {
        return await Promise.race([
          this.performFirebaseUpload(file, issueId, userId),
          this.createTimeoutPromise(this.TIMEOUT_DURATION)
        ]);
      });
    } catch (error) {
      console.error('Firebase upload failed, falling back to mock:', error);
      
      // Fallback to mock data if Firebase fails
      return this.createMockMediaFile(file);
    }
  }

  // Perform the actual Firebase upload
  private async performFirebaseUpload(file: File, issueId: string, userId: string): Promise<MediaFile> {
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}_${timestamp}.${fileExtension}`;
    
    const mediaType = file.type.startsWith('image/') ? 'photos' : 'videos';
    const storageRef = ref(storage, `issues/${issueId}/${mediaType}/${fileName}`);
    
    // Upload with metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'uploadedBy': userId,
        'issueId': issueId,
        'originalName': file.name
      }
    };
    
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      id: `${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
      url: downloadURL,
      type: file.type.startsWith('image/') ? 'photo' : 'video',
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString()
    };
  }

  // Create mock media file for fallback
  private createMockMediaFile(file: File): MediaFile {
    const timestamp = Date.now();
    const objectUrl = URL.createObjectURL(file);
    
    return {
      id: `mock_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
      url: objectUrl,
      type: file.type.startsWith('image/') ? 'photo' : 'video',
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString()
    };
  }

  // Upload multiple files with progress tracking
  async uploadMultipleFiles(
    files: File[], 
    issueId: string, 
    userId: string,
    onProgress?: (progress: number) => void
  ): Promise<MediaFile[]> {
    const results: MediaFile[] = [];
    let completed = 0;
    
    for (const file of files) {
      try {
        const mediaFile = await this.uploadFile(file, issueId, userId);
        results.push(mediaFile);
        completed++;
        
        if (onProgress) {
          onProgress((completed / files.length) * 100);
        }
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        // Continue with other files even if one fails
      }
    }
    
    return results;
  }

  // Delete a file with error handling
  async deleteFile(url: string): Promise<void> {
    // Skip deletion for mock URLs (blob URLs)
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
      return;
    }

    if (!this.isFirebaseConfigured()) {
      console.warn('Firebase not configured, skipping deletion');
      return;
    }

    try {
      await this.retryOperation(async () => {
        const storageRef = ref(storage, url);
        await deleteObject(storageRef);
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      // Don't throw error for deletion failures
    }
  }

  // Validate file before upload
  validateFile(file: File): { isValid: boolean; error?: string } {
    const isPhoto = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isPhoto && !isVideo) {
      return { isValid: false, error: 'Only photo and video files are allowed' };
    }
    
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: `File size exceeds limit (${isVideo ? '50MB' : '10MB'} max)` 
      };
    }
    
    // Check for supported formats
    const supportedPhotoFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const supportedVideoFormats = ['video/mp4', 'video/webm', 'video/quicktime'];
    
    if (isPhoto && !supportedPhotoFormats.includes(file.type)) {
      return { isValid: false, error: 'Supported photo formats: JPEG, PNG, WebP' };
    }
    
    if (isVideo && !supportedVideoFormats.includes(file.type)) {
      return { isValid: false, error: 'Supported video formats: MP4, WebM, MOV' };
    }
    
    return { isValid: true };
  }

  // Compress image before upload (optional optimization)
  async compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
    if (!file.type.startsWith('image/')) {
      return file;
    }

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file); // Return original if compression fails
          }
        }, file.type, quality);
      };
      
      img.onerror = () => resolve(file); // Return original if loading fails
      img.src = URL.createObjectURL(file);
    });
  }

  // Format file size for display
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get media type icon
  getMediaIcon(type: 'photo' | 'video'): string {
    return type === 'photo' ? '📷' : '🎬';
  }

  // Check if URL is a mock/blob URL
  isMockUrl(url: string): boolean {
    return url.startsWith('blob:') || url.includes('mock_');
  }

  // Get connection status
  async getConnectionStatus(): Promise<{
    online: boolean;
    firebaseConfigured: boolean;
    canUpload: boolean;
  }> {
    const online = await this.checkNetworkConnectivity();
    const firebaseConfigured = this.isFirebaseConfigured();
    
    return {
      online,
      firebaseConfigured,
      canUpload: online && firebaseConfigured
    };
  }
}

export const enhancedMediaService = new EnhancedMediaService();