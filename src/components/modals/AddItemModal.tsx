import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCreateInventoryItem } from '@/hooks/useInventory';

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemAdded?: (item: any) => void;
}

export const AddItemModal = ({ open, onOpenChange, onItemAdded }: AddItemModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit_price: '',
    supplier: '',
    location: '',
    condition: 'excellent',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const createItemMutation = useCreateInventoryItem();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      quantity: '',
      unit_price: '',
      supplier: '',
      location: '',
      condition: 'excellent',
      notes: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.category || !formData.quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill in the item name, category, and quantity.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newItem = await createItemMutation.mutateAsync({
        name: formData.name.trim(),
        category: formData.category,
        quantity: parseInt(formData.quantity),
        unit_price: formData.unit_price ? parseFloat(formData.unit_price) : null,
        supplier: formData.supplier.trim() || null,
        location: formData.location.trim() || null,
        condition: formData.condition,
        notes: formData.notes.trim() || null,
        last_checked: new Date().toISOString().split('T')[0],
      });

      toast({
        title: "Success",
        description: `${formData.name} has been added to the inventory.`,
      });

      // Call the onItemAdded callback if provided
      if (onItemAdded) {
        onItemAdded(newItem);
      }

      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add inventory item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold">Add New Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-vip-black">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
              placeholder="Enter item name"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-vip-black">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange('category', value)} 
                disabled={isSubmitting}
              >
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
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                required
                min="0"
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit_price" className="text-sm font-medium text-vip-black">Unit Price</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => handleInputChange('unit_price', e.target.value)}
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
                placeholder="0.00"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition" className="text-sm font-medium text-vip-black">Condition</Label>
              <Select 
                value={formData.condition} 
                onValueChange={(value) => handleInputChange('condition', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier" className="text-sm font-medium text-vip-black">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
                placeholder="Supplier name"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-vip-black">Storage Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
                placeholder="Storage location"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-vip-black">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
              placeholder="Additional notes about the item"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-vip-gold/20">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel} 
              className="px-6 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
