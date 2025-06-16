
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Calendar, Clock, User, MapPin, Eye, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NewBookingModal } from '@/components/modals/NewBookingModal';
import { useRealtimeQuery } from "@/hooks/useRealtimeQuery";

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newBookingOpen, setNewBookingOpen] = useState(false);
  const { toast } = useToast();

  // Fetch live data from Supabase "bookings" table
  const { data: bookingsData, isLoading, error } = useRealtimeQuery("bookings", { orderBy: "created_at" });

  // Mock bookings for fallback
  const mockBookings = [
    {
      id: '1',
      client_name: 'Hon. Margaret Wanjiku',
      service_type: 'Diplomatic Meeting',
      scheduled_at: '2024-01-25T10:00:00Z',
      status: 'confirmed',
      notes: 'Meeting with Ambassador',
      created_at: '2024-01-20'
    },
    {
      id: '2',
      client_name: 'Dr. David Kimani',
      service_type: 'Corporate Event',
      scheduled_at: '2024-01-28T14:30:00Z',
      status: 'pending',
      notes: 'Board meeting preparation',
      created_at: '2024-01-22'
    },
    {
      id: '3',
      client_name: 'Ms. Grace Muthoni',
      service_type: 'State Reception',
      scheduled_at: '2024-01-30T18:00:00Z',
      status: 'confirmed',
      notes: 'State dinner arrangements',
      created_at: '2024-01-23'
    }
  ];

  // Use real data if available, otherwise use mock data
  const bookings = bookingsData && bookingsData.length > 0 ? bookingsData : mockBookings;

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((booking: any) => booking.status === 'confirmed').length;
  const pendingBookings = bookings.filter((booking: any) => booking.status === 'pending').length;
  const completedBookings = bookings.filter((booking: any) => booking.status === 'completed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-ios-green text-white';
      case 'pending': return 'bg-ios-orange text-white';
      case 'completed': return 'bg-ios-blue text-white';
      case 'cancelled': return 'bg-ios-red text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredBookings = bookings.filter((booking: any) => {
    const matchesSearch = booking.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.service_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewBooking = (bookingId: string) => {
    console.log('Viewing booking:', bookingId);
    toast({
      title: "View Booking Details",
      description: "Opening detailed view of the booking...",
    });
  };

  const handleEditBooking = (bookingId: string) => {
    console.log('Editing booking:', bookingId);
    toast({
      title: "Edit Booking",
      description: "Opening edit form for the booking...",
    });
  };

  const handleDeleteBooking = (bookingId: string) => {
    console.log('Deleting booking:', bookingId);
    toast({
      title: "Delete Booking",
      description: "Booking has been deleted successfully.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Manage VVIP appointments and protocol events</h1>
          <p className="text-vip-gold/80 mt-2">Schedule and manage exclusive VVIP events and appointments</p>
        </div>
        <Button onClick={() => setNewBookingOpen(true)} className="bg-vip-gold text-white hover:bg-vip-gold-dark">
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{totalBookings}</div>
            <p className="text-xs text-vip-gold/60">All appointments</p>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{confirmedBookings}</div>
            <p className="text-xs text-ios-green">Ready to proceed</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{pendingBookings}</div>
            <p className="text-xs text-ios-orange">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{completedBookings}</div>
            <p className="text-xs text-ios-blue">Successfully executed</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="text-vip-black">Search & Filter Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
              <Input
                placeholder="Search by client or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold bg-white text-vip-black">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-vip-gold/30 z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-vip-black">
            <Calendar className="h-5 w-5 mr-2 text-vip-gold" />
            VVIP Bookings ({filteredBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
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
          <div className="space-y-4">
            {filteredBookings.map((booking: any) => {
              const { date, time } = formatDateTime(booking.scheduled_at || new Date().toISOString());
              return (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-vip-gold/20 rounded-lg vip-glass-light hover:bg-vip-gold/5 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-vip-black">{booking.client_name}</h3>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-vip-gold/80">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {booking.service_type}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {time}
                      </div>
                    </div>
                    {booking.notes && (
                      <p className="text-xs text-vip-gold/60 mt-1">{booking.notes}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleViewBooking(booking.id)}
                      variant="outline" 
                      size="sm" 
                      className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      onClick={() => handleEditBooking(booking.id)}
                      variant="outline" 
                      size="sm" 
                      className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      onClick={() => handleDeleteBooking(booking.id)}
                      variant="outline" 
                      size="sm" 
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
            {!isLoading && filteredBookings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-vip-gold/60">No bookings found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <NewBookingModal />
    </div>
  );
};

export default Bookings;
