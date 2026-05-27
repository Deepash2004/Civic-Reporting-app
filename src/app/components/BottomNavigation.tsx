import React from 'react';
import { Button } from './ui/button';
import { Screen } from '../App';
import { Home, FileText, Users, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  unreadNotificationsCount: number;
}

export function BottomNavigation({ currentScreen, onNavigate, unreadNotificationsCount }: BottomNavigationProps) {
  const { t } = useLanguage();
  
  const navItems = [
    {
      screen: 'home' as Screen,
      icon: Home,
      label: t('home'),
      emoji: '🏠'
    },
    {
      screen: 'report' as Screen,
      icon: FileText,
      label: t('report'),
      emoji: '📝'
    },
    {
      screen: 'tracking' as Screen,
      icon: FileText,
      label: t('tracking'),
      emoji: '📋'
    },
    {
      screen: 'community' as Screen,
      icon: Users,
      label: t('community'),
      emoji: '👥'
    }
  ];

  if (currentScreen === 'onboarding') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-40">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-3 px-2">
          {navItems.map((item) => {
            const isActive = currentScreen === item.screen;
            const IconComponent = item.icon;
            
            return (
              <Button
                key={item.screen}
                onClick={() => onNavigate(item.screen)}
                variant="ghost"
                className={`flex-1 flex-col space-y-1 h-14 relative rounded-xl font-semibold transition-all ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-primary hover:bg-secondary'
                }`}
              >
                <div className="relative">
                  <span className="text-lg">{item.emoji}</span>
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold">{item.label}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full"></div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}