
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCreateStaff } from '@/hooks/useStaff';

interface AddStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddStaffModal = ({ open, onOpenChange }: AddStaffModalProps) => {
  const [formData, setFormData] = useState({
    full_name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    salary: '',
    hire_date: '',
    bio: '',
    status: 'active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const createStaffMutation = useCreateStaff();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      position: '',
      department: '',
      email: '',
      phone: '',
      salary: '',
      hire_date: '',
      bio: '',
      status: 'active'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name.trim() || !formData.position.trim() || !formData.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in the name, position, and email fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createStaffMutation.mutateAsync({
        full_name: formData.full_name.trim(),
        position: formData.position.trim(),
        department: formData.department.trim() || null,
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        hire_date: formData.hire_date || null,
        bio: formData.bio.trim() || null,
        status: formData.status,
        profile_image_url: null,
      });

      toast({
        title: "Success",
        description: `${formData.full_name} has been added to the team.`,
      });

      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add staff member. Please try again.",
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
      <DialogContent className="sm:max-w-[500px] bg-white border border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-vip-black">Add New Staff Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3">
            <Label htmlFor="full_name" className="text-vip-black">Full Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              className="border-vip-gold/30 focus:border-vip-gold"
              placeholder="Enter full name"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="position" className="text-vip-black">Position *</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              className="border-vip-gold/30 focus:border-vip-gold"
              placeholder="e.g., Protocol Officer"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="department" className="text-vip-black">Department</Label>
            <Select 
              value={formData.department} 
              onValueChange={(value) => handleInputChange('department', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-white border-vip-gold/20">
                <SelectItem value="Protocol">Protocol</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Events">Events</SelectItem>
                <SelectItem value="Logistics">Logistics</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Administration">Administration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label htmlFor="email" className="text-vip-black">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="border-vip-gold/30 focus:border-vip-gold"
                placeholder="email@sirolele.com"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="phone" className="text-vip-black">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="border-vip-gold/30 focus:border-vip-gold"
                placeholder="+254 7XX XXX XXX"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label htmlFor="salary" className="text-vip-black">Salary</Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                className="border-vip-gold/30 focus:border-vip-gold"
                placeholder="50000"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="hire_date" className="text-vip-black">Hire Date</Label>
              <Input
                id="hire_date"
                type="date"
                value={formData.hire_date}
                onChange={(e) => handleInputChange('hire_date', e.target.value)}
                className="border-vip-gold/30 focus:border-vip-gold"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="bio" className="text-vip-black">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="border-vip-gold/30 focus:border-vip-gold"
              placeholder="Brief description of the staff member"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="border-vip-gold/30 text-vip-black hover:bg-vip-gold-light hover:text-black"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-vip-gold text-black hover:bg-vip-gold-light"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Staff Member'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
