import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Mic, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { MediaUploadEnhanced } from './MediaUpload-Enhanced';
import { MediaFile } from '../App';

interface ReportIssueScreenProps {
  onSubmit: (issue: {
    title: string;
    category: string;
    description: string;
    location: string;
    photo?: string;
    media?: MediaFile[];
  }) => void;
  onBack: () => void;
  userId: string;
}

interface IssueCategory {
  id: string;
  nameKey: string;
  icon: string;
  color: string;
}

export function ReportIssueScreen({ onSubmit, onBack, userId }: ReportIssueScreenProps) {
  const { t } = useLanguage();
  
  const categories: IssueCategory[] = [
    { id: 'garbage', nameKey: 'garbage', icon: '🗑️', color: 'bg-destructive/10 text-destructive border border-destructive/20' },
    { id: 'pothole', nameKey: 'road_infrastructure', icon: '🚧', color: 'bg-warning/10 text-warning border border-warning/20' },
    { id: 'streetlight', nameKey: 'lighting_traffic', icon: '💡', color: 'bg-warning/10 text-warning border border-warning/20' },
    { id: 'water', nameKey: 'water_drainage', icon: '💧', color: 'bg-info/10 text-info border border-primary/20' },
    { id: 'noise', nameKey: 'noise_pollution', icon: '📢', color: 'bg-primary/10 text-primary border border-primary/20' },
    { id: 'environment', nameKey: 'public_spaces', icon: '🌳', color: 'bg-success/10 text-success border border-success/20' },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(t('current_location'));
  const [isRecording, setIsRecording] = useState(false);
  const [media, setMedia] = useState<MediaFile[]>([]);

  const handleSubmit = () => {
    if (!selectedCategory || !description.trim()) {
      alert(t('select_category_required'));
      return;
    }

    const selectedCat = categories.find(cat => cat.id === selectedCategory);
    
    onSubmit({
      title: title || `${t(selectedCat?.nameKey as any)} Issue`,
      category: t(selectedCat?.nameKey as any) || '',
      description,
      location,
      media
    });
    
    // Reset form after submission
    setSelectedCategory('');
    setTitle('');
    setDescription('');
    setMedia([]);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop voice recording
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setDescription(prev => prev + (prev ? ' ' : '') + '[Voice note: Issue description recorded]');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm px-4 py-4 flex items-center space-x-4 border-b border-border">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">{t('report_issue_title')}</h1>
      </div>

      <div className="p-4 space-y-6 pb-32">
        {/* Category Selection */}
        <Card className="bg-card border border-border shadow-md">
          <CardContent className="p-6">
            <Label className="text-lg font-bold text-foreground mb-4 block">
              {t('select_category')}
            </Label>
            
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant="outline"
                  className={`p-4 h-auto flex-col space-y-2 border-2 transition-all font-semibold ${
                    selectedCategory === category.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                  }`}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-sm font-medium">{t(category.nameKey as any)}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Issue Details */}
        <Card className="bg-card border border-border shadow-md">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label className="text-base font-semibold text-foreground">
                {t('issue_title_optional')}
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('issue_title_placeholder')}
                className="mt-2 border-border rounded-xl bg-input-background"
              />
            </div>

            <div>
              <Label className="text-base font-semibold text-foreground">
                {t('description_required')}
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('description_placeholder')}
                className="mt-2 border-border rounded-xl min-h-24 bg-input-background"
                rows={4}
              />
            </div>

            <div>
              <Label className="text-base font-semibold text-foreground mb-3 block">
                {t('voice_note')}
              </Label>
              
              <div className="flex justify-center">
                <Button
                  onClick={toggleRecording}
                  variant="outline"
                  className={`p-4 h-auto flex-col space-y-2 rounded-xl transition-all w-32 ${
                    isRecording 
                      ? 'border-destructive bg-destructive/10 text-destructive' 
                      : 'border-border hover:bg-secondary/50'
                  }`}
                >
                  <Mic className={`w-6 h-6 ${isRecording ? 'text-destructive' : 'text-muted-foreground'}`} />
                  <span className={`text-xs font-semibold ${isRecording ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {isRecording ? t('recording') : t('voice')}
                  </span>
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold text-foreground">
                {t('location')}
              </Label>
              <div className="mt-2 flex items-center space-x-3 p-3 border border-border rounded-xl bg-secondary/30">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium">{location}</span>
                <Button variant="ghost" size="sm" className="ml-auto text-primary font-semibold">
                  {t('change_location')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Upload */}
        <MediaUploadEnhanced
          onMediaUploaded={setMedia}
          maxFiles={5}
          userId={userId}
          existingMedia={media}
        />

        {/* Tips */}
        <Card className="bg-gradient-to-r from-info/10 to-success/10 border border-border">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <span className="text-xl">💡</span>
              <div>
                <p className="font-semibold text-foreground">{t('pro_tips')}</p>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1 font-medium">
                  <li>{t('tip_photos')}</li>
                  <li>{t('tip_location')}</li>
                  <li>{t('tip_impact')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sticky Submit Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-card border-t border-border z-30">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleSubmit}
            disabled={!selectedCategory || !description.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('submit_report')}
          </Button>
        </div>
      </div>
    </div>
  );
}