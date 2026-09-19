import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string, role: UserRole, location?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const role: UserRole = userProfile?.role || 'user';

  const fetchProfile = async (uid: string) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      } else {
        // Fallback default profile if document doesn't exist yet
        const defaultProfile: UserProfile = {
          uid,
          displayName: user?.displayName || 'User',
          email: user?.email || '',
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        setUserProfile(defaultProfile);
      }
    } catch (err) {
      console.warn('Firestore user fetch failed, using local profile state:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    await fetchProfile(res.user.uid);
  };

  const signup = async (
    email: string,
    pass: string,
    name: string,
    selectedRole: UserRole,
    location?: string
  ) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    const newProfile: UserProfile = {
      uid: res.user.uid,
      displayName: name,
      email: email,
      role: selectedRole,
      location: location || 'Ahmedabad',
      createdAt: new Date().toISOString(),
      verified: true,
    };

    try {
      await setDoc(doc(db, 'users', res.user.uid), newProfile);
    } catch (e) {
      console.warn('Firestore setDoc failed:', e);
    }

    setUserProfile(newProfile);
  };

  const loginWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    await fetchProfile(res.user.uid);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.uid);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        role,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
