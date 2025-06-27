
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Search, Plus, Eye, Edit, MapPin, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useMeetingRequests } from '@/hooks/useMeetingRequests';
import { ViewMeetingRequestModal } from '@/components/modals/ViewMeetingRequestModal';
import { EditMeetingRequestModal } from '@/components/modals/EditMeetingRequestModal';

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch meeting requests from database
  const { data: meetingRequests = [], isLoading, refetch } = useMeetingRequests();

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'approved': return 'bg-green-500 text-white';
      case 'in_progress': return 'bg-blue-500 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  // Filter requests based on search term
  const filteredRequests = meetingRequests.filter((request: any) => 
    request.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.event_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get upcoming events (events with future dates)
  const upcomingEvents = filteredRequests.filter((request: any) => {
    if (!request.event_date) return false;
    const eventDate = new Date(request.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }).sort((a: any, b: any) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setViewModalOpen(true);
  };

  const handleEditRequest = (request: any) => {
    setSelectedRequest(request);
    setEditModalOpen(true);
  };

  const handleRequestUpdated = () => {
    refetch();
    toast({
      title: "Request Updated",
      description: "Meeting request has been updated successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6 max-w-7xl mx-auto flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-2">Manage and track upcoming VVIP events</p>
        </div>
        <Button 
          onClick={() => navigate('/create-booking')} 
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{filteredRequests.length}</div>
            <p className="text-xs text-gray-500">All events</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{upcomingEvents.length}</div>
            <p className="text-xs text-blue-500">Future events</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {filteredRequests.filter((r: any) => r.status === 'pending').length}
            </div>
            <p className="text-xs text-yellow-500">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredRequests.filter((r: any) => {
                if (!r.event_date) return false;
                const eventDate = new Date(r.event_date);
                const now = new Date();
                return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-green-500">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events by client name, type, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Upcoming Events ({upcomingEvents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Officers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingEvents.map((event: any) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.full_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-blue-200 text-blue-600">
                        {event.event_type || 'Not specified'}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {formatDate(event.event_date)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {event.location || 'TBD'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        {event.protocol_officers || 'TBD'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status?.charAt(0).toUpperCase() + event.status?.slice(1) || 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => handleViewRequest(event)}
                          variant="outline" 
                          size="sm"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          onClick={() => handleEditRequest(event)}
                          variant="outline" 
                          size="sm"
                          className="border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {upcomingEvents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No upcoming events found.</p>
              <p className="text-sm text-gray-400 mt-2">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Create your first event to get started.'}
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

export default Bookings;
