
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemAdded?: (item: any) => void;
}

export const AddItemModal = ({ open, onOpenChange, onItemAdded }: AddItemModalProps) => {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const { toast } = useToast();

  const resetForm = () => {
    setItemName('');
    setCategory('');
    setQuantity('');
    setLocation('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem = {
      id: Date.now().toString(),
      item_name: itemName,
      name: itemName,
      description: category,
      category: category,
      quantity: parseInt(quantity),
      location: location,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (onItemAdded) {
      onItemAdded(newItem);
    }

    toast({
      title: "Item Added",
      description: `${itemName} has been added to the inventory.`,
    });

    resetForm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold">Add New Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="itemName" className="text-sm font-medium text-vip-black">Item Name *</Label>
            <Input
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-vip-black">Category *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Transport">Transport & Vehicles</SelectItem>
                  <SelectItem value="Security">Security Equipment</SelectItem>
                  <SelectItem value="Protocol">Protocol Materials</SelectItem>
                  <SelectItem value="Communication">Communication Devices</SelectItem>
                  <SelectItem value="Catering">Catering Supplies</SelectItem>
                  <SelectItem value="Decoration">Event Decorations</SelectItem>
                  <SelectItem value="Documentation">Documentation & Stationery</SelectItem>
                  <SelectItem value="Technology">Audio/Visual Equipment</SelectItem>
                  <SelectItem value="Accommodation">Accommodation Resources</SelectItem>
                  <SelectItem value="Ceremonial">Ceremonial Items</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium text-vip-black">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="0"
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-vip-black">Location *</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-vip-gold/20">
            <Button type="button" variant="outline" onClick={handleCancel} className="px-6 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
              Cancel
            </Button>
            <Button type="submit" className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark">
              Add Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
