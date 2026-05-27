import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { MediaFile } from '../App';

export class MediaService {
  // Upload a single file to Firebase Storage
  async uploadFile(file: File, issueId: string, userId: string): Promise<MediaFile> {
    try {
      // Validate file type
      const isPhoto = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isPhoto && !isVideo) {
        throw new Error('Only photo and video files are allowed');
      }
      
      // Validate file size (50MB max for videos, 10MB max for photos)
      const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(`File size exceeds limit (${isVideo ? '50MB' : '10MB'} max)`);
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${userId}_${timestamp}.${fileExtension}`;
      
      // Create storage reference
      const mediaType = isPhoto ? 'photos' : 'videos';
      const storageRef = ref(storage, `issues/${issueId}/${mediaType}/${fileName}`);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Create MediaFile object
      const mediaFile: MediaFile = {
        id: `${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
        url: downloadURL,
        type: isPhoto ? 'photo' : 'video',
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };
      
      return mediaFile;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
  
  // Upload multiple files
  async uploadMultipleFiles(files: File[], issueId: string, userId: string): Promise<MediaFile[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, issueId, userId));
    return Promise.all(uploadPromises);
  }
  
  // Delete a file from storage
  async deleteFile(url: string): Promise<void> {
    try {
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
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
}

export const mediaService = new MediaService();