import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NewBookingModalProps {
  onBookingCreated?: () => void;
}

export const NewBookingModal = ({ onBookingCreated }: NewBookingModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [serviceCharge, setServiceCharge] = useState('');
  const { toast } = useToast();

  const resetFormAndClose = () => {
    setClientName('');
    setEmail('');
    setPhone('');
    setEventType('');
    setDate('');
    setLocation('');
    setNotes('');
    setServiceCharge('');
    setIsOpen(false);
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
      // Create a VVIP service request
      const { error } = await supabase
        .from('vvip_service_requests')
        .insert({
          full_name: clientName,
          email: email,
          phone: phone,
          event_type: eventType as any,
          event_date: date,
          location: location,
          requirements: notes,
          estimated_cost: parseFloat(serviceCharge) || null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Booking Created Successfully",
        description: `VVIP service booking for ${clientName} has been created and is pending approval.`,
      });

      onBookingCreated?.();
      resetFormAndClose();
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast({
        title: "Failed to Create Booking",
        description: error.message || "An error occurred while creating the booking.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-sm font-medium">Client Name *</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">Phone *</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventType" className="text-sm font-medium">Event Type *</Label>
            <Select value={eventType} onValueChange={setEventType} required>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">Event Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter event location"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="serviceCharge" className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Estimated Cost (KSH)
            </Label>
            <Input
              id="serviceCharge"
              type="number"
              value={serviceCharge}
              onChange={(e) => setServiceCharge(e.target.value)}
              placeholder="Enter estimated cost"
              min="0"
            />
            {serviceCharge && (
              <p className="text-sm text-gray-600">
                Formatted: {formatCurrency(parseFloat(serviceCharge) || 0)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Requirements</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional requirements or notes"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetFormAndClose} 
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? 'Creating...' : 'Create Booking'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
