
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Mail, Phone, FileText, Check, X } from 'lucide-react';
import { format } from 'date-fns';

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

interface ViewBookingDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: ItemBooking | null;
}

export const ViewBookingDetailsModal = ({ open, onOpenChange, booking }: ViewBookingDetailsModalProps) => {
  if (!booking) return null;

  const getStatusBadgeVariant = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const itemCategories = [
    { label: 'Tables', value: booking.tables, icon: '🪑' },
    { label: 'Chairs', value: booking.chairs, icon: '💺' },
    { label: 'Tents', value: booking.tents, icon: '⛺' },
    { label: 'Plates', value: booking.plates, icon: '🍽️' },
    { label: 'Cups', value: booking.cups, icon: '🥤' },
    { label: 'Forks/Spoons', value: booking.forks_spoons, icon: '🍴' },
    { label: 'Sound System', value: booking.sound_system, icon: '🔊' },
    { label: 'Lighting Equipment', value: booking.lighting_equipment, icon: '💡' },
    { label: 'Extension Cables', value: booking.extension_cables, icon: '🔌' },
    { label: 'Water Dispensers', value: booking.water_dispensers, icon: '🚰' },
    { label: 'Tablecloths', value: booking.tablecloths, icon: '🧻' },
    { label: 'Decoration Items', value: booking.decoration_items, icon: '🎨' },
  ];

  const requestedItems = itemCategories.filter(item => item.value && item.value > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] vip-glass border-vip-gold/20 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold">
            Booking Details - {booking.full_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Client Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-vip-black border-b border-vip-gold/30 pb-2">
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-vip-black">Full Name</p>
                <p className="text-sm text-gray-700">{booking.full_name}</p>
              </div>
              
              {booking.email && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-vip-black flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </p>
                  <p className="text-sm text-gray-700">{booking.email}</p>
                </div>
              )}
              
              {booking.phone && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-vip-black flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Phone
                  </p>
                  <p className="text-sm text-gray-700">{booking.phone}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-vip-black flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Event Date
                </p>
                <p className="text-sm text-gray-700">
                  {format(new Date(booking.event_date), 'EEEE, MMMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-vip-gold/30" />

          {/* Booking Status & Dates */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-vip-black border-b border-vip-gold/30 pb-2">
              Booking Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-vip-black">Current Status</p>
                <Badge variant={getStatusBadgeVariant(booking.status)}>
                  {booking.status || 'pending'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-vip-black">Date Submitted</p>
                <p className="text-sm text-gray-700">
                  {format(new Date(booking.created_at), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-vip-black">Last Updated</p>
                <p className="text-sm text-gray-700">
                  {format(new Date(booking.updated_at), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-vip-gold/30" />

          {/* Requested Items */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-vip-black border-b border-vip-gold/30 pb-2">
              Requested Items
            </h3>
            {requestedItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {requestedItems.map((item) => (
                  <div key={item.label} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-vip-black">{item.label}</span>
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <p className="text-xl font-bold text-vip-gold">{item.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No specific items requested</p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-vip-black border-b border-vip-gold/30 pb-2">
              Terms & Conditions
            </h3>
            <div className="flex items-center space-x-2">
              {booking.terms_agreed ? (
                <>
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Terms and conditions accepted</span>
                </>
              ) : (
                <>
                  <X className="h-5 w-5 text-red-600" />
                  <span className="text-sm text-red-700 font-medium">Terms and conditions not accepted</span>
                </>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          {booking.additional_notes && (
            <>
              <Separator className="bg-vip-gold/30" />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-vip-black border-b border-vip-gold/30 pb-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Additional Notes
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{booking.additional_notes}</p>
                </div>
              </div>
            </>
          )}

          {/* Booking ID */}
          <Separator className="bg-vip-gold/30" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-vip-black">Booking ID</p>
            <p className="text-xs font-mono text-gray-500 bg-gray-100 p-2 rounded border">
              {booking.id}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
