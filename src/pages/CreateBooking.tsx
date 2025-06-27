
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, MapPin, Clock, ArrowLeft, Save, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useBookingDocuments } from '@/hooks/useBookingDocuments';
import { Database } from '@/integrations/supabase/types';

type EventType = Database['public']['Enums']['event_type'];
type ProtocolOfficersRange = Database['public']['Enums']['protocol_officers_range'];
type RequestStatus = Database['public']['Enums']['request_status'];

const CreateBooking = () => {
  const [clientName, setClientName] = useState('');
  const [eventType, setEventType] = useState<EventType | ''>('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [vision, setVision] = useState('');
  const [protocolOfficers, setProtocolOfficers] = useState<ProtocolOfficersRange | ''>('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { saveBookingDocument, isUploading } = useBookingDocuments();

  const eventTypes: EventType[] = [
    'corporate',
    'wedding', 
    'diplomatic',
    'private',
    'government',
    'other'
  ];

  const protocolOfficersRanges: ProtocolOfficersRange[] = [
    '1-5',
    '5-10', 
    '10-20',
    '20+'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName || !eventType || !eventDate || !contactEmail || !contactPhone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Client Name, Event Type, Date, Email, and Phone).",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        full_name: clientName.trim(),
        email: contactEmail.trim(),
        phone: contactPhone.trim(),
        event_type: eventType as EventType,
        event_date: eventDate,
        location: eventLocation.trim() || null,
        vision: vision.trim() || null,
        protocol_officers: protocolOfficers as ProtocolOfficersRange || null,
        status: 'pending' as RequestStatus
      };

      const { data, error } = await supabase
        .from('meeting_requests')
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;

      // Save document to storage bucket
      try {
        await saveBookingDocument(data.id, { ...bookingData, id: data.id });
      } catch (storageError) {
        console.warn('Document storage failed, but booking was created:', storageError);
        // Don't fail the entire operation if storage fails
      }

      toast({
        title: "Booking Created Successfully",
        description: "The meeting request has been submitted and document saved.",
      });

      // Reset form
      setClientName('');
      setEventType('');
      setEventDate('');
      setEventLocation('');
      setVision('');
      setProtocolOfficers('');
      setContactEmail('');
      setContactPhone('');

      // Navigate to bookings list
      navigate('/list-bookings');

    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/list-bookings');
  };

  const isProcessing = isSubmitting || isUploading;

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
              disabled={isProcessing}
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
              {/* Client Name - Now a simple input */}
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-sm font-medium text-gray-700">
                  Client Name *
                </Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter client full name"
                  className="bg-white border-gray-300 focus:border-blue-500"
                  required
                  disabled={isProcessing}
                />
              </div>

              {/* Event Type and Protocol Officers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="eventType" className="text-sm font-medium text-gray-700">
                    Event Type *
                  </Label>
                  <Select value={eventType} onValueChange={(value: EventType) => setEventType(value)} required disabled={isProcessing}>
                    <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 z-50">
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type} className="hover:bg-blue-50">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="protocolOfficers" className="text-sm font-medium text-gray-700">
                    Protocol Officers Range
                  </Label>
                  <Select value={protocolOfficers} onValueChange={(value: ProtocolOfficersRange) => setProtocolOfficers(value)} disabled={isProcessing}>
                    <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 z-50">
                      {protocolOfficersRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    required
                    disabled={isProcessing}
                  />
                </div>

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
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
                    Contact Email *
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Primary contact email"
                    className="bg-white border-gray-300 focus:border-blue-500"
                    required
                    disabled={isProcessing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">
                    Contact Phone *
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Primary contact phone"
                    className="bg-white border-gray-300 focus:border-blue-500"
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Vision/Description */}
              <div className="space-y-2">
                <Label htmlFor="vision" className="text-sm font-medium text-gray-700">
                  Event Vision/Description
                </Label>
                <Textarea
                  id="vision"
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  placeholder="Provide details about the event vision, purpose, agenda, special requirements, etc."
                  rows={4}
                  className="bg-white border-gray-300 focus:border-blue-500 placeholder:text-gray-400"
                  disabled={isProcessing}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="px-6"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isSubmitting ? 'Creating...' : 'Saving...'}
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
