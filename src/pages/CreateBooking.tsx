
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarIcon, Clock, User, MapPin, Plus, CheckCircle, ArrowLeft, Save, AlertCircle, DollarSign } from 'lucide-react';
import { AddClientModal } from '@/components/modals/AddClientModal';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeQuery } from '@/hooks/useRealtimeQuery';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BookingFormData {
  clientId: string;
  clientName: string;
  eventType: string;
  date: Date | undefined;
  time: string;
  location: string;
  notes: string;
  serviceCharge: number;
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
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    clientId: '',
    clientName: '',
    eventType: '',
    date: undefined,
    time: '',
    location: '',
    notes: '',
    serviceCharge: 0,
    duration: 2
  });
  
  const [showAddClient, setShowAddClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientHistory, setClientHistory] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch existing clients from database
  const { data: clientsData, isLoading: clientsLoading } = useRealtimeQuery("clients");

  const eventTypes = [
    { 
      category: 'Diplomatic Services',
      items: [
        { value: 'diplomatic-meeting', label: 'Diplomatic Meeting', icon: '🏛️' },
        { value: 'government-protocol', label: 'Government Protocol', icon: '⚖️' },
        { value: 'state-reception', label: 'State Reception', icon: '🏆' },
      ]
    },
    { 
      category: 'Corporate Events',
      items: [
        { value: 'corporate-event', label: 'Corporate Event', icon: '🏢' },
        { value: 'business-summit', label: 'Business Summit', icon: '📊' },
        { value: 'executive-retreat', label: 'Executive Retreat', icon: '🌟' },
      ]
    },
    { 
      category: 'Special Events',
      items: [
        { value: 'cultural-exchange', label: 'Cultural Exchange', icon: '🎭' },
        { value: 'charity-gala', label: 'Charity Gala', icon: '💎' },
        { value: 'award-ceremony', label: 'Award Ceremony', icon: '🏅' },
        { value: 'international-conference', label: 'International Conference', icon: '🌍' },
      ]
    }
  ];

  const frequentLocations = [
    'Nairobi CBD - State House',
    'JKIA - VIP Terminal',
    'Villa Rosa Kempinski',
    'Safari Park Hotel',
    'Nairobi Serena Hotel',
    'InterContinental Nairobi',
    'Karen Country Club',
    'UN Headquarters - Gigiri',
    'US Embassy - Westlands',
    'UK High Commission - Upper Hill'
  ];

  const templateNotes = [
    'Strict VIP handling required with full security protocols',
    'High-profile client requiring maximum discretion',
    'Medical assistance may be required on standby',
    'Multiple language interpretation services needed',
    'Special dietary requirements to be accommodated'
  ];

  useEffect(() => {
    if (selectedClient) {
      fetchClientHistory(selectedClient.id);
    }
  }, [selectedClient]);

  const fetchClientHistory = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setClientHistory(data || []);
    } catch (error: any) {
      console.error('Error fetching client history:', error);
    }
  };

  const validateStep = (step: number): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.clientName) errors.clientName = 'Client selection is required';
    }
    
    if (step === 2) {
      if (!formData.eventType) errors.eventType = 'Event type is required';
      if (!formData.date) errors.date = 'Date is required';
      if (!formData.time) errors.time = 'Time is required';
      if (!formData.location.trim()) errors.location = 'Location is required';
      if (formData.serviceCharge <= 0) errors.serviceCharge = 'Service charge must be greater than 0';
      
      // Validate date is not in the past
      if (formData.date && formData.time) {
        const selectedDateTime = new Date(formData.date);
        selectedDateTime.setHours(parseInt(formData.time.split(':')[0]), parseInt(formData.time.split(':')[1]));
        const now = new Date();
        if (selectedDateTime < now) {
          errors.date = 'Cannot schedule bookings in the past';
        }
      }

      // Validate business hours (8 AM - 10 PM)
      if (formData.time) {
        const hour = parseInt(formData.time.split(':')[0]);
        if (hour < 8 || hour > 22) {
          errors.time = 'Bookings must be between 8:00 AM and 10:00 PM';
        }
      }
    }

    return errors;
  };

  const handleInputChange = (field: keyof BookingFormData, value: string | number | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleNextStep = () => {
    const errors = validateStep(currentStep);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      toast({
        title: "Validation Error",
        description: "Please correct the highlighted fields.",
        variant: "destructive"
      });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    const errors = validateStep(2);
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
      if (!formData.date) throw new Error('Date is required');

      // Create booking in Supabase
      const scheduledAt = new Date(formData.date);
      scheduledAt.setHours(parseInt(formData.time.split(':')[0]), parseInt(formData.time.split(':')[1]));

      const allEvents = eventTypes.flatMap(category => category.items);
      const selectedEventType = allEvents.find(e => e.value === formData.eventType);

      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            client_name: formData.clientName,
            service_type: selectedEventType?.label,
            scheduled_at: scheduledAt.toISOString(),
            status: 'pending',
            approval_status: 'pending',
            revenue: formData.serviceCharge,
            notes: `${formData.notes}\n\nLocation: ${formData.location}\nDuration: ${formData.duration} hours\nService Charge: KSH ${formData.serviceCharge.toLocaleString()}`,
            client_id: formData.clientId || null
          }
        ])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create a quote record for this booking
      if (selectedEventType && bookingData) {
        const { error: quoteError } = await supabase
          .from('quotes')
          .insert([
            {
              requester_name: formData.clientName,
              requested_service: selectedEventType.label,
              amount: formData.serviceCharge,
              status: 'pending',
              quote_details: `Service: ${selectedEventType.label}\nDate: ${format(formData.date, 'PPP')}\nTime: ${formData.time}\nLocation: ${formData.location}\nDuration: ${formData.duration} hours\nNotes: ${formData.notes}`
            }
          ]);

        if (quoteError) {
          console.warn('Quote creation failed:', quoteError);
        }
      }

      toast({
        title: "Booking Created Successfully",
        description: `VVIP booking for ${formData.clientName} has been scheduled for ${format(formData.date, 'PPP')} at ${formData.time}.`,
      });

      // Show success step
      setCurrentStep(4);

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
      typeof value === 'string' ? value.trim() !== '' : value !== 0 && value !== undefined
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
    setSelectedClient(newClient);
    toast({
      title: "Client Added",
      description: `${newClient.full_name} has been added to your client list.`,
    });
  };

  const handleClientSelection = (clientName: string) => {
    const validClients = getValidClients();
    const selectedClientData = validClients.find((client: Client) => client.full_name === clientName);
    handleInputChange('clientName', clientName);
    handleInputChange('clientId', selectedClientData?.id || '');
    setSelectedClient(selectedClientData || null);
  };

  // Type guard for safe client data usage
  const getValidClients = (): Client[] => {
    if (!Array.isArray(clientsData) || clientsData.length === 0) {
      return [];
    }
    
    const firstItem = clientsData[0];
    
    if (!firstItem || typeof firstItem !== 'object') {
      return [];
    }
    
    if (firstItem && typeof firstItem === 'object' && 'id' in firstItem && 'full_name' in firstItem) {
      return clientsData as unknown as Client[];
    }
    
    return [];
  };

  const validClients = getValidClients();
  const allEvents = eventTypes.flatMap(category => category.items);
  const selectedEventType = allEvents.find(e => e.value === formData.eventType);

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-8 mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
            currentStep >= step 
              ? "bg-blue-600 border-blue-600 text-white" 
              : "border-gray-300 text-gray-500"
          )}>
            {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
          </div>
          {step < 3 && (
            <div className={cn(
              "w-16 h-0.5 mx-2 transition-colors",
              currentStep > step ? "bg-blue-600" : "bg-gray-300"
            )} />
          )}
        </div>
      ))}
    </div>
  );

  const renderSummaryBox = () => (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 sticky top-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-blue-900 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Booking Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {formData.clientName && (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">{formData.clientName}</span>
          </div>
        )}
        {selectedEventType && (
          <div className="space-y-2">
            <Badge variant="outline" className="bg-white text-blue-700 border-blue-300">
              {selectedEventType.icon} {selectedEventType.label}
            </Badge>
          </div>
        )}
        {formData.serviceCharge > 0 && (
          <div className="text-lg font-bold text-blue-900">
            {formatCurrency(formData.serviceCharge)}
          </div>
        )}
        {formData.date && (
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-blue-600" />
            <span className="text-sm">{format(formData.date, 'PPP')}</span>
          </div>
        )}
        {formData.time && (
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm">{formData.time}</span>
          </div>
        )}
        {formData.location && (
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-sm">{formData.location}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-white shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Created Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your VVIP booking for {formData.clientName} has been scheduled and is pending approval.
            </p>
            <div className="space-y-2 mb-6 text-left bg-gray-50 p-4 rounded-lg">
              <div><strong>Client:</strong> {formData.clientName}</div>
              <div><strong>Event:</strong> {selectedEventType?.label}</div>
              <div><strong>Date:</strong> {formData.date ? format(formData.date, 'PPP') : ''}</div>
              <div><strong>Time:</strong> {formData.time}</div>
              <div><strong>Location:</strong> {formData.location}</div>
              <div><strong>Service Charge:</strong> {formatCurrency(formData.serviceCharge)}</div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/bookings')} className="flex-1">
                View All Bookings
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentStep(1);
                  setFormData({
                    clientId: '',
                    clientName: '',
                    eventType: '',
                    date: undefined,
                    time: '',
                    location: '',
                    notes: '',
                    serviceCharge: 0,
                    duration: 2
                  });
                }}
                className="flex-1"
              >
                Create Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
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
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Client Information */}
            {currentStep === 1 && (
              <Card className="bg-white shadow-sm border-0">
                <CardHeader className="border-b bg-gray-50">
                  <CardTitle className="text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Step 1: Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="client" className="text-sm font-medium text-gray-700">
                      Select Client *
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
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                      <User className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                      <div className="font-medium">{client.full_name}</div>
                                      {client.company && <div className="text-sm text-gray-500">{client.company}</div>}
                                    </div>
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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add New
                      </Button>
                    </div>
                  </div>

                  {selectedClient && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Client Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Email:</strong> {selectedClient.email || 'N/A'}</div>
                        <div><strong>Phone:</strong> {selectedClient.phone || 'N/A'}</div>
                        <div><strong>Company:</strong> {selectedClient.company || 'N/A'}</div>
                      </div>
                      
                      {clientHistory.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium text-blue-900 mb-2">Recent Bookings</h5>
                          <div className="space-y-1">
                            {clientHistory.slice(0, 3).map((booking, index) => (
                              <div key={index} className="text-xs bg-white p-2 rounded border">
                                {booking.service_type} - {booking.scheduled_at ? format(new Date(booking.scheduled_at), 'MMM dd, yyyy') : 'No date'}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button 
                      onClick={handleNextStep}
                      disabled={!formData.clientName}
                      className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Next: Event Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Event Details */}
            {currentStep === 2 && (
              <Card className="bg-white shadow-sm border-0">
                <CardHeader className="border-b bg-gray-50">
                  <CardTitle className="text-gray-900 flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Step 2: Event Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Event Type Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Event Type *</Label>
                    <div className="space-y-4">
                      {eventTypes.map((category) => (
                        <div key={category.category}>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">{category.category}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {category.items.map((event) => (
                              <div
                                key={event.value}
                                onClick={() => handleInputChange('eventType', event.value)}
                                className={cn(
                                  "p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300",
                                  formData.eventType === event.value 
                                    ? "border-blue-500 bg-blue-50" 
                                    : "border-gray-200 bg-white"
                                )}
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="text-2xl">{event.icon}</span>
                                  <div>
                                    <div className="font-medium text-gray-900">{event.label}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {validationErrors.eventType && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.eventType}</p>
                    )}
                  </div>

                  <Separator />

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.date && "text-muted-foreground",
                              validationErrors.date && "border-red-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.date}
                            onSelect={(date) => handleInputChange('date', date)}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      {validationErrors.date && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.date}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Time *</Label>
                      <Input
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        className={`${validationErrors.time ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      />
                      {validationErrors.time && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.time}</p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Location *</Label>
                    <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                      <SelectTrigger className={`${validationErrors.location ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}>
                        <SelectValue placeholder="Select location or enter custom" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        {frequentLocations.map((location) => (
                          <SelectItem key={location} value={location} className="hover:bg-blue-50">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                              {location}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Or enter custom location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="mt-2"
                    />
                    {validationErrors.location && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.location}</p>
                    )}
                  </div>

                  {/* Service Charge */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Service Charge (KES) *
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.serviceCharge || ''}
                      onChange={(e) => handleInputChange('serviceCharge', parseInt(e.target.value) || 0)}
                      placeholder="Enter service charge amount"
                      className={`${validationErrors.serviceCharge ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                    />
                    {formData.serviceCharge > 0 && (
                      <p className="text-sm text-blue-600">Formatted: {formatCurrency(formData.serviceCharge)}</p>
                    )}
                    {validationErrors.serviceCharge && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.serviceCharge}</p>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={handlePrevStep}
                      className="px-8"
                    >
                      Previous
                    </Button>
                    <Button 
                      onClick={handleNextStep}
                      className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Next: Additional Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Additional Details */}
            {currentStep === 3 && (
              <Card className="bg-white shadow-sm border-0">
                <CardHeader className="border-b bg-gray-50">
                  <CardTitle className="text-gray-900 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                    Step 3: Additional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Duration (hours)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="24"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 1)}
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Special Notes & Requirements</Label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {templateNotes.map((template, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleInputChange('notes', formData.notes + (formData.notes ? '\n' : '') + template)}
                            className="text-xs"
                          >
                            {template.slice(0, 30)}...
                          </Button>
                        ))}
                      </div>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Enter any special requirements, preferences, or notes for this booking..."
                        rows={6}
                        className="border-gray-300 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500">
                        {formData.notes.length}/1000 characters
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={handlePrevStep}
                      className="px-8"
                    >
                      Previous
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
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
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            {renderSummaryBox()}
          </div>
        </div>

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
