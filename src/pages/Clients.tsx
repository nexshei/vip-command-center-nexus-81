
import React, { useState } from 'react';
import { Users, Plus, Search, Package, Bell, Calendar, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AddClientModal } from '@/components/modals/AddClientModal';

const Clients = () => {
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
          <h1 className="text-3xl font-serif font-bold text-vip-black">Client Management</h1>
          <p className="text-vip-gold/80 mt-2">VIP client profiles and relationship management</p>
        </div>
        <AddClientModal />
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

      {/* Client Statistics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">847</div>
            <p className="text-xs text-ios-green">+23 this month</p>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">VIP Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">156</div>
            <p className="text-xs text-vip-gold/60">Premium clients</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Active This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">324</div>
            <p className="text-xs text-vip-gold/60">Engaged clients</p>
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

      {/* Client Directory */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-vip-black">
            <Users className="h-5 w-5 mr-2 text-vip-gold" />
            Client Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Sample clients */}
            {[
              { id: 1, name: 'Hon. Peter Maina', tier: 'VVIP', company: 'Government Official', lastVisit: '2 days ago' },
              { id: 2, name: 'Dr. Sarah Wanjiku', tier: 'VIP', company: 'Nairobi Hospital', lastVisit: '1 week ago' },
              { id: 3, name: 'Mr. James Kimani', tier: 'Premium', company: 'Safaricom PLC', lastVisit: '3 days ago' },
              { id: 4, name: 'Ms. Grace Mutua', tier: 'VIP', company: 'KCB Bank', lastVisit: '5 days ago' },
            ].map((client) => (
              <div key={client.id} className="flex items-center justify-between p-4 border border-vip-gold/20 rounded-lg vip-glass-light hover:bg-vip-gold/5 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-vip-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-vip-gold font-semibold text-sm">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-vip-black">{client.name}</h3>
                    <p className="text-sm text-vip-gold/80">{client.company}</p>
                    <p className="text-xs text-vip-gold/60">Last visit: {client.lastVisit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    client.tier === 'VVIP' ? 'bg-vip-red text-white' :
                    client.tier === 'VIP' ? 'bg-vip-gold text-black' :
                    'bg-ios-blue text-white'
                  }`}>
                    {client.tier}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
