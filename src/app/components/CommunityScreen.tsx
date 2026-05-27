import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Trophy, Award, Flame, Users } from 'lucide-react';
import { User } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CommunityScreenProps {
  user: User | null;
  onBack: () => void;
}

interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  avatar: string;
  rank: number;
  reportsCount: number;
}

interface BadgeType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  progress?: number;
  target?: number;
}

const leaderboardData: LeaderboardUser[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    points: 450,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rank: 1,
    reportsCount: 23
  },
  {
    id: '2',
    name: 'Priya Sharma',
    points: 380,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b14c?w=100&h=100&fit=crop&crop=face',
    rank: 2,
    reportsCount: 19
  },
  {
    id: '3',
    name: 'Amit Singh',
    points: 320,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rank: 3,
    reportsCount: 16
  },
  {
    id: '4',
    name: 'Sneha Patel',
    points: 280,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rank: 4,
    reportsCount: 14
  },
  {
    id: '5',
    name: 'Rohit Gupta',
    points: 250,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    rank: 5,
    reportsCount: 12
  }
];

const badgesData: BadgeType[] = [
  {
    id: 'first-reporter',
    name: 'First Reporter',
    description: 'Submit your first issue report',
    icon: '🥉',
    color: 'bg-warning/10 text-warning border border-warning/20',
    earned: true
  },
  {
    id: 'problem-solver',
    name: 'Problem Solver',
    description: 'Report 5 issues that get resolved',
    icon: '🥈',
    color: 'bg-secondary text-foreground border border-border',
    earned: true
  },
  {
    id: 'community-hero',
    name: 'Community Hero',
    description: 'Earn 500 points from resolved issues',
    icon: '🥇',
    color: 'bg-warning/10 text-warning border border-warning/20',
    earned: false,
    progress: 120,
    target: 500
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Report issues for 7 consecutive days',
    icon: '🔥',
    color: 'bg-destructive/10 text-destructive border border-destructive/20',
    earned: false,
    progress: 3,
    target: 7
  },
  {
    id: 'location-scout',
    name: 'Location Scout',
    description: 'Report issues in 10 different areas',
    icon: '📍',
    color: 'bg-primary/10 text-primary border border-primary/20',
    earned: false,
    progress: 2,
    target: 10
  },
  {
    id: 'team-player',
    name: 'Team Player',
    description: 'Join a neighborhood team',
    icon: '🤝',
    color: 'bg-success/10 text-success border border-success/20',
    earned: false
  }
];

export function CommunityScreen({ user, onBack }: CommunityScreenProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const earnedBadges = badgesData.filter(badge => badge.earned);
  const availableBadges = badgesData.filter(badge => !badge.earned);

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
        <h1 className="text-xl font-bold text-foreground">Community</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* User Stats */}
        {user && (
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <ImageWithFallback
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                  <p className="text-muted-foreground font-medium">{user.points} points earned</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Flame className="w-4 h-4 text-warning" />
                      <span className="text-sm font-semibold text-foreground">{user.streakDays} day streak</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-warning" />
                      <span className="text-sm font-semibold text-foreground">{earnedBadges.length} badges</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard */}
        <Card className="bg-card border border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-warning" />
              <span className="text-foreground font-bold">Neighborhood Leaderboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {leaderboardData.map((leaderUser, index) => (
              <div
                key={leaderUser.id}
                className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                  user?.name === leaderUser.name 
                    ? 'bg-primary/5 border-2 border-primary/20' 
                    : 'bg-secondary/50 border border-border'
                }`}
              >
                <div className="text-2xl">
                  {getRankIcon(leaderUser.rank)}
                </div>
                
                <ImageWithFallback
                  src={leaderUser.avatar}
                  alt={leaderUser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{leaderUser.name}</p>
                  <p className="text-sm text-muted-foreground">{leaderUser.reportsCount} reports</p>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-primary">{leaderUser.points}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full mt-4">
              View Full Leaderboard
            </Button>
          </CardContent>
        </Card>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <Card className="bg-card border border-border shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-warning" />
                <span className="text-foreground font-bold">Your Badges</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-4 bg-gradient-to-br from-warning/10 to-warning/20 border border-warning/30 rounded-xl text-center"
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h3 className="font-semibold text-foreground text-sm">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Badges */}
        <Card className="bg-card border border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🎯</span>
              <span className="text-foreground font-bold">Goals to Achieve</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableBadges.map((badge) => (
              <div
                key={badge.id}
                className="p-4 border border-border bg-secondary/30 rounded-xl"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl opacity-50">{badge.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
                    
                    {badge.progress !== undefined && badge.target && (
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold text-foreground">{badge.progress}/{badge.target}</span>
                        </div>
                        <Progress 
                          value={(badge.progress / badge.target) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Community Team */}
        <Card className="bg-gradient-to-r from-primary/10 to-success/10 border border-border shadow-md">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-card rounded-full mx-auto flex items-center justify-center shadow-md border border-border">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Join Your Neighborhood Team</h3>
              <p className="text-muted-foreground font-medium">
                Team up with neighbors to unlock community rewards and make a bigger impact together.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  🎁 Team rewards available
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  👥 12 neighbors already joined
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-bold">
                Join Team
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card border border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-foreground font-bold">Recent Community Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-success/10 border border-success/20 rounded-lg">
              <span className="text-success">🎉</span>
              <p className="text-sm text-foreground">
                <span className="font-semibold">Priya Sharma</span> earned Community Hero badge!
              </p>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-info/10 border border-primary/20 rounded-lg">
              <span className="text-primary">✅</span>
              <p className="text-sm text-foreground">
                <span className="font-semibold">Streetlight issue</span> on Park Ave was resolved
              </p>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <span className="text-warning">🔥</span>
              <p className="text-sm text-foreground">
                <span className="font-semibold">Amit Singh</span> reached 5-day reporting streak!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}