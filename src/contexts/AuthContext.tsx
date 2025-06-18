
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
    'superadmin@sirolevvipprotocolltd.co.ke': {
      id: '1',
      email: 'superadmin@sirolevvipprotocolltd.co.ke',
      name: 'Sir Dennis Olele',
      role: 'super_admin' as const,
      avatar: null
    },
    'subadmin@sirolevvipprotocolltd.co.ke': {
      id: '2', 
      email: 'subadmin@sirolevvipprotocolltd.co.ke',
      name: 'Sir Dennis Olele',
      role: 'protocol_admin' as const,
      avatar: null
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock users for demo
    const user = mockUsers[email as keyof typeof mockUsers];
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
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
