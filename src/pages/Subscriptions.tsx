
import React, { useState } from 'react';
import { Users, Search, Mail, Check, X, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Subscriptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const { toast } = useToast();

  // Fetch subscribers from database
  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ['newsletter_subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <Badge className="bg-green-500 text-white">Active</Badge>
      : <Badge className="bg-red-500 text-white">Inactive</Badge>;
  };

  const handleApproveSubscriber = async (id: string) => {
    // In real implementation, this would update the database
    toast({
      title: "Subscriber Approved",
      description: "The subscriber has been approved successfully.",
    });
  };

  const handleRejectSubscriber = async (id: string) => {
    // In real implementation, this would update the database
    toast({
      title: "Subscriber Rejected",
      description: "The subscriber has been removed.",
      variant: "destructive",
    });
  };

  const handleSendEmailToAll = () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      });
      return;
    }

    const activeSubscribers = subscribers.filter(s => s.is_active);
    
    // In a real app, this would send actual emails
    console.log('Sending email to:', activeSubscribers.map(s => s.email));
    console.log('Subject:', emailSubject);
    console.log('Message:', emailMessage);
    
    toast({
      title: "Emails Sent",
      description: `Email sent to ${activeSubscribers.length} active subscribers.`,
    });
    
    setEmailSubject('');
    setEmailMessage('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
        <div className="text-xl text-vip-gold">Loading subscribers...</div>
      </div>
    );
  }

  const activeSubscribers = subscribers.filter(s => s.is_active);
  const inactiveSubscribers = subscribers.filter(s => !s.is_active);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-white mb-2">VIP Subscribers</h1>
            <p className="text-xl text-vip-gold">Manage your VIP subscribers and send event notifications</p>
          </div>
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-vip-gold" />
            <span className="text-2xl font-bold text-white">{subscribers.length}</span>
            <span className="text-vip-gold">Total Subscribers</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white border border-vip-gold/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-vip-black mb-2">
                {activeSubscribers.length}
              </div>
              <p className="text-vip-gold font-medium">Active Subscribers</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-vip-gold/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-vip-black mb-2">
                {inactiveSubscribers.length}
              </div>
              <p className="text-vip-gold font-medium">Inactive Subscribers</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-vip-gold/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-vip-black mb-2">
                {subscribers.length}
              </div>
              <p className="text-vip-gold font-medium">Total Subscribers</p>
            </CardContent>
          </Card>
        </div>

        {/* Email All Subscribers */}
        <Card className="bg-white border border-vip-gold/20">
          <CardHeader className="border-b border-vip-gold/10">
            <CardTitle className="text-xl font-serif text-vip-black flex items-center">
              <Mail className="h-5 w-5 mr-2 text-vip-gold" />
              Send Email to All Active Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-vip-black mb-2">
                Subject
              </label>
              <Input
                placeholder="Enter email subject..."
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-vip-black mb-2">
                Message
              </label>
              <textarea
                placeholder="Enter your message..."
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-vip-gold/30 rounded-md bg-white text-vip-black focus:border-vip-gold focus:outline-none resize-none"
              />
            </div>
            <Button 
              onClick={handleSendEmailToAll}
              className="bg-vip-gold text-black hover:bg-vip-gold/80"
              disabled={activeSubscribers.length === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Email to {activeSubscribers.length} Active Subscribers
            </Button>
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="bg-white border border-vip-gold/20">
          <CardContent className="p-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold" />
              <Input
                placeholder="Search subscribers by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
              />
            </div>
          </CardContent>
        </Card>

        {/* Subscribers Table */}
        <Card className="bg-white border border-vip-gold/20">
          <CardHeader className="border-b border-vip-gold/10">
            <CardTitle className="text-xl font-serif text-vip-black">Subscriber List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-vip-gold/10">
                  <TableHead className="text-vip-black font-semibold">Email</TableHead>
                  <TableHead className="text-vip-black font-semibold">Status</TableHead>
                  <TableHead className="text-vip-black font-semibold">Join Date</TableHead>
                  <TableHead className="text-vip-black font-semibold">Source</TableHead>
                  <TableHead className="text-vip-black font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id} className="border-b border-vip-gold/10 hover:bg-vip-gold/5">
                    <TableCell className="font-medium text-vip-black">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-vip-gold" />
                        {subscriber.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(subscriber.is_active)}
                    </TableCell>
                    <TableCell className="text-vip-black">
                      {new Date(subscriber.subscribed_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-vip-black">
                      {subscriber.source || 'website'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {!subscriber.is_active && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproveSubscriber(subscriber.id)}
                            className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Activate
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-vip-gold/30 text-vip-black hover:bg-vip-gold hover:text-black"
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Send Email
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredSubscribers.length === 0 && (
              <div className="text-center text-vip-black/60 py-8">
                {searchTerm ? 'No subscribers match your search.' : 'No subscribers found. Start building your subscriber list.'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscriptions;
