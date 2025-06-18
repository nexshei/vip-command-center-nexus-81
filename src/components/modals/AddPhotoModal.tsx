
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface AddPhotoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPhotoUpdated?: () => void;
}

export const AddPhotoModal = ({ open, onOpenChange, onPhotoUpdated }: AddPhotoModalProps) => {
  const [formData, setFormData] = useState({
    src: '',
    altText: '',
    category: '',
    isFeatured: false,
    displayOrder: 0
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.src || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (onPhotoUpdated) {
      onPhotoUpdated();
    }

    toast({
      title: "Photo Added",
      description: "The photo has been added to the gallery.",
    });
    
    setFormData({
      src: '',
      altText: '',
      category: '',
      isFeatured: false,
      displayOrder: 0
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-vip-black">Add New Photo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3">
            <Label htmlFor="src" className="text-vip-black">Image URL *</Label>
            <Input
              id="src"
              value={formData.src}
              onChange={(e) => setFormData({ ...formData, src: e.target.value })}
              className="border-vip-gold/30 focus:border-vip-gold"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="altText" className="text-vip-black">Alt Text</Label>
            <Input
              id="altText"
              value={formData.altText}
              onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
              className="border-vip-gold/30 focus:border-vip-gold"
              placeholder="Describe the image"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="category" className="text-vip-black">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white border-vip-gold/20">
                <SelectItem value="Events">Events</SelectItem>
                <SelectItem value="Protocol">Protocol</SelectItem>
                <SelectItem value="Team">Team</SelectItem>
                <SelectItem value="Facilities">Facilities</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked as boolean })}
            />
            <Label htmlFor="featured" className="text-vip-black">Featured Photo</Label>
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
              Add Photo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
