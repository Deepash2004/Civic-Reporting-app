import React from 'react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../contexts/LanguageContext';

interface OnboardingScreenProps {
  onLogin: () => void;
}

export function OnboardingScreen({ onLogin }: OnboardingScreenProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
        {/* Illustration */}
        <div className="w-80 h-64 rounded-2xl overflow-hidden shadow-lg bg-card p-4">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1549223940-9e14d93b1369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwaWxsdXN0cmF0aW9uJTIwbWluaW1hbCUyMHBlb3BsZXxlbnwxfHx8fDE3NTc1MzQwNTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="City and people illustration"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* Logo and Title */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <span className="text-primary-foreground text-xl">🏙️</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{t('app_name')}</h1>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">{t('onboarding_title')}</h2>
            <p className="text-lg text-primary font-medium">{t('onboarding_subtitle')}</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {t('onboarding_description')}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
          <div className="flex items-center space-x-3 p-4 bg-card rounded-xl shadow-sm border border-border">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-lg">📱</span>
            </div>
            <span className="text-foreground font-medium">Easy reporting</span>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-card rounded-xl shadow-sm border border-border">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-lg">📊</span>
            </div>
            <span className="text-foreground font-medium">Track progress</span>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-card rounded-xl shadow-sm border border-border">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-lg">🤝</span>
            </div>
            <span className="text-foreground font-medium">Build community</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4 pt-8">
        <Button 
          onClick={onLogin}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-2xl text-lg font-bold shadow-lg border-0"
        >
          {t('get_started')}
        </Button>
        
        <Button 
          onClick={onLogin}
          variant="outline"
          className="w-full border-2 border-primary text-primary py-4 rounded-2xl text-lg font-semibold bg-card hover:bg-primary/5 transition-all"
        >
          {t('sign_in')}
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center pt-6">
        <p className="text-sm text-muted-foreground font-medium">
          Join thousands of citizens making their cities better
        </p>
      </div>
    </div>
  );
}