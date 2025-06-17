
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { CalendarIcon, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditMeetingRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: any;
  onRequestUpdated: () => void;
}

export const EditMeetingRequestModal = ({ open, onOpenChange, request, onRequestUpdated }: EditMeetingRequestModalProps) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    event_type: '',
    event_date: null as Date | null,
    location: '',
    protocol_officers: '',
    vision: '',
    status: 'pending'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (request) {
      setFormData({
        full_name: request.full_name || '',
        email: request.email || '',
        phone: request.phone || '',
        event_type: request.event_type || '',
        event_date: request.event_date ? new Date(request.event_date) : null,
        location: request.location || '',
        protocol_officers: request.protocol_officers || '',
        vision: request.vision || '',
        status: request.status || 'pending'
      });
    }
  }, [request]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = {
        ...formData,
        event_date: formData.event_date ? format(formData.event_date, 'yyyy-MM-dd') : null
      };

      const { error } = await supabase
        .from('meeting_requests')
        .update(updateData)
        .eq('id', request.id);

      if (error) throw error;

      toast({
        title: "Meeting Request Updated",
        description: "The meeting request has been updated successfully.",
      });

      onRequestUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "An error occurred while updating the meeting request.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const eventTypes = [
    'VVIP Escort Service',
    'Airport Transfer',
    'Diplomatic Protocol',
    'Corporate Event',
    'Wedding Ceremony',
    'Government Function',
    'Private Security',
    'Cultural Event',
    'Religious Ceremony',
    'Business Meeting',
    'Other'
  ];

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold flex items-center">
            <Save className="h-5 w-5 mr-2 text-vip-gold" />
            Edit Meeting Request
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="py-4 max-h-[70vh] overflow-y-auto space-y-4">
          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-vip-black">Client Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-vip-gold/80">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="border-vip-gold/30 focus:border-vip-gold"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-vip-gold/80">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="border-vip-gold/30 focus:border-vip-gold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-vip-gold/80">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="border-vip-gold/30 focus:border-vip-gold"
                required
              />
            </div>
          </div>

          {/* Event Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-vip-black">Event Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event_type" className="text-vip-gold/80">Event Type</Label>
                <Select value={formData.event_type} onValueChange={(value) => setFormData(prev => ({ ...prev, event_type: value }))}>
                  <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-vip-gold/30 z-50">
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-vip-gold/80">Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-vip-gold/30",
                        !formData.event_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.event_date ? format(formData.event_date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-vip-gold/30" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.event_date}
                      onSelect={(date) => setFormData(prev => ({ ...prev, event_date: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-vip-gold/80">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="border-vip-gold/30 focus:border-vip-gold"
                placeholder="Event location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protocol_officers" className="text-vip-gold/80">Protocol Officers</Label>
              <Input
                id="protocol_officers"
                value={formData.protocol_officers}
                onChange={(e) => setFormData(prev => ({ ...prev, protocol_officers: e.target.value }))}
                className="border-vip-gold/30 focus:border-vip-gold"
                placeholder="Number or specific officers required"
              />
            </div>
          </div>

          {/* Status and Vision */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-vip-black">Status & Requirements</h3>
            
            <div className="space-y-2">
              <Label htmlFor="status" className="text-vip-gold/80">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-vip-gold/30 z-50">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vision" className="text-vip-gold/80">Vision/Requirements</Label>
              <Textarea
                id="vision"
                value={formData.vision}
                onChange={(e) => setFormData(prev => ({ ...prev, vision: e.target.value }))}
                className="border-vip-gold/30 focus:border-vip-gold min-h-[100px]"
                placeholder="Describe your vision and specific requirements..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-vip-gold text-white hover:bg-vip-gold-dark"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Updating...' : 'Update Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
