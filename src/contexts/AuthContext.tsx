import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string; role: string } | null;
  login: (email: string, passcode: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('auth_token') === 'simulated-token';
  });
  
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, passcode: string) => {
    // Simulated open backend call for development
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const userData = { 
          name: email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') || 'Admin User', 
          email: email, 
          role: 'Super Admin' 
        };
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('auth_token', 'simulated-token');
        localStorage.setItem('auth_user', JSON.stringify(userData));
        resolve();
      }, 800);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
