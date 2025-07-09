
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, Download, Eye, Calendar, User, Phone, Mail, Trash2 } from 'lucide-react';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { format } from 'date-fns';
import { ViewBookingDetailsModal } from '@/components/modals/ViewBookingDetailsModal';
import { UpdateBookingStatusModal } from '@/components/modals/UpdateBookingStatusModal';

interface ItemBooking {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  event_date: string;
  status?: string;
  created_at: string;
  updated_at: string;
  additional_notes?: string;
  chairs?: number;
  tables?: number;
  tents?: number;
  plates?: number;
  cups?: number;
  forks_spoons?: number;
  sound_system?: number;
  lighting_equipment?: number;
  extension_cables?: number;
  water_dispensers?: number;
  tablecloths?: number;
  decoration_items?: number;
  terms_agreed?: boolean;
}

const ItemBookings = () => {
  const [bookings, setBookings] = useState<ItemBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<ItemBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<ItemBooking | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedBookingName, setSelectedBookingName] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
    setupRealtimeSubscription();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('item_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch item bookings.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('item_bookings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'item_bookings'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchBookings();
          toast({
            title: "Live Update",
            description: "Item bookings data has been updated in real-time.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone?.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const getItemsSummary = (booking: ItemBooking) => {
    const items = [];
    if (booking.chairs && booking.chairs > 0) items.push(`${booking.chairs} Chairs`);
    if (booking.tables && booking.tables > 0) items.push(`${booking.tables} Tables`);
    if (booking.tents && booking.tents > 0) items.push(`${booking.tents} Tents`);
    if (booking.plates && booking.plates > 0) items.push(`${booking.plates} Plates`);
    if (booking.cups && booking.cups > 0) items.push(`${booking.cups} Cups`);
    if (booking.forks_spoons && booking.forks_spoons > 0) items.push(`${booking.forks_spoons} Forks/Spoons`);
    if (booking.sound_system && booking.sound_system > 0) items.push(`${booking.sound_system} Sound System`);
    if (booking.lighting_equipment && booking.lighting_equipment > 0) items.push(`${booking.lighting_equipment} Lighting`);
    if (booking.extension_cables && booking.extension_cables > 0) items.push(`${booking.extension_cables} Extension Cables`);
    if (booking.water_dispensers && booking.water_dispensers > 0) items.push(`${booking.water_dispensers} Water Dispensers`);
    if (booking.tablecloths && booking.tablecloths > 0) items.push(`${booking.tablecloths} Tablecloths`);
    if (booking.decoration_items && booking.decoration_items > 0) items.push(`${booking.decoration_items} Decorations`);
    
    return items.length > 0 ? items.join(', ') : 'No items specified';
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const exportToCSV = () => {
    const headers = ['Booking ID', 'Full Name', 'Email', 'Phone', 'Event Date', 'Items', 'Status', 'Date Booked', 'Notes'];
    const csvData = filteredBookings.map(booking => [
      booking.id,
      booking.full_name,
      booking.email || '',
      booking.phone || '',
      format(new Date(booking.event_date), 'MMM dd, yyyy'),
      getItemsSummary(booking),
      booking.status || 'pending',
      format(new Date(booking.created_at), 'MMM dd, yyyy HH:mm'),
      booking.additional_notes || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `item-bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Item bookings have been exported to CSV.",
    });
  };

  const handleViewDetails = (booking: ItemBooking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateStatus = (booking: ItemBooking) => {
    setSelectedBooking(booking);
    setIsStatusModalOpen(true);
  };

  const handleDeleteBooking = async () => {
    if (!selectedBookingId) return;
    
    try {
      const { error } = await supabase
        .from('item_bookings')
        .delete()
        .eq('id', selectedBookingId);

      if (error) throw error;

      fetchBookings();
      toast({
        title: "Booking Deleted",
        description: "The item booking has been removed successfully.",
        variant: "destructive"
      });
      setShowDeleteModal(false);
      setSelectedBookingId(null);
      setSelectedBookingName('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete booking.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-vip-gold">Item Bookings Management</h1>
            <p className="text-vip-gold/60 mt-2">Manage all item booking requests from the public website</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10">
              <Calendar className="h-3 w-3 mr-1" />
              {filteredBookings.length} Total Bookings
            </Badge>
            <Button
              onClick={exportToCSV}
              variant="outline"
              size="sm"
              className="text-vip-gold border-vip-gold/30 hover:bg-vip-gold/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-gray-300">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-vip-gold/20 border-vip-gold/50 text-vip-gold hover:bg-vip-gold/30 focus:ring-2 focus:ring-vip-gold/50">
                  <Filter className="h-4 w-4 mr-2 text-vip-gold" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-vip-gold/30 backdrop-blur-sm">
                  <SelectItem value="all" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20">All Statuses</SelectItem>
                  <SelectItem value="pending" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20">Pending</SelectItem>
                  <SelectItem value="approved" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20">Approved</SelectItem>
                  <SelectItem value="rejected" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-300">Item Booking Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vip-gold"></div>
                <span className="ml-3 text-gray-400">Loading bookings...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">Booking ID</TableHead>
                      <TableHead className="text-gray-400">Client</TableHead>
                      <TableHead className="text-gray-400">Contact</TableHead>
                      <TableHead className="text-gray-400">Event Date</TableHead>
                      <TableHead className="text-gray-400">Items Summary</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Date Booked</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id} className="border-gray-700 hover:bg-gray-800/50">
                        <TableCell className="font-mono text-xs text-gray-400">
                          {booking.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-vip-gold" />
                            <span className="font-medium text-white">{booking.full_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {booking.email && (
                              <div className="flex items-center text-sm text-gray-400">
                                <Mail className="h-3 w-3 mr-1" />
                                {booking.email}
                              </div>
                            )}
                            {booking.phone && (
                              <div className="flex items-center text-sm text-gray-400">
                                <Phone className="h-3 w-3 mr-1" />
                                {booking.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {format(new Date(booking.event_date), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="text-sm text-gray-400 truncate" title={getItemsSummary(booking)}>
                            {getItemsSummary(booking)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={getStatusBadgeVariant(booking.status)}
                            className="cursor-pointer"
                            onClick={() => handleUpdateStatus(booking)}
                          >
                            {booking.status || 'pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          {format(new Date(booking.created_at), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(booking)}
                              className="text-vip-gold hover:bg-vip-gold/10"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedBookingId(booking.id);
                                setSelectedBookingName(booking.full_name);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {!isLoading && filteredBookings.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No item bookings found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ViewBookingDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        booking={selectedBooking}
      />

      <UpdateBookingStatusModal
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        booking={selectedBooking}
        onStatusUpdated={fetchBookings}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteBooking}
        title="Delete Item Booking"
        description="Are you sure you want to delete this item booking? This action cannot be undone."
        itemName={selectedBookingName}
      />
    </div>
  );
};

export default ItemBookings;
