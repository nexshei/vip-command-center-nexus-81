
import React from 'react';
import { Calendar, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterModal } from '@/components/modals/FilterModal';
import { NewBookingModal } from '@/components/modals/NewBookingModal';

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
          <FilterModal />
          <NewBookingModal />
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
          <div className="space-y-4">
            {/* Sample bookings */}
            {[
              { id: 1, client: 'Hon. Mary Wanjiku', service: 'VIP Consultation', time: '10:00 AM', status: 'confirmed' },
              { id: 2, client: 'Dr. James Kiprotich', service: 'Protocol Service', time: '2:00 PM', status: 'pending' },
              { id: 3, client: 'Ms. Grace Njeri', service: 'Event Management', time: '4:30 PM', status: 'confirmed' },
            ].map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border border-vip-gold/20 rounded-lg vip-glass-light">
                <div>
                  <h3 className="font-semibold text-vip-black">{booking.client}</h3>
                  <p className="text-sm text-vip-gold/80">{booking.service}</p>
                  <p className="text-xs text-vip-gold/60">{booking.time}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === 'confirmed' 
                      ? 'bg-ios-green text-white' 
                      : 'bg-vip-gold text-black'
                  }`}>
                    {booking.status}
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

export default Bookings;
