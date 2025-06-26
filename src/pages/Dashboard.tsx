
import React from 'react';
import DashboardStats from '@/components/dashboard/DashboardStats';
import QuickActions from '@/components/dashboard/QuickActions';
import VipCalendar from '@/components/dashboard/VipCalendar';
import RealtimeNotifications from '@/components/dashboard/RealtimeNotifications';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user, hasAccess } = useAuth();

  return (
    <div className="p-6 max-w-7xl mx-auto bg-black min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-vip-gold">
          Welcome back, {user?.name || 'VVIP User'}
        </h1>
        <p className="text-vip-gold/70 mt-1">
          Your VVIP Protocol Dashboard - {user?.role === 'protocol_admin' ? 'Protocol Operations View' : 'Live data updates automatically'}
        </p>
        {user?.role === 'protocol_admin' && (
          <div className="mt-2 p-3 bg-vip-gold/10 border border-vip-gold/30 rounded-lg">
            <p className="text-sm text-vip-gold/80">
              <strong>Protocol Admin Access:</strong> You have operational access with restricted administrative functions for enhanced security.
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {/* Stats Overview - Hide sensitive metrics for protocol admin */}
        {hasAccess(['super_admin', 'admin']) && <DashboardStats />}

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Quick Actions & Calendar */}
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            <VipCalendar />
          </div>

          {/* Right Column - Real-time Activity */}
          <div className="space-y-6">
            <RealtimeNotifications />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
