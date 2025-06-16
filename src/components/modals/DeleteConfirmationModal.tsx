
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  itemName: string;
  onConfirm: () => void;
}

export const DeleteConfirmationModal = ({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  itemName, 
  onConfirm 
}: DeleteConfirmationModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="flex items-center text-vip-black text-xl font-semibold">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-vip-black">
            {description} <span className="font-semibold">"{itemName}"</span>?
          </p>
          <p className="text-sm text-vip-gold/60 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            className="px-6 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleConfirm}
            className="px-6 bg-red-500 text-white hover:bg-red-600"
          >
            Confirm Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
