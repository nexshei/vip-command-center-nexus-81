import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Calculator, User, Plus, Save, ArrowLeft } from 'lucide-react';
import { AddClientModal } from '@/components/modals/AddClientModal';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeQuery } from '@/hooks/useRealtimeQuery';

interface Client {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  company?: string;
}

const GenerateQuote = () => {
  const [clientName, setClientName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [quoteDetails, setQuoteDetails] = useState('');
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [showAddClient, setShowAddClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch existing clients from database
  const { data: clientsData, isLoading: clientsLoading } = useRealtimeQuery("clients");

  const serviceOptions = [
    { value: 'diplomatic-meeting', label: 'Diplomatic Meeting' },
    { value: 'corporate-event', label: 'Corporate Event' },
    { value: 'government-protocol', label: 'Government Protocol' },
    { value: 'state-reception', label: 'State Reception' },
    { value: 'business-summit', label: 'Business Summit' },
    { value: 'cultural-exchange', label: 'Cultural Exchange' },
    { value: 'charity-gala', label: 'Charity Gala' },
    { value: 'award-ceremony', label: 'Award Ceremony' },
    { value: 'executive-retreat', label: 'Executive Retreat' },
    { value: 'international-conference', label: 'International Conference' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName || !serviceType || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('quotes')
        .insert([
          {
            requester_name: clientName,
            requested_service: serviceType,
            amount: amount,
            quote_details: quoteDetails,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating quote:', error);
        toast({
          title: "Error",
          description: "Failed to generate quote. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Quote Generated",
        description: "Quote has been successfully generated.",
      });

      // Reset form
      setClientName('');
      setServiceType('');
      setQuoteDetails('');
      setAmount(undefined);

      // Navigate to quotes page
      navigate('/bookings');

    } catch (error) {
      console.error('Error generating quote:', error);
      toast({
        title: "Error",
        description: "Failed to generate quote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to the bookings page
    navigate('/bookings');
  };

  const handleClientAdded = (newClient: Client) => {
    setClientName(newClient.full_name);
    toast({
      title: "Client Added",
      description: `${newClient.full_name} has been added to your client list.`,
    });
  };

  // Type guard for safe client data usage
  const getValidClients = (): Client[] => {
    if (!Array.isArray(clientsData) || clientsData.length === 0) {
      return [];
    }
    
    const firstItem = clientsData[0];
    
    // Check for null/undefined and ensure it's an object with required properties
    if (!firstItem || typeof firstItem !== 'object') {
      return [];
    }
    
    // Check if firstItem has required properties
    if ('id' in firstItem && 'full_name' in firstItem) {
      return clientsData as unknown as Client[];
    }
    
    return [];
  };

  const validClients = getValidClients();

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
              <h1 className="text-3xl font-bold text-gray-900">Generate New Quote</h1>
              <p className="text-gray-600 mt-1">Create a new service quote for a VVIP client</p>
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
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Quote Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Name */}
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-sm font-medium text-gray-700">
                  Client Name *
                </Label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Select value={clientName} onValueChange={setClientName}>
                      <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
                        <SelectValue placeholder="Select client" />
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
              </div>

              {/* Service Type */}
              <div className="space-y-2">
                <Label htmlFor="serviceType" className="text-sm font-medium text-gray-700">
                  Service Type *
                </Label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 z-50">
                    {serviceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.label} className="hover:bg-blue-50">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                  Amount (KSH) *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount !== undefined ? amount.toString() : ''}
                  onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Enter amount"
                  className="bg-white border-gray-300 focus:border-blue-500"
                />
              </div>

              {/* Quote Details */}
              <div className="space-y-2">
                <Label htmlFor="quoteDetails" className="text-sm font-medium text-gray-700">
                  Quote Details
                </Label>
                <Textarea
                  id="quoteDetails"
                  value={quoteDetails}
                  onChange={(e) => setQuoteDetails(e.target.value)}
                  placeholder="Enter quote details..."
                  rows={4}
                  className="bg-white border-gray-300 focus:border-blue-500 placeholder:text-gray-400"
                />
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
                      Generating...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Generate Quote
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

export default GenerateQuote;
