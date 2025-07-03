
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';

interface ItemBooking {
  id: string;
  full_name: string;
  status?: string;
  email?: string;
  phone?: string;
  event_date: string;
}

interface UpdateBookingStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: ItemBooking | null;
  onStatusUpdated: () => void;
}

export const UpdateBookingStatusModal = ({ open, onOpenChange, booking, onStatusUpdated }: UpdateBookingStatusModalProps) => {
  const [newStatus, setNewStatus] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (booking) {
      setNewStatus(booking.status || 'pending');
      setAdminNotes('');
    }
  }, [booking]);

  const handleUpdateStatus = async () => {
    if (!booking) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('item_bookings')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', booking.id);

      if (error) throw error;

      onStatusUpdated();
      
      toast({
        title: "Status Updated",
        description: `Booking status has been updated to "${newStatus}" for ${booking.full_name}.`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'The booking request has been approved and confirmed.';
      case 'rejected': return 'The booking request has been rejected.';
      case 'pending': return 'The booking request is awaiting review.';
      default: return '';
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold">
            Update Booking Status
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Current Booking Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-vip-black">{booking.full_name}</h3>
              <Badge variant={getStatusBadgeVariant(booking.status || 'pending')}>
                {booking.status || 'pending'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              Event Date: {new Date(booking.event_date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              Contact: {booking.email || booking.phone || 'No contact info'}
            </p>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <Label htmlFor="status" className="text-sm font-medium text-vip-black">
              New Status
            </Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            {newStatus && (
              <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  {getStatusDescription(newStatus)}
                </p>
              </div>
            )}
          </div>

          {/* Admin Notes (Optional) */}
          <div className="space-y-3">
            <Label htmlFor="admin_notes" className="text-sm font-medium text-vip-black">
              Admin Notes (Optional)
            </Label>
            <Textarea
              id="admin_notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
              placeholder="Add any internal notes about this status change..."
            />
          </div>

          {/* Confirmation Warning */}
          {newStatus !== (booking.status || 'pending') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800">Confirm Status Change</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    You are about to change the status from "{booking.status || 'pending'}" to "{newStatus}". 
                    This action will be logged and may trigger notifications to the client.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-vip-gold/20">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="px-6 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateStatus}
              className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark"
              disabled={isLoading || newStatus === (booking.status || 'pending')}
            >
              {isLoading ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
