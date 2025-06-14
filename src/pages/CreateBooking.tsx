
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Plus } from 'lucide-react';
import { AddClientModal } from '@/components/modals/AddClientModal';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const CreateBooking = () => {
  const [clientName, setClientName] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const existingClients = [
    'Hon. Mary Wanjiku',
    'Dr. James Kiprotich', 
    'Ms. Grace Njeri',
    'Lord Wellington',
    'Ambassador Stevens'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || !service || !date || !time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    console.log('Creating booking:', { clientName, service, date, time, notes });
    
    toast({
      title: "Booking Created Successfully",
      description: `VIP booking for ${clientName} has been scheduled for ${date} at ${time}.`,
    });

    // Navigate back to bookings page
    navigate('/bookings');
  };

  const handleCancel = () => {
    navigate('/bookings');
  };

  const handleAddNewClient = () => {
    setShowAddClient(true);
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Create New VIP Booking</h1>
          <p className="text-vip-gold/80 mt-2">Schedule a new appointment or protocol service</p>
        </div>
      </div>

      {/* Main Form */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="text-vip-black flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-vip-gold" />
            Booking Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Selection */}
            <div className="space-y-2">
              <Label htmlFor="client" className="text-sm font-medium text-vip-black">
                Client Name *
              </Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select value={clientName} onValueChange={setClientName}>
                    <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                      <SelectValue placeholder="Select existing client or add new" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-vip-gold/30 z-50">
                      {existingClients.map((client) => (
                        <SelectItem key={client} value={client} className="hover:bg-vip-gold/10">
                          {client}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  onClick={handleAddNewClient}
                  className="bg-vip-gold text-white hover:bg-vip-gold-dark flex-shrink-0"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add New
                </Button>
              </div>
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <Label htmlFor="service" className="text-sm font-medium text-vip-black">
                Service Type *
              </Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-vip-gold/30 z-50">
                  <SelectItem value="consultation" className="hover:bg-vip-gold/10">VIP Consultation</SelectItem>
                  <SelectItem value="protocol" className="hover:bg-vip-gold/10">Protocol Service</SelectItem>
                  <SelectItem value="event" className="hover:bg-vip-gold/10">Event Management</SelectItem>
                  <SelectItem value="concierge" className="hover:bg-vip-gold/10">Concierge Service</SelectItem>
                  <SelectItem value="diplomatic" className="hover:bg-vip-gold/10">Diplomatic Protocol</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium text-vip-black">
                  Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium text-vip-black">
                  Time *
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-vip-black">
                Additional Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any special requirements or notes for this booking..."
                rows={4}
                className="border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-vip-gold/20">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="px-6 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark"
              >
                Create Booking
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Add Client Modal */}
      <AddClientModal 
        open={showAddClient} 
        onOpenChange={setShowAddClient}
      />
    </div>
  );
};

export default CreateBooking;
