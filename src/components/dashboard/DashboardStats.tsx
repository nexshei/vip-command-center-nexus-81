
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useMeetingRequests } from '@/hooks/useMeetingRequests';
import { useSubscribers } from '@/hooks/useSubscribers';
import { useApplications } from '@/hooks/useApplications';
import { supabase } from '@/integrations/supabase/client';

const DashboardStats = () => {
  const { data: clients = [] } = useClients();
  const { data: meetingRequests = [] } = useMeetingRequests();
  const { data: subscribers = [] } = useSubscribers();
  const { data: applications = [] } = useApplications();
  const [realTimeStats, setRealTimeStats] = useState({
    todaysBookings: 0,
    thisWeeksBookings: 0,
    activeSubscribers: 0
  });

  // Calculate stats in real-time
  useEffect(() => {
    const calculateStats = () => {
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

      setRealTimeStats({
        todaysBookings,
        thisWeeksBookings,
        activeSubscribers
      });
    };

    calculateStats();
  }, [meetingRequests, subscribers]);

  // Set up real-time subscriptions for stats updates
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-stats-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meeting_requests'
        },
        () => {
          console.log('Meeting requests updated - refreshing stats');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'newsletter_subscriptions'
        },
        () => {
          console.log('Subscriptions updated - refreshing stats');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients'
        },
        () => {
          console.log('Clients updated - refreshing stats');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'career_applications'
        },
        () => {
          console.log('Applications updated - refreshing stats');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
          <div className="text-2xl font-bold text-vip-gold">{realTimeStats.todaysBookings}</div>
          <p className="text-xs text-vip-gold/60">
            {realTimeStats.todaysBookings === 0 ? 'No bookings today' : 'Active requests'}
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
          <div className="text-2xl font-bold text-vip-gold">{realTimeStats.thisWeeksBookings}</div>
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
            {clients.length === 0 ? 'No clients yet' : 'Total clients'}
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
            {applications.length === 0 ? 'No applications yet' : 'Career applications'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
