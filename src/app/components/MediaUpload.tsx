import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Camera, Video, X, Upload, FileImage, AlertCircle, CheckCircle } from 'lucide-react';
import { mediaService } from '../services/mediaService';
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
}

export function MediaUpload({ 
  onMediaUploaded, 
  maxFiles = 5, 
  issueId = 'temp', 
  userId,
  existingMedia = [] 
}: MediaUploadProps) {
  const { t } = useLanguage();
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null, type: 'photo' | 'video') => {
    if (!files) return;
    
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
      const validation = mediaService.validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        setError(validation.error || 'Invalid file');
        return;
      }
    }
    
    // Initialize upload progress
    const newUploads: UploadProgress[] = validFiles.map(file => ({
      file,
      progress: 0
    }));
    
    setUploads(prev => [...prev, ...newUploads]);
    
    // Upload files
    const uploadPromises = validFiles.map(async (file, index) => {
      try {
        const uploadIndex = uploads.length + index;
        
        // Simulate progress (Firebase doesn't provide upload progress)
        const progressInterval = setInterval(() => {
          setUploads(prev => prev.map((upload, i) => 
            i === uploadIndex ? { ...upload, progress: Math.min(upload.progress + 10, 90) } : upload
          ));
        }, 200);
        
        // Upload file
        const mediaFile = await mediaService.uploadFile(file, issueId, userId);
        
        clearInterval(progressInterval);
        
        // Mark as completed
        setUploads(prev => prev.map((upload, i) => 
          i === uploadIndex ? { 
            ...upload, 
            progress: 100, 
            completed: true, 
            mediaFile 
          } : upload
        ));
        
        return mediaFile;
      } catch (error) {
        const uploadIndex = uploads.length + index;
        setUploads(prev => prev.map((upload, i) => 
          i === uploadIndex ? { 
            ...upload, 
            error: error instanceof Error ? error.message : 'Upload failed',
            progress: 0
          } : upload
        ));
        throw error;
      }
    });
    
    try {
      const uploadedFiles = await Promise.all(uploadPromises);
      const successfulUploads = uploadedFiles.filter(Boolean);
      
      if (successfulUploads.length > 0) {
        onMediaUploaded([...existingMedia, ...successfulUploads]);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const removeUpload = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingMedia = async (mediaFile: MediaFile) => {
    try {
      await mediaService.deleteFile(mediaFile.url);
      const updatedMedia = existingMedia.filter(m => m.id !== mediaFile.id);
      onMediaUploaded(updatedMedia);
    } catch (error) {
      console.error('Error removing media:', error);
      setError('Failed to remove media file');
    }
  };

  const canAddMore = existingMedia.length + uploads.length < maxFiles;

  return (
    <Card className="bg-card border border-border shadow-md">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground">
            {t('add_photos_videos')}
          </h3>
          <span className="text-sm text-muted-foreground font-medium">
            {existingMedia.length + uploads.filter(u => u.completed).length}/{maxFiles}
          </span>
        </div>

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
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files, 'video')}
          className="hidden"
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
                    {mediaService.formatFileSize(media.size)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploads.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">
              {t('uploading_files')}
            </h4>
            {uploads.map((upload, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileImage className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground truncate">
                      {upload.file.name}
                    </span>
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
                      <span>{mediaService.formatFileSize(upload.file.size)}</span>
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}