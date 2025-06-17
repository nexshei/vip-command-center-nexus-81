
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Calendar, Clock, User, MapPin, DollarSign, FileText, Tag } from 'lucide-react';

interface ViewEventDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: any;
}

export const ViewEventDetailsModal = ({ open, onOpenChange, event }: ViewEventDetailsModalProps) => {
  if (!event) return null;

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return { date: 'Not set', time: 'Not set' };
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'completed': return 'bg-blue-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'rejected': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const { date, time } = formatDateTime(event.scheduled_at);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2 text-vip-gold" />
            Event Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Basic Information */}
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-lg text-vip-black">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-vip-gold" />
                  <div>
                    <p className="text-sm text-vip-gold/80">Client Name</p>
                    <p className="font-medium text-vip-black">{event.client_name || 'No client name'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-vip-gold" />
                  <div>
                    <p className="text-sm text-vip-gold/80">Service Type</p>
                    <p className="font-medium text-vip-black">{event.service_type || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-vip-gold" />
                  <div>
                    <p className="text-sm text-vip-gold/80">Date</p>
                    <p className="font-medium text-vip-black">{date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-vip-gold" />
                  <div>
                    <p className="text-sm text-vip-gold/80">Time</p>
                    <p className="font-medium text-vip-black">{time}</p>
                  </div>
                </div>
              </div>

              {event.revenue && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-vip-gold" />
                  <div>
                    <p className="text-sm text-vip-gold/80">Revenue</p>
                    <p className="font-medium text-green-600">KSH {(event.revenue || 0).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Information */}
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-lg text-vip-black">Status Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-vip-gold/80 mb-2">Event Status</p>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status?.charAt(0).toUpperCase() + event.status?.slice(1) || 'Unknown'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-vip-gold/80 mb-2">Approval Status</p>
                  <Badge className={getApprovalStatusColor(event.approval_status)}>
                    {event.approval_status?.charAt(0).toUpperCase() + event.approval_status?.slice(1) || 'Unknown'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {event.notes && (
            <Card className="vip-glass border-vip-gold/20">
              <CardHeader>
                <CardTitle className="text-lg text-vip-black">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-vip-black whitespace-pre-wrap">{event.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-lg text-vip-black">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-vip-gold/80">Created:</span>
                <span className="text-sm text-vip-black">
                  {event.created_at ? new Date(event.created_at).toLocaleString() : 'Unknown'}
                </span>
              </div>
              {event.updated_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-vip-gold/80">Last Updated:</span>
                  <span className="text-sm text-vip-black">
                    {new Date(event.updated_at).toLocaleString()}
                  </span>
                </div>
              )}
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
