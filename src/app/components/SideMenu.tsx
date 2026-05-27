import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { User, Screen } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X, User as UserIcon, HelpCircle, Shield, FileText, Settings, LogOut, Bell } from 'lucide-react';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function SideMenu({ isOpen, onClose, user, onNavigate, onLogout }: SideMenuProps) {
  if (!isOpen) return null;

  const menuItems = [
    {
      icon: <UserIcon className="w-5 h-5" />,
      label: 'Profile',
      screen: 'profile' as Screen,
      emoji: '👤'
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: 'Notifications',
      screen: 'notifications' as Screen,
      emoji: '🔔'
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      label: 'FAQs',
      screen: 'faqs' as Screen,
      emoji: '❓'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: 'Privacy & Policy',
      screen: 'privacy' as Screen,
      emoji: '🔒'
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Terms & Conditions',
      screen: 'terms' as Screen,
      emoji: '📜'
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      screen: 'settings' as Screen,
      emoji: '⚙️'
    }
  ];

  const handleItemClick = (screen: Screen) => {
    onNavigate(screen);
    onClose();
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Side Menu - positioned on the right */}
      <div className="absolute right-0 top-0 w-80 bg-card shadow-2xl h-full overflow-y-auto border-l border-border">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-md">
                <span className="text-primary-foreground">🏙️</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">CitySaathi</h2>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="rounded-full p-2 hover:bg-muted"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>

          {/* User Profile Section */}
          {user && (
            <Card className="mb-6 bg-gradient-to-r from-primary/10 to-info-background border border-border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <ImageWithFallback
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{user.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="font-semibold">🌟 {user.points} points</span>
                      <span className="font-semibold">🔥 {user.streakDays} days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.screen}
                onClick={() => handleItemClick(item.screen)}
                variant="ghost"
                className="w-full justify-start p-4 h-auto text-left hover:bg-muted rounded-xl font-semibold"
              >
                <span className="mr-3 text-lg">{item.emoji}</span>
                <span className="flex-1 text-foreground">{item.label}</span>
              </Button>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start p-4 h-auto text-left hover:bg-destructive/10 text-destructive hover:text-destructive rounded-xl font-semibold"
          >
            <span className="mr-3 text-lg">🚪</span>
            <span className="flex-1">Logout</span>
          </Button>

          {/* App Info */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center font-medium">
              CitySaathi v1.0.0
            </p>
            <p className="text-xs text-muted-foreground text-center mt-1 font-medium">
              Making cities better, together
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}