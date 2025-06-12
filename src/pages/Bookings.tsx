
import React from 'react';
import { Calendar, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Bookings = () => {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Bookings & Events</h1>
          <p className="text-vip-gold/80 mt-2">Manage VIP appointments and protocol events</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-white">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Today's Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">12</div>
            <p className="text-xs text-vip-gold/60">+2 from yesterday</p>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">48</div>
            <p className="text-xs text-vip-gold/60">+8 from last week</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">6</div>
            <p className="text-xs text-vip-red">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Revenue (KSH)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">2.8M</div>
            <p className="text-xs text-ios-green">+12% this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar/Booking List */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-vip-black">
            <Calendar className="h-5 w-5 mr-2 text-vip-gold" />
            Upcoming Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-vip-gold/60">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Booking management interface coming soon...</p>
            <p className="text-sm mt-2">Feature under development</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Bookings;
