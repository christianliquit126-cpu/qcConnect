import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, GoogleAuthProvider,
  FacebookAuthProvider, signInWithPopup, updateProfile,
} from "firebase/auth";
import { ref, set, get, update } from "firebase/database";
import { auth, db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  location: string;
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await get(ref(db, `users/${u.uid}`));
        if (snap.exists()) {
          setUserProfile(snap.val() as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const createUserDoc = async (u: User, name?: string) => {
    const snap = await get(ref(db, `users/${u.uid}`));
    if (!snap.exists()) {
      const displayName = name || u.displayName || "Anonymous";
      const profile: UserProfile = {
        uid: u.uid,
        name: displayName,
        email: u.email || "",
        avatar: u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3B82F6&color=fff`,
        location: "",
        createdAt: Date.now(),
      };
      await set(ref(db, `users/${u.uid}`), profile);
      setUserProfile(profile);
    } else {
      setUserProfile(snap.val() as UserProfile);
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await createUserDoc(cred.user, name);
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, new GoogleAuthProvider());
    await createUserDoc(cred.user);
  };

  const loginWithFacebook = async () => {
    const cred = await signInWithPopup(auth, new FacebookAuthProvider());
    await createUserDoc(cred.user);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    await update(ref(db, `users/${user.uid}`), data);
    setUserProfile((prev) => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, register, loginWithGoogle, loginWithFacebook, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
