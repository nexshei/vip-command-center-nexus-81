
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientAdded?: (client: any) => void;
}

export const AddClientModal = ({ open, onOpenChange, onClientAdded }: AddClientModalProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newClient = {
      id: Date.now().toString(),
      full_name: fullName,
      email: email || null,
      phone: phone || null,
      company: company || null,
      notes: notes || null,
      created_at: new Date().toISOString(),
    };

    if (onClientAdded) {
      onClientAdded(newClient);
    }

    toast({
      title: "Client Added",
      description: `${fullName} has been added to the client database.`,
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
          <DialogTitle className="text-vip-black text-xl font-semibold">Add New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-vip-black">Full Name *</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-vip-black">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-vip-black">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium text-vip-black">Company</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-vip-black">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-vip-gold/20">
            <Button type="button" variant="outline" onClick={handleCancel} className="px-6 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
              Cancel
            </Button>
            <Button type="submit" className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark">
              Add Client
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
