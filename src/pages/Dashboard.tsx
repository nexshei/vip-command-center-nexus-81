
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RealtimeNotifications from '@/components/dashboard/RealtimeNotifications';
import QuickActions from '@/components/dashboard/QuickActions';
import VipCalendar from '@/components/dashboard/VipCalendar';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { RefreshCw, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  const { stats, refreshStats } = useRealtimeData();

  const handleRefreshData = () => {
    refreshStats();
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
            <h1 className="text-3xl font-serif font-bold text-white">VVIP Protocol Dashboard</h1>
            <p className="text-white/80 mt-2">Real-time overview of your business operations</p>
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
              className="text-white border-white/30 hover:bg-white/10 hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="text-white font-medium">Refresh</span>
            </Button>
          </div>
        </div>

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

        {/* System Status */}
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-white">
              <div>
                <div className="font-medium text-white/90">Database</div>
                <div className="text-green-400">✅ Connected</div>
              </div>
              <div>
                <div className="font-medium text-white/90">Real-time</div>
                <div className="text-green-400">✅ Active</div>
              </div>
              <div>
                <div className="font-medium text-white/90">Last Update</div>
                <div className="text-white/80">{new Date().toLocaleTimeString()}</div>
              </div>
              <div>
                <div className="font-medium text-white/90">Records</div>
                <div className="text-white/80">{(stats?.totalClients || 0) + (stats?.totalContactSubmissions || 0) + (stats?.totalMeetingRequests || 0) + (stats?.totalApplications || 0)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
