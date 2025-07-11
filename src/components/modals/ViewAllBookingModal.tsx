import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Mail, Phone, MapPin, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface UnifiedBooking {
  id: string;
  source: string;
  full_name: string;
  email: string;
  phone: string;
  event_type: string | null;
  event_date: string | null;
  location: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  // Additional fields based on source
  vision?: string;
  admin_notes?: string;
  meeting_scheduled_at?: string;
  requirements?: string;
  service_type?: string;
  estimated_cost?: number;
  protocol_officers?: string;
}

interface ViewAllBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: UnifiedBooking | null;
}

export const ViewAllBookingModal = ({ open, onOpenChange, booking }: ViewAllBookingModalProps) => {
  if (!booking) return null;

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceBadgeColor = (source: string) => {
    return source === 'meeting_request' 
      ? 'bg-blue-100 text-blue-800'
      : 'bg-purple-100 text-purple-800';
  };

  const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return 'Not specified';
    try {
      return format(new Date(dateTimeString), 'EEEE, MMMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            Booking Details - {booking.full_name}
            <Badge className={getSourceBadgeColor(booking.source)}>
              {booking.source === 'meeting_request' ? 'Meeting Request' : 'VVIP Service'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Client Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold border-b pb-2">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Full Name</p>
                <p className="text-sm text-gray-700">{booking.full_name}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </p>
                <p className="text-sm text-gray-700">{booking.email}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  Phone
                </p>
                <p className="text-sm text-gray-700">{booking.phone}</p>
              </div>

              {booking.location && (
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Location
                  </p>
                  <p className="text-sm text-gray-700">{booking.location}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Event Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold border-b pb-2">Event Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {booking.event_type && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Event Type</p>
                  <Badge variant="outline">{booking.event_type}</Badge>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Event Date
                </p>
                <p className="text-sm text-gray-700">{formatDateTime(booking.event_date)}</p>
              </div>

              {booking.meeting_scheduled_at && (
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Meeting Scheduled
                  </p>
                  <p className="text-sm text-gray-700">{formatDateTime(booking.meeting_scheduled_at)}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium">Status</p>
                <Badge className={getStatusBadgeColor(booking.status)}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* VVIP Service Specific Information */}
          {booking.source === 'vvip_service' && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold border-b pb-2">VVIP Service Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {booking.service_type && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Service Type</p>
                      <Badge variant="outline">{booking.service_type}</Badge>
                    </div>
                  )}

                  {booking.protocol_officers && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Protocol Officers</p>
                      <p className="text-sm text-gray-700">{booking.protocol_officers}</p>
                    </div>
                  )}

                  {booking.estimated_cost && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Estimated Cost</p>
                      <p className="text-sm font-semibold text-green-600">
                        {formatCurrency(booking.estimated_cost)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Requirements or Vision */}
          {(booking.requirements || booking.vision) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold border-b pb-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  {booking.source === 'meeting_request' ? 'Vision' : 'Requirements'}
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {booking.requirements || booking.vision}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Admin Notes */}
          {booking.admin_notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold border-b pb-2">Admin Notes</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{booking.admin_notes}</p>
                </div>
              </div>
            </>
          )}

          {/* Timestamps */}
          <Separator />
          <div className="space-y-3">
            <h3 className="text-lg font-semibold border-b pb-2">Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-gray-700">
                  {format(new Date(booking.created_at), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-gray-700">
                  {format(new Date(booking.updated_at), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
          </div>

          {/* Booking ID */}
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium">Booking ID</p>
            <p className="text-xs font-mono text-gray-500 bg-gray-100 p-2 rounded border">
              {booking.id}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};