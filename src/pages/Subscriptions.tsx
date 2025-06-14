
import React, { useState } from 'react';
import { Users, Search, Filter, Eye, Mail, Phone, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilterModal } from '@/components/modals/FilterModal';

// Mock data for VIP subscribers
const mockSubscribers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+254 700 123 456",
    tier: "Gold",
    status: "Active",
    joinDate: "2024-01-15",
    lastPayment: "2024-06-01",
    amount: "KSh 50,000"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+254 700 789 012",
    tier: "Platinum",
    status: "Active",
    joinDate: "2024-02-20",
    lastPayment: "2024-06-01",
    amount: "KSh 150,000"
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.j@email.com",
    phone: "+254 700 345 678",
    tier: "Diamond",
    status: "Active",
    joinDate: "2024-03-10",
    lastPayment: "2024-06-01",
    amount: "KSh 500,000"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    phone: "+254 700 456 789",
    tier: "Gold",
    status: "Pending",
    joinDate: "2024-05-25",
    lastPayment: "2024-05-25",
    amount: "KSh 50,000"
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@email.com",
    phone: "+254 700 567 890",
    tier: "Platinum",
    status: "Expired",
    joinDate: "2023-12-01",
    lastPayment: "2024-04-01",
    amount: "KSh 150,000"
  }
];

const Subscriptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subscribers] = useState(mockSubscribers);

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.tier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case 'Expired':
        return <Badge className="bg-red-500 text-white">Expired</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Gold':
        return <Badge className="bg-vip-gold text-black">Gold</Badge>;
      case 'Platinum':
        return <Badge className="bg-gray-300 text-black">Platinum</Badge>;
      case 'Diamond':
        return <Badge className="bg-blue-600 text-white">Diamond</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{tier}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-white mb-2">VIP Subscribers</h1>
            <p className="text-xl text-vip-gold">Manage your exclusive VIP membership subscribers</p>
          </div>
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-vip-gold" />
            <span className="text-2xl font-bold text-white">{subscribers.length}</span>
            <span className="text-vip-gold">Total Subscribers</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
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
                {subscribers.filter(s => s.tier === 'Gold').length}
              </div>
              <p className="text-vip-gold font-medium">Gold Tier</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-vip-gold/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-vip-black mb-2">
                {subscribers.filter(s => s.tier === 'Platinum').length}
              </div>
              <p className="text-vip-gold font-medium">Platinum Tier</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-vip-gold/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-vip-black mb-2">
                {subscribers.filter(s => s.tier === 'Diamond').length}
              </div>
              <p className="text-vip-gold font-medium">Diamond Tier</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white border border-vip-gold/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold" />
                <Input
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
                />
              </div>
              <div className="flex gap-2">
                <FilterModal />
                <Button variant="outline" className="border-vip-gold/30 text-vip-black bg-white hover:bg-vip-gold hover:text-black">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
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
                  <TableHead className="text-vip-black font-semibold">Name</TableHead>
                  <TableHead className="text-vip-black font-semibold">Contact</TableHead>
                  <TableHead className="text-vip-black font-semibold">Tier</TableHead>
                  <TableHead className="text-vip-black font-semibold">Status</TableHead>
                  <TableHead className="text-vip-black font-semibold">Join Date</TableHead>
                  <TableHead className="text-vip-black font-semibold">Last Payment</TableHead>
                  <TableHead className="text-vip-black font-semibold">Amount</TableHead>
                  <TableHead className="text-vip-black font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id} className="border-b border-vip-gold/10 hover:bg-vip-gold/5">
                    <TableCell className="font-medium text-vip-black">
                      {subscriber.name}
                    </TableCell>
                    <TableCell className="text-vip-black">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-vip-gold" />
                          {subscriber.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-vip-gold" />
                          {subscriber.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTierBadge(subscriber.tier)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(subscriber.status)}
                    </TableCell>
                    <TableCell className="text-vip-black">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-vip-gold" />
                        {subscriber.joinDate}
                      </div>
                    </TableCell>
                    <TableCell className="text-vip-black">
                      {subscriber.lastPayment}
                    </TableCell>
                    <TableCell className="font-semibold text-vip-black">
                      {subscriber.amount}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-vip-gold/30 text-vip-black hover:bg-vip-gold hover:text-black"
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-vip-gold/30 text-vip-black hover:bg-vip-gold hover:text-black"
                        >
                          Edit
                        </Button>
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
