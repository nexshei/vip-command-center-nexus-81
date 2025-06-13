
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Trash2, FileText, Mail, Save, Calculator } from 'lucide-react';
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
  };

  const subtotal = quoteItems.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = discountType === 'percentage' 
    ? (subtotal * (parseFloat(discountValue) || 0)) / 100
    : parseFloat(discountValue) || 0;
  const finalTotal = subtotal - discountAmount;

  const handleGeneratePDF = () => {
    toast({
      title: "PDF Generated",
      description: "Quote PDF has been generated successfully.",
    });
  };

  const handleSendEmail = () => {
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
          <h1 className="text-3xl font-serif font-bold text-vip-black">New Quote Generation</h1>
          <p className="text-vip-gold/80 mt-2">Create professional quotes with our interactive quote builder</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleSaveDraft} variant="outline" className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSendEmail} variant="outline" className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
            <Mail className="h-4 w-4 mr-2" />
            Send Quote
          </Button>
          <Button onClick={handleGeneratePDF} className="bg-vip-gold text-white hover:bg-vip-gold-dark">
            <FileText className="h-4 w-4 mr-2" />
            Generate PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quote Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Selection */}
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-vip-black">Client Information</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Services & Items */}
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-vip-black">Quote Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Predefined Services */}
              <div className="space-y-3">
                <Label className="text-vip-black font-medium">Add Predefined Services</Label>
                <Select onValueChange={addPredefinedItem}>
                  <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold">
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
                <Label className="text-vip-black font-medium">Add Custom Item</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    placeholder="Item name"
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    className="col-span-2 border-vip-gold/30 focus:border-vip-gold"
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    value={customItemPrice}
                    onChange={(e) => setCustomItemPrice(e.target.value)}
                    className="border-vip-gold/30 focus:border-vip-gold"
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
                  Add Item
                </Button>
              </div>

              {/* Items List */}
              {quoteItems.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-vip-black font-medium">Quote Items</Label>
                  <div className="space-y-2">
                    {quoteItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 border border-vip-gold/20 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-vip-black">{item.name}</h4>
                          <p className="text-sm text-vip-gold/80">KSh {item.unitPrice.toLocaleString()} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm text-vip-gold/80">Qty:</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 border-vip-gold/30 focus:border-vip-gold"
                          />
                        </div>
                        <div className="text-right min-w-[80px]">
                          <p className="font-medium text-vip-black">KSh {item.total.toLocaleString()}</p>
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
                </div>
              )}

              {/* Discount */}
              <div className="space-y-3">
                <Label className="text-vip-black font-medium">Discount (Optional)</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Select value={discountType} onValueChange={setDiscountType}>
                    <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder={discountType === 'percentage' ? '10' : '5000'}
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="col-span-2 border-vip-gold/30 focus:border-vip-gold"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quote Preview & Total */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center text-vip-black">
                <Calculator className="h-5 w-5 mr-2 text-vip-gold" />
                Quote Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-vip-gold/80">Subtotal:</span>
                  <span className="font-medium text-vip-black">KSh {subtotal.toLocaleString()}</span>
                </div>
                {discountValue && (
                  <div className="flex justify-between">
                    <span className="text-vip-gold/80">
                      Discount ({discountType === 'percentage' ? `${discountValue}%` : 'Fixed'}):
                    </span>
                    <span className="font-medium text-red-600">-KSh {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-vip-gold/20 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-vip-black">Total:</span>
                    <span className="text-lg font-bold text-vip-gold">KSh {finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {quoteItems.length > 0 && (
                <Badge className="bg-ios-green text-white w-full justify-center">
                  Quote Ready
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Quote Preview */}
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-vip-black">Quote Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-lg text-sm">
                <div className="text-center border-b pb-4">
                  <h3 className="font-bold text-lg">Sir Dennis Olele VVIP Protocol</h3>
                  <p className="text-gray-600">Professional Quote</p>
                </div>
                
                <div>
                  <p><strong>Client:</strong> {selectedClient || 'Not Selected'}</p>
                  <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  <p><strong>Quote #:</strong> Q{Date.now().toString().slice(-6)}</p>
                </div>

                {quoteItems.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Items:</h4>
                    {quoteItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>KSh {item.total.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>KSh {finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GenerateQuote;
