
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardStats from '@/components/dashboard/DashboardStats';
import QuickActions from '@/components/dashboard/QuickActions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Crown, Calendar, TrendingUp, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
    { id: 1, action: 'New VVIP booking confirmed', client: 'Embassy of Sweden', time: '2 minutes ago', type: 'booking' },
    { id: 2, action: 'Payment received', client: 'Lord Wellington', time: '15 minutes ago', type: 'payment' },
    { id: 3, action: 'Staff member checked in', client: 'Internal', time: '1 hour ago', type: 'staff' },
    { id: 4, action: 'Protocol completed', client: 'Pemberton Holdings', time: '2 hours ago', type: 'protocol' },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Diplomatic Reception",
      client: "Embassy of Sweden",
      time: "10:00 AM",
      date: "Today",
      type: "diplomatic"
    },
    {
      id: 2,
      title: "Corporate Meeting",
      client: "Pemberton Holdings",
      time: "2:30 PM", 
      date: "Today",
      type: "corporate"
    },
    {
      id: 3,
      title: "Private Consultation",
      client: "Lord Wellington",
      time: "9:00 AM",
      date: "Tomorrow",
      type: "consultation"
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'diplomatic': return 'bg-vip-gold text-black';
      case 'corporate': return 'bg-blue-500 text-white';
      case 'consultation': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        {/* Simplified Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {getWelcomeMessage()}
              </h1>
              <p className="text-gray-600 flex items-center">
                <Crown className="h-4 w-4 mr-2 text-vip-gold" />
                {getRoleTitle()} • Sir Ole VVIP Protocol
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions - Full Width on Large Screens */}
          <div className="lg:col-span-2">
            <QuickActions />
          </div>

          {/* Upcoming Events - Simplified Calendar */}
          <div>
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-vip-gold" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 p-4">
                  {upcomingEvents.slice(0, 3).map((event) => (
                    <div 
                      key={event.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate('/bookings')}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                        <p className="text-xs text-gray-500">{event.client}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{event.time}</div>
                        <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>
                          {event.date}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activities - Simplified */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-vip-gold" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'booking' ? 'bg-vip-gold' :
                      activity.type === 'payment' ? 'bg-green-500' :
                      activity.type === 'staff' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{activity.client}</span>
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
