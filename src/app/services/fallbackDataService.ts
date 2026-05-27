import { Issue, Notification, User, MediaFile } from '../App';

export class FallbackDataService {
  private readonly STORAGE_KEYS = {
    ISSUES: 'citysaathi_issues',
    NOTIFICATIONS: 'citysaathi_notifications',
    USER: 'citysaathi_user',
    MEDIA: 'citysaathi_media'
  };

  // Issues Management
  getIssues(): Issue[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.ISSUES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading issues from localStorage:', error);
      return [];
    }
  }

  saveIssues(issues: Issue[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.ISSUES, JSON.stringify(issues));
    } catch (error) {
      console.error('Error saving issues to localStorage:', error);
    }
  }

  addIssue(issue: Issue): void {
    const issues = this.getIssues();
    issues.unshift(issue);
    this.saveIssues(issues);
  }

  updateIssue(issueId: string, updates: Partial<Issue>): void {
    const issues = this.getIssues();
    const index = issues.findIndex(issue => issue.id === issueId);
    if (index !== -1) {
      issues[index] = { ...issues[index], ...updates };
      this.saveIssues(issues);
    }
  }

  getUserIssues(userId: string): Issue[] {
    const allIssues = this.getIssues();
    return allIssues.filter(issue => issue.userId === userId);
  }

  // Notifications Management
  getNotifications(): Notification[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error);
      return [];
    }
  }

  saveNotifications(notifications: Notification[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  }

  addNotification(notification: Notification): void {
    const notifications = this.getNotifications();
    notifications.unshift(notification);
    this.saveNotifications(notifications);
  }

  markNotificationAsRead(notificationId: string): void {
    const notifications = this.getNotifications();
    const index = notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      notifications[index].read = true;
      this.saveNotifications(notifications);
    }
  }

  getUserNotifications(userId: string): Notification[] {
    const allNotifications = this.getNotifications();
    return allNotifications.filter(notification => notification.userId === userId);
  }

  // User Management
  getUser(): User | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      return null;
    }
  }

  saveUser(user: User): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }

  clearUser(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error clearing user from localStorage:', error);
    }
  }

  // Media Management
  getMedia(): MediaFile[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.MEDIA);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading media from localStorage:', error);
      return [];
    }
  }

  saveMedia(media: MediaFile[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.MEDIA, JSON.stringify(media));
    } catch (error) {
      console.error('Error saving media to localStorage:', error);
    }
  }

  addMediaFile(mediaFile: MediaFile): void {
    const media = this.getMedia();
    media.push(mediaFile);
    this.saveMedia(media);
  }

  removeMediaFile(mediaId: string): void {
    const media = this.getMedia();
    const filtered = media.filter(m => m.id !== mediaId);
    this.saveMedia(filtered);
  }

  // Sync Management - keep track of what needs to be synced to Firebase
  getPendingSync(): {
    issues: Issue[];
    notifications: Notification[];
    media: MediaFile[];
  } {
    try {
      const pendingSync = localStorage.getItem('citysaathi_pending_sync');
      return pendingSync ? JSON.parse(pendingSync) : {
        issues: [],
        notifications: [],
        media: []
      };
    } catch (error) {
      console.error('Error loading pending sync data:', error);
      return { issues: [], notifications: [], media: [] };
    }
  }

  addToPendingSync(type: 'issues' | 'notifications' | 'media', item: any): void {
    try {
      const pending = this.getPendingSync();
      pending[type].push(item);
      localStorage.setItem('citysaathi_pending_sync', JSON.stringify(pending));
    } catch (error) {
      console.error('Error adding to pending sync:', error);
    }
  }

  clearPendingSync(): void {
    try {
      localStorage.removeItem('citysaathi_pending_sync');
    } catch (error) {
      console.error('Error clearing pending sync:', error);
    }
  }

  // Storage space management
  getStorageUsage(): {
    used: number;
    available: number;
    percentage: number;
  } {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith('citysaathi_')) {
          totalSize += localStorage[key].length;
        }
      }
      
      // Estimate available space (most browsers limit localStorage to ~5-10MB)
      const estimatedLimit = 5 * 1024 * 1024; // 5MB
      const percentage = (totalSize / estimatedLimit) * 100;
      
      return {
        used: totalSize,
        available: estimatedLimit - totalSize,
        percentage: Math.min(percentage, 100)
      };
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  // Clean up old data to free space
  cleanupOldData(daysToKeep: number = 30): void {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      // Clean old issues
      const issues = this.getIssues();
      const recentIssues = issues.filter(issue => 
        new Date(issue.dateSubmitted) > cutoffDate
      );
      this.saveIssues(recentIssues);
      
      // Clean old notifications
      const notifications = this.getNotifications();
      const recentNotifications = notifications.filter(notification =>
        new Date(notification.timestamp) > cutoffDate
      );
      this.saveNotifications(recentNotifications);
      
      console.log(`Cleaned up data older than ${daysToKeep} days`);
    } catch (error) {
      console.error('Error during data cleanup:', error);
    }
  }

  // Export data for backup
  exportData(): string {
    try {
      const data = {
        issues: this.getIssues(),
        notifications: this.getNotifications(),
        user: this.getUser(),
        media: this.getMedia(),
        exportDate: new Date().toISOString()
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return '';
    }
  }

  // Import data from backup
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.issues) this.saveIssues(data.issues);
      if (data.notifications) this.saveNotifications(data.notifications);
      if (data.user) this.saveUser(data.user);
      if (data.media) this.saveMedia(data.media);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export const fallbackDataService = new FallbackDataService();