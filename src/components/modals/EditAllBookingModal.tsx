import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  vision?: string;
  admin_notes?: string;
  meeting_scheduled_at?: string;
  requirements?: string;
  service_type?: string;
  estimated_cost?: number;
  protocol_officers?: string;
}

interface EditAllBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: UnifiedBooking | null;
  onBookingUpdated?: () => void;
}

export const EditAllBookingModal = ({ open, onOpenChange, booking, onBookingUpdated }: EditAllBookingModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    if (booking && open) {
      setFormData({
        full_name: booking.full_name || '',
        email: booking.email || '',
        phone: booking.phone || '',
        event_type: booking.event_type || '',
        event_date: booking.event_date || '',
        location: booking.location || '',
        status: booking.status || '',
        admin_notes: booking.admin_notes || '',
        vision: booking.vision || '',
        requirements: booking.requirements || '',
        service_type: booking.service_type || '',
        estimated_cost: booking.estimated_cost || '',
        protocol_officers: booking.protocol_officers || '',
        meeting_scheduled_at: booking.meeting_scheduled_at || ''
      });
    }
  }, [booking, open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    setIsLoading(true);

    try {
      const table = booking.source === 'meeting_request' ? 'meeting_requests' : 'vvip_service_requests';
      
      // Prepare update data based on source
      let updateData: any = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        event_type: formData.event_type || null,
        event_date: formData.event_date || null,
        location: formData.location || null,
        status: formData.status,
        admin_notes: formData.admin_notes || null,
        updated_at: new Date().toISOString()
      };

      if (booking.source === 'meeting_request') {
        updateData.vision = formData.vision || null;
        updateData.meeting_scheduled_at = formData.meeting_scheduled_at || null;
        updateData.protocol_officers = formData.protocol_officers || null;
      } else {
        updateData.requirements = formData.requirements || null;
        updateData.service_type = formData.service_type || null;
        updateData.estimated_cost = formData.estimated_cost ? parseFloat(formData.estimated_cost) : null;
        updateData.protocol_officers = formData.protocol_officers || null;
      }

      const { error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Booking Updated",
        description: `${booking.source === 'meeting_request' ? 'Meeting request' : 'VVIP service'} has been updated successfully.`,
      });

      onBookingUpdated?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update booking.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center">
            <Edit className="h-5 w-5 mr-2" />
            Edit {booking.source === 'meeting_request' ? 'Meeting Request' : 'VVIP Service'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Client Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name || ''}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status || ''} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Event Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Event Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event_type">Event Type</Label>
                <Select value={formData.event_type || ''} onValueChange={(value) => handleInputChange('event_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="diplomatic">Diplomatic</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_date">Event Date</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date || ''}
                  onChange={(e) => handleInputChange('event_date', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Event location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="protocol_officers">Protocol Officers</Label>
                <Select value={formData.protocol_officers || ''} onValueChange={(value) => handleInputChange('protocol_officers', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5</SelectItem>
                    <SelectItem value="5-10">5-10</SelectItem>
                    <SelectItem value="10-20">10-20</SelectItem>
                    <SelectItem value="20+">20+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {booking.source === 'meeting_request' && (
              <div className="space-y-2">
                <Label htmlFor="meeting_scheduled_at">Meeting Scheduled At</Label>
                <Input
                  id="meeting_scheduled_at"
                  type="datetime-local"
                  value={formData.meeting_scheduled_at ? new Date(formData.meeting_scheduled_at).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleInputChange('meeting_scheduled_at', e.target.value)}
                />
              </div>
            )}
          </div>

          {/* VVIP Service Specific Fields */}
          {booking.source === 'vvip_service' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">VVIP Service Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service_type">Service Type</Label>
                  <Select value={formData.service_type || ''} onValueChange={(value) => handleInputChange('service_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_protocol">Full Protocol</SelectItem>
                      <SelectItem value="event_management">Event Management</SelectItem>
                      <SelectItem value="vip_escort">VIP Escort</SelectItem>
                      <SelectItem value="security_coordination">Security Coordination</SelectItem>
                      <SelectItem value="logistics_support">Logistics Support</SelectItem>
                      <SelectItem value="diplomatic_protocol">Diplomatic Protocol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_cost">Estimated Cost (KSH)</Label>
                  <Input
                    id="estimated_cost"
                    type="number"
                    value={formData.estimated_cost || ''}
                    onChange={(e) => handleInputChange('estimated_cost', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Text Areas */}
          <div className="space-y-4">
            {booking.source === 'meeting_request' ? (
              <div className="space-y-2">
                <Label htmlFor="vision">Vision</Label>
                <Textarea
                  id="vision"
                  value={formData.vision || ''}
                  onChange={(e) => handleInputChange('vision', e.target.value)}
                  placeholder="Client's vision for the event"
                  rows={3}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements || ''}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="Service requirements"
                  rows={3}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="admin_notes">Admin Notes</Label>
              <Textarea
                id="admin_notes"
                value={formData.admin_notes || ''}
                onChange={(e) => handleInputChange('admin_notes', e.target.value)}
                placeholder="Internal notes for administrators"
                rows={3}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Updating...' : 'Update Booking'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};