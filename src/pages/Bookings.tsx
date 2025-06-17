
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Calendar, Clock, User, MapPin, Eye, Edit, Trash2, FileText, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeQuery } from "@/hooks/useRealtimeQuery";

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch live data from Supabase
  const { data: bookingsData, isLoading: bookingsLoading, error: bookingsError } = useRealtimeQuery("bookings", { orderBy: "created_at" });
  const { data: quotesData, isLoading: quotesLoading, error: quotesError } = useRealtimeQuery("quotes", { orderBy: "created_at" });

  // Use real data or fallback to empty arrays
  const bookings = bookingsData || [];
  const quotes = quotesData || [];

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

  const filteredQuotes = quotes.filter((quote: any) => {
    const matchesSearch = quote.requester_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.requested_service?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewItem = (id: string, type: 'booking' | 'quote') => {
    toast({
      title: `View ${type === 'booking' ? 'Booking' : 'Quote'} Details`,
      description: `Opening detailed view of the ${type}...`,
    });
  };

  const handleEditItem = (id: string, type: 'booking' | 'quote') => {
    toast({
      title: `Edit ${type === 'booking' ? 'Booking' : 'Quote'}`,
      description: `Opening edit form for the ${type}...`,
    });
  };

  const handleDeleteItem = async (id: string, type: 'booking' | 'quote') => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const { error } = await supabase
        .from(type === 'booking' ? 'bookings' : 'quotes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: `${type === 'booking' ? 'Booking' : 'Quote'} Deleted`,
        description: `The ${type} has been deleted successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "An error occurred while deleting.",
        variant: "destructive"
      });
    }
  };

  const totalBookings = bookings.length;
  const totalQuotes = quotes.length;
  const confirmedBookings = bookings.filter((booking: any) => booking.status === 'confirmed').length;
  const pendingItems = [...bookings, ...quotes].filter((item: any) => item.status === 'pending').length;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">List Events & Quotes</h1>
          <p className="text-vip-gold/80 mt-2">Manage all VVIP bookings and quotes</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/create-booking')} className="bg-vip-gold text-white hover:bg-vip-gold-dark">
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
          <Button onClick={() => navigate('/generate-quote')} variant="outline" className="border-vip-gold text-vip-gold hover:bg-vip-gold/10">
            <FileText className="h-4 w-4 mr-2" />
            New Quote
          </Button>
        </div>
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
            <CardTitle className="text-sm font-medium text-vip-gold/80">Total Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{totalQuotes}</div>
            <p className="text-xs text-vip-gold/60">All quotations</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{confirmedBookings}</div>
            <p className="text-xs text-green-600">Ready to proceed</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{pendingItems}</div>
            <p className="text-xs text-yellow-600">Awaiting action</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="text-vip-black">Search & Filter</CardTitle>
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

            <Button variant="outline" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Bookings and Quotes */}
      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Bookings ({filteredBookings.length})
          </TabsTrigger>
          <TabsTrigger value="quotes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Quotes ({filteredQuotes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center text-vip-black">
                <Calendar className="h-5 w-5 mr-2 text-vip-gold" />
                VVIP Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="text-center py-8">
                  <p className="text-vip-gold/60">Loading bookings...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking: any) => {
                      const { date, time } = formatDateTime(booking.scheduled_at || new Date().toISOString());
                      return (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.client_name}</TableCell>
                          <TableCell>{booking.service_type}</TableCell>
                          <TableCell>{date}</TableCell>
                          <TableCell>{time}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                onClick={() => handleViewItem(booking.id, 'booking')}
                                variant="outline" 
                                size="sm"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button 
                                onClick={() => handleEditItem(booking.id, 'booking')}
                                variant="outline" 
                                size="sm"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                onClick={() => handleDeleteItem(booking.id, 'booking')}
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
              {!bookingsLoading && filteredBookings.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-vip-gold/60">No bookings found matching your search.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes">
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center text-vip-black">
                <FileText className="h-5 w-5 mr-2 text-vip-gold" />
                Generated Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quotesLoading ? (
                <div className="text-center py-8">
                  <p className="text-vip-gold/60">Loading quotes...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotes.map((quote: any) => {
                      const { date } = formatDateTime(quote.created_at || new Date().toISOString());
                      return (
                        <TableRow key={quote.id}>
                          <TableCell className="font-medium">{quote.requester_name}</TableCell>
                          <TableCell>{quote.requested_service}</TableCell>
                          <TableCell>KSH {quote.amount?.toLocaleString()}</TableCell>
                          <TableCell>{date}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(quote.status)}>
                              {quote.status?.charAt(0).toUpperCase() + quote.status?.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                onClick={() => handleViewItem(quote.id, 'quote')}
                                variant="outline" 
                                size="sm"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button 
                                onClick={() => handleEditItem(quote.id, 'quote')}
                                variant="outline" 
                                size="sm"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                onClick={() => handleDeleteItem(quote.id, 'quote')}
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
              {!quotesLoading && filteredQuotes.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-vip-gold/60">No quotes found matching your search.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Bookings;
