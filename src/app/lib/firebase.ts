// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBegrybjyFRn_c9T-ToYtHIOH9YwAzer8",
  authDomain: "civic-5a33a.firebaseapp.com",
  projectId: "civic-5a33a",
  storageBucket: "civic-5a33a.firebasestorage.app",
  messagingSenderId: "201867863515",
  appId: "1:201867863515:web:90eb8af8a4e2b3811e33fe",
  measurementId: "G-VKP5EHDNSE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;