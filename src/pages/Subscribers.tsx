
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Search, Mail, UserCheck, UserX } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Subscribers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { hasAccess } = useAuth();

  // Fetch subscribers from database
  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ['subscribers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Protocol admin has limited access - can only view and send pre-approved messages
  const canModifySubscriptions = hasAccess(['super_admin', 'admin']);

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubscriberAction = async (subscriber: any, action: 'toggle' | 'message') => {
    if (action === 'message') {
      toast({
        title: "Send Message",
        description: `Opening communication with ${subscriber.email}`,
      });
    } else if (action === 'toggle' && canModifySubscriptions) {
      // In real implementation, this would update the database
      toast({
        title: "Status Updated",
        description: `${subscriber.email} subscription status updated`,
      });
    } else {
      toast({
        title: "Access Restricted",
        description: "You don't have permission to modify subscription status.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-xl text-vip-gold">Loading subscribers...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">
            VVIP Subscribers
          </h1>
          <p className="text-vip-gold/80 mt-2">
            {canModifySubscriptions ? 
              'Manage your VVIP subscriber database' : 
              'View VVIP subscribers and send communications'
            }
          </p>
        </div>
      </div>
      
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="text-vip-gold">Subscribers List</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/50" />
            <Input
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-vip-gold/30"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSubscribers.map((subscriber) => (
              <div key={subscriber.id} className="flex items-center justify-between p-4 border border-vip-gold/20 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-vip-gold/20 rounded-full flex items-center justify-center">
                      <Mail className="h-4 w-4 text-vip-gold" />
                    </div>
                    <div>
                      <p className="font-medium text-vip-black">{subscriber.email}</p>
                      <p className="text-sm text-vip-gold/60">
                        Joined: {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={subscriber.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {subscriber.is_active ? "SUBSCRIBED" : "UNSUBSCRIBED"}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSubscriberAction(subscriber, 'message')}
                      className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                    {canModifySubscriptions && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSubscriberAction(subscriber, 'toggle')}
                        className={subscriber.is_active 
                          ? "border-red-300 text-red-600 hover:bg-red-50"
                          : "border-green-300 text-green-600 hover:bg-green-50"
                        }
                      >
                        {subscriber.is_active ? (
                          <>
                            <UserX className="h-3 w-3 mr-1" />
                            Unsubscribe
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-3 w-3 mr-1" />
                            Subscribe
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredSubscribers.length === 0 && (
              <div className="text-center text-vip-gold/60 py-8">
                {searchTerm ? 'No subscribers match your search.' : 'No subscribers found. Start building your VVIP subscriber list.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscribers;
