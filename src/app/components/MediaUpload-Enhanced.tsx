import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Camera, Video, X, Upload, FileImage, AlertCircle, CheckCircle, Wifi, WifiOff, Cloud, CloudOff } from 'lucide-react';
import { enhancedMediaService } from '../services/mediaService-enhanced';
import { MediaFile } from '../App';
import { useLanguage } from '../contexts/LanguageContext';

interface MediaUploadProps {
  onMediaUploaded: (mediaFiles: MediaFile[]) => void;
  maxFiles?: number;
  issueId?: string;
  userId: string;
  existingMedia?: MediaFile[];
}

interface UploadProgress {
  file: File;
  progress: number;
  error?: string;
  completed?: boolean;
  mediaFile?: MediaFile;
  isMock?: boolean;
}

interface ConnectionStatus {
  online: boolean;
  firebaseConfigured: boolean;
  canUpload: boolean;
}

export function MediaUploadEnhanced({ 
  onMediaUploaded, 
  maxFiles = 5, 
  issueId = 'temp', 
  userId,
  existingMedia = [] 
}: MediaUploadProps) {
  const { t } = useLanguage();
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    online: true,
    firebaseConfigured: true,
    canUpload: true
  });
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Check connection status on component mount
  React.useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    const status = await enhancedMediaService.getConnectionStatus();
    setConnectionStatus(status);
  };

  const handleFileSelect = async (files: FileList | null, type: 'photo' | 'video') => {
    if (!files || isUploading) return;
    
    setError(null);
    const fileArray = Array.from(files);
    
    // Check total file limit
    const totalFiles = existingMedia.length + uploads.length + fileArray.length;
    if (totalFiles > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    // Validate each file
    const validFiles: File[] = [];
    for (const file of fileArray) {
      const validation = enhancedMediaService.validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        setError(validation.error || 'Invalid file');
        return;
      }
    }
    
    if (validFiles.length === 0) return;
    
    setIsUploading(true);
    
    // Initialize upload progress
    const newUploads: UploadProgress[] = validFiles.map(file => ({
      file,
      progress: 0
    }));
    
    setUploads(prev => [...prev, ...newUploads]);
    
    try {
      // Upload files with progress tracking
      const uploadedFiles = await enhancedMediaService.uploadMultipleFiles(
        validFiles,
        issueId,
        userId,
        (overallProgress) => {
          // Update overall progress (simplified)
          setUploads(prev => prev.map((upload, index) => {
            if (index >= prev.length - validFiles.length) {
              return { ...upload, progress: Math.min(overallProgress, 95) };
            }
            return upload;
          }));
        }
      );
      
      // Mark files as completed
      setUploads(prev => prev.map((upload, index) => {
        const fileIndex = index - (prev.length - validFiles.length);
        if (fileIndex >= 0 && fileIndex < uploadedFiles.length) {
          const mediaFile = uploadedFiles[fileIndex];
          return {
            ...upload,
            progress: 100,
            completed: true,
            mediaFile,
            isMock: enhancedMediaService.isMockUrl(mediaFile.url)
          };
        }
        return upload;
      }));
      
      // Update parent component with all media files
      if (uploadedFiles.length > 0) {
        onMediaUploaded([...existingMedia, ...uploadedFiles]);
      }
      
      // Show warning if using mock data
      const hasMockFiles = uploadedFiles.some(file => enhancedMediaService.isMockUrl(file.url));
      if (hasMockFiles) {
        setError('Files uploaded locally. They will be synced when connection is restored.');
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload some files. Please try again.');
      
      // Mark failed uploads
      setUploads(prev => prev.map((upload, index) => {
        if (index >= prev.length - validFiles.length) {
          return { 
            ...upload, 
            error: 'Upload failed',
            progress: 0
          };
        }
        return upload;
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const removeUpload = (index: number) => {
    const upload = uploads[index];
    if (upload.mediaFile && enhancedMediaService.isMockUrl(upload.mediaFile.url)) {
      // Revoke blob URL for mock files
      URL.revokeObjectURL(upload.mediaFile.url);
    }
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingMedia = async (mediaFile: MediaFile) => {
    try {
      await enhancedMediaService.deleteFile(mediaFile.url);
      const updatedMedia = existingMedia.filter(m => m.id !== mediaFile.id);
      onMediaUploaded(updatedMedia);
    } catch (error) {
      console.error('Error removing media:', error);
      setError('Failed to remove media file');
    }
  };

  const retryFailedUploads = async () => {
    const failedUploads = uploads.filter(upload => upload.error && !upload.completed);
    if (failedUploads.length === 0) return;
    
    setError(null);
    
    for (const failedUpload of failedUploads) {
      try {
        setUploads(prev => prev.map(upload => 
          upload === failedUpload 
            ? { ...upload, error: undefined, progress: 0 }
            : upload
        ));
        
        const mediaFile = await enhancedMediaService.uploadFile(failedUpload.file, issueId, userId);
        
        setUploads(prev => prev.map(upload => 
          upload === failedUpload 
            ? { 
                ...upload, 
                progress: 100, 
                completed: true, 
                mediaFile,
                isMock: enhancedMediaService.isMockUrl(mediaFile.url)
              }
            : upload
        ));
        
        onMediaUploaded([...existingMedia, mediaFile]);
        
      } catch (error) {
        setUploads(prev => prev.map(upload => 
          upload === failedUpload 
            ? { ...upload, error: 'Retry failed' }
            : upload
        ));
      }
    }
  };

  const canAddMore = existingMedia.length + uploads.length < maxFiles && !isUploading;

  return (
    <Card className="bg-card border border-border shadow-md">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground">
            {t('add_photos_videos')}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground font-medium">
              {existingMedia.length + uploads.filter(u => u.completed).length}/{maxFiles}
            </span>
            
            {/* Connection status indicator */}
            <div className="flex items-center space-x-1">
              {connectionStatus.online ? (
                <Wifi className="w-4 h-4 text-success" />
              ) : (
                <WifiOff className="w-4 h-4 text-destructive" />
              )}
              {connectionStatus.firebaseConfigured ? (
                <Cloud className="w-4 h-4 text-success" />
              ) : (
                <CloudOff className="w-4 h-4 text-warning" />
              )}
            </div>
          </div>
        </div>

        {/* Connection status warning */}
        {!connectionStatus.canUpload && (
          <Alert className="bg-warning/10 border-warning/20">
            <AlertCircle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning font-medium">
              {!connectionStatus.online 
                ? 'No internet connection. Files will be stored locally.'
                : 'Firebase not configured. Using local storage.'}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="bg-destructive/10 border-destructive/20">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive font-medium">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Buttons */}
        {canAddMore && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => photoInputRef.current?.click()}
              variant="outline"
              className="p-4 h-auto flex-col space-y-2 border-border rounded-xl hover:bg-secondary/50"
              disabled={isUploading}
            >
              <Camera className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-semibold">
                {t('add_photos')}
              </span>
            </Button>
            
            <Button
              onClick={() => videoInputRef.current?.click()}
              variant="outline"
              className="p-4 h-auto flex-col space-y-2 border-border rounded-xl hover:bg-secondary/50"
              disabled={isUploading}
            >
              <Video className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-semibold">
                {t('add_videos')}
              </span>
            </Button>
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files, 'photo')}
          className="hidden"
          disabled={isUploading}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files, 'video')}
          className="hidden"
          disabled={isUploading}
        />

        {/* Existing Media */}
        {existingMedia.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground text-sm">
              {t('uploaded_media')}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {existingMedia.map((media) => (
                <div key={media.id} className="relative group">
                  <div className="aspect-square bg-secondary rounded-lg overflow-hidden border border-border">
                    {media.type === 'photo' ? (
                      <img
                        src={media.url}
                        alt={media.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary">
                        <Video className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Mock indicator */}
                    {enhancedMediaService.isMockUrl(media.url) && (
                      <Badge variant="secondary" className="absolute top-1 left-1 text-xs bg-warning/20 text-warning">
                        Local
                      </Badge>
                    )}
                  </div>
                  <Button
                    onClick={() => removeExistingMedia(media)}
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="mt-1 text-xs text-muted-foreground font-medium truncate">
                    {media.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {enhancedMediaService.formatFileSize(media.size)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploads.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground text-sm">
                {t('uploading_files')}
              </h4>
              {uploads.some(u => u.error) && (
                <Button
                  onClick={retryFailedUploads}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Retry Failed
                </Button>
              )}
            </div>
            {uploads.map((upload, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileImage className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground truncate">
                      {upload.file.name}
                    </span>
                    {upload.isMock && (
                      <Badge variant="secondary" className="text-xs bg-warning/20 text-warning">
                        Local
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {upload.completed && (
                      <CheckCircle className="w-4 h-4 text-success" />
                    )}
                    {upload.error && (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}
                    <Button
                      onClick={() => removeUpload(index)}
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {!upload.error && (
                  <div className="space-y-1">
                    <Progress value={upload.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{enhancedMediaService.formatFileSize(upload.file.size)}</span>
                      <span>{upload.progress}%</span>
                    </div>
                  </div>
                )}
                
                {upload.error && (
                  <div className="text-xs text-destructive font-medium">
                    {upload.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="bg-info/10 border border-info/20 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <span className="text-sm">💡</span>
            <div className="text-xs text-muted-foreground space-y-1 font-medium">
              <p>• {t('photo_tip')}</p>
              <p>• {t('video_tip')}</p>
              <p>• {t('file_limit_tip')}</p>
              {!connectionStatus.canUpload && (
                <p>• Files stored locally will sync when connection is restored</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}