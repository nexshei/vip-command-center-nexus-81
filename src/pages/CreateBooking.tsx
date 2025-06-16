
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Plus, CheckCircle, ArrowLeft, Save } from 'lucide-react';
import { AddClientModal } from '@/components/modals/AddClientModal';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeQuery } from '@/hooks/useRealtimeQuery';

interface BookingFormData {
  clientId: string;
  clientName: string;
  eventType: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  estimatedCost: number;
  duration: number;
}

interface Client {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  company?: string;
}

const CreateBooking = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    clientId: '',
    clientName: '',
    eventType: '',
    date: '',
    time: '',
    location: '',
    notes: '',
    estimatedCost: 0,
    duration: 2
  });
  
  const [showAddClient, setShowAddClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch existing clients from database
  const { data: clientsData, isLoading: clientsLoading } = useRealtimeQuery("clients");

  const eventTypes = [
    { value: 'diplomatic-meeting', label: 'Diplomatic Meeting', price: 75000, duration: 3 },
    { value: 'corporate-event', label: 'Corporate Event', price: 150000, duration: 4 },
    { value: 'government-protocol', label: 'Government Protocol', price: 200000, duration: 6 },
    { value: 'state-reception', label: 'State Reception', price: 300000, duration: 8 },
    { value: 'business-summit', label: 'Business Summit', price: 250000, duration: 6 },
    { value: 'cultural-exchange', label: 'Cultural Exchange', price: 100000, duration: 4 },
    { value: 'charity-gala', label: 'Charity Gala', price: 180000, duration: 5 },
    { value: 'award-ceremony', label: 'Award Ceremony', price: 120000, duration: 3 },
    { value: 'executive-retreat', label: 'Executive Retreat', price: 220000, duration: 12 },
    { value: 'international-conference', label: 'International Conference', price: 350000, duration: 8 },
  ];

  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!formData.clientName) errors.clientName = 'Client selection is required';
    if (!formData.eventType) errors.eventType = 'Event type is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    
    // Validate date is not in the past
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    if (selectedDateTime < now) {
      errors.date = 'Cannot schedule bookings in the past';
    }

    // Validate business hours (8 AM - 10 PM)
    const hour = parseInt(formData.time.split(':')[0]);
    if (hour < 8 || hour > 22) {
      errors.time = 'Bookings must be between 8:00 AM and 10:00 PM';
    }

    return errors;
  };

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-calculate estimated cost and duration when event type changes
    if (field === 'eventType') {
      const selectedEvent = eventTypes.find(e => e.value === value);
      if (selectedEvent) {
        setFormData(prev => ({
          ...prev,
          estimatedCost: selectedEvent.price,
          duration: selectedEvent.duration
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please correct the highlighted fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create booking in Supabase
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            client_name: formData.clientName,
            service_type: eventTypes.find(e => e.value === formData.eventType)?.label,
            scheduled_at: `${formData.date}T${formData.time}:00Z`,
            status: 'pending',
            notes: `${formData.notes}\n\nLocation: ${formData.location}\nDuration: ${formData.duration} hours\nEstimated Cost: KSH ${formData.estimatedCost.toLocaleString()}`,
            client_id: formData.clientId || null
          }
        ])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create a quote record for this booking
      const selectedEventType = eventTypes.find(e => e.value === formData.eventType);
      if (selectedEventType && bookingData) {
        const { error: quoteError } = await supabase
          .from('quotes')
          .insert([
            {
              requester_name: formData.clientName,
              requested_service: selectedEventType.label,
              amount: selectedEventType.price,
              status: 'pending',
              quote_details: `Service: ${selectedEventType.label}\nDate: ${formData.date}\nTime: ${formData.time}\nLocation: ${formData.location}\nDuration: ${formData.duration} hours\nNotes: ${formData.notes}`
            }
          ]);

        if (quoteError) {
          console.warn('Quote creation failed:', quoteError);
        }
      }

      toast({
        title: "Booking Created Successfully",
        description: `VVIP booking for ${formData.clientName} has been scheduled for ${new Date(formData.date).toLocaleDateString()} at ${formData.time}.`,
      });

      // Reset form
      setFormData({
        clientId: '',
        clientName: '',
        eventType: '',
        date: '',
        time: '',
        location: '',
        notes: '',
        estimatedCost: 0,
        duration: 2
      });

      // Navigate to bookings page
      navigate('/bookings');

    } catch (error: any) {
      console.error('Booking creation error:', error);
      toast({
        title: "Booking Creation Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const hasUnsavedChanges = Object.values(formData).some(value => 
      typeof value === 'string' ? value.trim() !== '' : value !== 0
    );
    
    if (hasUnsavedChanges) {
      if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        navigate('/bookings');
      }
    } else {
      navigate('/bookings');
    }
  };

  const handleClientAdded = (newClient: Client) => {
    setFormData(prev => ({
      ...prev,
      clientId: newClient.id,
      clientName: newClient.full_name
    }));
    toast({
      title: "Client Added",
      description: `${newClient.full_name} has been added to your client list.`,
    });
  };

  const handleClientSelection = (clientName: string) => {
    // Type guard to ensure clientsData is an array of clients
    const isValidClientsData = (data: any): data is Client[] => {
      return Array.isArray(data) && data.length > 0 && 
             typeof data[0] === 'object' && 
             'id' in data[0] && 
             'full_name' in data[0];
    };

    if (isValidClientsData(clientsData)) {
      const selectedClient = clientsData.find((client: Client) => client.full_name === clientName);
      handleInputChange('clientName', clientName);
      handleInputChange('clientId', selectedClient?.id || '');
    } else {
      handleInputChange('clientName', clientName);
      handleInputChange('clientId', '');
    }
  };

  // Type guard for safe client data usage
  const getValidClients = (): Client[] => {
    if (!Array.isArray(clientsData) || clientsData.length === 0) {
      return [];
    }
    
    const firstItem = clientsData[0];
    
    // Explicit null and undefined check
    if (firstItem === null || firstItem === undefined || typeof firstItem !== 'object') {
      return [];
    }
    
    // Now TypeScript knows firstItem is not null
    if ('id' in firstItem && 'full_name' in firstItem) {
      return clientsData as unknown as Client[];
    }
    
    return [];
  };

  const validClients = getValidClients();

  const selectedEventType = eventTypes.find(e => e.value === formData.eventType);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="h-10 w-10 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New VVIP Booking</h1>
              <p className="text-gray-600 mt-1">Schedule a new appointment or protocol service</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">All fields marked with * are required</p>
          </div>
        </div>

        {/* Main Form */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Selection */}
              <div className="space-y-2">
                <Label htmlFor="client" className="text-sm font-medium text-gray-700">
                  Client Name *
                </Label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Select 
                      value={formData.clientName} 
                      onValueChange={handleClientSelection}
                    >
                      <SelectTrigger className={`bg-white border-gray-300 ${validationErrors.clientName ? 'border-red-500' : 'focus:border-blue-500'}`}>
                        <SelectValue placeholder="Select existing client or add new" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 z-50">
                        {clientsLoading ? (
                          <SelectItem value="loading" disabled>Loading clients...</SelectItem>
                        ) : validClients.length > 0 ? (
                          validClients.map((client: Client) => (
                            <SelectItem key={client.id} value={client.full_name} className="hover:bg-blue-50">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-blue-600" />
                                {client.full_name}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-clients" disabled>No clients found</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {validationErrors.clientName && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.clientName}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={() => setShowAddClient(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add New
                  </Button>
                </div>
                {formData.clientName && (
                  <div className="flex items-center text-xs text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Client selected: {formData.clientName}
                  </div>
                )}
              </div>

              {/* Event Type */}
              <div className="space-y-2">
                <Label htmlFor="eventType" className="text-sm font-medium text-gray-700">
                  Event Type *
                </Label>
                <Select value={formData.eventType} onValueChange={(value) => handleInputChange('eventType', value)}>
                  <SelectTrigger className={`bg-white border-gray-300 ${validationErrors.eventType ? 'border-red-500' : 'focus:border-blue-500'}`}>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 z-50">
                    {eventTypes.map((event) => (
                      <SelectItem key={event.value} value={event.value} className="hover:bg-blue-50">
                        <div className="flex justify-between items-center w-full">
                          <span>{event.label}</span>
                          <span className="text-blue-600 font-semibold ml-4">KSH {event.price.toLocaleString()}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.eventType && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.eventType}</p>
                )}
                {selectedEventType && (
                  <div className="flex items-center justify-between text-xs bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Event selected: {selectedEventType.label}
                    </div>
                    <div className="text-blue-700 font-semibold">
                      Estimated cost: KSH {selectedEventType.price.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    min={today}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={`bg-white border-gray-300 ${validationErrors.date ? 'border-red-500' : 'focus:border-blue-500'}`}
                    required
                  />
                  {validationErrors.date && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.date}</p>
                  )}
                  {formData.date && !validationErrors.date && (
                    <div className="flex items-center text-xs text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {new Date(formData.date).toLocaleDateString('en-GB', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                    Time *
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className={`bg-white border-gray-300 ${validationErrors.time ? 'border-red-500' : 'focus:border-blue-500'}`}
                    required
                  />
                  {validationErrors.time && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.time}</p>
                  )}
                  {formData.time && !validationErrors.time && (
                    <div className="flex items-center text-xs text-green-600">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(`2000-01-01T${formData.time}`).toLocaleTimeString('en-GB', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                  Location *
                </Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter event location (e.g., Nairobi CBD, State House, Hotel Conference Room)"
                  className={`bg-white border-gray-300 ${validationErrors.location ? 'border-red-500' : 'focus:border-blue-500'}`}
                  required
                />
                {validationErrors.location && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.location}</p>
                )}
              </div>

              {selectedEventType && (
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                    Duration (hours)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="24"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 1)}
                    className="bg-white border-gray-300 focus:border-blue-500"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Enter any special requirements, preferences, or notes for this booking..."
                  rows={4}
                  className="bg-white border-gray-300 focus:border-blue-500 placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500">
                  {formData.notes.length}/500 characters
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
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
    </div>
  );
};

export default CreateBooking;
