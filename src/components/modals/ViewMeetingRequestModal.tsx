
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Calendar, Clock, User, MapPin, FileText, Tag, Mail, Phone } from 'lucide-react';

interface ViewMeetingRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: any;
}

export const ViewMeetingRequestModal = ({ open, onOpenChange, request }: ViewMeetingRequestModalProps) => {
  if (!request) return null;

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

  const { date, time } = formatDateTime(request.event_date);
  const status = request.status || 'pending';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2 text-vip-gold" />
            Meeting Request Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Client Information */}
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-lg text-vip-black">Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-vip-gold" />
                  <div>
                    <p className="text-sm text-vip-gold/80">Full Name</p>
                    <p className="font-medium text-vip-black">{request.full_name || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-vip-gold" />
                  <div>
                    <p className="text-sm text-vip-gold/80">Email</p>
                    <p className="font-medium text-vip-black">{request.email || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-vip-gold" />
                <div>
                  <p className="text-sm text-vip-gold/80">Phone Number</p>
                  <p className="font-medium text-vip-black">{request.phone || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Information */}
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-lg text-vip-black">Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-vip-gold" />
                  <div>
                    <p className="text-sm text-vip-gold/80">Event Type</p>
                    <p className="font-medium text-vip-black">{request.event_type || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-vip-gold" />
                  <div>
                    <p className="text-sm text-vip-gold/80">Event Date</p>
                    <p className="font-medium text-vip-black">{date}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-vip-gold" />
                <div>
                  <p className="text-sm text-vip-gold/80">Location</p>
                  <p className="font-medium text-vip-black">{request.location || 'Not specified'}</p>
                </div>
              </div>

              {request.protocol_officers && (
                <div>
                  <p className="text-sm text-vip-gold/80">Protocol Officers</p>
                  <p className="font-medium text-vip-black">{request.protocol_officers}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status & Vision */}
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-lg text-vip-black">Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-vip-gold/80 mb-2">Current Status</p>
                <Badge className={getStatusColor(status)}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </div>

              {request.vision && (
                <div>
                  <p className="text-sm text-vip-gold/80">Vision/Requirements</p>
                  <p className="text-vip-black whitespace-pre-wrap mt-1">{request.vision}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-lg text-vip-black">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-vip-gold/80">Submitted:</span>
                <span className="text-sm text-vip-black">
                  {request.created_at ? new Date(request.created_at).toLocaleString() : 'Unknown'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={() => onOpenChange(false)}
            className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark"
          >
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
