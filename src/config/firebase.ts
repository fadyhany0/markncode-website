import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAvMIjM__uMx6k2VbsgN8CCKcZDN_hFPRE",
  authDomain: "markncode-c5afb.firebaseapp.com",
  projectId: "markncode-c5afb",
  storageBucket: "markncode-c5afb.firebasestorage.app",
  messagingSenderId: "449401922134",
  appId: "1:449401922134:web:a200fae69f4a2594e011f7",
  measurementId: "G-PM7C0R21D0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app); 