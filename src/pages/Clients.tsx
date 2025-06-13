
import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddClientModal } from '@/components/modals/AddClientModal';

const Clients = () => {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Client Management</h1>
          <p className="text-vip-gold/80 mt-2">VIP client profiles and relationship management</p>
        </div>
        <AddClientModal />
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
            {/* Sample clients with updated format */}
            {[
              { id: 1, name: 'Hon. Peter Maina', company: 'Government Official', lastVisit: '2 days ago' },
              { id: 2, name: 'Dr. Sarah Wanjiku', company: 'Nairobi Hospital', lastVisit: '1 week ago' },
              { id: 3, name: 'Mr. James Kimani', company: 'Safaricom PLC', lastVisit: '3 days ago' },
              { id: 4, name: 'Ms. Grace Mutua', company: 'KCB Bank', lastVisit: '5 days ago' },
            ].map((client) => (
              <div key={client.id} className="flex items-center space-x-4 p-4 border border-vip-gold/20 rounded-lg vip-glass-light hover:bg-vip-gold/5 transition-colors">
                <div className="w-12 h-12 bg-vip-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-vip-gold font-semibold text-sm">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-vip-black">{client.name}</h3>
                  <p className="text-sm text-vip-gold/80">{client.company}</p>
                  <p className="text-xs text-vip-gold/60">Last visit: {client.lastVisit}</p>
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
