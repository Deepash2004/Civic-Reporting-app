import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, Issue, Screen } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SideMenu } from './SideMenu';
import { Menu } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeScreenProps {
  user: User | null;
  issues: Issue[];
  unreadNotificationsCount: number;
  navigateToScreen: (screen: Screen) => void;
  onLogout: () => void;
}

export function HomeScreen({ user, issues, unreadNotificationsCount, navigateToScreen, onLogout }: HomeScreenProps) {
  const { t } = useLanguage();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const userIssues = issues.filter(issue => issue.userId === user?.id);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-warning/10 text-warning-foreground border border-warning/20';
      case 'acknowledged': return 'bg-info-background text-info-foreground border border-primary/20';
      case 'in-progress': return 'bg-primary/10 text-primary border border-primary/20';
      case 'resolved': return 'bg-success-background text-success-foreground border border-success/20';
      default: return 'bg-muted text-muted-foreground border border-border';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted': return t('submitted');
      case 'acknowledged': return t('acknowledged');
      case 'in-progress': return t('in_progress');
      case 'resolved': return t('resolved');
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return '📝';
      case 'acknowledged': return '👀';
      case 'in-progress': return '🔧';
      case 'resolved': return '✅';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {user && (
              <ImageWithFallback
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
              />
            )}
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {t('welcome_back')} {user?.name || t('guest_user')} 👋
              </h1>
              <p className="text-sm text-muted-foreground font-medium">Ready to make a difference?</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => navigateToScreen('notifications')}
              variant="ghost"
              className="text-muted-foreground relative hover:bg-secondary rounded-xl p-3"
            >
              🔔
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </Button>
            
            <Button
              onClick={() => setShowSideMenu(true)}
              variant="ghost"
              size="sm"
              className="p-2 rounded-xl hover:bg-secondary"
            >
              <Menu className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        {user && (
          <Card className="bg-gradient-to-r from-primary/10 to-info-background border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{user.badges.length} {t('badges_earned')} 🏆</p>
                  <p className="text-muted-foreground font-medium">earned for contributions</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">{user.streakDays} days 🔥</p>
                  <p className="text-sm text-muted-foreground font-medium">streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main CTA */}
        <Card className="border-0 shadow-lg bg-primary">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary-foreground/20 rounded-2xl mx-auto flex items-center justify-center">
                <span className="text-3xl">📱</span>
              </div>
              <h2 className="text-xl font-bold text-primary-foreground">{t('report_issue')}</h2>
              <p className="text-primary-foreground/90 font-medium">Help make your city better by reporting problems</p>
              <Button 
                onClick={() => navigateToScreen('report')}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-8 py-3 rounded-2xl shadow-md"
              >
                Start Reporting
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Report Common Issues */}
        <Card className="bg-card border border-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Quick Report</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => navigateToScreen('report')}
                variant="outline"
                className="p-4 h-auto flex-col space-y-2 border-2 border-border hover:border-primary/50 hover:bg-primary/5 rounded-xl"
              >
                <span className="text-2xl">🗑️</span>
                <span className="text-sm font-semibold text-foreground">{t('garbage')}</span>
              </Button>
              
              <Button
                onClick={() => navigateToScreen('report')}
                variant="outline"
                className="p-4 h-auto flex-col space-y-2 border-2 border-border hover:border-primary/50 hover:bg-primary/5 rounded-xl"
              >
                <span className="text-2xl">🚧</span>
                <span className="text-sm font-semibold text-foreground">Pothole</span>
              </Button>
              
              <Button
                onClick={() => navigateToScreen('report')}
                variant="outline"
                className="p-4 h-auto flex-col space-y-2 border-2 border-border hover:border-primary/50 hover:bg-primary/5 rounded-xl"
              >
                <span className="text-2xl">💡</span>
                <span className="text-sm font-semibold text-foreground">Street Light</span>
              </Button>
              
              <Button
                onClick={() => navigateToScreen('report')}
                variant="outline"
                className="p-4 h-auto flex-col space-y-2 border-2 border-border hover:border-primary/50 hover:bg-primary/5 rounded-xl"
              >
                <span className="text-2xl">💧</span>
                <span className="text-sm font-semibold text-foreground">Water Issue</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => navigateToScreen('tracking')}
            variant="outline"
            className="p-6 h-auto flex-col space-y-2 bg-card border-border rounded-xl hover:bg-muted"
          >
            <span className="text-2xl">📋</span>
            <span className="text-sm font-semibold text-foreground">{t('track_issues')}</span>
          </Button>
          
          <Button
            onClick={() => navigateToScreen('community')}
            variant="outline"
            className="p-6 h-auto flex-col space-y-2 bg-card border-border rounded-xl hover:bg-muted"
          >
            <span className="text-2xl">🏆</span>
            <span className="text-sm font-semibold text-foreground">{t('leaderboard')}</span>
          </Button>
        </div>

        {/* Active Reports */}
        {userIssues.length > 0 && (
          <Card className="bg-card border border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">{t('your_reports')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userIssues.slice(0, 3).map((issue) => (
                <div key={issue.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getStatusIcon(issue.status)}</span>
                    <div>
                      <p className="font-semibold text-foreground">{issue.title}</p>
                      <p className="text-sm text-muted-foreground font-medium">{issue.location}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(issue.status)} border-0 font-semibold`}>
                    {getStatusText(issue.status)}
                  </Badge>
                </div>
              ))}
              
              {userIssues.length > 3 && (
                <Button
                  onClick={() => navigateToScreen('tracking')}
                  variant="ghost"
                  className="w-full text-primary font-semibold hover:bg-primary/5"
                >
                  View all {userIssues.length} reports
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Map Snippet */}
        <Card className="bg-card border border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Nearby Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-gradient-to-br from-info-background to-muted rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-muted/30 rounded-xl"></div>
              <div className="relative z-10 text-center space-y-2">
                <span className="text-3xl">🗺️</span>
                <p className="text-foreground font-semibold">Interactive Map</p>
                <p className="text-sm text-muted-foreground font-medium">15 issues in your area</p>
              </div>
              
              {/* Mock map pins */}
              <div className="absolute top-8 left-12 w-4 h-4 bg-destructive rounded-full flex items-center justify-center shadow-md">
                <span className="text-xs text-destructive-foreground font-bold">!</span>
              </div>
              <div className="absolute bottom-12 right-16 w-4 h-4 bg-warning rounded-full flex items-center justify-center shadow-md">
                <span className="text-xs text-warning-foreground font-bold">!</span>
              </div>
              <div className="absolute top-16 right-8 w-4 h-4 bg-success rounded-full flex items-center justify-center shadow-md">
                <span className="text-xs text-success-foreground font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Community Reports */}
        <Card className="bg-card border border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">{t('recent_reports')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {issues.filter(issue => issue.userId !== user?.id).slice(0, 4).map((issue) => {
              const getCategoryIcon = (category: string) => {
                switch (category.toLowerCase()) {
                  case 'garbage': return '🗑️';
                  case 'road & infrastructure': return '🚧';
                  case 'lighting & traffic': return '💡';
                  case 'water & drainage': return '💧';
                  case 'noise & pollution': return '📢';
                  case 'public spaces': return '🌳';
                  default: return '📝';
                }
              };



              return (
                <div key={issue.id} className="flex items-start space-x-4 p-4 bg-muted/50 rounded-xl border border-border/50">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getCategoryIcon(issue.category)}</span>
                    <span className="text-sm">{getStatusIcon(issue.status)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-foreground line-clamp-1">{issue.title}</h4>
                      <Badge className={`${getStatusColor(issue.status)} border-0 font-semibold text-xs ml-2 shrink-0`}>
                        {getStatusText(issue.status)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{issue.description}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">{issue.location}</span>
                      <span className="text-muted-foreground">{issue.dateSubmitted}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <Button
              onClick={() => navigateToScreen('community')}
              variant="ghost"
              className="w-full text-primary font-semibold hover:bg-primary/5"
            >
              View all community reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Side Menu */}
      <SideMenu
        isOpen={showSideMenu}
        onClose={() => setShowSideMenu(false)}
        user={user}
        onNavigate={navigateToScreen}
        onLogout={onLogout}
      />
    </div>
  );
}