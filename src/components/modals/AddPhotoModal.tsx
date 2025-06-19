
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload } from 'lucide-react';

interface AddPhotoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPhotoUpdated: () => void;
}

const AddPhotoModal: React.FC<AddPhotoModalProps> = ({ 
  open, 
  onOpenChange, 
  onPhotoUpdated 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    src: '',
    alt_text: '',
    category: 'events'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('gallery_photos')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Photo Added",
        description: "The photo has been successfully added to the gallery."
      });

      onPhotoUpdated();
      setFormData({
        src: '',
        alt_text: '',
        category: 'events'
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to add photo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-vip-black">Add Photo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="src" className="text-sm font-medium text-vip-black">Image URL</Label>
            <Input
              id="src"
              value={formData.src}
              onChange={(e) => setFormData(prev => ({ ...prev, src: e.target.value }))}
              className="border-vip-gold/30 focus:border-vip-gold"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alt_text" className="text-sm font-medium text-vip-black">Alt Text</Label>
            <Input
              id="alt_text"
              value={formData.alt_text}
              onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
              className="border-vip-gold/30 focus:border-vip-gold"
              placeholder="Describe the image..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-vip-black">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="facilities">Facilities</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-vip-black border-vip-gold/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-vip-gold text-white hover:bg-vip-gold-dark"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isLoading ? 'Adding...' : 'Add Photo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPhotoModal;
