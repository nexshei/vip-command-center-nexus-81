import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Trash2, FileText, Mail, Save, Calculator, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuoteItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const GenerateQuote = () => {
  const [selectedClient, setSelectedClient] = useState('');
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const { toast } = useToast();

  const predefinedServices = [
    { id: '1', name: 'VIP Airport Transfer', price: 15000 },
    { id: '2', name: 'Executive Meeting Setup', price: 25000 },
    { id: '3', name: 'Luxury Event Planning', price: 150000 },
    { id: '4', name: 'Private Security Detail', price: 50000 },
    { id: '5', name: 'Catering Services', price: 8000 },
  ];

  const mockClients = [
    'Hon. Peter Maina',
    'Dr. Sarah Wanjiku', 
    'Mr. James Kimani',
    'Ms. Grace Mutua'
  ];

  const addPredefinedItem = (serviceId: string) => {
    const service = predefinedServices.find(s => s.id === serviceId);
    if (service) {
      const newItem: QuoteItem = {
        id: Date.now().toString(),
        name: service.name,
        quantity: 1,
        unitPrice: service.price,
        total: service.price
      };
      setQuoteItems([...quoteItems, newItem]);
      toast({
        title: "Service Added",
        description: `${service.name} added to quote.`,
      });
    }
  };

  const addCustomItem = () => {
    if (!customItemName.trim()) {
      toast({
        title: "Missing Item Name",
        description: "Please enter an item name.",
        variant: "destructive"
      });
      return;
    }
    
    if (!customItemPrice || parseFloat(customItemPrice) <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price.",
        variant: "destructive"
      });
      return;
    }

    const newItem: QuoteItem = {
      id: Date.now().toString(),
      name: customItemName.trim(),
      quantity: 1,
      unitPrice: parseFloat(customItemPrice),
      total: parseFloat(customItemPrice)
    };
    setQuoteItems([...quoteItems, newItem]);
    setCustomItemName('');
    setCustomItemPrice('');
    toast({
      title: "Custom Item Added",
      description: `${customItemName} added to quote.`,
    });
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setQuoteItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity, total: item.unitPrice * quantity }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setQuoteItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "Item has been removed from the quote.",
    });
  };

  const subtotal = quoteItems.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = discountType === 'percentage' 
    ? (subtotal * (parseFloat(discountValue) || 0)) / 100
    : parseFloat(discountValue) || 0;
  const finalTotal = subtotal - discountAmount;

  const handleGenerateQuote = () => {
    if (!selectedClient) {
      toast({
        title: "Client Required",
        description: "Please select a client before generating the quote.",
        variant: "destructive"
      });
      return;
    }

    if (quoteItems.length === 0) {
      toast({
        title: "No Items",
        description: "Please add at least one item to generate a quote.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Quote Generated Successfully",
      description: `Quote for ${selectedClient} has been created with ${quoteItems.length} items totaling KSh ${finalTotal.toLocaleString()}.`,
    });
  };

  const handleGeneratePDF = () => {
    if (!selectedClient || quoteItems.length === 0) {
      toast({
        title: "Cannot Generate PDF",
        description: "Please select a client and add items first.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "PDF Generated",
      description: "Quote PDF has been generated successfully.",
    });
  };

  const handleSendEmail = () => {
    if (!selectedClient || quoteItems.length === 0) {
      toast({
        title: "Cannot Send Email",
        description: "Please complete the quote first.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Quote Sent",
      description: "Quote has been sent to client via email.",
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Quote draft has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-black text-vip-gold p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with prominent action buttons */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-vip-gold mb-2">Generate Professional Quote</h1>
            <p className="text-vip-gold/70 text-lg">Create detailed quotes for VIP services and events</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleSaveDraft} 
              variant="outline" 
              size="lg"
              className="border-2 border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-black transition-all duration-300 px-6 py-3 text-base font-medium bg-transparent"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Draft
            </Button>
            <Button 
              onClick={handleGenerateQuote} 
              size="lg"
              className="bg-vip-gold text-black hover:bg-vip-gold-light px-8 py-3 text-base font-medium shadow-lg"
              disabled={!selectedClient || quoteItems.length === 0}
            >
              <Calculator className="h-5 w-5 mr-2" />
              Generate Quote
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Quote Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Client Selection */}
            <Card className="bg-gray-900 border border-vip-gold/30 shadow-xl">
              <CardHeader className="bg-vip-gold/10 border-b border-vip-gold/30">
                <CardTitle className="flex items-center text-vip-gold text-xl">
                  <Users className="h-6 w-6 mr-3" />
                  Step 1: Select Client
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Label className="text-vip-gold font-semibold text-base">Choose Client *</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-vip-gold/60" />
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger className="pl-12 h-12 border-2 border-vip-gold/30 focus:border-vip-gold text-vip-gold text-base bg-black">
                        <SelectValue placeholder="Search and select client..." />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-2 border-vip-gold">
                        {mockClients.map((client) => (
                          <SelectItem key={client} value={client} className="text-vip-gold hover:bg-vip-gold/20">
                            {client}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" className="border-2 border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-black bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Client
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Add Services */}
            <Card className="bg-gray-900 border border-vip-gold/30 shadow-xl">
              <CardHeader className="bg-vip-gold/10 border-b border-vip-gold/30">
                <CardTitle className="text-vip-gold text-xl">Step 2: Add Services & Items</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Quick Add Services */}
                <div className="space-y-4">
                  <Label className="text-vip-gold font-semibold text-base">Quick Add Services</Label>
                  <Select onValueChange={addPredefinedItem}>
                    <SelectTrigger className="h-12 border-2 border-vip-gold/30 focus:border-vip-gold text-vip-gold text-base bg-black">
                      <SelectValue placeholder="Select a service to add..." />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-2 border-vip-gold">
                      {predefinedServices.map((service) => (
                        <SelectItem key={service.id} value={service.id} className="text-vip-gold hover:bg-vip-gold/20">
                          {service.name} - KSh {service.price.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Item */}
                <div className="space-y-4 p-4 border-2 border-vip-gold/30 rounded-lg bg-gray-800">
                  <Label className="text-vip-gold font-semibold text-base">Add Custom Item</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Item name"
                      value={customItemName}
                      onChange={(e) => setCustomItemName(e.target.value)}
                      className="md:col-span-2 h-12 border-2 border-vip-gold/30 focus:border-vip-gold text-vip-gold bg-black"
                    />
                    <Input
                      placeholder="Price (KSh)"
                      type="number"
                      value={customItemPrice}
                      onChange={(e) => setCustomItemPrice(e.target.value)}
                      className="h-12 border-2 border-vip-gold/30 focus:border-vip-gold text-vip-gold bg-black"
                    />
                  </div>
                  <Button 
                    onClick={addCustomItem}
                    className="w-full bg-vip-gold text-black hover:bg-vip-gold-light h-12 text-base font-medium"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Custom Item
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Review Items */}
            {quoteItems.length > 0 && (
              <Card className="bg-gray-900 border border-vip-gold/30 shadow-xl">
                <CardHeader className="bg-vip-gold/10 border-b border-vip-gold/30">
                  <CardTitle className="text-vip-gold text-xl">Step 3: Review Quote Items</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {quoteItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border-2 border-vip-gold/30 rounded-lg bg-gray-800">
                        <div className="flex-1">
                          <h4 className="font-semibold text-vip-gold text-base">{item.name}</h4>
                          <p className="text-vip-gold/70">KSh {item.unitPrice.toLocaleString()} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label className="text-vip-gold font-medium">Qty:</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-20 h-10 border-2 border-vip-gold/30 focus:border-vip-gold text-vip-gold text-center bg-black"
                          />
                        </div>
                        <div className="text-right min-w-[120px]">
                          <p className="font-bold text-vip-gold text-lg">KSh {item.total.toLocaleString()}</p>
                        </div>
                        <Button
                          onClick={() => removeItem(item.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500 bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Discount Section */}
                  <div className="mt-6 pt-6 border-t-2 border-vip-gold/30">
                    <div className="space-y-4">
                      <Label className="text-vip-gold font-semibold text-base">Apply Discount (Optional)</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select value={discountType} onValueChange={setDiscountType}>
                          <SelectTrigger className="h-12 border-2 border-vip-gold/30 focus:border-vip-gold text-vip-gold bg-black">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-2 border-vip-gold">
                            <SelectItem value="percentage" className="text-vip-gold">Percentage (%)</SelectItem>
                            <SelectItem value="fixed" className="text-vip-gold">Fixed Amount (KSh)</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder={discountType === 'percentage' ? '10' : '5000'}
                          type="number"
                          value={discountValue}
                          onChange={(e) => setDiscountValue(e.target.value)}
                          className="md:col-span-2 h-12 border-2 border-vip-gold/30 focus:border-vip-gold text-vip-gold bg-black"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quote Summary & Actions */}
          <div className="space-y-6">
            {/* Financial Summary */}
            <Card className="bg-gray-900 border border-vip-gold/30 shadow-xl">
              <CardHeader className="bg-vip-gold/10 border-b border-vip-gold/30">
                <CardTitle className="flex items-center text-vip-gold text-xl">
                  <Calculator className="h-6 w-6 mr-3" />
                  Quote Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-vip-gold/70 font-medium">Items:</span>
                    <span className="font-semibold text-vip-gold text-lg">{quoteItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-vip-gold/70 font-medium">Subtotal:</span>
                    <span className="font-semibold text-vip-gold text-lg">KSh {subtotal.toLocaleString()}</span>
                  </div>
                  {discountValue && (
                    <div className="flex justify-between items-center">
                      <span className="text-vip-gold/70 font-medium">
                        Discount ({discountType === 'percentage' ? `${discountValue}%` : 'Fixed'}):
                      </span>
                      <span className="font-semibold text-red-400 text-lg">-KSh {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-vip-gold/30 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-vip-gold">Total:</span>
                      <span className="text-2xl font-bold text-vip-gold">KSh {finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {selectedClient && quoteItems.length > 0 && (
                  <Badge className="bg-green-600 text-white w-full justify-center py-2 text-base">
                    Quote Ready to Generate
                  </Badge>
                )}
                
                {(!selectedClient || quoteItems.length === 0) && (
                  <Badge variant="outline" className="border-2 border-vip-gold/30 text-vip-gold/70 w-full justify-center py-2 text-base bg-transparent">
                    Complete Steps Above
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-gray-900 border border-vip-gold/30 shadow-xl">
              <CardHeader className="bg-vip-gold/10 border-b border-vip-gold/30">
                <CardTitle className="text-vip-gold text-xl">Quote Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button 
                  onClick={handleGeneratePDF} 
                  className="w-full bg-vip-gold text-black hover:bg-vip-gold-light h-12 text-base font-medium"
                  disabled={!selectedClient || quoteItems.length === 0}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  onClick={handleSendEmail} 
                  variant="outline" 
                  className="w-full border-2 border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-black h-12 text-base font-medium bg-transparent"
                  disabled={!selectedClient || quoteItems.length === 0}
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Email to Client
                </Button>
              </CardContent>
            </Card>

            {/* Quote Preview */}
            {selectedClient && quoteItems.length > 0 && (
              <Card className="bg-gray-900 border border-vip-gold/30 shadow-xl">
                <CardHeader className="bg-vip-gold/10 border-b border-vip-gold/30">
                  <CardTitle className="text-vip-gold text-xl">Quote Preview</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 p-4 bg-gray-800 border-2 border-vip-gold/30 rounded-lg text-vip-gold">
                    <div className="text-center border-b-2 border-vip-gold/30 pb-4">
                      <h3 className="font-bold text-xl text-vip-gold">Sir Dennis Olele VVIP Protocol</h3>
                      <p className="text-vip-gold/70 text-base">Professional Quote</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-base"><strong>Client:</strong> {selectedClient}</p>
                      <p className="text-base"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                      <p className="text-base"><strong>Quote #:</strong> Q{Date.now().toString().slice(-6)}</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-base">Services:</h4>
                      {quoteItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} (x{item.quantity})</span>
                          <span className="font-medium">KSh {item.total.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t-2 border-vip-gold/30 pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-vip-gold">KSh {finalTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateQuote;
