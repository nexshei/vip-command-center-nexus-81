
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  permission, 
  fallback 
}) => {
  const { hasPermission, user } = useAuth();

  if (!hasPermission(permission)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-white border border-vip-gold/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl text-vip-black">Access Restricted</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-vip-black/70">
              You don't have permission to access this section.
            </p>
            <div className="bg-vip-gold/10 p-3 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-vip-gold" />
                <span className="text-vip-black">
                  Current Role: <strong>{user?.role || 'Unknown'}</strong>
                </span>
              </div>
            </div>
            <p className="text-xs text-vip-black/60">
              Contact your administrator if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
