
import React from 'react';
import DashboardStats from '@/components/dashboard/DashboardStats';
import QuickActions from '@/components/dashboard/QuickActions';
import VipCalendar from '@/components/dashboard/VipCalendar';
import RealtimeNotifications from '@/components/dashboard/RealtimeNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Activity, Zap } from 'lucide-react';

const Dashboard = () => {
  const { user, hasAccess } = useAuth();
  const { stats, refreshStats } = useRealtimeData();

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

      {/* Real-time Database Status */}
      <div className="mb-6">
        <Card className="bg-black border-vip-gold/30 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-vip-gold flex items-center">
              <Database className="h-5 w-5 mr-2 text-vip-gold" />
              Real-time Database Status
              <Activity className="h-4 w-4 ml-2 text-green-500 animate-pulse" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-vip-gold">{stats.totalClients}</div>
                <div className="text-vip-gold/60">Clients</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-vip-gold">{stats.totalMeetingRequests}</div>
                <div className="text-vip-gold/60">Meeting Requests</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-vip-gold">{stats.totalContactSubmissions}</div>
                <div className="text-vip-gold/60">Contact Messages</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-vip-gold">{stats.totalApplications}</div>
                <div className="text-vip-gold/60">Applications</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-vip-gold">{stats.totalStaff}</div>
                <div className="text-vip-gold/60">Staff Members</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-vip-gold">{stats.totalInventoryItems}</div>
                <div className="text-vip-gold/60">Inventory Items</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-vip-gold">{stats.totalJobPostings}</div>
                <div className="text-vip-gold/60">Job Postings</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-vip-gold">{stats.totalSubscribers}</div>
                <div className="text-vip-gold/60">Subscribers</div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-vip-gold/30">
              <div className="flex items-center justify-between text-xs text-vip-gold/60">
                <span>Last updated: {stats.lastUpdated.toLocaleTimeString()}</span>
                <div className="flex items-center">
                  <Zap className="h-3 w-3 mr-1 text-green-500" />
                  Real-time Active
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
