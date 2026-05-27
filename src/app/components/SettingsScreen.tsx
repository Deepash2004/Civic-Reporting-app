import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { ArrowLeft, Settings, Bell, Globe, Palette, Download, Trash2, HelpCircle, Moon, Sun } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    // Notifications
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
    
    // Privacy
    locationSharing: true,
    profileVisibility: 'public',
    dataCollection: true,
    
    // App Preferences
    defaultCategory: 'all',
    autoLocation: true,
    
    // Data & Storage
    cacheSize: '45MB',
    offlineMode: false,
    dataCompression: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLanguageChange = (newLanguage: string) => {
    const langCode = newLanguage === 'hindi' ? 'hi' : 'en';
    setLanguage(langCode as Language);
  };

  const clearCache = () => {
    // Simulate cache clearing
    handleSettingChange('cacheSize', '0MB');
    setTimeout(() => {
      handleSettingChange('cacheSize', '2MB');
    }, 1000);
  };

  const exportData = () => {
    // Simulate data export
    alert('Data export started. You\'ll receive an email with your data within 24 hours.');
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
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t('settings_title')}</h1>
            <p className="text-sm text-muted-foreground">{t('app_preferences')}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* App Preferences - Language First */}
        <Card className="bg-card border border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Globe className="w-5 h-5" />
              <span>{t('app_preferences')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('language')}</Label>
              <Select
                value={language === 'hi' ? 'hindi' : 'english'}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">🇺🇸 {t('english')}</SelectItem>
                  <SelectItem value="hindi">🇮🇳 {t('hindi')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-primary" />
                  ) : (
                    <Sun className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div>
                  <Label className="text-base font-semibold">
                    {theme === 'dark' ? t('dark_mode') : t('light_mode')}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'dark' ? t('dark_mode_desc') : t('light_mode_desc')}
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={() => toggleTheme()}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Default Category</Label>
              <Select
                value={settings.defaultCategory}
                onValueChange={(value) => handleSettingChange('defaultCategory', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="garbage">{t('garbage')}</SelectItem>
                  <SelectItem value="road_infrastructure">{t('road_infrastructure')}</SelectItem>
                  <SelectItem value="lighting_traffic">{t('lighting_traffic')}</SelectItem>
                  <SelectItem value="water_drainage">{t('water_drainage')}</SelectItem>
                  <SelectItem value="noise_pollution">{t('noise_pollution')}</SelectItem>
                  <SelectItem value="public_spaces">{t('public_spaces')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-detect Location</Label>
                <p className="text-sm text-gray-600">Automatically fill location when reporting</p>
              </div>
              <Switch
                checked={settings.autoLocation}
                onCheckedChange={(checked) => handleSettingChange('autoLocation', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card border border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Bell className="w-5 h-5" />
              <span>{t('notifications_settings')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('push_notifications')}</Label>
                <p className="text-sm text-gray-600">Receive alerts about your reports</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('email_notifications')}</Label>
                <p className="text-sm text-gray-600">Get updates via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('sms_notifications')}</Label>
                <p className="text-sm text-gray-600">Receive text message alerts</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Sound</Label>
                  <p className="text-xs text-gray-600">Notification sounds</p>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Vibration</Label>
                  <p className="text-xs text-gray-600">Haptic feedback</p>
                </div>
                <Switch
                  checked={settings.vibrationEnabled}
                  onCheckedChange={(checked) => handleSettingChange('vibrationEnabled', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="bg-card border border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <span className="text-lg">🔒</span>
              <span>{t('privacy_security')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Location Sharing</Label>
                <p className="text-sm text-gray-600">Allow precise location detection</p>
              </div>
              <Switch
                checked={settings.locationSharing}
                onCheckedChange={(checked) => handleSettingChange('locationSharing', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Profile Visibility</Label>
              <Select
                value={settings.profileVisibility}
                onValueChange={(value) => handleSettingChange('profileVisibility', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Everyone can see</SelectItem>
                  <SelectItem value="community">Community - Local users only</SelectItem>
                  <SelectItem value="private">Private - Hidden profile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('data_privacy')}</Label>
                <p className="text-sm text-gray-600">Help improve the app with usage data</p>
              </div>
              <Switch
                checked={settings.dataCollection}
                onCheckedChange={(checked) => handleSettingChange('dataCollection', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data & Storage */}
        <Card className="bg-card border border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Download className="w-5 h-5" />
              <span>Data & Storage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Cache Size</Label>
                <p className="text-sm text-gray-600">Temporary files: {settings.cacheSize}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCache}
              >
                Clear Cache
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Offline Mode</Label>
                <p className="text-sm text-gray-600">Save reports when offline</p>
              </div>
              <Switch
                checked={settings.offlineMode}
                onCheckedChange={(checked) => handleSettingChange('offlineMode', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Data Compression</Label>
                <p className="text-sm text-gray-600">Reduce data usage</p>
              </div>
              <Switch
                checked={settings.dataCompression}
                onCheckedChange={(checked) => handleSettingChange('dataCompression', checked)}
              />
            </div>
            
            <Separator />
            
            <Button
              variant="outline"
              className="w-full"
              onClick={exportData}
            >
              <Download className="w-4 h-4 mr-2" />
              Export My Data
            </Button>
          </CardContent>
        </Card>

        {/* Support & Feedback */}
        <Card className="bg-card border border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <HelpCircle className="w-5 h-5" />
              <span>{t('support_feedback')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="w-4 h-4 mr-2" />
              {t('help_support')}
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <span className="text-lg mr-2">💬</span>
              {t('send_feedback')}
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <span className="text-lg mr-2">⭐</span>
              {t('rate_app')}
            </Button>
            
            <Separator />
            
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Reset All Settings
            </Button>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border shadow-md">
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <h3 className="font-bold text-foreground">{t('app_name')}</h3>
              <p className="text-sm text-muted-foreground">Version 1.0.0 (Build 100)</p>
              <p className="text-xs text-muted-foreground">© 2025 {t('app_name')}. All rights reserved.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}