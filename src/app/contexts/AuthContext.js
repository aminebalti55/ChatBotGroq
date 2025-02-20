'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      if (pathname !== '/login' && pathname !== '/signup') {
        console.log('Redirecting to login - not authenticated');
        router.replace('/login');
      }
    } else {
      if (pathname === '/login' || pathname === '/signup') {
        console.log('Redirecting to home - already authenticated');
        router.replace('/');
      }
    }
  }, [user, loading, pathname, router]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/verify-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('User authenticated:', userData);
        setUser({
          id: userData.id,
          email: userData.email,
          isActive: userData.is_active,
          createdAt: userData.created_at
        });
      } else {
        console.log('Token verification failed');
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    
    await checkAuth();
    
    console.log('Login successful');
  };

  const signup = async (email, password) => {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Signup failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    
    await checkAuth();
    
    console.log('Signup successful');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const value = { 
    user, 
    loading, 
    login, 
    signup,
    logout, 
    checkAuth 
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};