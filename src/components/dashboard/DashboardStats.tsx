
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useMeetingRequests } from '@/hooks/useMeetingRequests';
import { useSubscribers } from '@/hooks/useSubscribers';
import { useApplications } from '@/hooks/useApplications';

const DashboardStats = () => {
  const { data: clients = [] } = useClients();
  const { data: meetingRequests = [] } = useMeetingRequests();
  const { data: subscribers = [] } = useSubscribers();
  const { data: applications = [] } = useApplications();

  // Calculate today's bookings
  const today = new Date().toISOString().split('T')[0];
  const todaysBookings = meetingRequests.filter(request => 
    request.event_date === today
  ).length;

  // Calculate this week's bookings
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const thisWeeksBookings = meetingRequests.filter(request => {
    if (!request.event_date) return false;
    const eventDate = new Date(request.event_date);
    return eventDate >= weekStart && eventDate <= weekEnd;
  }).length;

  // Active subscribers
  const activeSubscribers = subscribers.filter(sub => sub.is_active).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-black border-vip-gold/30 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-vip-gold/80">
            Today's Bookings
          </CardTitle>
          <Calendar className="h-4 w-4 text-vip-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-vip-gold">{todaysBookings}</div>
          <p className="text-xs text-vip-gold/60">
            Active requests
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-black border-vip-gold/30 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-vip-gold/80">
            This Week
          </CardTitle>
          <Calendar className="h-4 w-4 text-vip-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-vip-gold">{thisWeeksBookings}</div>
          <p className="text-xs text-vip-gold/60">
            Weekly bookings
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-black border-vip-gold/30 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-vip-gold/80">
            VVIP Clients
          </CardTitle>
          <Users className="h-4 w-4 text-vip-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-vip-gold">{clients.length}</div>
          <p className="text-xs text-vip-gold/60">
            Total clients
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-black border-vip-gold/30 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-vip-gold/80">
            Applications
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-vip-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-vip-gold">{applications.length}</div>
          <p className="text-xs text-vip-gold/60">
            Career applications
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
