import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { issuesService, notificationsService } from '../services/firestoreService';
import { Issue, Notification } from '../App';

// Custom hook for managing user issues
export function useUserIssues() {
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setIssues([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = issuesService.subscribeToUserIssues(
      currentUser.uid,
      (userIssues) => {
        setIssues(userIssues);
        setLoading(false);
        setError(null);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  const createIssue = async (issueData: Omit<Issue, 'id' | 'dateSubmitted' | 'userId'>) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      await issuesService.createIssue({
        ...issueData,
        userId: currentUser.uid,
        status: 'submitted'
      });
      
      // Create a notification for the new issue
      await notificationsService.createNotification({
        title: 'Report Submitted! 📝',
        message: `Your ${issueData.category.toLowerCase()} report has been submitted successfully. We'll update you on the progress.`,
        type: 'success',
        read: false,
        issueId: '', // Will be updated by the service
        icon: '📝',
        userId: currentUser.uid
      });
    } catch (error) {
      console.error('Error creating issue:', error);
      setError('Failed to create issue');
      throw error;
    }
  };

  return { issues, loading, error, createIssue };
}

// Custom hook for managing community issues
export function useCommunityIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunityIssues = async () => {
      try {
        setLoading(true);
        const communityIssues = await issuesService.getCommunityIssues();
        setIssues(communityIssues);
        setError(null);
      } catch (err) {
        console.error('Error fetching community issues:', err);
        setError('Failed to load community issues');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityIssues();
  }, []);

  const refreshCommunityIssues = async () => {
    try {
      const communityIssues = await issuesService.getCommunityIssues();
      setIssues(communityIssues);
      setError(null);
    } catch (err) {
      console.error('Error refreshing community issues:', err);
      setError('Failed to refresh community issues');
    }
  };

  return { issues, loading, error, refreshCommunityIssues };
}

// Custom hook for managing user notifications
export function useUserNotifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = notificationsService.subscribeToUserNotifications(
      currentUser.uid,
      (userNotifications) => {
        setNotifications(userNotifications);
        setLoading(false);
        setError(null);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError('Failed to mark notification as read');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, loading, error, markAsRead, unreadCount };
}