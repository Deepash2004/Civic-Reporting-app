import React, { useState, useEffect } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { ReportIssueScreen } from './components/ReportIssueScreen';
import { IssueTrackingScreen } from './components/IssueTrackingScreen';
import { CommunityScreen } from './components/CommunityScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { FAQScreen } from './components/FAQScreen';
import { PrivacyPolicyScreen } from './components/PrivacyPolicyScreen';
import { TermsConditionsScreen } from './components/TermsConditionsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { Alert, AlertDescription } from './components/ui/alert';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { connectionManager, ConnectionStatus } from './utils/connectionManager';
import { fallbackDataService } from './services/fallbackDataService';
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { Screen, User, Issue, Notification, MediaFile } from './App';

// Mock data for initial load
const mockUser: User = {
  id: '1',
  name: 'Rajesh',
  streakDays: 3,
  badges: ['First Reporter', 'Problem Solver'],
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
};

const initialMockIssues: Issue[] = [
  {
    id: '1',
    title: 'Deep Pothole on Main Street',
    category: 'Road & Infrastructure',
    description: 'Large and deep pothole near the bus stop causing severe traffic disruption.',
    status: 'in-progress',
    location: 'Main Street, Block A, Near Bus Stop',
    dateSubmitted: '2025-09-08',
    userId: '1',
    assignedOfficer: {
      id: 'officer_1',
      name: 'Suresh Kumar',
      department: 'Public Works Department',
      contactNumber: '+91-9876543210',
      assignedDate: '2025-09-09'
    }
  }
];

