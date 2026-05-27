import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Issue, Notification, MediaFile } from '../App';

// Issues Service
export class IssuesService {
  private collectionName = 'issues';

  // Create a new issue
  async createIssue(issueData: Omit<Issue, 'id' | 'dateSubmitted'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...issueData,
        dateSubmitted: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating issue:', error);
      throw error;
    }
  }

  // Get all issues for a user
  async getUserIssues(userId: string): Promise<Issue[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateSubmitted: this.formatTimestamp(doc.data().dateSubmitted)
      } as Issue));
    } catch (error) {
      console.error('Error fetching user issues:', error);
      throw error;
    }
  }

  // Get community issues (all issues in the area)
  async getCommunityIssues(limit: number = 50): Promise<Issue[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateSubmitted: this.formatTimestamp(doc.data().dateSubmitted)
      } as Issue));
    } catch (error) {
      console.error('Error fetching community issues:', error);
      throw error;
    }
  }

  // Update issue status
  async updateIssueStatus(issueId: string, status: Issue['status'], assignedOfficer?: Issue['assignedOfficer']): Promise<void> {
    try {
      const issueRef = doc(db, this.collectionName, issueId);
      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      };
      
      if (assignedOfficer) {
        updateData.assignedOfficer = assignedOfficer;
      }
      
      await updateDoc(issueRef, updateData);
    } catch (error) {
      console.error('Error updating issue status:', error);
      throw error;
    }
  }

  // Subscribe to real-time updates for user issues
  subscribeToUserIssues(userId: string, callback: (issues: Issue[]) => void): () => void {
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const issues = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateSubmitted: this.formatTimestamp(doc.data().dateSubmitted)
      } as Issue));
      callback(issues);
    });
  }

  // Upload issue photo (legacy method)
  async uploadIssuePhoto(file: File, issueId: string): Promise<string> {
    try {
      const storageRef = ref(storage, `issues/${issueId}/${file.name}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  }

  // Upload multiple media files
  async uploadIssueMedia(files: File[], issueId: string, userId: string): Promise<MediaFile[]> {
    try {
      const uploadPromises = files.map(async (file) => {
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${userId}_${timestamp}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
        
        const mediaType = file.type.startsWith('image/') ? 'photos' : 'videos';
        const storageRef = ref(storage, `issues/${issueId}/${mediaType}/${fileName}`);
        
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        
        const mediaFile: MediaFile = {
          id: `${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
          url: downloadURL,
          type: file.type.startsWith('image/') ? 'photo' : 'video',
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString()
        };
        
        return mediaFile;
      });
      
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  private formatTimestamp(timestamp: Timestamp | any): string {
    if (!timestamp) return new Date().toISOString().split('T')[0];
    if (timestamp.toDate) {
      return timestamp.toDate().toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  }
}

// Notifications Service
export class NotificationsService {
  private collectionName = 'notifications';

  // Create a new notification
  async createNotification(notificationData: Omit<Notification, 'id' | 'timestamp'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...notificationData,
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Get notifications for a user
  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: this.formatTimestamp(doc.data().timestamp)
      } as Notification));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, this.collectionName, notificationId);
      await updateDoc(notificationRef, {
        read: true,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Subscribe to real-time notifications
  subscribeToUserNotifications(userId: string, callback: (notifications: Notification[]) => void): () => void {
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: this.formatTimestamp(doc.data().timestamp)
      } as Notification));
      callback(notifications);
    });
  }

  private formatTimestamp(timestamp: Timestamp | any): string {
    if (!timestamp) return new Date().toISOString();
    if (timestamp.toDate) {
      return timestamp.toDate().toISOString();
    }
    return new Date().toISOString();
  }
}

// Initialize services
export const issuesService = new IssuesService();
export const notificationsService = new NotificationsService();