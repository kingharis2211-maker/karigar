import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  session: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: 'buyer' | 'provider') => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (newRole: 'buyer' | 'provider') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      setUser(data as UserProfile);
    } else if (error) {
      console.error('Error fetching user profile:', error);
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const register = async (email: string, password: string, fullName: string, role: 'buyer' | 'provider') => {
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) throw signUpError;

    if (data.user) {
      const { error: profileError } = await supabase.from('user_profiles').insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role,
      });
      if (profileError) throw profileError;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const switchRole = async (newRole: 'buyer' | 'provider') => {
    if (!user) return;
    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', user.id);
    if (error) throw error;
    setUser({ ...user, role: newRole });
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, register, logout, switchRole }}>
      {children}
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
