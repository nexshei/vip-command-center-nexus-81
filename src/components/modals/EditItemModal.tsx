import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface EditItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  onSuccess?: () => void;
  type: 'inventory' | 'client' | 'staff';
}

export const EditItemModal = ({ open, onOpenChange, item, onSuccess, type }: EditItemModalProps) => {
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating item:', formData);
    
    const updatedItem = {
      ...formData,
      updated_at: new Date().toISOString(),
    };

    toast({
      title: "Item Updated",
      description: `${type === 'inventory' ? formData.item_name || formData.name : 
                   type === 'client' ? formData.full_name : 
                   formData.full_name} has been updated successfully.`,
    });

    if (onSuccess) {
      onSuccess();
    }

    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData(item);
    onOpenChange(false);
  };

  const renderInventoryForm = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="item_name" className="text-sm font-medium text-vip-black">Item Name *</Label>
        <Input
          id="item_name"
          value={formData.item_name || formData.name || ''}
          onChange={(e) => setFormData({...formData, item_name: e.target.value, name: e.target.value})}
          required
          className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium text-vip-black">Category *</Label>
          <Select value={formData.description || formData.category || ''} onValueChange={(value) => setFormData({...formData, description: value, category: value})}>
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
            onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
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
          value={formData.location || ''}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          required
          className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
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
            <Button type="submit" className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
