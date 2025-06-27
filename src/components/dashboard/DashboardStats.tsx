
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, TrendingUp, Clock } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useMeetingRequests } from '@/hooks/useMeetingRequests';
import { useApplications } from '@/hooks/useApplications';
import { useContactSubmissions } from '@/hooks/useContactSubmissions';
import { supabase } from '@/integrations/supabase/client';

const DashboardStats = () => {
  const { data: clients = [] } = useClients();
  const { data: meetingRequests = [] } = useMeetingRequests();
  const { data: applications = [] } = useApplications();
  const { data: contactSubmissions = [] } = useContactSubmissions();
  
  const [realTimeStats, setRealTimeStats] = useState({
    todaysBookings: 0,
    thisWeeksBookings: 0,
    pendingApplications: 0,
    newMessagesToday: 0
  });

  // Calculate real-time stats from actual data
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

      // Calculate pending applications
      const pendingApplications = applications.filter(app => 
        app.status === 'pending'
      ).length;

      // Calculate today's new messages
      const newMessagesToday = contactSubmissions.filter(message => {
        const messageDate = new Date(message.created_at).toISOString().split('T')[0];
        return messageDate === today;
      }).length;

      setRealTimeStats({
        todaysBookings,
        thisWeeksBookings,
        pendingApplications,
        newMessagesToday
      });
    };

    calculateStats();
  }, [meetingRequests, applications, contactSubmissions]);

  // Set up real-time subscriptions for stats updates
  useEffect(() => {
    console.log('Setting up dashboard stats real-time subscriptions...');
    
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
          console.log('Meeting requests updated - refreshing dashboard stats');
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
          console.log('Clients updated - refreshing dashboard stats');
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
          console.log('Applications updated - refreshing dashboard stats');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_submissions'
        },
        () => {
          console.log('Contact submissions updated - refreshing dashboard stats');
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up dashboard stats subscriptions...');
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
            {realTimeStats.todaysBookings === 0 ? 'No bookings today' : `${realTimeStats.todaysBookings} active request${realTimeStats.todaysBookings !== 1 ? 's' : ''}`}
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
            Pending Applications
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-vip-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-vip-gold">{realTimeStats.pendingApplications}</div>
          <p className="text-xs text-vip-gold/60">
            {realTimeStats.pendingApplications === 0 ? 'All processed' : 'Awaiting review'}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-black border-vip-gold/30 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-vip-gold/80">
            New Messages Today
          </CardTitle>
          <Clock className="h-4 w-4 text-vip-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-vip-gold">{realTimeStats.newMessagesToday}</div>
          <p className="text-xs text-vip-gold/60">
            {realTimeStats.newMessagesToday === 0 ? 'No new messages' : 'Today\'s inquiries'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
