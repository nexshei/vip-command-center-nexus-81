
import React, { useState } from 'react';
import { Calendar, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FilterModal } from '@/components/modals/FilterModal';
import { NewBookingModal } from '@/components/modals/NewBookingModal';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeQuery } from "@/hooks/useRealtimeQuery";

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Realtime bookings from Supabase (ordered by scheduled_at)
  const { data: bookings, isLoading, error } = useRealtimeQuery('bookings', { orderBy: 'scheduled_at' });

  const filteredBookings = (bookings || []).filter(
    (booking: any) =>
      (booking.client_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.service_type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookingClick = (booking: any) => {
    console.log('Opening booking details:', booking);
    toast({
      title: "Opening Booking",
      description: `Loading details for ${booking.client_name}`,
    });
  };

  const handleStatsCardClick = (cardType: string) => {
    console.log('Stats card clicked:', cardType);
    toast({
      title: "Loading Details",
      description: `Opening ${cardType} details...`,
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Bookings & Events</h1>
          <p className="text-vip-gold/80 mt-2">Manage VIP appointments and protocol events</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
            />
          </div>
          <FilterModal />
          <NewBookingModal />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* Placeholders for now, can derive from live data if needed */}
        <Card 
          className="vip-glass border-vip-gold/20 cursor-pointer hover:bg-vip-gold/5 transition-colors"
          onClick={() => handleStatsCardClick("Today's Bookings")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Today's Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">
              {Array.isArray(bookings) ? bookings.filter((b:any)=>b.scheduled_at && new Date(b.scheduled_at).toDateString() === new Date().toDateString()).length : '-'}
            </div>
            <p className="text-xs text-vip-gold/60">Realtime</p>
          </CardContent>
        </Card>
        
        {/* You can compute stats for other cards as needed */}
        <Card 
          className="vip-glass border-vip-gold/20 cursor-pointer hover:bg-vip-gold/5 transition-colors"
          onClick={() => handleStatsCardClick("This Week")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">
              {Array.isArray(bookings)
                ? bookings.filter((b:any)=>{
                  if (!b.scheduled_at) return false;
                  const d = new Date(b.scheduled_at);
                  const now = new Date();
                  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate()+7);
                  return d >= weekStart && d < weekEnd;
                }).length
                : '-'}
            </div>
            <p className="text-xs text-vip-gold/60">Realtime</p>
          </CardContent>
        </Card>

        <Card 
          className="vip-glass border-vip-gold/20 cursor-pointer hover:bg-vip-gold/5 transition-colors"
          onClick={() => handleStatsCardClick("Pending Approval")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">
              {Array.isArray(bookings) ? bookings.filter((b:any)=>b.status==='pending').length : '-'}
            </div>
            <p className="text-xs text-vip-red">Realtime</p>
          </CardContent>
        </Card>

        <Card 
          className="vip-glass border-vip-gold/20 cursor-pointer hover:bg-vip-gold/5 transition-colors"
          onClick={() => handleStatsCardClick("Revenue")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Revenue (KSH)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">
              {/* Placeholder, sum over bookings when you have amount field */}
              -
            </div>
            <p className="text-xs text-ios-green">Realtime</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar/Booking List */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-vip-black">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-vip-gold" />
              Upcoming Bookings ({filteredBookings.length})
            </div>
            <Button 
              onClick={() => {
                // refetch via React Query
                window.location.reload();
              }}
              variant="outline" 
              size="sm"
              className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
            >
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading && (
              <div className="text-center py-8">
                <p className="text-vip-gold/60">Loading bookings...</p>
              </div>
            )}
            {error && (
              <div className="text-center py-8">
                <p className="text-vip-red">{error.message}</p>
              </div>
            )}
            {filteredBookings.map((booking: any) => (
              <div 
                key={booking.id} 
                className="flex items-center justify-between p-4 border border-vip-gold/20 rounded-lg vip-glass-light hover:bg-vip-gold/5 transition-colors cursor-pointer"
                onClick={() => handleBookingClick(booking)}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-vip-black">{booking.client_name}</h3>
                      <p className="text-sm text-vip-gold/80">{booking.service_type}</p>
                      <div className="flex items-center space-x-4 text-xs text-vip-gold/60 mt-1">
                        <span>{booking.scheduled_at ? new Date(booking.scheduled_at).toLocaleDateString() : '-'}</span>
                        <span>•</span>
                        <span>{booking.scheduled_at ? new Date(booking.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-ios-green text-white' 
                          : 'bg-vip-gold text-black'
                      }`}>
                        {booking.status ? (booking.status.charAt(0).toUpperCase() + booking.status.slice(1)) : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {!isLoading && filteredBookings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-vip-gold/60">No bookings found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Bookings;
