
import React, { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddItemModal } from './AddItemModal';

interface AddItemModalTriggerProps {
  onItemAdded?: (item: any) => void;
}

export const AddItemModalTrigger = ({ onItemAdded }: AddItemModalTriggerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </DialogTrigger>
      <AddItemModal open={isOpen} onOpenChange={setIsOpen} onItemAdded={onItemAdded} />
    </Dialog>
  );
};
