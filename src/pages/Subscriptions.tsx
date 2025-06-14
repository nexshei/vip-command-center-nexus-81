
import React, { useState } from 'react';
import { Users, Search, Mail, Check, X, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

// Mock data for VIP subscribers
const mockSubscribers = [
  {
    id: 1,
    email: "john.doe@email.com",
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    email: "jane.smith@email.com",
    status: "Active",
    joinDate: "2024-02-20",
  },
  {
    id: 3,
    email: "michael.j@email.com",
    status: "Active",
    joinDate: "2024-03-10",
  },
  {
    id: 4,
    email: "sarah.wilson@email.com",
    status: "Pending",
    joinDate: "2024-05-25",
  },
  {
    id: 5,
    email: "david.brown@email.com",
    status: "Pending",
    joinDate: "2023-12-01",
  }
];

const Subscriptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subscribers, setSubscribers] = useState(mockSubscribers);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
    }
  };

  const handleApproveSubscriber = (id: number) => {
    setSubscribers(prev => 
      prev.map(subscriber => 
        subscriber.id === id 
          ? { ...subscriber, status: 'Active' }
          : subscriber
      )
    );
    toast({
      title: "Subscriber Approved",
      description: "The subscriber has been approved successfully.",
    });
  };

  const handleRejectSubscriber = (id: number) => {
    setSubscribers(prev => prev.filter(subscriber => subscriber.id !== id));
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

    const activeSubscribers = subscribers.filter(s => s.status === 'Active');
    
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
                {subscribers.filter(s => s.status === 'Active').length}
              </div>
              <p className="text-vip-gold font-medium">Active Subscribers</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-vip-gold/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-vip-black mb-2">
                {subscribers.filter(s => s.status === 'Pending').length}
              </div>
              <p className="text-vip-gold font-medium">Pending Approval</p>
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
            >
              <Send className="h-4 w-4 mr-2" />
              Send Email to All Active Subscribers
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
                      {getStatusBadge(subscriber.status)}
                    </TableCell>
                    <TableCell className="text-vip-black">
                      {subscriber.joinDate}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {subscriber.status === 'Pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveSubscriber(subscriber.id)}
                              className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectSubscriber(subscriber.id)}
                              className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {subscriber.status === 'Active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-vip-gold/30 text-vip-black hover:bg-vip-gold hover:text-black"
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Send Email
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscriptions;
