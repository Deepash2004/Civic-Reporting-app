import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ArrowLeft, Camera, Edit3, Save, X } from 'lucide-react';
import { User } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProfileScreenProps {
  user: User | null;
  onBack: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

export function ProfileScreen({ user, onBack, onUpdateUser }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(user);
  const [notifications, setNotifications] = useState({
    statusUpdates: true,
    communityAlerts: true,
    rewards: true,
    marketing: false
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-card border border-border shadow-lg">
          <CardContent className="p-8 text-center">
            <span className="text-6xl">👤</span>
            <h3 className="text-xl font-bold text-foreground mt-4 mb-2">Sign In Required</h3>
            <p className="text-muted-foreground mb-6 font-medium">Please sign in to view your profile</p>
            <Button onClick={onBack} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = () => {
    if (editedUser) {
      onUpdateUser(editedUser);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const achievements = [
    { name: 'First Reporter', icon: '🥇', description: 'Submitted your first report' },
    { name: 'Problem Solver', icon: '🔧', description: 'Helped resolve 5 issues' },
    { name: 'Community Hero', icon: '🦸', description: 'Top contributor this month' },
    { name: 'Streak Master', icon: '🔥', description: '7-day reporting streak' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm px-4 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center space-x-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Profile</h1>
            <p className="text-sm text-muted-foreground font-medium">Manage your account</p>
          </div>
        </div>
        
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
            >
              <Save className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Info */}
        <Card className="bg-card border border-border shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <ImageWithFallback
                  src={editedUser?.avatar || user.avatar}
                  alt={editedUser?.name || user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
                />
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full p-2"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name" className="font-semibold text-foreground">Name</Label>
                      <Input
                        id="name"
                        value={editedUser?.name || ''}
                        onChange={(e) => setEditedUser(prev => 
                          prev ? { ...prev, name: e.target.value } : null
                        )}
                        className="mt-1 bg-input-background"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
                    <p className="text-muted-foreground font-medium">CitySaathi Member</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-primary/10 rounded-xl border border-primary/20">
                <p className="text-2xl font-bold text-primary">{user.streakDays}</p>
                <p className="text-sm text-muted-foreground font-medium">Day Streak</p>
              </div>
              <div className="text-center p-3 bg-success/10 rounded-xl border border-success/20">
                <p className="text-2xl font-bold text-success">{user.badges.length}</p>
                <p className="text-sm text-muted-foreground font-medium">Badges</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-card border border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 font-bold text-foreground">
              <span>🏆</span>
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-xl border ${
                  user.badges.includes(achievement.name)
                    ? 'bg-warning/10 border-warning/30'
                    : 'bg-muted border-border'
                }`}
              >
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{achievement.name}</h4>
                  <p className="text-sm text-muted-foreground font-medium">{achievement.description}</p>
                </div>
                {user.badges.includes(achievement.name) && (
                  <Badge className="bg-warning/20 text-warning-foreground border-warning/30 font-semibold">
                    Earned
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-card border border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 font-bold text-foreground">
              <span>🔔</span>
              <span>Notification Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="status-updates" className="font-semibold text-foreground">Status Updates</Label>
                <p className="text-sm text-muted-foreground font-medium">Get notified about report progress</p>
              </div>
              <Switch
                id="status-updates"
                checked={notifications.statusUpdates}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, statusUpdates: checked }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="community-alerts" className="font-semibold text-foreground">Community Alerts</Label>
                <p className="text-sm text-muted-foreground font-medium">Local announcements and updates</p>
              </div>
              <Switch
                id="community-alerts"
                checked={notifications.communityAlerts}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, communityAlerts: checked }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="rewards" className="font-semibold text-foreground">Rewards & Achievements</Label>
                <p className="text-sm text-muted-foreground font-medium">Points, badges, and milestones</p>
              </div>
              <Switch
                id="rewards"
                checked={notifications.rewards}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, rewards: checked }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing" className="font-semibold text-foreground">Marketing & Tips</Label>
                <p className="text-sm text-muted-foreground font-medium">App updates and helpful tips</p>
              </div>
              <Switch
                id="marketing"
                checked={notifications.marketing}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, marketing: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="bg-card border border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 font-bold text-foreground">
              <span>⚙️</span>
              <span>Account Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start font-semibold">
              <span className="mr-2">📧</span>
              Change Email
            </Button>
            <Button variant="outline" className="w-full justify-start font-semibold">
              <span className="mr-2">🔐</span>
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start font-semibold">
              <span className="mr-2">📱</span>
              Update Phone Number
            </Button>
            <Separator />
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold">
              <span className="mr-2">🗑️</span>
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}