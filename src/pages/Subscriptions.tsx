
import React, { useState } from 'react';
import { Package, Users, Bell, Calendar, FileText, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Subscriptions = () => {
  const [staff, setStaff] = useState([
    { id: 1, name: 'Sarah Johnson', role: 'Concierge Manager', status: 'Active' },
    { id: 2, name: 'Michael Chen', role: 'Protocol Officer', status: 'Active' },
    { id: 3, name: 'Emma Davis', role: 'Guest Relations', status: 'On Leave' },
  ]);

  const [inventory] = useState([
    { id: 1, item: 'Premium Towels', quantity: 150, status: 'In Stock' },
    { id: 2, item: 'Champagne Bottles', quantity: 45, status: 'Low Stock' },
    { id: 3, item: 'VIP Access Cards', quantity: 200, status: 'In Stock' },
  ]);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Operations Dashboard</h1>
          <p className="text-vip-gold/80 mt-2">Manage inventory, staff, and client services</p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="vip-glass border-vip-gold/20 hover:border-vip-gold/40 transition-colors cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Quick Book
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-vip-black mb-2">Create Booking</div>
            <Button size="sm" className="w-full bg-vip-gold text-white hover:bg-vip-gold-dark">
              New Booking
            </Button>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20 hover:border-vip-gold/40 transition-colors cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Client Quotes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-vip-black mb-2">Generate Quote</div>
            <Button size="sm" className="w-full bg-vip-gold text-white hover:bg-vip-gold-dark">
              Create Quote
            </Button>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80 flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-vip-black mb-2">Coming Soon!</div>
            <p className="text-xs text-vip-gold/60">Feature under development</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Career Portal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-vip-black mb-2">Recruitment</div>
            <p className="text-xs text-vip-gold/60">Staff management coming soon...</p>
          </CardContent>
        </Card>
      </div>

      {/* Staff Management Section */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-vip-black">
            <span className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-vip-gold" />
              Staff Management
            </span>
            <Button size="sm" className="bg-vip-gold text-white hover:bg-vip-gold-dark">
              <Plus className="h-4 w-4 mr-1" />
              Add Staff
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="text-sm text-vip-gold/80 mb-2">Total Staff: {staff.length}</div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-vip-gold/80">Name</TableHead>
                <TableHead className="text-vip-gold/80">Role</TableHead>
                <TableHead className="text-vip-gold/80">Status</TableHead>
                <TableHead className="text-vip-gold/80">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="text-vip-black font-medium">{member.name}</TableCell>
                  <TableCell className="text-vip-gold/70">{member.role}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      member.status === 'Active' ? 'bg-ios-green text-white' : 'bg-vip-gold/20 text-vip-gold'
                    }`}>
                      {member.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="text-vip-gold border-vip-gold/30">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Inventory Section */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-vip-black">
            <span className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-vip-gold" />
              Inventory Management
            </span>
            <Button size="sm" className="bg-vip-gold text-white hover:bg-vip-gold-dark">
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-vip-gold/80">Item</TableHead>
                <TableHead className="text-vip-gold/80">Quantity</TableHead>
                <TableHead className="text-vip-gold/80">Status</TableHead>
                <TableHead className="text-vip-gold/80">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-vip-black font-medium">{item.item}</TableCell>
                  <TableCell className="text-vip-gold/70">{item.quantity}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'In Stock' ? 'bg-ios-green text-white' : 'bg-vip-red text-white'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="text-vip-gold border-vip-gold/30">
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscriptions;