function ConnectionIndicator({ status }: { status: ConnectionStatus }) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center space-x-2 bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
        {status.online ? (
          <Wifi className="w-4 h-4 text-success" />
        ) : (
          <WifiOff className="w-4 h-4 text-destructive" />
        )}
        {status.firebaseConnected ? (
          <Cloud className="w-4 h-4 text-success" />
        ) : (
          <CloudOff className="w-4 h-4 text-warning" />
        )}
        
        <Badge 
          variant={status.canUpload ? "default" : "destructive"}
          className="text-xs"
        >
          {status.canUpload ? 'Online' : 'Offline'}
        </Badge>
      </div>
    </div>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [user, setUser] = useState<User | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    online: true,
    firebaseConnected: false,
    canUpload: false
  });
  const [showConnectionAlert, setShowConnectionAlert] = useState(false);

  // Initialize data and connection monitoring
  useEffect(() => {
    // Load saved data from localStorage
    const savedUser = fallbackDataService.getUser();
    const savedIssues = fallbackDataService.getIssues();
    const savedNotifications = fallbackDataService.getNotifications();

    if (savedUser) {
      setUser(savedUser);
      setCurrentScreen('home');
    }
    
    setIssues(savedIssues.length > 0 ? savedIssues : initialMockIssues);
    setNotifications(savedNotifications);

    // Monitor connection status
    connectionManager.addListener((status) => {
      setConnectionStatus(status);
      
      // Show alert when connection status changes
      if (!status.canUpload && status.online !== connectionStatus.online) {
        setShowConnectionAlert(true);
        setTimeout(() => setShowConnectionAlert(false), 5000);
      }
    });

    // Test Firebase connection
    connectionManager.testFirebaseConnection();

    // Cleanup old data periodically
    fallbackDataService.cleanupOldData(30);

    return () => {
      connectionManager.removeListener((status) => setConnectionStatus(status));
    };
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      fallbackDataService.saveUser(user);
    }
  }, [user]);

  useEffect(() => {
    fallbackDataService.saveIssues(issues);
  }, [issues]);

  useEffect(() => {
    fallbackDataService.saveNotifications(notifications);
  }, [notifications]);

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const goToLogin = () => {
    setCurrentScreen('login');
  };

  const signInUser = () => {
    setUser(mockUser);
    setCurrentScreen('home');
  };

  const signInWithGoogle = () => {
    const googleUser: User = {
      ...mockUser,
      name: 'Rajesh Kumar',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    };
    setUser(googleUser);
    setCurrentScreen('home');
  };

  const signInAsGuest = () => {
    setCurrentScreen('home');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password functionality to be implemented');
  };

  const handleSignUp = () => {
    console.log('Sign up functionality to be implemented');
  };

  const handleLogout = () => {
    setUser(null);
    fallbackDataService.clearUser();
    setCurrentScreen('login');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const addIssue = (issue: Omit<Issue, 'id' | 'dateSubmitted' | 'status' | 'userId'>) => {
    const newIssue: Issue = {
      ...issue,
      id: Math.random().toString(36).substr(2, 9),
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'submitted',
      userId: user?.id || 'guest'
    };
    
    setIssues(prev => [newIssue, ...prev]);
    
    // Add confirmation notification
    const confirmationNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Report Submitted! 📝',
      message: `Your ${issue.category.toLowerCase()} report has been submitted successfully. We'll update you on the progress.`,
      type: 'success',
      timestamp: new Date().toISOString(),
      read: false,
      issueId: newIssue.id,
      icon: '📝',
      userId: user?.id || 'guest'
    };
    
    setNotifications(prev => [confirmationNotification, ...prev]);
    
    // Add to pending sync if not connected to Firebase
    if (!connectionStatus.canUpload) {
      fallbackDataService.addToPendingSync('issues', newIssue);
      fallbackDataService.addToPendingSync('notifications', confirmationNotification);
    }
    
    setCurrentScreen('home');
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const retryConnection = async () => {
    await connectionManager.testFirebaseConnection();
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return (
          <OnboardingScreen 
            onLogin={goToLogin}
          />
        );
      case 'login':
        return (
          <LoginScreen 
            onLogin={signInUser}
            onGoogleLogin={signInWithGoogle}
            onBack={() => setCurrentScreen('onboarding')}
            onForgotPassword={handleForgotPassword}
            onSignUp={handleSignUp}
            onGuestLogin={signInAsGuest}
          />
        );
      case 'home':
        return (
          <HomeScreen 
            user={user}
            issues={issues}
            unreadNotificationsCount={unreadNotificationsCount}
            navigateToScreen={navigateToScreen}
            onLogout={handleLogout}
          />
        );
      case 'report':
        return (
          <ReportIssueScreen 
            onSubmit={addIssue}
            onBack={() => setCurrentScreen('home')}
            userId={user?.id || 'guest'}
          />
        );
      case 'tracking':
        return (
          <IssueTrackingScreen 
            issues={issues}
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'community':
        return (
          <CommunityScreen 
            user={user}
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'notifications':
        return (
          <NotificationsScreen 
            notifications={notifications}
            onNotificationRead={markNotificationAsRead}
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            user={user}
            onBack={() => setCurrentScreen('home')}
            onUpdateUser={updateUser}
          />
        );
      case 'faqs':
        return (
          <FAQScreen 
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'privacy':
        return (
          <PrivacyPolicyScreen 
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'terms':
        return (
          <TermsConditionsScreen 
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'settings':
        return (
          <SettingsScreen 
            onBack={() => setCurrentScreen('home')}
          />
        );
      default:
        return <OnboardingScreen onLogin={goToLogin} />;
    }
  };

  const showBottomNavigation = !['onboarding', 'login'].includes(currentScreen);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background md:bg-slate-100 md:dark:bg-slate-900 md:py-12 flex justify-center items-center">
          <div className="w-full md:w-[400px] min-h-screen md:min-h-[800px] md:h-[800px] bg-card md:rounded-[3rem] md:shadow-2xl relative overflow-hidden md:border-[14px] md:border-slate-900 dark:border-slate-950">
            {/* Connection Status Indicator */}
            <ConnectionIndicator status={connectionStatus} />
            
            {/* Connection Alert */}
            {showConnectionAlert && (
              <div className="absolute top-16 left-4 right-4 z-40">
                <Alert className="bg-warning/10 border-warning/20">
                  <CloudOff className="h-4 w-4 text-warning" />
                  <AlertDescription className="text-warning font-medium">
                    {!connectionStatus.online 
                      ? 'You are offline. Data will be saved locally and synced when connection is restored.'
                      : 'Firebase connection lost. Using local storage.'}
                  </AlertDescription>
                  {connectionStatus.online && !connectionStatus.firebaseConnected && (
                    <Button
                      onClick={retryConnection}
                      variant="outline"
                      size="sm"
                      className="ml-2 text-warning border-warning hover:bg-warning/10"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Retry
                    </Button>
                  )}
                </Alert>
              </div>
            )}
            
            <div className={`h-full overflow-y-auto overflow-x-hidden ${showBottomNavigation ? "pb-20" : ""}`}>
              {renderScreen()}
            </div>
            
            {showBottomNavigation && (
              <div className="absolute bottom-0 w-full">
                <BottomNavigation
                  currentScreen={currentScreen}
                  onNavigate={navigateToScreen}
                  unreadNotificationsCount={unreadNotificationsCount}
                />
              </div>
            )}
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}