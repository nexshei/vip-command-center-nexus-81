
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
        <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black">Create New VIP Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="clientName" className="text-vip-black">Client Name</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="service" className="text-vip-black">Service Type</Label>
            <Select value={service} onValueChange={setService} required>
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">VIP Consultation</SelectItem>
                <SelectItem value="protocol">Protocol Service</SelectItem>
                <SelectItem value="event">Event Management</SelectItem>
                <SelectItem value="concierge">Concierge Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date" className="text-vip-black">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time" className="text-vip-black">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes" className="text-vip-black">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or requirements"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit" className="bg-vip-gold text-white hover:bg-vip-gold-dark">
              Create Booking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
