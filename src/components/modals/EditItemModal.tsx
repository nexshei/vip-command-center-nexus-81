import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useUpdateInventoryItem } from '@/hooks/useInventory';

interface EditItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  onSuccess?: () => void;
  onItemUpdated?: (item: any) => void;
  type: 'inventory' | 'client' | 'staff';
}

export const EditItemModal = ({ open, onOpenChange, item, onSuccess, onItemUpdated, type }: EditItemModalProps) => {
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();
  const updateInventoryItem = useUpdateInventoryItem();

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating item:', formData);
    
    if (type === 'inventory') {
      try {
        await updateInventoryItem.mutateAsync({
          id: formData.id,
          name: formData.name,
          category: formData.category,
          quantity: formData.quantity,
          unit_price: formData.unit_price,
          supplier: formData.supplier,
          location: formData.location,
          condition: formData.condition,
          notes: formData.notes
        });

        toast({
          title: "Item Updated",
          description: `${formData.name} has been updated successfully.`,
        });

        if (onSuccess) {
          onSuccess();
        }
        
        onOpenChange(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update inventory item",
          variant: "destructive",
        });
      }
    } else {
      // Handle other types (client, staff) - keeping existing simulation logic
      const updatedItem = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      toast({
        title: "Item Updated",
        description: `${type === 'client' ? formData.full_name : formData.full_name} has been updated successfully.`,
      });

      if (onSuccess) {
        onSuccess();
      }
      
      if (onItemUpdated) {
        onItemUpdated(updatedItem);
      }

      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setFormData(item);
    onOpenChange(false);
  };

  const renderInventoryForm = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-vip-black">Item Name *</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
          className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium text-vip-black">Category *</Label>
          <Select value={formData.category || ''} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
              <SelectValue />
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
            value={formData.quantity || ''}
            onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
            required
            min="0"
            className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unit_price" className="text-sm font-medium text-vip-black">Unit Price (KSH)</Label>
          <Input
            id="unit_price"
            type="number"
            step="0.01"
            value={formData.unit_price || ''}
            onChange={(e) => setFormData({...formData, unit_price: parseFloat(e.target.value) || 0})}
            min="0"
            className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="condition" className="text-sm font-medium text-vip-black">Condition</Label>
          <Select value={formData.condition || ''} onValueChange={(value) => setFormData({...formData, condition: value})}>
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
          <Label htmlFor="location" className="text-sm font-medium text-vip-black">Location *</Label>
          <Input
            id="location"
            value={formData.location || ''}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
            className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supplier" className="text-sm font-medium text-vip-black">Supplier</Label>
          <Input
            id="supplier"
            value={formData.supplier || ''}
            onChange={(e) => setFormData({...formData, supplier: e.target.value})}
            className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium text-vip-black">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
          rows={3}
        />
      </div>
    </>
  );

  const renderClientForm = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-sm font-medium text-vip-black">Full Name *</Label>
        <Input
          id="full_name"
          value={formData.full_name || ''}
          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
          required
          className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-vip-black">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-vip-black">Phone *</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
            className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="company" className="text-sm font-medium text-vip-black">Company</Label>
        <Input
          id="company"
          value={formData.company || ''}
          onChange={(e) => setFormData({...formData, company: e.target.value})}
          className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
        />
      </div>
    </>
  );

  const renderStaffForm = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-sm font-medium text-vip-black">Full Name *</Label>
        <Input
          id="full_name"
          value={formData.full_name || ''}
          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
          required
          className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role" className="text-sm font-medium text-vip-black">Role *</Label>
        <Input
          id="role"
          value={formData.role || ''}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          required
          className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-vip-black">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-vip-black">Phone *</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
            className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status" className="text-sm font-medium text-vip-black">Status *</Label>
        <Select value={formData.status || ''} onValueChange={(value) => setFormData({...formData, status: value})}>
          <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on-leave">On Leave</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold">
            Edit {type === 'inventory' ? 'Inventory Item' : type === 'client' ? 'Client' : 'Staff Member'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {type === 'inventory' && renderInventoryForm()}
          {type === 'client' && renderClientForm()}
          {type === 'staff' && renderStaffForm()}

          <div className="flex justify-end gap-3 pt-6 border-t border-vip-gold/20">
            <Button type="button" variant="outline" onClick={handleCancel} className="px-6 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark"
              disabled={type === 'inventory' && updateInventoryItem.isPending}
            >
              {type === 'inventory' && updateInventoryItem.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
