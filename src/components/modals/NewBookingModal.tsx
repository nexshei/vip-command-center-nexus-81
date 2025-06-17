
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const NewBookingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clientName, setClientName] = useState('');
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [revenue, setRevenue] = useState('');
  const { toast } = useToast();

  const resetFormAndClose = () => {
    setClientName('');
    setEventType('');
    setDate('');
    setTime('');
    setNotes('');
    setRevenue('');
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Combine date and time for scheduled_at
      const scheduledAt = date && time ? `${date}T${time}:00` : null;

      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            client_name: clientName,
            service_type: eventType,
            scheduled_at: scheduledAt,
            notes: notes,
            revenue: revenue ? parseFloat(revenue) : 0,
            status: 'pending',
            approval_status: 'pending'
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Event Created Successfully",
        description: `VVIP event for ${clientName} has been scheduled and is pending approval.`,
      });

      resetFormAndClose();
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast({
        title: "Failed to Create Event",
        description: error.message || "An error occurred while creating the event.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold">Create New VVIP Event</DialogTitle>
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
            <Label htmlFor="revenue" className="text-sm font-medium text-vip-black">Expected Revenue (KSH)</Label>
            <Input
              id="revenue"
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              placeholder="Enter expected revenue"
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
            />
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
              onClick={resetFormAndClose} 
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
              {isLoading ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
