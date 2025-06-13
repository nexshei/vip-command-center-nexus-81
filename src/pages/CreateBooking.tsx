
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Calendar as CalendarIcon, Clock, User, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreateBooking = () => {
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const { toast } = useToast();

  const services = [
    { id: '1', name: 'VIP Airport Transfer', duration: '2 hours', capacity: '4 passengers' },
    { id: '2', name: 'Executive Meeting Setup', duration: '4 hours', capacity: '20 people' },
    { id: '3', name: 'Luxury Event Planning', duration: '8 hours', capacity: '100 guests' },
    { id: '4', name: 'Private Security Detail', duration: '12 hours', capacity: '1 client' },
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const mockClients = [
    'Hon. Peter Maina',
    'Dr. Sarah Wanjiku', 
    'Mr. James Kimani',
    'Ms. Grace Mutua'
  ];

  const handleSaveBooking = () => {
    toast({
      title: "Booking Created Successfully",
      description: "The VIP booking has been saved to the system.",
    });
    // Reset form
    setStep(1);
    setSelectedClient('');
    setSelectedService('');
    setSelectedDate(undefined);
    setSelectedTime('');
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">New Booking Creation</h1>
          <p className="text-vip-gold/80 mt-2">Create VIP bookings with our streamlined booking wizard</p>
        </div>
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`flex items-center ${i < 3 ? 'mr-2' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= i ? 'bg-vip-gold text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > i ? <CheckCircle className="h-4 w-4" /> : i}
              </div>
              {i < 3 && <div className={`w-8 h-0.5 ${step > i ? 'bg-vip-gold' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center text-vip-black">
                Step {step} of 3
                {step === 1 && <><User className="h-5 w-5 ml-2 text-vip-gold" /> Client & Service</>}
                {step === 2 && <><CalendarIcon className="h-5 w-5 ml-2 text-vip-gold" /> Date & Time</>}
                {step === 3 && <><CheckCircle className="h-5 w-5 ml-2 text-vip-gold" /> Confirmation</>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 1 && (
                <>
                  {/* Client Selection */}
                  <div className="space-y-3">
                    <Label className="text-vip-black font-medium">Select Client *</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
                      <Select value={selectedClient} onValueChange={setSelectedClient}>
                        <SelectTrigger className="pl-10 border-vip-gold/30 focus:border-vip-gold">
                          <SelectValue placeholder="Search and select client..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockClients.map((client) => (
                            <SelectItem key={client} value={client}>{client}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" size="sm" className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Client
                    </Button>
                  </div>

                  {/* Service Selection */}
                  <div className="space-y-3">
                    <Label className="text-vip-black font-medium">Select Service *</Label>
                    <div className="grid gap-3">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedService === service.id
                              ? 'border-vip-gold bg-vip-gold/10'
                              : 'border-vip-gold/20 hover:border-vip-gold/40'
                          }`}
                          onClick={() => setSelectedService(service.id)}
                        >
                          <h4 className="font-medium text-vip-black">{service.name}</h4>
                          <div className="flex space-x-4 mt-2 text-sm text-vip-gold/80">
                            <span><Clock className="h-3 w-3 inline mr-1" />{service.duration}</span>
                            <span><User className="h-3 w-3 inline mr-1" />{service.capacity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  {/* Date Selection */}
                  <div className="space-y-3">
                    <Label className="text-vip-black font-medium">Select Date *</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border border-vip-gold/20"
                      disabled={(date) => date < new Date()}
                    />
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div className="space-y-3">
                      <Label className="text-vip-black font-medium">Select Time *</Label>
                      <div className="grid grid-cols-5 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className={selectedTime === time ? "bg-vip-gold text-white" : "border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-vip-black">Booking Confirmation</h3>
                  <div className="space-y-3 p-4 bg-vip-gold/5 rounded-lg border border-vip-gold/20">
                    <div className="flex justify-between">
                      <span className="text-vip-gold/80">Client:</span>
                      <span className="font-medium text-vip-black">{selectedClient}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-vip-gold/80">Service:</span>
                      <span className="font-medium text-vip-black">
                        {services.find(s => s.id === selectedService)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-vip-gold/80">Date:</span>
                      <span className="font-medium text-vip-black">
                        {selectedDate?.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-vip-gold/80">Time:</span>
                      <span className="font-medium text-vip-black">{selectedTime}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-vip-gold/20">
                <Button
                  variant="outline"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                >
                  Previous
                </Button>
                {step < 3 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={
                      (step === 1 && (!selectedClient || !selectedService)) ||
                      (step === 2 && (!selectedDate || !selectedTime))
                    }
                    className="bg-vip-gold text-white hover:bg-vip-gold-dark"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSaveBooking}
                    className="bg-vip-gold text-white hover:bg-vip-gold-dark"
                  >
                    Save Booking
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div>
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-vip-black">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-vip-gold/80">Client</span>
                  <p className="font-medium text-vip-black">
                    {selectedClient || 'Not selected'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-vip-gold/80">Service</span>
                  <p className="font-medium text-vip-black">
                    {services.find(s => s.id === selectedService)?.name || 'Not selected'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-vip-gold/80">Date & Time</span>
                  <p className="font-medium text-vip-black">
                    {selectedDate && selectedTime 
                      ? `${selectedDate.toLocaleDateString()} at ${selectedTime}`
                      : 'Not selected'
                    }
                  </p>
                </div>
              </div>
              
              {selectedClient && selectedService && selectedDate && selectedTime && (
                <div className="pt-4 border-t border-vip-gold/20">
                  <Badge className="bg-ios-green text-white">
                    Ready to Save
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;
