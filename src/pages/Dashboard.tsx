
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RealtimeNotifications from '@/components/dashboard/RealtimeNotifications';
import QuickActions from '@/components/dashboard/QuickActions';
import VipCalendar from '@/components/dashboard/VipCalendar';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { Database, RefreshCw, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  const {
    totalMeetingRequests,
    totalContacts,
    totalApplications,
    totalStaff,
    isLoading,
    error,
    refetch
  } = useRealtimeData();

  // Debug logging
  console.log('Dashboard - Real-time Data:', {
    totalMeetingRequests,
    totalContacts,
    totalApplications,
    totalStaff,
    isLoading,
    error
  });

  const handleRefreshData = () => {
    refetch();
    toast({
      title: "Data Refreshed",
      description: "Dashboard data has been updated with the latest information.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-vip-gold">VVIP Protocol Dashboard</h1>
            <p className="text-vip-gold/60 mt-2">Real-time overview of your business operations</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10">
              <Activity className="h-3 w-3 mr-1 animate-pulse" />
              Live Data
            </Badge>
            <Button
              onClick={handleRefreshData}
              variant="outline"
              size="sm"
              className="text-vip-gold border-vip-gold/30 hover:bg-vip-gold/10"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Database Connection Status */}
        <Card className="bg-black border-vip-gold/30 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-vip-gold flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Database Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{error ? '❌' : '✅'}</div>
                <p className="text-xs text-vip-gold/60">Connection</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-vip-gold">{totalMeetingRequests}</div>
                <p className="text-xs text-vip-gold/60">Meeting Requests</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-vip-gold">{totalContacts}</div>
                <p className="text-xs text-vip-gold/60">Contact Messages</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-vip-gold">{totalApplications}</div>
                <p className="text-xs text-vip-gold/60">Applications</p>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">
                  Database connection error. Please refresh or check your connection.
                </p>
              </div>
            )}
            {!error && (
              <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm">
                  ✅ Successfully connected to database. Real-time updates are active.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Statistics */}
          <div className="lg:col-span-2">
            <DashboardStats />
          </div>
          
          {/* Real-time Notifications */}
          <div>
            <RealtimeNotifications />
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Actions */}
          <QuickActions />
          
          {/* Calendar */}
          <VipCalendar />
        </div>

        {/* Debug Information */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-400">Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Loading State: {isLoading ? 'Loading...' : 'Complete'}</div>
              <div>Data Last Updated: {new Date().toLocaleTimeString()}</div>
              <div>Real-time Updates: Active</div>
              <div>Database Status: {error ? 'Error' : 'Connected'}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
