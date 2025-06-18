import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Eye, Edit, Trash2, Image as ImageIcon, Star } from 'lucide-react';
import { useRealtimeQuery } from '@/hooks/useRealtimeQuery';
import { useToast } from '@/hooks/use-toast';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { AddPhotoModal } from '@/components/modals/AddPhotoModal';
import { supabase } from '@/integrations/supabase/client';

interface GalleryPhoto {
  id: string;
  src: string;
  alt_text: string | null;
  category: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean | null;
  display_order: number | null;
}

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [photoModal, setPhotoModal] = useState({ open: false, photo: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, photo: null });
  const { toast } = useToast();

  // Fetch gallery photos
  const { data: photosData, isLoading: photosLoading, error: photosError, refetch } = useRealtimeQuery('gallery_photos', { orderBy: 'display_order' });

  // Type guard
  const isGalleryPhoto = (item: any): item is GalleryPhoto => {
    return item && typeof item === 'object' && typeof item.id === 'string' && typeof item.src === 'string';
  };

  // Safely handle data with proper error checking
  const photos: GalleryPhoto[] = (!photosError && Array.isArray(photosData)) ? photosData.filter(isGalleryPhoto) : [];

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         photo.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(photos.map(photo => photo.category)));
  const featuredPhotos = photos.filter(photo => photo.is_featured).length;

  const handleAddPhoto = () => {
    setPhotoModal({ open: true, photo: null });
  };

  const handleEditPhoto = (photo: GalleryPhoto) => {
    setPhotoModal({ open: true, photo });
  };

  const handleDeletePhoto = (photo: GalleryPhoto) => {
    setDeleteModal({ open: true, photo });
  };

  const confirmDelete = async () => {
    if (!deleteModal.photo) return;

    try {
      const { error } = await supabase
        .from('gallery_photos')
        .delete()
        .eq('id', deleteModal.photo.id);

      if (error) throw error;

      refetch();
      toast({
        title: "Photo Deleted",
        description: "The photo has been successfully deleted from the gallery.",
      });

      setDeleteModal({ open: false, photo: null });
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Error",
        description: "Failed to delete photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePhotoUpdated = () => {
    refetch();
    toast({
      title: "Gallery Updated",
      description: "The photo has been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Gallery Management</h1>
          <p className="text-vip-gold/80 mt-2">Manage your photo gallery and showcase your best work</p>
        </div>
        <Button onClick={handleAddPhoto} className="bg-vip-gold text-black hover:bg-vip-gold/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Photo
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Total Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{photos.length}</div>
            <p className="text-xs text-vip-gold/60">In gallery</p>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{categories.length}</div>
            <p className="text-xs text-blue-600">Different categories</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{featuredPhotos}</div>
            <p className="text-xs text-yellow-600">Featured photos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="vip-glass border-vip-gold/20">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-vip-gold/50" />
              <Input
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-vip-gold/30"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 border-vip-gold/30">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-vip-black">
            <ImageIcon className="h-5 w-5 mr-2 text-vip-gold" />
            Photo Gallery ({filteredPhotos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {photosLoading ? (
            <div className="text-center py-8">
              <p className="text-vip-gold/60">Loading photos...</p>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-vip-gold/60">No photos found. Add your first photo to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPhotos.map((photo) => (
                <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-vip-gold/20 vip-glass-light hover:shadow-lg transition-all">
                  <div className="aspect-square relative">
                    <img
                      src={photo.src}
                      alt={photo.alt_text || 'Gallery photo'}
                      className="w-full h-full object-cover"
                    />
                    {photo.is_featured && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        onClick={() => handleEditPhoto(photo)}
                        variant="outline"
                        size="sm"
                        className="bg-white/90 border-vip-gold/30 text-vip-black hover:bg-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeletePhoto(photo)}
                        variant="outline"
                        size="sm"
                        className="bg-white/90 border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <Badge className="mb-2">{photo.category}</Badge>
                    {photo.alt_text && (
                      <p className="text-sm text-vip-gold/80 truncate">{photo.alt_text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddPhotoModal
        open={photoModal.open}
        onOpenChange={(open) => setPhotoModal({ ...photoModal, open })}
        onPhotoUpdated={handlePhotoUpdated}
      />

      <DeleteConfirmationModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        title="Delete Photo"
        description="Are you sure you want to delete this photo from the gallery?"
        itemName={deleteModal.photo?.alt_text || 'Photo'}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Gallery;
