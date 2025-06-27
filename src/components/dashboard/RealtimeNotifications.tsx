
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Bell, 
  Calendar, 
  MessageSquare, 
  FileText,
  Eye,
  Clock,
  Activity
} from 'lucide-react';

interface RecentActivity {
  bookings: any[];
  contacts: any[];
  applications: any[];
}

const RealtimeNotifications = () => {
  const { toast } = useToast();
  const [recentActivity, setRecentActivity] = useState<RecentActivity>({
    bookings: [],
    contacts: [],
    applications: []
  });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch recent data from database
  const fetchRecentData = async () => {
    try {
      console.log('Fetching recent activity data...');
      
      // Fetch recent meeting requests (last 24 hours)
      const { data: bookings } = await supabase
        .from('meeting_requests')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent contact submissions (last 24 hours)
      const { data: contacts } = await supabase
        .from('contact_submissions')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent career applications (last 24 hours)
      const { data: applications } = await supabase
        .from('career_applications')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentActivity({
        bookings: bookings || [],
        contacts: contacts || [],
        applications: applications || []
      });
      setLastUpdate(new Date());
      setIsLoading(false);
      
      console.log('Recent activity data fetched:', {
        bookings: bookings?.length || 0,
        contacts: contacts?.length || 0,
        applications: applications?.length || 0
      });
    } catch (error) {
      console.error('Error fetching recent data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchRecentData();

    // Set up real-time subscriptions
    console.log('Setting up real-time activity subscriptions...');
    
    const meetingChannel = supabase
      .channel('meeting-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meeting_requests'
        },
        (payload) => {
          console.log('Meeting request change:', payload);
          fetchRecentData();
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Meeting Request",
              description: `New meeting request from ${payload.new?.full_name || 'Unknown'}`
            });
          }
        }
      )
      .subscribe();

    const contactChannel = supabase
      .channel('contact-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_submissions'
        },
        (payload) => {
          console.log('Contact submission change:', payload);
          fetchRecentData();
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Contact Message",
              description: `New message from ${payload.new?.full_name || 'Unknown'}`
            });
          }
        }
      )
      .subscribe();

    const applicationChannel = supabase
      .channel('application-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'career_applications'
        },
        (payload) => {
          console.log('Career application change:', payload);
          fetchRecentData();
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Application",
              description: `New application from ${payload.new?.full_name || 'Unknown'}`
            });
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time activity subscriptions...');
      supabase.removeChannel(meetingChannel);
      supabase.removeChannel(contactChannel);
      supabase.removeChannel(applicationChannel);
    };
  }, [toast]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'approved':
      case 'completed':
        return 'bg-green-500 text-white';
      case 'reviewing':
      case 'in_progress':
        return 'bg-blue-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-black border-vip-gold/30 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-vip-gold flex items-center">
            <Bell className="h-5 w-5 mr-2 text-vip-gold animate-pulse" />
            Loading Activity...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Activity className="h-6 w-6 text-vip-gold animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black border-vip-gold/30 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-vip-gold flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-vip-gold" />
            Real-time Activity
          </div>
          <Badge variant="outline" className="text-xs text-green-500 border-green-500/30 bg-green-500/10">
            <Activity className="h-3 w-3 mr-1 animate-pulse" />
            Live
          </Badge>
        </CardTitle>
        <p className="text-xs text-vip-gold/60">
          Last updated: {formatTime(lastUpdate.toISOString())}
        </p>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {/* Recent Bookings */}
        {recentActivity.bookings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-vip-gold/80 flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-vip-gold" />
              Recent Meeting Requests ({recentActivity.bookings.length})
            </h4>
            {recentActivity.bookings.map((booking: any) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-500/30 hover:bg-green-900/30 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-vip-gold">{booking.full_name}</p>
                  <p className="text-xs text-vip-gold/60">{booking.event_type || 'General Meeting'}</p>
                  {booking.event_date && (
                    <p className="text-xs text-vip-gold/50">Scheduled: {new Date(booking.event_date).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(booking.status)} size="sm">
                    {booking.status?.toUpperCase() || 'PENDING'}
                  </Badge>
                  <p className="text-xs text-vip-gold/60 mt-1">{formatTime(booking.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Contact Messages */}
        {recentActivity.contacts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-vip-gold/80 flex items-center">
              <MessageSquare className="h-4 w-4 mr-1 text-vip-gold" />
              Recent Messages ({recentActivity.contacts.length})
            </h4>
            {recentActivity.contacts.map((contact: any) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-500/30 hover:bg-blue-900/30 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-vip-gold">{contact.full_name}</p>
                  <p className="text-xs text-vip-gold/60">{contact.subject || 'General Inquiry'}</p>
                  <p className="text-xs text-vip-gold/50 truncate max-w-48">{contact.message?.substring(0, 50)}...</p>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(contact.status)} size="sm">
                    {contact.status?.toUpperCase() || 'PENDING'}
                  </Badge>
                  <p className="text-xs text-vip-gold/60 mt-1">{formatTime(contact.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Applications */}
        {recentActivity.applications.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-vip-gold/80 flex items-center">
              <FileText className="h-4 w-4 mr-1 text-vip-gold" />
              Recent Applications ({recentActivity.applications.length})
            </h4>
            {recentActivity.applications.map((application: any) => (
              <div key={application.id} className="flex items-center justify-between p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30 hover:bg-yellow-900/30 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-vip-gold">{application.full_name}</p>
                  <p className="text-xs text-vip-gold/60">{application.position || 'Position Applied'}</p>
                  <p className="text-xs text-vip-gold/50">{application.email}</p>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(application.status)} size="sm">
                    {application.status?.toUpperCase() || 'PENDING'}
                  </Badge>
                  <p className="text-xs text-vip-gold/60 mt-1">{formatTime(application.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No recent activity message */}
        {recentActivity.bookings.length === 0 && 
         recentActivity.contacts.length === 0 && 
         recentActivity.applications.length === 0 && (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-vip-gold/40 mx-auto mb-3" />
            <p className="text-sm text-vip-gold/60 mb-1">No recent activity in the last 24 hours</p>
            <p className="text-xs text-vip-gold/40">Real-time updates are active and monitoring</p>
          </div>
        )}

        {/* Refresh button */}
        <div className="pt-4 border-t border-vip-gold/30">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-vip-gold border-vip-gold/30 hover:bg-vip-gold/10"
            onClick={() => {
              setIsLoading(true);
              fetchRecentData();
              toast({ title: "Refreshed", description: "Activity data has been refreshed" });
            }}
            disabled={isLoading}
          >
            <Eye className="h-3 w-3 mr-1" />
            {isLoading ? 'Refreshing...' : 'Refresh Activity'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeNotifications;
