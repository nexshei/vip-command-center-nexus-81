
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
  const [clientName, setClientName] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating booking:', { clientName, service, date, time, notes });
    
    toast({
      title: "Booking Created",
      description: `VIP booking for ${clientName} has been scheduled successfully.`,
    });

    // Reset form
    setClientName('');
    setService('');
    setDate('');
    setTime('');
    setNotes('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-vip-gold text-vip-black hover:bg-vip-gold-dark font-medium">
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white border border-neutral-medium shadow-2xl">
        <DialogHeader className="pb-4 border-b border-neutral-medium">
          <DialogTitle className="text-2xl font-serif font-bold text-vip-black">Create New VIP Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-vip-black font-medium text-sm">Client Name</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
              className="bg-neutral-light border-neutral-medium text-vip-black placeholder:text-gray-500 focus:border-vip-gold focus:ring-vip-gold/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service" className="text-vip-black font-medium text-sm">Service Type</Label>
            <Select value={service} onValueChange={setService} required>
              <SelectTrigger className="bg-neutral-light border-neutral-medium text-vip-black focus:border-vip-gold focus:ring-vip-gold/20">
                <SelectValue placeholder="Select service" className="text-gray-500" />
              </SelectTrigger>
              <SelectContent className="bg-white border-neutral-medium">
                <SelectItem value="consultation" className="text-vip-black hover:bg-neutral-light">VIP Consultation</SelectItem>
                <SelectItem value="protocol" className="text-vip-black hover:bg-neutral-light">Protocol Service</SelectItem>
                <SelectItem value="event" className="text-vip-black hover:bg-neutral-light">Event Management</SelectItem>
                <SelectItem value="concierge" className="text-vip-black hover:bg-neutral-light">Concierge Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-vip-black font-medium text-sm">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-neutral-light border-neutral-medium text-vip-black focus:border-vip-gold focus:ring-vip-gold/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-vip-black font-medium text-sm">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-neutral-light border-neutral-medium text-vip-black focus:border-vip-gold focus:ring-vip-gold/20"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-vip-black font-medium text-sm">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or requirements"
              className="bg-neutral-light border-neutral-medium text-vip-black placeholder:text-gray-500 focus:border-vip-gold focus:ring-vip-gold/20"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-medium">
            <Button type="button" variant="outline" className="border-neutral-medium text-vip-black hover:bg-neutral-light">
              Cancel
            </Button>
            <Button type="submit" className="bg-vip-gold text-vip-black hover:bg-vip-gold-dark font-medium">
              Create Booking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
