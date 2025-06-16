
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Plus, CheckCircle } from 'lucide-react';
import { AddClientModal } from '@/components/modals/AddClientModal';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const CreateBooking = () => {
  const [clientName, setClientName] = useState('');
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const existingClients = [
    'Hon. Mary Wanjiku',
    'Dr. James Kiprotich', 
    'Ms. Grace Njeri',
    'Lord Wellington',
    'Ambassador Stevens'
  ];

  const eventTypes = [
    { value: 'diplomatic-meeting', label: 'Diplomatic Meeting', price: 'KSH 75,000' },
    { value: 'corporate-event', label: 'Corporate Event', price: 'KSH 150,000' },
    { value: 'government-protocol', label: 'Government Protocol', price: 'KSH 200,000' },
    { value: 'state-reception', label: 'State Reception', price: 'KSH 300,000' },
    { value: 'business-summit', label: 'Business Summit', price: 'KSH 250,000' },
    { value: 'cultural-exchange', label: 'Cultural Exchange', price: 'KSH 100,000' },
    { value: 'charity-gala', label: 'Charity Gala', price: 'KSH 180,000' },
    { value: 'award-ceremony', label: 'Award Ceremony', price: 'KSH 120,000' },
    { value: 'executive-retreat', label: 'Executive Retreat', price: 'KSH 220,000' },
    { value: 'international-conference', label: 'International Conference', price: 'KSH 350,000' },
  ];

  const validateForm = () => {
    const errors = [];
    if (!clientName) errors.push('Client name is required');
    if (!eventType) errors.push('Event type is required');
    if (!date) errors.push('Date is required');
    if (!time) errors.push('Time is required');
    
    // Validate date is not in the past
    const selectedDate = new Date(`${date}T${time}`);
    const now = new Date();
    if (selectedDate < now) {
      errors.push('Cannot schedule bookings in the past');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const selectedEventType = eventTypes.find(s => s.value === eventType);
    console.log('Creating booking:', { clientName, eventType, date, time, notes, selectedEventType });
    
    toast({
      title: "Booking Created Successfully",
      description: `VVIP booking for ${clientName} has been scheduled for ${new Date(date).toLocaleDateString()} at ${time}.`,
    });

    setIsSubmitting(false);
    navigate('/bookings');
  };

  const handleCancel = () => {
    if (clientName || eventType || date || time || notes) {
      if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        navigate('/bookings');
      }
    } else {
      navigate('/bookings');
    }
  };

  const handleAddNewClient = () => {
    console.log('Opening add client modal');
    setShowAddClient(true);
  };

  const handleClientAdded = (newClientName: string) => {
    console.log('New client added:', newClientName);
    setClientName(newClientName);
    toast({
      title: "Client Added",
      description: `${newClientName} has been added to your client list.`,
    });
  };

  const selectedEventType = eventTypes.find(s => s.value === eventType);

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Create New VVIP Booking</h1>
          <p className="text-vip-gold/80 mt-2">Schedule a new appointment or protocol service</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-vip-gold/60">All fields marked with * are required</p>
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
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-vip-gold" />
                            {client}
                          </div>
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
              {clientName && (
                <div className="flex items-center text-xs text-ios-green">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Client selected: {clientName}
                </div>
              )}
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <Label htmlFor="eventType" className="text-sm font-medium text-vip-black">
                Event Type *
              </Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-vip-gold/30 z-50">
                  {eventTypes.map((event) => (
                    <SelectItem key={event.value} value={event.value} className="hover:bg-vip-gold/10">
                      <div className="flex justify-between items-center w-full">
                        <span>{event.label}</span>
                        <span className="text-vip-gold font-semibold ml-4">{event.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedEventType && (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center text-ios-green">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Event selected: {selectedEventType.label}
                  </div>
                  <div className="text-vip-gold font-semibold">
                    Estimated cost: {selectedEventType.price}
                  </div>
                </div>
              )}
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
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
                  required
                />
                {date && (
                  <div className="flex items-center text-xs text-ios-green">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {new Date(date).toLocaleDateString('en-GB', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                )}
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
                {time && (
                  <div className="flex items-center text-xs text-ios-green">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(`2000-01-01T${time}`).toLocaleTimeString('en-GB', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                )}
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
                placeholder="Enter any special requirements, preferences, or notes for this booking..."
                rows={4}
                className="border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
              />
              <p className="text-xs text-vip-gold/60">
                {notes.length}/500 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-vip-gold/20">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Create Booking
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Add Client Modal */}
      <AddClientModal 
        open={showAddClient} 
        onOpenChange={setShowAddClient}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
};

export default CreateBooking;
