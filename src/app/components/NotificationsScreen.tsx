import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, CheckCircle, Bell, BellOff } from 'lucide-react';
import { Notification } from '../App';

interface NotificationsScreenProps {
  notifications: Notification[];
  onNotificationRead: (notificationId: string) => void;
  onBack: () => void;
}

export function NotificationsScreen({ notifications, onNotificationRead, onBack }: NotificationsScreenProps) {
  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-success/10 text-success border border-success/20';
      case 'info': return 'bg-info/10 text-info border border-primary/20';
      case 'warning': return 'bg-warning/10 text-warning border border-warning/20';
      case 'update': return 'bg-primary/10 text-primary border border-primary/20';
      default: return 'bg-secondary text-foreground border border-border';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationTime.toLocaleDateString();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onNotificationRead(notification.id);
    }
  };

  const markAllAsRead = () => {
    unreadNotifications.forEach(notification => {
      onNotificationRead(notification.id);
    });
  };

  const renderNotification = (notification: Notification) => (
    <Card 
      key={notification.id} 
      className={`border shadow-md cursor-pointer transition-all hover:shadow-lg ${
        !notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : 'bg-card border-border'
      }`}
      onClick={() => handleNotificationClick(notification)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationTypeColor(notification.type)}`}>
              <span className="text-lg">{notification.icon}</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                {notification.title}
              </h3>
              {!notification.read && (
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
              )}
            </div>
            
            <p className={`mt-1 text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
              {notification.message}
            </p>
            
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(notification.timestamp)}
              </span>
              
              <Badge className={getNotificationTypeColor(notification.type)}>
                {notification.type}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
        </div>
        
        {unreadNotifications.length > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="ghost"
            size="sm"
            className="text-primary"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card border border-border shadow-md">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mx-auto mb-2">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{unreadNotifications.length}</p>
              <p className="text-sm text-muted-foreground font-medium">Unread</p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-md">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-lg mx-auto mb-2">
                <BellOff className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
              <p className="text-sm text-muted-foreground font-medium">Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Unread Notifications */}
        {unreadNotifications.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
              <span>New Notifications</span>
              <Badge className="bg-destructive/10 text-destructive border border-destructive/20">
                {unreadNotifications.length}
              </Badge>
            </h2>
            
            <div className="space-y-3">
              {unreadNotifications.map(renderNotification)}
            </div>
          </div>
        )}

        {/* Read Notifications */}
        {readNotifications.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">
              Earlier
            </h2>
            
            <div className="space-y-3">
              {readNotifications.map(renderNotification)}
            </div>
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 && (
          <Card className="bg-card border border-border shadow-md">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-secondary rounded-full mx-auto flex items-center justify-center">
                  <Bell className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">No Notifications</h3>
                <p className="text-muted-foreground font-medium">
                  You're all caught up! Notifications about your reports and community updates will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notification Settings */}
        <Card className="bg-gradient-to-r from-primary/10 to-success/10 border border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-xl">📱</span>
                <div>
                  <p className="font-semibold text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Get notified about issue updates</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full flex items-center p-1">
                <div className="w-4 h-4 bg-primary-foreground rounded-full ml-auto"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-xl">📧</span>
                <div>
                  <p className="font-semibold text-foreground">Email Updates</p>
                  <p className="text-sm text-muted-foreground">Weekly summary of your reports</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-switch-background rounded-full flex items-center p-1">
                <div className="w-4 h-4 bg-card rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🏆</span>
                <div>
                  <p className="font-semibold text-foreground">Achievement Alerts</p>
                  <p className="text-sm text-muted-foreground">New badges and milestones</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full flex items-center p-1">
                <div className="w-4 h-4 bg-primary-foreground rounded-full ml-auto"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}