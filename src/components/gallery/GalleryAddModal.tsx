
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface GalleryAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoAdded: () => void;
}

export const GalleryAddModal: React.FC<GalleryAddModalProps> = ({
  isOpen,
  onClose,
  onPhotoAdded,
}) => {
  const [formData, setFormData] = useState({
    src: '',
    alt_text: '',
    category: '',
    display_order: 0,
    is_featured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('gallery_photos')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Photo Added",
        description: "The photo has been successfully added to the gallery.",
      });
      
      setFormData({
        src: '',
        alt_text: '',
        category: '',
        display_order: 0,
        is_featured: false,
      });
      
      onPhotoAdded();
    } catch (error: any) {
      toast({
        title: "Add Failed",
        description: error.message || "An error occurred while adding the photo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-vip-gold/30 text-vip-gold max-w-md">
        <DialogHeader>
          <DialogTitle className="text-vip-gold flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Add New Photo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="src" className="text-vip-gold">Photo URL *</Label>
            <Input
              id="src"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={formData.src}
              onChange={(e) => handleInputChange('src', e.target.value)}
              required
              className="border-vip-gold/30 focus:border-vip-gold text-vip-gold bg-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-vip-gold">Category *</Label>
            <Input
              id="category"
              placeholder="e.g., Events, Portraits, Lifestyle"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              required
              className="border-vip-gold/30 focus:border-vip-gold text-vip-gold bg-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alt_text" className="text-vip-gold">Description</Label>
            <Textarea
              id="alt_text"
              placeholder="Describe the photo for accessibility and search..."
              value={formData.alt_text}
              onChange={(e) => handleInputChange('alt_text', e.target.value)}
              className="border-vip-gold/30 focus:border-vip-gold text-vip-gold bg-black resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order" className="text-vip-gold">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              placeholder="0"
              value={formData.display_order}
              onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
              className="border-vip-gold/30 focus:border-vip-gold text-vip-gold bg-black"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
            />
            <Label htmlFor="is_featured" className="text-vip-gold">
              Mark as featured photo
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.src || !formData.category}
              className="flex-1 bg-vip-gold hover:bg-vip-gold-light text-black"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Adding...' : 'Add Photo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
