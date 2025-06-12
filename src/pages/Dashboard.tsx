
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardStats from '@/components/dashboard/DashboardStats';
import QuickActions from '@/components/dashboard/QuickActions';
import VipCalendar from '@/components/dashboard/VipCalendar';
import { Crown, Star } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    if (hour >= 17) greeting = 'Good evening';
    
    return `${greeting}, ${user?.name?.split(' ')[0] || 'Administrator'}`;
  };

  const getRoleTitle = () => {
    return user?.role === 'super_admin' 
      ? 'Super Administrator' 
      : 'Protocol Administrator';
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl vip-gradient p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2 animate-fade-in-up">
                {getWelcomeMessage()}
              </h1>
              <p className="text-lg opacity-90 flex items-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <Crown className="h-5 w-5 mr-2 text-vip-gold" />
                {getRoleTitle()} • Sir Ole VVIP Protocol
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-right">
                <p className="text-sm opacity-75">System Status</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">All Systems Operational</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Star className="h-8 w-8 text-vip-gold" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <QuickActions />
        </div>
        <div className="space-y-8">
          <VipCalendar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
