import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  AuthError,
  browserPopupRedirectResolver
} from '@firebase/auth';
import { auth, googleProvider } from '../firebase';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'User'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        setUser({
          email: userCredential.user.email || '',
          name: userCredential.user.displayName || 'User'
        });
        navigate('/dashboard');
      }
    } catch (err) {
      const error = err as AuthError;
      console.error('Sign in error:', error);
      switch (error.code) {
        case 'auth/invalid-email':
          throw new Error('Please enter a valid email address');
        case 'auth/user-not-found':
          throw new Error('No account found with this email');
        case 'auth/wrong-password':
          throw new Error('Incorrect password');
        case 'auth/too-many-requests':
          throw new Error('Too many failed attempts. Please try again later.');
        case 'auth/network-request-failed':
          throw new Error('Network error. Please check your connection.');
        default:
          throw new Error('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
        setUser({
          email: userCredential.user.email || '',
          name: name
        });
        navigate('/dashboard');
      }
    } catch (err) {
      const error = err as AuthError;
      console.error('Sign up error:', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('This email is already registered. Please sign in instead.');
        case 'auth/invalid-email':
          throw new Error('Please enter a valid email address');
        case 'auth/weak-password':
          throw new Error('Password should be at least 6 characters long');
        case 'auth/network-request-failed':
          throw new Error('Network error. Please check your connection.');
        default:
          throw new Error('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
        
        if (result.user) {
          setUser({
            email: result.user.email || '',
            name: result.user.displayName || 'User'
          });
          navigate('/dashboard');
        }
      } catch (popupError: any) {
        if (popupError.code === 'auth/popup-closed-by-user') {
          return;
        } else if (popupError.code === 'auth/popup-blocked') {
          throw new Error('Popup was blocked. Please allow popups for this site and try again.');
        } else if (popupError.code === 'auth/cancelled-popup-request') {
          return;
        } else {
          throw new Error('Failed to sign in with Google. Please try again.');
        }
      }
    } catch (err) {
      const error = err as AuthError;
      console.error('Google sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await signOut(auth);
      setUser(null);
      navigate('/home');
    } catch (err) {
      const error = err as AuthError;
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut: handleSignOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 