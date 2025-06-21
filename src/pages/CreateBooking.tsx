
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, MapPin, Clock, ArrowLeft, Save, Plus, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  company?: string;
}

const CreateBooking = () => {
  const [clientName, setClientName] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [numberOfAttendees, setNumberOfAttendees] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock clients data
  const [clients] = useState<Client[]>([
    {
      id: '1',
      full_name: 'Ambassador Johnson',
      email: 'ambassador.johnson@embassy.com',
      phone: '+254-123-456-789',
      company: 'Embassy of Excellence'
    },
    {
      id: '2',
      full_name: 'Minister Chen',
      email: 'minister.chen@gov.example',
      phone: '+254-987-654-321',
      company: 'Government Office'
    },
    {
      id: '3',
      full_name: 'Sarah Williams',
      email: 'sarah.williams@megacorp.com',
      phone: '+254-555-123-456',
      company: 'MegaCorp International'
    }
  ]);

  const eventTypes = [
    'Diplomatic Meeting',
    'State Reception',
    'Corporate Event',
    'Government Protocol',
    'VIP Transport',
    'Security Detail',
    'Cultural Exchange',
    'Business Summit',
    'Award Ceremony',
    'Charity Gala'
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName || !eventType || !eventDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Client, Event Type, and Date).",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Booking Created Successfully",
        description: "The meeting request has been submitted and is pending approval.",
      });

      // Reset form
      setClientName('');
      setEventType('');
      setEventDate('');
      setEventTime('');
      setEventLocation('');
      setEventDescription('');
      setSpecialRequirements('');
      setNumberOfAttendees('');
      setContactEmail('');
      setContactPhone('');

      // Navigate to bookings list
      navigate('/list-bookings');

    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/list-bookings');
  };

  const handleClientSelect = (fullName: string) => {
    setClientName(fullName);
    const selectedClient = clients.find(c => c.full_name === fullName);
    if (selectedClient) {
      setContactEmail(selectedClient.email || '');
      setContactPhone(selectedClient.phone || '');
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Create New Booking</h1>
              <p className="text-gray-600 mt-1">Schedule a new VVIP protocol event or meeting</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">All fields marked with * are required</p>
            <Badge variant="outline" className="mt-1">
              Request #{Date.now().toString().slice(-6)}
            </Badge>
          </div>
        </div>

        {/* Main Form */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-gray-900 flex items-center">
              <CalendarDays className="h-5 w-5 mr-2 text-blue-600" />
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="text-sm font-medium text-gray-700">
                    Client Name *
                  </Label>
                  <Select value={clientName} onValueChange={handleClientSelect}>
                    <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Select or enter client name" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 z-50">
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.full_name} className="hover:bg-blue-50">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-blue-600" />
                            <div>
                              <div className="font-medium">{client.full_name}</div>
                              {client.company && <div className="text-xs text-gray-500">{client.company}</div>}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!clientName && (
                    <Input
                      placeholder="Or type client name manually"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="bg-white border-gray-300 focus:border-blue-500"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventType" className="text-sm font-medium text-gray-700">
                    Event Type *
                  </Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 z-50">
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type} className="hover:bg-blue-50">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="eventDate" className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Event Date *
                  </Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="bg-white border-gray-300 focus:border-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventTime" className="text-sm font-medium text-gray-700 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Preferred Time
                  </Label>
                  <Select value={eventTime} onValueChange={setEventTime}>
                    <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 z-50">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfAttendees" className="text-sm font-medium text-gray-700">
                    Number of Attendees
                  </Label>
                  <Input
                    id="numberOfAttendees"
                    type="number"
                    value={numberOfAttendees}
                    onChange={(e) => setNumberOfAttendees(e.target.value)}
                    placeholder="Expected attendees"
                    className="bg-white border-gray-300 focus:border-blue-500"
                    min="1"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="eventLocation" className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Event Location
                </Label>
                <Input
                  id="eventLocation"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Enter the venue or location for the event"
                  className="bg-white border-gray-300 focus:border-blue-500"
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
                    Contact Email
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Primary contact email"
                    className="bg-white border-gray-300 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">
                    Contact Phone
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Primary contact phone"
                    className="bg-white border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Event Description */}
              <div className="space-y-2">
                <Label htmlFor="eventDescription" className="text-sm font-medium text-gray-700">
                  Event Description
                </Label>
                <Textarea
                  id="eventDescription"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Provide details about the event, purpose, agenda, etc."
                  rows={4}
                  className="bg-white border-gray-300 focus:border-blue-500 placeholder:text-gray-400"
                />
              </div>

              {/* Special Requirements */}
              <div className="space-y-2">
                <Label htmlFor="specialRequirements" className="text-sm font-medium text-gray-700">
                  Special Requirements
                </Label>
                <Textarea
                  id="specialRequirements"
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  placeholder="Any special protocol requirements, security needs, dietary restrictions, etc."
                  rows={3}
                  className="bg-white border-gray-300 focus:border-blue-500 placeholder:text-gray-400"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="px-6"
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
      </div>
    </div>
  );
};

export default CreateBooking;
