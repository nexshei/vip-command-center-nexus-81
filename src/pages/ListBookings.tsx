
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
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch live meeting requests data
  const { data: meetingRequests, isLoading, error } = useRealtimeQuery("meeting_requests", { orderBy: "created_at" });

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return { date: 'Not set', time: 'Not set' };
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredMeetingRequests = (meetingRequests || []).filter((request: any) => {
    const matchesSearch = request.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.event_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEventType = eventTypeFilter === 'all' || request.event_type === eventTypeFilter;
    return matchesSearch && matchesEventType;
  });

  const handleViewRequest = (id: string) => {
    toast({
      title: "View Meeting Request",
      description: "Opening detailed view of the meeting request...",
    });
  };

  const handleEditRequest = (id: string) => {
    toast({
      title: "Edit Meeting Request", 
      description: "Opening edit form for the meeting request...",
    });
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

  // Get unique event types for filter
  const eventTypes = [...new Set((meetingRequests || []).map((request: any) => request.event_type).filter(Boolean))];

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Meeting Requests</h1>
          <p className="text-vip-gold/80 mt-2">View and manage meeting requests submitted from the frontend</p>
        </div>
        <Button 
          onClick={() => navigate('/create-booking')} 
          className="bg-vip-gold text-white hover:bg-vip-gold-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{filteredMeetingRequests.length}</div>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">
              {filteredMeetingRequests.filter((r: any) => {
                const requestDate = new Date(r.created_at);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return requestDate >= weekAgo;
              }).length}
            </div>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{eventTypes.length}</div>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">
              {filteredMeetingRequests.filter((r: any) => {
                if (!r.event_date) return false;
                const eventDate = new Date(r.event_date);
                return eventDate >= new Date();
              }).length}
            </div>
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
          <div className="grid gap-4 md:grid-cols-3">
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

            <Button 
              variant="outline" 
              onClick={() => { setSearchTerm(''); setEventTypeFilter('all'); }} 
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
              <p className="text-vip-gold/60">Loading meeting requests...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error loading meeting requests: {error.message}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeetingRequests.map((request: any) => {
                  const eventDate = formatDateTime(request.event_date);
                  const submittedDate = formatDateTime(request.created_at);
                  return (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.full_name || 'No name'}</TableCell>
                      <TableCell>{request.email || 'No email'}</TableCell>
                      <TableCell>{request.phone || 'No phone'}</TableCell>
                      <TableCell>
                        {request.event_type ? (
                          <Badge variant="outline" className="border-vip-gold/30 text-vip-gold">
                            {request.event_type}
                          </Badge>
                        ) : (
                          'Not specified'
                        )}
                      </TableCell>
                      <TableCell>{eventDate.date}</TableCell>
                      <TableCell>{request.location || 'Not specified'}</TableCell>
                      <TableCell className="text-sm text-gray-600">{submittedDate.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleViewRequest(request.id)}
                            variant="outline" 
                            size="sm"
                            className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            onClick={() => handleEditRequest(request.id)}
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
          )}
          {!isLoading && !error && filteredMeetingRequests.length === 0 && (
            <div className="text-center py-8">
              <p className="text-vip-gold/60">No meeting requests found matching your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ListBookings;
