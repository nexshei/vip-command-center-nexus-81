
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  
  // Mock data for recent activity
  const [recentBookings] = useState([
    {
      id: '1',
      client_name: 'Ambassador Johnson',
      service_type: 'Diplomatic Meeting',
      status: 'confirmed',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
    },
    {
      id: '2',
      client_name: 'Minister Chen',
      service_type: 'State Reception',
      status: 'pending',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    }
  ]);

  const [recentContacts] = useState([
    {
      id: '1',
      name: 'Sarah Williams',
      subject: 'VIP Transport Request',
      created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString() // 45 minutes ago
    }
  ]);

  const [recentQuotes] = useState([
    {
      id: '1',
      requester_name: 'Embassy of France',
      requested_service: 'Corporate Event',
      amount: 150000,
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
    }
  ]);

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
            Demo Mode
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

        {/* Quick action to view all */}
        <div className="pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-vip-gold border-vip-gold/30 hover:bg-vip-gold/10"
            onClick={() => toast({ title: "Demo Mode", description: "This is demo data for display purposes." })}
          >
            <Eye className="h-3 w-3 mr-1" />
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeNotifications;
