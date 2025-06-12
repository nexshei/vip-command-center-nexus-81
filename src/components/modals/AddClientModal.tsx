
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AddClientModal = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tier, setTier] = useState('');
  const [company, setCompany] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding client:', { name, email, phone, tier, company });
    
    toast({
      title: "Client Added",
      description: `${name} has been added to your VIP client database.`,
    });

    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setTier('');
    setCompany('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-vip-gold text-vip-black hover:bg-vip-gold-dark font-medium">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white border border-neutral-medium shadow-2xl">
        <DialogHeader className="pb-4 border-b border-neutral-medium">
          <DialogTitle className="text-2xl font-serif font-bold text-vip-black">Add New VIP Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-vip-black font-medium text-sm">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              className="bg-neutral-light border-neutral-medium text-vip-black placeholder:text-gray-500 focus:border-vip-gold focus:ring-vip-gold/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-vip-black font-medium text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="bg-neutral-light border-neutral-medium text-vip-black placeholder:text-gray-500 focus:border-vip-gold focus:ring-vip-gold/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-vip-black font-medium text-sm">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="bg-neutral-light border-neutral-medium text-vip-black placeholder:text-gray-500 focus:border-vip-gold focus:ring-vip-gold/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tier" className="text-vip-black font-medium text-sm">Client Tier</Label>
            <Select value={tier} onValueChange={setTier} required>
              <SelectTrigger className="bg-neutral-light border-neutral-medium text-vip-black focus:border-vip-gold focus:ring-vip-gold/20">
                <SelectValue placeholder="Select tier" className="text-gray-500" />
              </SelectTrigger>
              <SelectContent className="bg-white border-neutral-medium">
                <SelectItem value="vvip" className="text-vip-black hover:bg-neutral-light">VVIP</SelectItem>
                <SelectItem value="vip" className="text-vip-black hover:bg-neutral-light">VIP</SelectItem>
                <SelectItem value="premium" className="text-vip-black hover:bg-neutral-light">Premium</SelectItem>
                <SelectItem value="standard" className="text-vip-black hover:bg-neutral-light">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="text-vip-black font-medium text-sm">Company (Optional)</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter company name"
              className="bg-neutral-light border-neutral-medium text-vip-black placeholder:text-gray-500 focus:border-vip-gold focus:ring-vip-gold/20"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-medium">
            <Button type="button" variant="outline" className="border-neutral-medium text-vip-black hover:bg-neutral-light">
              Cancel
            </Button>
            <Button type="submit" className="bg-vip-gold text-vip-black hover:bg-vip-gold-dark font-medium">
              Add Client
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
