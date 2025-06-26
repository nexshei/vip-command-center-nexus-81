
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'Senior Admin' | 'Sub Admin' | 'User';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock users with roles
  const mockUsers: Record<string, User> = {
    'super@sirole.com': {
      id: '1',
      email: 'super@sirole.com',
      name: 'Super Admin',
      role: 'Senior Admin',
      avatar: null
    },
    'protocol@sirole.com': {
      id: '2', 
      email: 'protocol@sirole.com',
      name: 'Protocol Admin',
      role: 'Sub Admin',
      avatar: null
    },
    'admin@sirole.com': {
      id: '3',
      email: 'admin@sirole.com',
      name: 'Sir Dennis Olele',
      role: 'Senior Admin',
      avatar: null
    },
    'user@sirole.com': {
      id: '4',
      email: 'user@sirole.com',
      name: 'VVIP User',
      role: 'User',
      avatar: null
    }
  };

  // Permission mapping for different roles
  const rolePermissions: Record<UserRole, string[]> = {
    'Senior Admin': [
      'dashboard', 'create-booking', 'bookings', 'list-bookings', 'generate-quote',
      'clients', 'contact-messages', 'inventory', 'careers', 'gallery', 'staff',
      'email', 'subscribers', 'settings'
    ],
    'Sub Admin': [
      'dashboard', 'create-booking', 'bookings', 'list-bookings', 'generate-quote',
      'clients:limited', 'contact-messages', 'inventory:limited', 'careers:limited',
      'subscribers:limited'
    ],
    'User': [
      'dashboard', 'create-booking', 'bookings', 'generate-quote'
    ]
  };

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('vip_admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const userPermissions = rolePermissions[user.role] || [];
    
    // Check for exact permission or base permission (without :limited suffix)
    return userPermissions.includes(permission) || 
           userPermissions.includes(permission.split(':')[0]);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check mock users with correct password
    const user = mockUsers[email];
    if (!user || password !== 'vip123') {
      throw new Error('Invalid credentials');
    }

    setUser(user);
    localStorage.setItem('vip_admin_user', JSON.stringify(user));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vip_admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
