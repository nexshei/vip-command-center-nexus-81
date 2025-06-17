
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRealtimeQuery } from '@/hooks/useRealtimeQuery';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Calendar, 
  MessageSquare, 
  Users, 
  FileText,
  Eye,
  Clock
} from 'lucide-react';

const RealtimeNotifications = () => {
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  // Monitor all real-time data
  const { data: bookings } = useRealtimeQuery("bookings", { orderBy: "created_at" });
  const { data: contacts } = useRealtimeQuery("contact_submissions", { orderBy: "created_at" });
  const { data: quotes } = useRealtimeQuery("quotes", { orderBy: "created_at" });

  // Get recent items (last 24 hours)
  const getRecentItems = (items: any[], hours = 24) => {
    if (!items) return [];
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);
    
    return items.filter(item => 
      new Date(item.created_at) > cutoff
    ).slice(0, 5); // Show max 5 recent items
  };

  const recentBookings = getRecentItems(bookings);
  const recentContacts = getRecentItems(contacts);
  const recentQuotes = getRecentItems(quotes);

  // Show toast notification for new items
  useEffect(() => {
    if (recentBookings.length > 0) {
      const newest = recentBookings[0];
      const createdTime = new Date(newest.created_at);
      if (createdTime > lastUpdate) {
        toast({
          title: "New Booking Received!",
          description: `${newest.client_name} - ${newest.service_type}`,
        });
      }
    }
  }, [recentBookings]);

  useEffect(() => {
    if (recentContacts.length > 0) {
      const newest = recentContacts[0];
      const createdTime = new Date(newest.created_at);
      if (createdTime > lastUpdate) {
        toast({
          title: "New Contact Message",
          description: `From ${newest.name}: ${newest.subject}`,
        });
      }
    }
  }, [recentContacts]);

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

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-vip-gold" />
            Recent Activity
          </div>
          <Badge variant="outline" className="text-xs">
            Live Updates
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-vip-gold" />
              New Bookings
            </h4>
            {recentBookings.map((booking: any) => (
              <div key={booking.id} className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{booking.client_name}</p>
                  <p className="text-xs text-gray-600">{booking.service_type}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-500 text-white text-xs">
                    {booking.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(booking.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Contact Messages */}
        {recentContacts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <MessageSquare className="h-4 w-4 mr-1 text-vip-gold" />
              New Messages
            </h4>
            {recentContacts.map((contact: any) => (
              <div key={contact.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                  <p className="text-xs text-gray-600">{contact.subject}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(contact.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Quotes */}
        {recentQuotes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <FileText className="h-4 w-4 mr-1 text-vip-gold" />
              New Quote Requests
            </h4>
            {recentQuotes.map((quote: any) => (
              <div key={quote.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{quote.requester_name}</p>
                  <p className="text-xs text-gray-600">{quote.requested_service}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-yellow-500 text-white text-xs">
                    KSH {quote.amount?.toLocaleString()}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(quote.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No recent activity */}
        {recentBookings.length === 0 && recentContacts.length === 0 && recentQuotes.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No recent activity</p>
            <p className="text-xs">New bookings and messages will appear here</p>
          </div>
        )}

        {/* Quick action to view all */}
        {(recentBookings.length > 0 || recentContacts.length > 0 || recentQuotes.length > 0) && (
          <div className="pt-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-vip-gold border-vip-gold/30 hover:bg-vip-gold/10"
            >
              <Eye className="h-3 w-3 mr-1" />
              View All Activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealtimeNotifications;
