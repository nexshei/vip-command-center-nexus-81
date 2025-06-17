
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Save, Star, Calendar, Hash } from 'lucide-react';

interface GalleryPhotoModalProps {
  photo: any;
  isOpen: boolean;
  onClose: () => void;
  onPhotoUpdated: () => void;
}

export const GalleryPhotoModal: React.FC<GalleryPhotoModalProps> = ({
  photo,
  isOpen,
  onClose,
  onPhotoUpdated,
}) => {
  const [formData, setFormData] = useState({
    src: '',
    alt_text: '',
    category: '',
    display_order: 0,
    is_featured: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (photo) {
      setFormData({
        src: photo.src || '',
        alt_text: photo.alt_text || '',
        category: photo.category || '',
        display_order: photo.display_order || 0,
        is_featured: photo.is_featured || false,
      });
    }
  }, [photo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) return;
    
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('gallery_photos')
        .update(formData)
        .eq('id', photo.id);

      if (error) throw error;

      toast({
        title: "Photo Updated",
        description: "The photo has been successfully updated.",
      });
      
      setIsEditing(false);
      onPhotoUpdated();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "An error occurred while updating the photo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!photo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-vip-gold/30 text-vip-gold max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-vip-gold flex items-center justify-between">
            <span>Photo Details</span>
            <div className="flex gap-2">
              {photo.is_featured && (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Featured
                </Badge>
              )}
              <Badge variant="outline" className="border-vip-gold/30 text-vip-gold">
                {photo.category}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Photo Display */}
          <div className="relative">
            <img
              src={photo.src}
              alt={photo.alt_text || 'Gallery photo'}
              className="w-full max-h-96 object-contain rounded-lg border border-vip-gold/30"
            />
          </div>

          {/* Photo Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-vip-gold/60">
              <Calendar className="h-4 w-4" />
              <span>Added: {new Date(photo.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-vip-gold/60">
              <Hash className="h-4 w-4" />
              <span>Order: {photo.display_order || 0}</span>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_src" className="text-vip-gold">Photo URL *</Label>
                <Input
                  id="edit_src"
                  type="url"
                  value={formData.src}
                  onChange={(e) => handleInputChange('src', e.target.value)}
                  required
                  className="border-vip-gold/30 focus:border-vip-gold text-vip-gold bg-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_category" className="text-vip-gold">Category *</Label>
                <Input
                  id="edit_category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  required
                  className="border-vip-gold/30 focus:border-vip-gold text-vip-gold bg-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_alt_text" className="text-vip-gold">Description</Label>
                <Textarea
                  id="edit_alt_text"
                  value={formData.alt_text}
                  onChange={(e) => handleInputChange('alt_text', e.target.value)}
                  className="border-vip-gold/30 focus:border-vip-gold text-vip-gold bg-black resize-none"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_display_order" className="text-vip-gold">Display Order</Label>
                <Input
                  id="edit_display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                  className="border-vip-gold/30 focus:border-vip-gold text-vip-gold bg-black"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit_is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                />
                <Label htmlFor="edit_is_featured" className="text-vip-gold">
                  Mark as featured photo
                </Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-vip-gold hover:bg-vip-gold-light text-black"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {photo.alt_text && (
                <div>
                  <Label className="text-vip-gold/80 text-sm">Description</Label>
                  <p className="text-vip-gold mt-1">{photo.alt_text}</p>
                </div>
              )}
              
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-vip-gold hover:bg-vip-gold-light text-black"
              >
                Edit Photo Details
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
