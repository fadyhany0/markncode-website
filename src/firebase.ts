import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from '@firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvMIjM__uMx6k2VbsgN8CCKcZDN_hFPRE",
  authDomain: "markncode-c5afb.firebaseapp.com",
  projectId: "markncode-c5afb",
  storageBucket: "markncode-c5afb.firebasestorage.app",
  messagingSenderId: "449401922134",
  appId: "1:449401922134:web:a200fae69f4a2594e011f7",
  measurementId: "G-PM7C0R21D0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firebase Analytics only in production
let analytics = null;
if (process.env.NODE_ENV === 'production') {
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  }).catch(error => {
    console.warn('Firebase Analytics initialization failed:', error);
  });
}

// Add API endpoint configuration
export const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:5000';

// Export analytics if needed elsewhere in the app
export { analytics };

// Add empty export to make this a module
export {}; 