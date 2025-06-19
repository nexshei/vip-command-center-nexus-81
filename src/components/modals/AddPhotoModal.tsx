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
import { Upload, X } from 'lucide-react';

interface AddPhotoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPhotoUpdated: () => void;
}

export const AddPhotoModal = ({ open, onOpenChange, onPhotoUpdated }: AddPhotoModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, GIF, or WebP).",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery-photos')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery-photos')
        .getPublicUrl(fileName);

      // Save photo record to database
      const { error: dbError } = await supabase
        .from('gallery_photos')
        .insert([{
          src: publicUrl,
          alt_text: formData.alt_text || null,
          category: formData.category,
          is_featured: formData.is_featured,
          display_order: formData.display_order || null,
          content_type: selectedFile.type,
          file_size: selectedFile.size
        }]);

      if (dbError) throw dbError;

      onPhotoUpdated();
      onOpenChange(false);
      handleCancel();
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
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFormData({
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
            <Label htmlFor="photo-file" className="text-vip-gold/80">Photo File *</Label>
            {!selectedFile ? (
              <div className="border-2 border-dashed border-vip-gold/30 rounded-lg p-6 text-center hover:border-vip-gold/50 transition-colors">
                <input
                  id="photo-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="photo-file"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="h-8 w-8 text-vip-gold/60" />
                  <span className="text-vip-gold/80">Click to upload an image</span>
                  <span className="text-xs text-vip-gold/60">JPG, PNG, GIF, or WebP (max 10MB)</span>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl || ''}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="mt-2 text-sm text-vip-gold/80">
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
                </div>
              </div>
            )}
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
              disabled={isLoading || !selectedFile || !formData.category}
              className="bg-vip-gold text-black hover:bg-vip-gold/90"
            >
              {isLoading ? 'Uploading...' : 'Add Photo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
