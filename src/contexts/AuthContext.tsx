
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'super_admin' | 'protocol_admin';

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
  canAccess: (page: string) => boolean;
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

  // Mock users for demo
  const mockUsers = {
    'super@sirole.com': {
      id: '1',
      email: 'super@sirole.com',
      name: 'Sir Dennis Olele',
      role: 'super_admin' as const,
      avatar: null
    },
    'protocol@sirole.com': {
      id: '2', 
      email: 'protocol@sirole.com',
      name: 'Protocol Officer',
      role: 'protocol_admin' as const,
      avatar: null
    }
  };

  // Define permissions for each role
  const rolePermissions = {
    super_admin: ['*'], // All permissions
    protocol_admin: [
      'view_dashboard',
      'view_bookings',
      'create_booking',
      'edit_booking',
      'view_clients',
      'edit_client',
      'view_inventory_limited',
      'edit_inventory_limited',
      'view_careers',
      'edit_careers_limited',
      'view_subscribers',
      'limited_subscriber_actions',
      'view_analytics'
    ]
  };

  // Define page access restrictions
  const pageAccess = {
    super_admin: ['*'], // All pages
    protocol_admin: [
      'dashboard',
      'bookings',
      'list-bookings',
      'create-booking',
      'clients',
      'inventory',
      'careers',
      'subscribers',
      'analytics',
      'generate-quote'
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
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  const canAccess = (page: string): boolean => {
    if (!user) return false;
    const userPages = pageAccess[user.role] || [];
    return userPages.includes('*') || userPages.includes(page);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock users for demo
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
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
};
