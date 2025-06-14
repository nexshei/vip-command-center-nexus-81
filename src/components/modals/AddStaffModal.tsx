
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AddStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStaffAdded: (newStaff: any) => void;
}

export const AddStaffModal = ({ open, onOpenChange, onStaffAdded }: AddStaffModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    phone: '',
    email: '',
    status: 'active'
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role || !formData.department || !formData.phone || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newStaff = {
      id: Date.now().toString(),
      ...formData,
      joinDate: new Date().toISOString().split('T')[0]
    };

    onStaffAdded(newStaff);
    toast({
      title: "Staff Member Added",
      description: `${formData.name} has been added to the team.`,
    });
    
    setFormData({
      name: '',
      role: '',
      department: '',
      phone: '',
      email: '',
      status: 'active'
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-vip-black">Add New Staff Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3">
            <Label htmlFor="name" className="text-vip-black">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-vip-gold/30 focus:border-vip-gold"
              placeholder="Enter full name"
            />
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="role" className="text-vip-black">Role *</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="border-vip-gold/30 focus:border-vip-gold"
              placeholder="e.g., Protocol Officer"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="department" className="text-vip-black">Department *</Label>
            <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
              <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-white border-vip-gold/20">
                <SelectItem value="Protocol">Protocol</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Events">Events</SelectItem>
                <SelectItem value="Logistics">Logistics</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="phone" className="text-vip-black">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border-vip-gold/30 focus:border-vip-gold"
              placeholder="+254 7XX XXX XXX"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="email" className="text-vip-black">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border-vip-gold/30 focus:border-vip-gold"
              placeholder="email@sirolele.com"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-vip-gold/30 text-vip-black hover:bg-vip-gold/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-vip-gold text-black hover:bg-vip-gold-dark"
            >
              Add Staff Member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
