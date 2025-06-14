
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
    if (customItemName && customItemPrice) {
      const newItem: QuoteItem = {
        id: Date.now().toString(),
        name: customItemName,
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
    }
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
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Generate Professional Quote</h1>
          <p className="text-vip-gold/80 mt-2">Create detailed quotes for VIP services and events</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleSaveDraft} variant="outline" className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button 
            onClick={handleGenerateQuote} 
            className="bg-vip-gold text-black hover:bg-vip-gold-dark"
            disabled={!selectedClient || quoteItems.length === 0}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Generate Quote
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quote Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Client Selection */}
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Users className="h-5 w-5 mr-2 text-vip-gold" />
                Step 1: Select Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label className="text-white font-medium">Choose Client *</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger className="pl-10 border-vip-gold/30 focus:border-vip-gold bg-white text-black">
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
            </CardContent>
          </Card>

          {/* Step 2: Add Services */}
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-white">Step 2: Add Services & Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Add Services */}
              <div className="space-y-3">
                <Label className="text-white font-medium">Quick Add Services</Label>
                <Select onValueChange={addPredefinedItem}>
                  <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold bg-white text-black">
                    <SelectValue placeholder="Select a service to add..." />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - KSh {service.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Item */}
              <div className="space-y-3">
                <Label className="text-white font-medium">Add Custom Item</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    placeholder="Item name"
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    className="col-span-2 border-vip-gold/30 focus:border-vip-gold bg-white text-black"
                  />
                  <Input
                    placeholder="Price (KSh)"
                    type="number"
                    value={customItemPrice}
                    onChange={(e) => setCustomItemPrice(e.target.value)}
                    className="border-vip-gold/30 focus:border-vip-gold bg-white text-black"
                  />
                </div>
                <Button 
                  onClick={addCustomItem}
                  disabled={!customItemName || !customItemPrice}
                  variant="outline" 
                  size="sm" 
                  className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Review Items */}
          {quoteItems.length > 0 && (
            <Card className="vip-glass border-vip-gold/20">
              <CardHeader>
                <CardTitle className="text-white">Step 3: Review Quote Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quoteItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 border border-vip-gold/20 rounded-lg bg-black/20">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{item.name}</h4>
                        <p className="text-sm text-vip-gold/80">KSh {item.unitPrice.toLocaleString()} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm text-vip-gold/80">Qty:</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 border-vip-gold/30 focus:border-vip-gold bg-white text-black"
                        />
                      </div>
                      <div className="text-right min-w-[100px]">
                        <p className="font-medium text-vip-gold">KSh {item.total.toLocaleString()}</p>
                      </div>
                      <Button
                        onClick={() => removeItem(item.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Discount Section */}
                <div className="mt-6 pt-4 border-t border-vip-gold/20">
                  <div className="space-y-3">
                    <Label className="text-white font-medium">Apply Discount (Optional)</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Select value={discountType} onValueChange={setDiscountType}>
                        <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold bg-white text-black">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount (KSh)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder={discountType === 'percentage' ? '10' : '5000'}
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        className="col-span-2 border-vip-gold/30 focus:border-vip-gold bg-white text-black"
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
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Calculator className="h-5 w-5 mr-2 text-vip-gold" />
                Quote Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-vip-gold/80">Items:</span>
                  <span className="font-medium text-white">{quoteItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vip-gold/80">Subtotal:</span>
                  <span className="font-medium text-white">KSh {subtotal.toLocaleString()}</span>
                </div>
                {discountValue && (
                  <div className="flex justify-between">
                    <span className="text-vip-gold/80">
                      Discount ({discountType === 'percentage' ? `${discountValue}%` : 'Fixed'}):
                    </span>
                    <span className="font-medium text-red-400">-KSh {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-vip-gold/20 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-white">Total:</span>
                    <span className="text-xl font-bold text-vip-gold">KSh {finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {selectedClient && quoteItems.length > 0 && (
                <Badge className="bg-ios-green text-white w-full justify-center">
                  Quote Ready to Generate
                </Badge>
              )}
              
              {(!selectedClient || quoteItems.length === 0) && (
                <Badge variant="outline" className="border-vip-gold/30 text-vip-gold w-full justify-center">
                  Complete Steps Above
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-white">Quote Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleGeneratePDF} 
                className="w-full bg-vip-gold text-black hover:bg-vip-gold-dark"
                disabled={!selectedClient || quoteItems.length === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button 
                onClick={handleSendEmail} 
                variant="outline" 
                className="w-full border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                disabled={!selectedClient || quoteItems.length === 0}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email to Client
              </Button>
            </CardContent>
          </Card>

          {/* Quote Preview */}
          {selectedClient && quoteItems.length > 0 && (
            <Card className="vip-glass border-vip-gold/20">
              <CardHeader>
                <CardTitle className="text-white">Quote Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-lg text-sm text-black">
                  <div className="text-center border-b pb-4">
                    <h3 className="font-bold text-lg">Sir Dennis Olele VVIP Protocol</h3>
                    <p className="text-gray-600">Professional Quote</p>
                  </div>
                  
                  <div>
                    <p><strong>Client:</strong> {selectedClient}</p>
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>Quote #:</strong> Q{Date.now().toString().slice(-6)}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Services:</h4>
                    {quoteItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>KSh {item.total.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>KSh {finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateQuote;
