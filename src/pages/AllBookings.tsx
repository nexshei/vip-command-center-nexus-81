
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Calendar, Trash2, Filter, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAllBookings } from '@/hooks/useAllBookings';
import { supabase } from '@/integrations/supabase/client';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { NewBookingModal } from '@/components/modals/NewBookingModal';

const AllBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedBookingName, setSelectedBookingName] = useState<string>('');
  const [selectedBookingSource, setSelectedBookingSource] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch all bookings from both tables
  const { data: allBookings = [], isLoading, refetch } = useAllBookings();

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return { date: 'Not set', time: 'Not set' };
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'approved': return 'bg-green-500 text-white';
      case 'rejected': return 'bg-red-500 text-white';
      case 'in_progress': return 'bg-blue-500 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getSourceBadgeColor = (source: string) => {
    return source === 'meeting_request' 
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-purple-100 text-purple-800 border-purple-200';
  };

  // Enhanced filtering
  const filteredBookings = allBookings.filter((booking) => {
    const matchesSearch = booking.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.event_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSource = sourceFilter === 'all' || booking.source === sourceFilter;
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesSource && matchesStatus;
  });


  const handleDeleteBooking = async () => {
    if (!selectedBookingId || !selectedBookingSource) return;
    
    try {
      const table = selectedBookingSource === 'meeting_request' ? 'meeting_requests' : 'vvip_service_requests';
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', selectedBookingId);

      if (error) throw error;

      refetch();
      toast({
        title: "Booking Deleted",
        description: "The booking has been removed successfully.",
        variant: "destructive"
      });
      setShowDeleteModal(false);
      setSelectedBookingId(null);
      setSelectedBookingName('');
      setSelectedBookingSource('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete booking.",
        variant: "destructive"
      });
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string, source: string) => {
    try {
      const table = source === 'meeting_request' ? 'meeting_requests' : 'vvip_service_requests';
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus as any })
        .eq('id', bookingId);

      if (error) throw error;

      refetch();
      toast({
        title: "Status Updated",
        description: `Booking status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive"
      });
    }
  };

  // Calculate stats
  const totalBookings = filteredBookings.length;
  const pendingBookings = filteredBookings.filter((b) => b.status === 'pending').length;
  const thisWeekBookings = filteredBookings.filter((b) => {
    const bookingDate = new Date(b.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return bookingDate >= weekAgo;
  }).length;
  const upcomingEvents = filteredBookings.filter((b) => {
    if (!b.event_date) return false;
    const eventDate = new Date(b.event_date);
    return eventDate >= new Date();
  }).length;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6 max-w-7xl mx-auto flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading all bookings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">All Bookings</h1>
          <p className="text-gray-600 mt-2">Manage meeting requests and VVIP service bookings</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => refetch()} 
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <NewBookingModal onBookingCreated={refetch} />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalBookings}</div>
            <p className="text-xs text-gray-500">All requests</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingBookings}</div>
            <p className="text-xs text-yellow-500">Awaiting response</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{thisWeekBookings}</div>
            <p className="text-xs text-green-500">New requests</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{upcomingEvents}</div>
            <p className="text-xs text-blue-500">Scheduled ahead</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Filter className="h-5 w-5 mr-2 text-blue-600" />
            Search & Filter Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or event type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 bg-white text-gray-900"
              />
            </div>
            
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 bg-white text-gray-900">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 z-50">
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="meeting_request">Meeting Requests</SelectItem>
                <SelectItem value="vvip_service">VVIP Services</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 bg-white text-gray-900">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => { setSearchTerm(''); setSourceFilter('all'); setStatusFilter('all'); }} 
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            All Bookings ({filteredBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => {
                  const eventDate = formatDateTime(booking.event_date || '');
                  const createdDate = formatDateTime(booking.created_at);
                  
                  return (
                    <TableRow key={`${booking.source}-${booking.id}`}>
                      <TableCell className="font-medium">{booking.full_name}</TableCell>
                      <TableCell className="text-sm">{booking.email}</TableCell>
                      <TableCell className="text-sm">{booking.phone}</TableCell>
                      <TableCell>
                        {booking.event_type ? (
                          <Badge variant="outline" className="border-blue-200 text-blue-600">
                            {booking.event_type}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">Not specified</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{eventDate.date}</TableCell>
                      <TableCell className="text-sm">{booking.location || 'Not specified'}</TableCell>
                      <TableCell>
                        <Badge className={getSourceBadgeColor(booking.source)}>
                          {booking.source === 'meeting_request' ? 'Meeting' : 'VVIP Service'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={booking.status}
                          onValueChange={(newStatus) => handleStatusUpdate(booking.id, newStatus, booking.source)}
                        >
                          <SelectTrigger className="w-36 h-9 border border-gray-300 bg-white hover:bg-gray-50 focus:border-blue-500">
                            <SelectValue>
                              <Badge className={`${getStatusColor(booking.status)} text-xs`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200 z-50">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{createdDate.date}</TableCell>
                       <TableCell>
                         <Button 
                           onClick={() => {
                             setSelectedBookingId(booking.id);
                             setSelectedBookingName(booking.full_name);
                             setSelectedBookingSource(booking.source);
                             setShowDeleteModal(true);
                           }}
                           variant="outline" 
                           size="sm"
                           className="border-red-300 text-red-600 hover:bg-red-50"
                         >
                           <Trash2 className="h-3 w-3" />
                         </Button>
                       </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {filteredBookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No bookings found.</p>
              <p className="text-sm text-gray-400 mt-2">
                {searchTerm || sourceFilter !== 'all' || statusFilter !== 'all' 
                  ? 'Try adjusting your search criteria.' 
                  : 'Create your first booking to get started.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteBooking}
        title="Delete Booking"
        description="Are you sure you want to delete this booking? This action cannot be undone."
        itemName={selectedBookingName}
      />

    </div>
  );
};

export default AllBookings;
