
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Calculator, 
  User, 
  Plus, 
  Save, 
  ArrowLeft, 
  Trash2, 
  Calendar,
  DollarSign,
  Percent,
  Download,
  Send,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  company?: string;
}

interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const GenerateQuote = () => {
  const [clientName, setClientName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [quoteDetails, setQuoteDetails] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [taxRate, setTaxRate] = useState(16); // Default VAT rate
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [expiryDate, setExpiryDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState(0);
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

  const serviceCategories = [
    {
      category: 'Diplomatic Services',
      services: [
        { value: 'diplomatic-meeting', label: 'Diplomatic Meeting', icon: '🏛️' },
        { value: 'government-protocol', label: 'Government Protocol', icon: '📋' },
        { value: 'state-reception', label: 'State Reception', icon: '🎭' }
      ]
    },
    {
      category: 'Corporate Events',
      services: [
        { value: 'corporate-event', label: 'Corporate Event', icon: '🏢' },
        { value: 'business-summit', label: 'Business Summit', icon: '💼' },
        { value: 'executive-retreat', label: 'Executive Retreat', icon: '🏖️' }
      ]
    },
    {
      category: 'Special Events',
      services: [
        { value: 'charity-gala', label: 'Charity Gala', icon: '❤️' },
        { value: 'award-ceremony', label: 'Award Ceremony', icon: '🏆' },
        { value: 'cultural-exchange', label: 'Cultural Exchange', icon: '🌍' }
      ]
    }
  ];

  const addLineItem = () => {
    if (!newItemName || newItemQuantity <= 0 || newItemPrice <= 0) {
      toast({
        title: "Invalid Line Item",
        description: "Please fill in all fields with valid values.",
        variant: "destructive"
      });
      return;
    }

    const newItem: LineItem = {
      id: Date.now().toString(),
      name: newItemName,
      quantity: newItemQuantity,
      unitPrice: newItemPrice,
      total: newItemQuantity * newItemPrice
    };

    setLineItems([...lineItems, newItem]);
    setNewItemName('');
    setNewItemQuantity(1);
    setNewItemPrice(0);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (discountType === 'percentage') {
      return (subtotal * discountAmount) / 100;
    }
    return discountAmount;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return ((subtotal - discount) * taxRate) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();

    if (!clientName || !serviceType || lineItems.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and add at least one line item.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: isDraft ? "Quote Saved as Draft" : "Quote Generated",
        description: isDraft ? "Quote has been saved as draft." : "Quote has been successfully generated and is pending approval.",
      });

      // Reset form
      setClientName('');
      setServiceType('');
      setQuoteDetails('');
      setLineItems([]);
      setTaxRate(16);
      setDiscountAmount(0);
      setExpiryDate('');

      // Navigate to bookings page
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
    navigate('/bookings');
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Generate New Quote</h1>
              <p className="text-gray-600 mt-1">Create a professional service quote for VVIP clients</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">All fields marked with * are required</p>
            <Badge variant="outline" className="mt-1">
              Quote #{Date.now().toString().slice(-6)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Quote Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form className="space-y-6">
                  {/* Client Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="clientName" className="text-sm font-medium text-gray-700">
                      Client Name *
                    </Label>
                    <Select value={clientName} onValueChange={setClientName}>
                      <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 z-50">
                        {clients.map((client: Client) => (
                          <SelectItem key={client.id} value={client.full_name} className="hover:bg-blue-50">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-blue-600" />
                              <div>
                                <div className="font-medium">{client.full_name}</div>
                                {client.email && <div className="text-xs text-gray-500">{client.email}</div>}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Service Type */}
                  <div className="space-y-2">
                    <Label htmlFor="serviceType" className="text-sm font-medium text-gray-700">
                      Primary Service Type *
                    </Label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 z-50">
                        {serviceCategories.map((category) => (
                          <div key={category.category}>
                            <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              {category.category}
                            </div>
                            {category.services.map((service) => (
                              <SelectItem key={service.value} value={service.label} className="hover:bg-blue-50">
                                <div className="flex items-center">
                                  <span className="mr-2">{service.icon}</span>
                                  {service.label}
                                </div>
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Line Items Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-700">Service Line Items *</Label>
                      <Badge variant="outline">{lineItems.length} items</Badge>
                    </div>
                    
                    {/* Add New Line Item */}
                    <div className="grid grid-cols-12 gap-2 p-4 bg-gray-50 rounded-lg">
                      <div className="col-span-5">
                        <Input
                          placeholder="Service description"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          className="bg-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={newItemQuantity}
                          onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                          className="bg-white"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          placeholder="Unit Price (KES)"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(Number(e.target.value))}
                          className="bg-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <Button
                          type="button"
                          onClick={addLineItem}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Line Items List */}
                    {lineItems.length > 0 && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider px-2">
                          <div className="col-span-5">Description</div>
                          <div className="col-span-2">Quantity</div>
                          <div className="col-span-2">Unit Price</div>
                          <div className="col-span-2">Total</div>
                          <div className="col-span-1">Action</div>
                        </div>
                        {lineItems.map((item) => (
                          <div key={item.id} className="grid grid-cols-12 gap-2 p-2 border rounded hover:bg-gray-50">
                            <div className="col-span-5 font-medium">{item.name}</div>
                            <div className="col-span-2">{item.quantity}</div>
                            <div className="col-span-2">{formatCurrency(item.unitPrice)}</div>
                            <div className="col-span-2 font-semibold">{formatCurrency(item.total)}</div>
                            <div className="col-span-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLineItem(item.id)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tax and Discount */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center">
                        <Percent className="h-4 w-4 mr-1" />
                        Tax Rate (%)
                      </Label>
                      <Input
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        className="bg-white border-gray-300 focus:border-blue-500"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Discount
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={discountAmount}
                          onChange={(e) => setDiscountAmount(Number(e.target.value))}
                          className="bg-white border-gray-300 focus:border-blue-500"
                          min="0"
                        />
                        <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed') => setDiscountType(value)}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">%</SelectItem>
                            <SelectItem value="fixed">KES</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate" className="text-sm font-medium text-gray-700 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Quote Expiry Date
                    </Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="bg-white border-gray-300 focus:border-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Quote Details */}
                  <div className="space-y-2">
                    <Label htmlFor="quoteDetails" className="text-sm font-medium text-gray-700">
                      Additional Notes & Terms
                    </Label>
                    <Textarea
                      id="quoteDetails"
                      value={quoteDetails}
                      onChange={(e) => setQuoteDetails(e.target.value)}
                      placeholder="Enter additional terms, conditions, or special notes for this quote..."
                      rows={4}
                      className="bg-white border-gray-300 focus:border-blue-500 placeholder:text-gray-400"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Quote Preview Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm border-0 sticky top-6">
              <CardHeader className="border-b bg-blue-50">
                <CardTitle className="text-blue-900 flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Quote Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Client Info */}
                  {clientName && (
                    <div>
                      <h4 className="font-medium text-gray-900">Client</h4>
                      <p className="text-sm text-gray-600">{clientName}</p>
                    </div>
                  )}

                  {/* Service Type */}
                  {serviceType && (
                    <div>
                      <h4 className="font-medium text-gray-900">Service</h4>
                      <p className="text-sm text-gray-600">{serviceType}</p>
                    </div>
                  )}

                  {/* Line Items Summary */}
                  {lineItems.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Services</h4>
                      <div className="space-y-1">
                        {lineItems.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.name} ({item.quantity}x)</span>
                            <span className="font-medium">{formatCurrency(item.total)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Financial Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium text-red-600">-{formatCurrency(calculateDiscount())}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax ({taxRate}%)</span>
                      <span className="font-medium">{formatCurrency(calculateTax())}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-lg text-blue-600">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4">
                    <Button
                      onClick={(e) => handleSubmit(e, false)}
                      disabled={isSubmitting || !clientName || !serviceType || lineItems.length === 0}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Generate Quote
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={(e) => handleSubmit(e, true)}
                      disabled={isSubmitting}
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Save as Draft
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateQuote;
