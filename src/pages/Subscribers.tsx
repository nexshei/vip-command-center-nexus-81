
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Search, Mail, UserCheck, UserX } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Subscriber {
  id: string;
  email: string;
  subscribed: boolean;
  created_at: string;
}

// Mock data for subscribers
const mockSubscribers: Subscriber[] = [
  {
    id: '1',
    email: 'ambassador.johnson@embassy.com',
    subscribed: true,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    email: 'sarah.williams@megacorp.com',
    subscribed: true,
    created_at: '2024-01-16T10:00:00Z'
  },
  {
    id: '3',
    email: 'minister.chen@gov.example',
    subscribed: false,
    created_at: '2024-01-17T10:00:00Z'
  }
];

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(mockSubscribers);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { hasAccess } = useAuth();

  // Protocol admin has limited access - can only view and send pre-approved messages
  const canModifySubscriptions = hasAccess(['super_admin', 'admin']);

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubscriberAction = (subscriber: Subscriber, action: 'toggle' | 'message') => {
    if (action === 'message') {
      toast({
        title: "Send Message",
        description: `Opening communication with ${subscriber.email}`,
      });
    } else if (action === 'toggle' && canModifySubscriptions) {
      const newStatus = !subscriber.subscribed;
      setSubscribers(prev => 
        prev.map(s => 
          s.id === subscriber.id 
            ? { ...s, subscribed: newStatus }
            : s
        )
      );
      toast({
        title: "Status Updated",
        description: `${subscriber.email} is now ${newStatus ? 'subscribed' : 'unsubscribed'}`,
      });
    } else {
      toast({
        title: "Access Restricted",
        description: "You don't have permission to modify subscription status.",
        variant: "destructive"
      });
    }
  };

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
                        Joined: {new Date(subscriber.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={subscriber.subscribed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {subscriber.subscribed ? "SUBSCRIBED" : "UNSUBSCRIBED"}
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
                        className={subscriber.subscribed 
                          ? "border-red-300 text-red-600 hover:bg-red-50"
                          : "border-green-300 text-green-600 hover:bg-green-50"
                        }
                      >
                        {subscriber.subscribed ? (
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
                {searchTerm ? 'No subscribers match your search.' : 'No subscribers yet.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscribers;
