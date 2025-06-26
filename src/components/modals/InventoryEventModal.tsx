
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package, Users, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: string;
  item_name: string;
  quantity: number;
  location: string;
  status: string;
}

interface EventAllocation {
  itemId: string;
  itemName: string;
  allocatedQuantity: number;
  returnedQuantity: number;
  status: 'allocated' | 'returned' | 'missing';
}

interface InventoryEventModalProps {
  inventoryItems: InventoryItem[];
  onEventCreated: (eventData: any) => void;
}

export const InventoryEventModal = ({ inventoryItems, onEventCreated }: InventoryEventModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [allocations, setAllocations] = useState<EventAllocation[]>([]);
  const { toast } = useToast();

  const addAllocation = () => {
    setAllocations(prev => [...prev, {
      itemId: '',
      itemName: '',
      allocatedQuantity: 0,
      returnedQuantity: 0,
      status: 'allocated'
    }]);
  };

  const updateAllocation = (index: number, field: keyof EventAllocation, value: any) => {
    setAllocations(prev => prev.map((allocation, i) => 
      i === index ? { ...allocation, [field]: value } : allocation
    ));
  };

  const removeAllocation = (index: number) => {
    setAllocations(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      id: Date.now().toString(),
      name: eventName,
      date: eventDate,
      allocations: allocations.filter(a => a.itemId && a.allocatedQuantity > 0),
      status: 'active',
      created_at: new Date().toISOString()
    };

    onEventCreated(eventData);
    
    toast({
      title: "Event Created",
      description: `${eventName} inventory tracking has been set up successfully.`,
    });

    // Reset form
    setEventName('');
    setEventDate('');
    setAllocations([]);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
          <Calendar className="h-4 w-4 mr-2" />
          Track Event Inventory
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] vip-glass border-vip-gold/20 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold flex items-center">
            <Package className="h-5 w-5 mr-2 text-vip-gold" />
            Create Event Inventory Tracking
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventName" className="text-sm font-medium text-vip-black">Event Name *</Label>
              <Input
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. VIP State Dinner"
                required
                className="border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDate" className="text-sm font-medium text-vip-black">Event Date *</Label>
              <Input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-vip-black">Inventory Allocations</Label>
              <Button type="button" onClick={addAllocation} variant="outline" size="sm" className="border-vip-gold/30 text-vip-gold">
                Add Item
              </Button>
            </div>
            
            {allocations.map((allocation, index) => (
              <div key={index} className="p-4 border border-vip-gold/20 rounded-lg bg-white/50">
                <div className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-4">
                    <Label className="text-xs text-vip-black/70">Item</Label>
                    <Select 
                      value={allocation.itemId} 
                      onValueChange={(value) => {
                        const item = inventoryItems.find(i => i.id === value);
                        updateAllocation(index, 'itemId', value);
                        updateAllocation(index, 'itemName', item?.item_name || '');
                      }}
                    >
                      <SelectTrigger className="border-vip-gold/30">
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryItems.map(item => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.item_name} (Available: {item.quantity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Label className="text-xs text-vip-black/70">Allocated Qty</Label>
                    <Input
                      type="number"
                      value={allocation.allocatedQuantity}
                      onChange={(e) => updateAllocation(index, 'allocatedQuantity', parseInt(e.target.value) || 0)}
                      min="0"
                      className="border-vip-gold/30"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label className="text-xs text-vip-black/70">Returned Qty</Label>
                    <Input
                      type="number"
                      value={allocation.returnedQuantity}
                      onChange={(e) => updateAllocation(index, 'returnedQuantity', parseInt(e.target.value) || 0)}
                      min="0"
                      max={allocation.allocatedQuantity}
                      className="border-vip-gold/30"
                    />
                  </div>
                  <div className="col-span-2">
                    <Button 
                      type="button" 
                      onClick={() => removeAllocation(index)}
                      variant="outline" 
                      size="sm"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-vip-gold/20">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="px-6 border-vip-gold/30 text-vip-gold">
              Cancel
            </Button>
            <Button type="submit" className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark">
              Create Event Tracking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
