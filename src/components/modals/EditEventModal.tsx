
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Edit, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: any;
  onEventUpdated?: () => void;
}

export const EditEventModal = ({ open, onOpenChange, event, onEventUpdated }: EditEventModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [clientName, setClientName] = useState('');
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [serviceCharge, setServiceCharge] = useState('');
  const [status, setStatus] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (event && open) {
      setClientName(event.client_name || '');
      setEventType(event.service_type || '');
      setNotes(event.notes || '');
      setServiceCharge(event.revenue ? event.revenue.toString() : '');
      setStatus(event.status || '');
      
      if (event.scheduled_at) {
        const scheduledDate = new Date(event.scheduled_at);
        setDate(scheduledDate.toISOString().split('T')[0]);
        setTime(scheduledDate.toTimeString().slice(0, 5));
      } else {
        setDate('');
        setTime('');
      }
    }
  }, [event, open]);

  const resetForm = () => {
    setClientName('');
    setEventType('');
    setDate('');
    setTime('');
    setNotes('');
    setServiceCharge('');
    setStatus('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API update
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Event Updated Successfully",
        description: `VVIP event for ${clientName} has been updated.`,
      });

      onEventUpdated?.();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast({
        title: "Failed to Update Event",
        description: error.message || "An error occurred while updating the event.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold flex items-center">
            <Edit className="h-5 w-5 mr-2 text-vip-gold" />
            Edit VVIP Event
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-sm font-medium text-vip-black">Client Name *</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
              required
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventType" className="text-sm font-medium text-vip-black">Event Type *</Label>
            <Select value={eventType} onValueChange={setEventType} required>
              <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diplomatic-meeting">Diplomatic Meeting</SelectItem>
                <SelectItem value="corporate-event">Corporate Event</SelectItem>
                <SelectItem value="government-protocol">Government Protocol</SelectItem>
                <SelectItem value="state-reception">State Reception</SelectItem>
                <SelectItem value="business-summit">Business Summit</SelectItem>
                <SelectItem value="cultural-exchange">Cultural Exchange</SelectItem>
                <SelectItem value="charity-gala">Charity Gala</SelectItem>
                <SelectItem value="award-ceremony">Award Ceremony</SelectItem>
                <SelectItem value="executive-retreat">Executive Retreat</SelectItem>
                <SelectItem value="international-conference">International Conference</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-vip-black">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium text-vip-black">Time *</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-vip-black">Status *</Label>
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceCharge" className="text-sm font-medium text-vip-black flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Service Charge (KSH) *
            </Label>
            <Input
              id="serviceCharge"
              type="number"
              value={serviceCharge}
              onChange={(e) => setServiceCharge(e.target.value)}
              placeholder="Enter service charge amount"
              required
              min="1"
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
            />
            {serviceCharge && (
              <p className="text-sm text-vip-gold">
                Formatted: {formatCurrency(parseFloat(serviceCharge) || 0)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-vip-black">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or requirements"
              rows={3}
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-vip-gold/20">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={isLoading}
              className="px-6 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark"
            >
              {isLoading ? 'Updating...' : 'Update Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
