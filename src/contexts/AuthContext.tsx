
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'super_admin' | 'protocol_admin' | 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  hasAccess: (requiredRole: string | string[]) => boolean;
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
    'senioradmin@sirolevvipprotocolltd.co.ke': {
      id: '1',
      email: 'senioradmin@sirolevvipprotocolltd.co.ke',
      name: 'Super Admin',
      avatar: null,
      role: 'super_admin'
    },
    'subadmin@sirolevvipprotocolltd.co.ke': {
      id: '2', 
      email: 'subadmin@sirolevvipprotocolltd.co.ke',
      name: 'Protocol Admin',
      avatar: null,
      role: 'protocol_admin'
    },
    'admin@sirole.com': {
      id: '3',
      email: 'admin@sirole.com',
      name: 'Sir Dennis Olele',
      avatar: null,
      role: 'admin'
    },
    'user@sirole.com': {
      id: '4',
      email: 'user@sirole.com',
      name: 'VVIP User',
      avatar: null,
      role: 'user'
    }
  };

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('vip_admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const hasAccess = (requiredRole: string | string[]) => {
    if (!user) return false;
    
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(user.role);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check mock users with correct password
    const user = mockUsers[email];
    if (!user || password !== 'Olele@2025') {
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
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
};
