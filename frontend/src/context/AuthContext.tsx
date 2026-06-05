import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { User, UserLoginRequest, UserRegisterRequest, Role } from '../types/user.types';
import { authApi } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: UserLoginRequest) => Promise<void>;
  register: (details: UserRegisterRequest) => Promise<void>;
  logout: (message?: string) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to decode JWT without external libraries
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const logoutTimerRef = useRef<any | null>(null);

  const clearTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, []);

  const logout = useCallback((message?: string) => {
    clearTimer();
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    if (message) {
      setError(message);
    }
  }, [clearTimer]);

  const setAutoLogoutTimer = useCallback((jwtToken: string) => {
    clearTimer();
    const claims = parseJwt(jwtToken);
    if (!claims || !claims.exp) return;

    const expirationTime = claims.exp * 1000; // convert to ms
    const timeUntilExpiry = expirationTime - Date.now();

    if (timeUntilExpiry <= 0) {
      logout('Your session has expired. Please login again.');
    } else {
      logoutTimerRef.current = setTimeout(() => {
        logout('Your session has expired. Please login again.');
      }, timeUntilExpiry);
    }
  }, [clearTimer, logout]);

  // Load user details from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      const claims = parseJwt(storedToken);
      if (claims && claims.exp && claims.exp * 1000 > Date.now()) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setAutoLogoutTimer(storedToken);
      } else {
        // Token expired
        logout('Session expired. Please log in again.');
      }
    }
    setLoading(false);

    // Listen to axios 401 logouts
    const handleLogoutEvent = () => {
      logout('Session expired. Please log in again.');
    };
    window.addEventListener('auth-logout', handleLogoutEvent);

    return () => {
      clearTimer();
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, [setAutoLogoutTimer, logout, clearTimer]);

  const login = async (credentials: UserLoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.data) {
        const { token: jwtToken, email, role, userId, studentId } = response.data;
        const loggedUser: User = { id: userId, email, role: role as Role, studentId };
        
        setUser(loggedUser);
        setToken(jwtToken);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        setAutoLogoutTimer(jwtToken);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (details: UserRegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register(details);
      if (response.success && response.data) {
        const { token: jwtToken, email, role, userId, studentId } = response.data;
        const loggedUser: User = { id: userId, email, role: role as Role, studentId };
        
        setUser(loggedUser);
        setToken(jwtToken);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        setAutoLogoutTimer(jwtToken);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
