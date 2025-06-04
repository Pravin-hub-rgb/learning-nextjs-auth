'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: check active session and set user
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setUser(null);
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };
    getUser();

    // Listen to auth state changes (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Signup function wrapping supabase.auth.signUp
  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    return { error };
  };

  // SignIn function wrapping supabase.auth.signInWithPassword
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return { error };
  };

  // SignOut function wrapping supabase.auth.signOut
  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming auth context easily
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
