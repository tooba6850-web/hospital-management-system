import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, RoleName } from '../types';
import { INITIAL_USERS } from '../data/initialData';
import { hasPermission, type Permission } from '../services/rbacService';

interface AuthContextType {
  currentUser: User | null;
  user: User | null;
  currentRole: RoleName;
  login: (email: string, role?: RoleName) => boolean;
  logout: () => void;
  switchRole: (role: RoleName) => void;
  can: (permission: Permission) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hms_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hms_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hms_current_user');
    }
  }, [currentUser]);

  const login = (email: string, requestedRole?: RoleName): boolean => {
    const found = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      const userToSet = requestedRole ? { ...found, role: requestedRole } : found;
      setCurrentUser(userToSet);
      return true;
    }
    const demoUser: User = {
      id: `USR-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: requestedRole || 'Doctor',
      status: 'active'
    };
    setCurrentUser(demoUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: RoleName) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    }
  };

  const can = (permission: Permission): boolean => {
    if (!currentUser) return false;
    return hasPermission(currentUser.role, permission);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser,
        currentRole: currentUser?.role || 'Doctor',
        login,
        logout,
        switchRole,
        can,
        isAuthenticated: !!currentUser,
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
