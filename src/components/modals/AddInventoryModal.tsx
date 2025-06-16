
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddInventoryModalProps {
  onItemAdded?: (item: any) => void;
}

export const AddInventoryModal = ({ onItemAdded }: AddInventoryModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [minStock, setMinStock] = useState('');
  const { toast } = useToast();

  const resetForm = () => {
    setItemName('');
    setCategory('');
    setQuantity('');
    setLocation('');
    setDescription('');
    setMinStock('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding inventory item:', { 
      itemName, 
      category, 
      quantity: parseInt(quantity), 
      location, 
      description,
      minStock: parseInt(minStock)
    });
    
    const newItem = {
      id: Date.now().toString(),
      item_name: itemName,
      description: category,
      quantity: parseInt(quantity),
      location,
      status: parseInt(quantity) > parseInt(minStock) ? 'available' : 
              parseInt(quantity) > 0 ? 'low_stock' : 'out_of_stock',
      created_at: new Date().toISOString(),
    };

    if (onItemAdded) {
      onItemAdded(newItem);
    }

    toast({
      title: "Inventory Item Added",
      description: `${itemName} has been added to the inventory successfully.`,
    });

    resetForm();
    setIsOpen(false);
  };

  const handleCancel = () => {
    resetForm();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold">Add New Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="itemName" className="text-sm font-medium text-vip-black">Item Name *</Label>
            <Input
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Luxury Vehicle Fleet"
              required
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
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
                placeholder="0"
                required
                min="0"
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-vip-black">Location *</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Warehouse A, Office Building"
                required
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStock" className="text-sm font-medium text-vip-black">Minimum Stock Level *</Label>
              <Input
                id="minStock"
                type="number"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                placeholder="5"
                required
                min="0"
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-vip-black">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details about the inventory item..."
              rows={3}
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-vip-gold/20">
            <Button type="button" variant="outline" onClick={handleCancel} className="px-6 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
              Cancel
            </Button>
            <Button type="submit" className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark">
              Create Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
