import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserCredential } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import {
  auth,
  googleProvider,
  facebookProvider,
  signInWithCredential
} from '../config/firebase';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { Platform } from 'react-native';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<UserCredential>;
  signInWithFacebook: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      if (Platform.OS === 'web') {
        return signInWithPopup(auth, googleProvider);
      } else {
        const redirectUrl = makeRedirectUri({
          scheme: 'contactmanager'
        });

        // Open web browser for Google sign in
        const result = await WebBrowser.openAuthSessionAsync(
          `https://${auth.config.authDomain}/auth/handler?provider=google&redirect_url=${encodeURIComponent(redirectUrl)}`,
          redirectUrl
        );

        if (result.type === 'success' && result.url) {
          const url = new URL(result.url);
          const idToken = url.searchParams.get('id_token');
          const accessToken = url.searchParams.get('access_token');

          if (!idToken || !accessToken) {
            throw new Error('Failed to get authentication tokens');
          }

          const credential = GoogleAuthProvider.credential(idToken, accessToken);
          return signInWithCredential(auth, credential);
        } else {
          throw new Error('Google Sign In was cancelled');
        }
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      if (Platform.OS === 'web') {
        return signInWithPopup(auth, facebookProvider);
      } else {
        const redirectUrl = makeRedirectUri({
          scheme: 'contactmanager'
        });

        // Open web browser for Facebook sign in
        const result = await WebBrowser.openAuthSessionAsync(
          `https://${auth.config.authDomain}/auth/handler?provider=facebook&redirect_url=${encodeURIComponent(redirectUrl)}`,
          redirectUrl
        );

        if (result.type === 'success' && result.url) {
          const url = new URL(result.url);
          const accessToken = url.searchParams.get('access_token');

          if (!accessToken) {
            throw new Error('Failed to get authentication token');
          }

          const credential = FacebookAuthProvider.credential(accessToken);
          return signInWithCredential(auth, credential);
        } else {
          throw new Error('Facebook Sign In was cancelled');
        }
      }
    } catch (error) {
      console.error('Facebook Sign-In Error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      return auth.signOut();
    } catch (error) {
      console.error('Sign Out Error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
