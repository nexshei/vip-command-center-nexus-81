
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const NewBookingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const resetFormAndClose = () => {
    setClientName('');
    setEventType('');
    setDate('');
    setTime('');
    setNotes('');
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating booking:', { clientName, eventType, date, time, notes });
    
    toast({
      title: "Booking Created",
      description: `VVIP booking for ${clientName} has been scheduled successfully.`,
    });

    resetFormAndClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold">Create New VVIP Booking</DialogTitle>
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
            <Button type="button" variant="outline" onClick={resetFormAndClose} className="px-6 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">Cancel</Button>
            <Button type="submit" className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark">
              Create Booking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
