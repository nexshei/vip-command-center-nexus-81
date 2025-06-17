
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddPhotoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPhotoAdded: () => void;
}

export const AddPhotoModal = ({ open, onOpenChange, onPhotoAdded }: AddPhotoModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    src: '',
    alt_text: '',
    category: '',
    is_featured: false,
    display_order: 0
  });

  const categories = [
    'Events',
    'Portraits',
    'Corporate',
    'Venues',
    'Team',
    'Awards',
    'Behind the Scenes',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('gallery_photos')
        .insert([{
          src: formData.src,
          alt_text: formData.alt_text || null,
          category: formData.category,
          is_featured: formData.is_featured,
          display_order: formData.display_order || null
        }]);

      if (error) throw error;

      onPhotoAdded();
      onOpenChange(false);
      setFormData({
        src: '',
        alt_text: '',
        category: '',
        is_featured: false,
        display_order: 0
      });
    } catch (error) {
      console.error('Error adding photo:', error);
      toast({
        title: "Error",
        description: "Failed to add photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setFormData({
      src: '',
      alt_text: '',
      category: '',
      is_featured: false,
      display_order: 0
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold">
            Add New Photo
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="src" className="text-vip-gold/80">Photo URL *</Label>
            <Input
              id="src"
              type="url"
              value={formData.src}
              onChange={(e) => setFormData({ ...formData, src: e.target.value })}
              placeholder="https://example.com/photo.jpg"
              required
              className="border-vip-gold/30 focus:border-vip-gold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alt_text" className="text-vip-gold/80">Description</Label>
            <Textarea
              id="alt_text"
              value={formData.alt_text}
              onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
              placeholder="Brief description of the photo"
              className="border-vip-gold/30 focus:border-vip-gold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-vip-gold/80">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order" className="text-vip-gold/80">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="border-vip-gold/30 focus:border-vip-gold"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
            />
            <Label htmlFor="is_featured" className="text-vip-gold/80">
              Featured Photo
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !formData.src || !formData.category}
              className="bg-vip-gold text-black hover:bg-vip-gold/90"
            >
              {isLoading ? 'Adding...' : 'Add Photo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
