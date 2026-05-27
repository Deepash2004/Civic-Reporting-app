import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Download, Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { MediaFile } from '../App';
import { mediaService } from '../services/mediaService';
import { useLanguage } from '../contexts/LanguageContext';

interface MediaViewerProps {
  media: MediaFile[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

function VideoControls({ videoRef }: VideoControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
      <div className="space-y-2">
        {/* Progress Bar */}
        <div className="flex items-center space-x-2 text-white text-xs">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 bg-white/20 rounded-lg appearance-none"
          />
          <span>{formatTime(duration)}</span>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              onClick={togglePlay}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={toggleMute}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
            onClick={() => {
              if (videoRef.current) {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  videoRef.current.requestFullscreen();
                }
              }
            }}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MediaViewer({ media, initialIndex = 0, isOpen, onClose }: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const { t } = useLanguage();
  const videoRef = React.useRef<HTMLVideoElement>(null);

  if (!media.length) return null;

  const currentMedia = media[currentIndex];
  const isVideo = currentMedia.type === 'video';

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const downloadMedia = () => {
    const link = document.createElement('a');
    link.href = currentMedia.url;
    link.download = currentMedia.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 bg-black">
        <DialogHeader className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DialogTitle className="text-white font-bold">
                {currentMedia.name}
              </DialogTitle>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {mediaService.getMediaIcon(currentMedia.type)} {currentMedia.type}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={downloadMedia}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="relative w-full h-full flex items-center justify-center">
          {isVideo ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={currentMedia.url}
                className="w-full h-full object-contain"
                controls={false}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    // Update controls if needed
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    // Video loaded
                  }
                }}
              />
              <VideoControls videoRef={videoRef} />
            </div>
          ) : (
            <img
              src={currentMedia.url}
              alt={currentMedia.name}
              className="max-w-full max-h-full object-contain"
            />
          )}

          {/* Navigation arrows */}
          {media.length > 1 && (
            <>
              <Button
                onClick={goToPrevious}
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
              >
                ←
              </Button>
              
              <Button
                onClick={goToNext}
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
              >
                →
              </Button>
            </>
          )}
        </div>

        {/* Media info and thumbnails */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <div className="space-y-3">
            {/* Media details */}
            <div className="text-white text-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">{currentMedia.name}</span>
                <span>{mediaService.formatFileSize(currentMedia.size)}</span>
              </div>
              <div className="text-white/70">
                {t('uploaded_on')} {new Date(currentMedia.uploadedAt).toLocaleDateString()}
              </div>
            </div>

            {/* Thumbnails */}
            {media.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {media.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentIndex 
                        ? 'border-primary' 
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    {item.type === 'photo' ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}