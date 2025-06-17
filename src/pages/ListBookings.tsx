
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Calendar, Eye, Edit, Trash2, Plus, Filter, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeQuery } from "@/hooks/useRealtimeQuery";
import { ViewMeetingRequestModal } from '@/components/modals/ViewMeetingRequestModal';
import { EditMeetingRequestModal } from '@/components/modals/EditMeetingRequestModal';

const ListBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch live meeting requests data with real-time updates
  const { data: meetingRequests, isLoading, error, refetch } = useRealtimeQuery("meeting_requests", { orderBy: "created_at" });

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
      case 'confirmed': return 'bg-green-500 text-white';
      case 'completed': return 'bg-blue-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Enhanced filtering
  const filteredMeetingRequests = (meetingRequests || []).filter((request: any) => {
    const matchesSearch = request.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.event_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEventType = eventTypeFilter === 'all' || request.event_type === eventTypeFilter;
    const matchesStatus = statusFilter === 'all' || (request.status || 'pending') === statusFilter;
    
    return matchesSearch && matchesEventType && matchesStatus;
  });

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setViewModalOpen(true);
  };

  const handleEditRequest = (request: any) => {
    setSelectedRequest(request);
    setEditModalOpen(true);
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meeting request?')) return;

    try {
      const { error } = await supabase
        .from('meeting_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Meeting Request Deleted",
        description: "The meeting request has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "An error occurred while deleting.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('meeting_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Meeting request status updated to ${newStatus}.`,
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "An error occurred while updating status.",
        variant: "destructive"
      });
    }
  };

  const handleRequestUpdated = () => {
    refetch();
  };

  // Get unique event types for filter
  const eventTypes = [...new Set((meetingRequests || []).map((request: any) => request.event_type).filter(Boolean))];

  // Calculate stats
  const totalRequests = filteredMeetingRequests.length;
  const pendingRequests = filteredMeetingRequests.filter((r: any) => (r.status || 'pending') === 'pending').length;
  const thisWeekRequests = filteredMeetingRequests.filter((r: any) => {
    const requestDate = new Date(r.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return requestDate >= weekAgo;
  }).length;
  const upcomingEvents = filteredMeetingRequests.filter((r: any) => {
    if (!r.event_date) return false;
    const eventDate = new Date(r.event_date);
    return eventDate >= new Date();
  }).length;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Meeting Requests</h1>
          <p className="text-vip-gold/80 mt-2">View and manage meeting requests submitted from the frontend</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => refetch()} 
            variant="outline"
            className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={() => navigate('/create-booking')} 
            className="bg-vip-gold text-white hover:bg-vip-gold-dark"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{totalRequests}</div>
            <p className="text-xs text-vip-gold/60">All time requests</p>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{pendingRequests}</div>
            <p className="text-xs text-yellow-600">Awaiting response</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{thisWeekRequests}</div>
            <p className="text-xs text-green-600">New requests</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{upcomingEvents}</div>
            <p className="text-xs text-blue-600">Scheduled ahead</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-vip-black">
            <Filter className="h-5 w-5 mr-2 text-vip-gold" />
            Search & Filter Meeting Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
              <Input
                placeholder="Search by name, email, or event type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
              />
            </div>
            
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold bg-white text-vip-black">
                <SelectValue placeholder="Filter by event type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-vip-gold/30 z-50">
                <SelectItem value="all">All Event Types</SelectItem>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

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
              onClick={() => { setSearchTerm(''); setEventTypeFilter('all'); setStatusFilter('all'); }} 
              className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Requests Table */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-vip-black">
            <Calendar className="h-5 w-5 mr-2 text-vip-gold" />
            Meeting Requests ({filteredMeetingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vip-gold mx-auto mb-4"></div>
              <p className="text-vip-gold/60">Loading meeting requests...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error loading meeting requests: {error.message}</p>
              <Button 
                onClick={() => refetch()} 
                variant="outline"
                className="mt-4 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
              >
                Try Again
              </Button>
            </div>
          ) : (
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
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMeetingRequests.map((request: any) => {
                    const eventDate = formatDateTime(request.event_date);
                    const submittedDate = formatDateTime(request.created_at);
                    const status = request.status || 'pending';
                    
                    return (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.full_name || 'No name'}</TableCell>
                        <TableCell className="text-sm">{request.email || 'No email'}</TableCell>
                        <TableCell className="text-sm">{request.phone || 'No phone'}</TableCell>
                        <TableCell>
                          {request.event_type ? (
                            <Badge variant="outline" className="border-vip-gold/30 text-vip-gold">
                              {request.event_type}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">Not specified</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{eventDate.date}</TableCell>
                        <TableCell className="text-sm">{request.location || 'Not specified'}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(status)}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{submittedDate.date}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              onClick={() => handleViewRequest(request)}
                              variant="outline" 
                              size="sm"
                              className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button 
                              onClick={() => handleEditRequest(request)}
                              variant="outline" 
                              size="sm"
                              className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              onClick={() => handleDeleteRequest(request.id)}
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
            </div>
          )}
          {!isLoading && !error && filteredMeetingRequests.length === 0 && (
            <div className="text-center py-8">
              <p className="text-vip-gold/60">No meeting requests found matching your search criteria.</p>
              <p className="text-sm text-vip-gold/40 mt-2">
                {meetingRequests?.length === 0 ? 'No requests have been submitted yet.' : 'Try adjusting your filters.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewMeetingRequestModal 
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        request={selectedRequest}
      />
      
      <EditMeetingRequestModal 
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        request={selectedRequest}
        onRequestUpdated={handleRequestUpdated}
      />
    </div>
  );
};

export default ListBookings;
