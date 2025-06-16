
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddClientModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClientAdded?: (clientName: string) => void;
}

export const AddClientModal = ({ open, onOpenChange, onClientAdded }: AddClientModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('');
  const [company, setCompany] = useState('');
  const { toast } = useToast();

  const isOpen = open ?? internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding client:', { name, email, phone, eventType, company });
    
    toast({
      title: "Client Added",
      description: `${name} has been added to your VVIP client database.`,
    });

    // Call the onClientAdded callback if provided
    if (onClientAdded) {
      onClientAdded(name);
    }

    // Reset form and close modal
    setName('');
    setEmail('');
    setPhone('');
    setEventType('');
    setCompany('');
    setIsOpen(false);
  };

  const handleCancel = () => {
    setName('');
    setEmail('');
    setPhone('');
    setEventType('');
    setCompany('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!onOpenChange && (
        <DialogTrigger asChild>
          <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold">Add New VVIP Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-vip-black">
              Full Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-vip-black">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-vip-black">
              Phone Number *
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eventType" className="text-sm font-medium text-vip-black">
              Event Type *
            </Label>
            <Select value={eventType} onValueChange={setEventType} required>
              <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-vip-gold/30">
                <SelectItem value="diplomatic-meeting" className="hover:bg-vip-gold/10">Diplomatic Meeting</SelectItem>
                <SelectItem value="corporate-event" className="hover:bg-vip-gold/10">Corporate Event</SelectItem>
                <SelectItem value="government-protocol" className="hover:bg-vip-gold/10">Government Protocol</SelectItem>
                <SelectItem value="state-reception" className="hover:bg-vip-gold/10">State Reception</SelectItem>
                <SelectItem value="business-summit" className="hover:bg-vip-gold/10">Business Summit</SelectItem>
                <SelectItem value="cultural-exchange" className="hover:bg-vip-gold/10">Cultural Exchange</SelectItem>
                <SelectItem value="charity-gala" className="hover:bg-vip-gold/10">Charity Gala</SelectItem>
                <SelectItem value="award-ceremony" className="hover:bg-vip-gold/10">Award Ceremony</SelectItem>
                <SelectItem value="executive-retreat" className="hover:bg-vip-gold/10">Executive Retreat</SelectItem>
                <SelectItem value="international-conference" className="hover:bg-vip-gold/10">International Conference</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium text-vip-black">
              Company/Organization
            </Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter company or organization"
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-vip-gold/20">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="px-6 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark"
            >
              Add Client
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
