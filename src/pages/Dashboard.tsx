
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardStats from '@/components/dashboard/DashboardStats';
import QuickActions from '@/components/dashboard/QuickActions';
import VipCalendar from '@/components/dashboard/VipCalendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Crown, Star, TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  const recentActivities = [
    { id: 1, action: 'New VIP booking confirmed', client: 'Embassy of Sweden', time: '2 minutes ago', type: 'booking' },
    { id: 2, action: 'Payment received', client: 'Lord Wellington', time: '15 minutes ago', type: 'payment' },
    { id: 3, action: 'Staff member checked in', client: 'Internal', time: '1 hour ago', type: 'staff' },
    { id: 4, action: 'Protocol completed', client: 'Pemberton Holdings', time: '2 hours ago', type: 'protocol' },
    { id: 5, action: 'New client registered', client: 'Royal Diplomatic Corp', time: '3 hours ago', type: 'client' },
  ];

  const upcomingTasks = [
    { id: 1, task: 'Prepare diplomatic reception setup', deadline: 'Today 2:00 PM', priority: 'high' },
    { id: 2, task: 'Review quarterly financial reports', deadline: 'Tomorrow', priority: 'medium' },
    { id: 3, task: 'Conduct staff training session', deadline: 'Friday', priority: 'low' },
    { id: 4, task: 'Update client database', deadline: 'Next Week', priority: 'medium' },
  ];

  return (
    <div className="min-h-screen bg-vip-professional-gradient">
      <ScrollArea className="h-screen">
        <div className="space-y-6 p-6 max-w-7xl mx-auto smooth-scroll">
          {/* Professional Welcome Header */}
          <div className="relative overflow-hidden rounded-2xl vip-gradient p-8 text-white animate-fade-in-up">
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-serif font-bold mb-3 text-white">
                    {getWelcomeMessage()}
                  </h1>
                  <p className="text-xl text-vip-gold flex items-center font-medium">
                    <Crown className="h-6 w-6 mr-2 text-vip-gold animate-professional-pulse" />
                    {getRoleTitle()} • Sir Ole VVIP Protocol
                  </p>
                  <p className="text-sm text-white/80 mt-2">
                    Professional protocol management at your fingertips
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm text-white/70 mb-1">System Status</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-vip-gold rounded-full animate-professional-pulse"></div>
                      <span className="text-sm font-medium text-white">All Systems Operational</span>
                    </div>
                  </div>
                  <div className="w-20 h-20 rounded-full bg-vip-gold/20 backdrop-blur-sm flex items-center justify-center border-2 border-vip-gold">
                    <Star className="h-10 w-10 text-vip-gold" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <DashboardStats />
          </div>

          {/* Main Content Grid with Enhanced Scrolling */}
          <div className="grid gap-6 lg:grid-cols-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Left Column - Main Actions */}
            <div className="lg:col-span-8 space-y-6">
              <QuickActions />
              
              {/* Recent Activities with Scrolling */}
              <Card className="professional-card">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-xl font-serif text-vip-black flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-vip-gold" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-80 scroll-container">
                    <div className="p-4 space-y-3">
                      {recentActivities.map((activity, index) => (
                        <div 
                          key={activity.id}
                          className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-vip-off-white transition-all duration-200 vip-hover-lift"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-3 h-3 rounded-full ${
                              activity.type === 'booking' ? 'bg-vip-gold' :
                              activity.type === 'payment' ? 'bg-green-500' :
                              activity.type === 'staff' ? 'bg-blue-500' :
                              activity.type === 'protocol' ? 'bg-purple-500' :
                              'bg-gray-500'
                            }`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-vip-black">{activity.action}</p>
                            <p className="text-xs text-gray-600">{activity.client}</p>
                            <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Calendar and Tasks */}
            <div className="lg:col-span-4 space-y-6">
              <VipCalendar />
              
              {/* Upcoming Tasks with Scrolling */}
              <Card className="professional-card">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-serif text-vip-black flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-vip-gold" />
                    Upcoming Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-64 scroll-container">
                    <div className="p-4 space-y-3">
                      {upcomingTasks.map((task, index) => (
                        <div 
                          key={task.id}
                          className="p-3 rounded-lg border border-gray-100 hover:bg-vip-off-white transition-all duration-200"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-medium text-vip-black">{task.task}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              task.priority === 'high' ? 'bg-red-100 text-red-700' :
                              task.priority === 'medium' ? 'bg-vip-gold/20 text-vip-gold' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{task.deadline}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Dashboard;
