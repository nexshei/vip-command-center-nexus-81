
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif font-bold text-vip-black mb-6">User Profile</h1>
      <div className="vip-glass border border-vip-gold/20 rounded-lg p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-vip-gold/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-vip-gold">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-vip-black">{user?.name}</h2>
              <p className="text-sm text-vip-gold/60">{user?.email}</p>
              <p className="text-sm text-vip-gold/60 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-vip-gold/80">Full Name</label>
              <p className="text-vip-black">{user?.name}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-vip-gold/80">Email</label>
              <p className="text-vip-black">{user?.email}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-vip-gold/80">Role</label>
              <p className="text-vip-black capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-vip-gold/80">Phone</label>
              <p className="text-vip-black">+254 700 000 000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
