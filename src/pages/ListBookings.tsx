
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Calendar, Eye, Edit, Trash2, Plus, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeQuery } from "@/hooks/useRealtimeQuery";

const ListBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch live bookings data
  const { data: bookings, isLoading, error } = useRealtimeQuery("bookings", { orderBy: "created_at" });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'completed': return 'bg-blue-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return { date: 'Not set', time: 'Not set' };
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredBookings = (bookings || []).filter((booking: any) => {
    const matchesSearch = booking.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.service_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewBooking = (id: string) => {
    toast({
      title: "View Booking Details",
      description: "Opening detailed view of the booking...",
    });
  };

  const handleEditBooking = (id: string) => {
    toast({
      title: "Edit Booking",
      description: "Opening edit form for the booking...",
    });
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Booking Deleted",
        description: "The booking has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "An error occurred while deleting.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">All Bookings</h1>
          <p className="text-vip-gold/80 mt-2">View and manage all VVIP bookings from the admin dashboard</p>
        </div>
        <Button 
          onClick={() => navigate('/create-booking')} 
          className="bg-vip-gold text-white hover:bg-vip-gold-dark"
        >
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
            <div className="text-2xl font-bold text-vip-black">{filteredBookings.length}</div>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">
              {filteredBookings.filter((b: any) => b.status === 'confirmed').length}
            </div>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">
              {filteredBookings.filter((b: any) => b.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">
              {filteredBookings.filter((b: any) => b.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-vip-black">
            <Filter className="h-5 w-5 mr-2 text-vip-gold" />
            Search & Filter Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
              <Input
                placeholder="Search by client name or service..."
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

            <Button 
              variant="outline" 
              onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} 
              className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-vip-black">
            <Calendar className="h-5 w-5 mr-2 text-vip-gold" />
            VVIP Bookings ({filteredBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-vip-gold/60">Loading bookings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error loading bookings: {error.message}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Scheduled Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking: any) => {
                  const scheduledDateTime = formatDateTime(booking.scheduled_at);
                  const createdDate = formatDateTime(booking.created_at);
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.client_name || 'No name'}</TableCell>
                      <TableCell>{booking.service_type || 'Not specified'}</TableCell>
                      <TableCell>{scheduledDateTime.date}</TableCell>
                      <TableCell>{scheduledDateTime.time}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status || 'pending')}>
                          {(booking.status || 'pending').charAt(0).toUpperCase() + (booking.status || 'pending').slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{createdDate.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleViewBooking(booking.id)}
                            variant="outline" 
                            size="sm"
                            className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            onClick={() => handleEditBooking(booking.id)}
                            variant="outline" 
                            size="sm"
                            className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                          >
                            <Edit className="h-3 w-3" />
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
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          {!isLoading && !error && filteredBookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-vip-gold/60">No bookings found matching your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ListBookings;
