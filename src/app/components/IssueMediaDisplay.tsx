import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Play, Image as ImageIcon, Eye } from 'lucide-react';
import { MediaFile } from '../App';
import { MediaViewer } from './MediaViewer';
import { useLanguage } from '../contexts/LanguageContext';

interface IssueMediaDisplayProps {
  media?: MediaFile[];
  className?: string;
  showViewAllButton?: boolean;
  maxVisible?: number;
}

export function IssueMediaDisplay({ 
  media = [], 
  className = '',
  showViewAllButton = true,
  maxVisible = 3
}: IssueMediaDisplayProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const { t } = useLanguage();

  if (!media.length) return null;

  const visibleMedia = media.slice(0, maxVisible);
  const remainingCount = media.length - maxVisible;

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <>
      <div className={`space-y-3 ${className}`}>
        {/* Media Grid */}
        <div className="grid grid-cols-3 gap-2">
          {visibleMedia.map((mediaFile, index) => (
            <button
              key={mediaFile.id}
              onClick={() => openViewer(index)}
              className="relative aspect-square bg-secondary rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors group"
            >
              {mediaFile.type === 'photo' ? (
                <img
                  src={mediaFile.url}
                  alt={mediaFile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <Play className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              )}
              
              {/* Media Type Badge */}
              <Badge 
                variant="secondary" 
                className="absolute top-1 right-1 text-xs bg-black/50 text-white border-none"
              >
                {mediaFile.type === 'photo' ? <ImageIcon className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </Badge>
              
              {/* Overlay for last item if there are more */}
              {index === maxVisible - 1 && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    +{remainingCount}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* View All Button */}
        {showViewAllButton && media.length > 0 && (
          <Button
            onClick={() => openViewer(0)}
            variant="outline"
            size="sm"
            className="w-full text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            {t('view_all_media')} ({media.length})
          </Button>
        )}

        {/* Media Summary */}
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          {media.filter(m => m.type === 'photo').length > 0 && (
            <Badge variant="secondary" className="text-xs">
              <ImageIcon className="w-3 h-3 mr-1" />
              {media.filter(m => m.type === 'photo').length} {t('photos')}
            </Badge>
          )}
          {media.filter(m => m.type === 'video').length > 0 && (
            <Badge variant="secondary" className="text-xs">
              <Play className="w-3 h-3 mr-1" />
              {media.filter(m => m.type === 'video').length} {t('videos')}
            </Badge>
          )}
        </div>
      </div>

      {/* Media Viewer */}
      <MediaViewer
        media={media}
        initialIndex={viewerIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </>
  );
}