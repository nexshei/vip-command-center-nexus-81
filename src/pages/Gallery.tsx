import React, { useState } from 'react';
import { useRealtimeQuery } from '@/hooks/useRealtimeQuery';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { AddPhotoModal } from '@/components/modals/AddPhotoModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GalleryPhoto {
  id: string;
  src: string;
  alt_text: string | null;
  category: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean | null;
  display_order: number | null;
  content_type: string;
  file_size: number | null;
  image_data: string | null;
}

const Gallery = () => {
  const { data: photosData, isLoading, error, refetch } = useRealtimeQuery('gallery_photos', {
    orderBy: 'display_order'
  });
  const { toast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<GalleryPhoto | null>(null);

  // Type guard to check if an item is a valid GalleryPhoto
  const isGalleryPhoto = (item: any): item is GalleryPhoto => {
    return (
      item &&
      typeof item === 'object' && 
      typeof item.id === 'string' &&
      typeof item.src === 'string' &&
      typeof item.category === 'string' &&
      typeof item.created_at === 'string' &&
      typeof item.updated_at === 'string' &&
      typeof item.content_type === 'string'
    );
  };

  // Safely handle the data type with proper type checking
  const galleryPhotos: GalleryPhoto[] = Array.isArray(photosData) && !error
    ? photosData.filter(isGalleryPhoto)
    : [];

  console.log('Gallery photos data:', photosData);
  console.log('Filtered gallery photos:', galleryPhotos);

  const handleDeletePhoto = async () => {
    if (!photoToDelete) return;

    try {
      // If the photo has a file stored in storage, delete it
      if (photoToDelete.src.includes('gallery-photos/')) {
        const fileName = photoToDelete.src.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('gallery-photos')
            .remove([fileName]);
          
          if (storageError) {
            console.error('Error deleting file from storage:', storageError);
          }
        }
      }

      // Delete the database record
      const { error } = await supabase
        .from('gallery_photos')
        .delete()
        .eq('id', photoToDelete.id);

      if (error) throw error;

      toast({
        title: "Photo deleted",
        description: "The photo has been successfully removed from the gallery.",
      });

      refetch();
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Error",
        description: "Failed to delete the photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openDeleteModal = (photo: GalleryPhoto) => {
    setPhotoToDelete(photo);
    setIsDeleteModalOpen(true);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-red-500 mb-2">Error Loading Gallery</h2>
          <p className="text-gray-600">Unable to load photos. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Photo Gallery</h1>
          <p className="text-vip-gold/80 mt-2">Manage your VVIP protocol photo collection</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-vip-gold text-black hover:bg-vip-gold/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Photo
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="vip-glass border-vip-gold/20">
              <CardContent className="p-4">
                <Skeleton className="w-full h-48 mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : galleryPhotos.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-block p-8 vip-glass border border-vip-gold/20 rounded-lg">
            <h2 className="text-xl font-semibold text-vip-gold mb-2">No Photos Found</h2>
            <p className="text-vip-gold/70">Your gallery is currently empty. Add some photos to get started.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryPhotos.map((photo) => (
            <Card key={photo.id} className="vip-glass border-vip-gold/20 hover:border-vip-gold/40 transition-colors group">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <img
                    src={photo.src}
                    alt={photo.alt_text || 'Gallery photo'}
                    className="w-full h-48 object-cover rounded-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  {photo.is_featured && (
                    <Badge className="absolute top-2 left-2 bg-vip-gold text-black">
                      Featured
                    </Badge>
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => openDeleteModal(photo)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-vip-gold border-vip-gold/30">
                      {photo.category}
                    </Badge>
                    {photo.display_order && (
                      <span className="text-xs text-vip-gold/60">
                        Order: {photo.display_order}
                      </span>
                    )}
                  </div>
                  
                  {photo.alt_text && (
                    <p className="text-sm text-vip-gold/80 line-clamp-2">
                      {photo.alt_text}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-vip-gold/60">
                      Added: {new Date(photo.created_at).toLocaleDateString()}
                    </p>
                    {photo.file_size && (
                      <p className="text-xs text-vip-gold/60">
                        {(photo.file_size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddPhotoModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onPhotoAdded={() => {
          refetch();
          toast({
            title: "Photo added",
            description: "The photo has been successfully added to the gallery.",
          });
        }}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Photo"
        description="Are you sure you want to delete this photo?"
        itemName={photoToDelete?.alt_text || 'Untitled Photo'}
        onConfirm={handleDeletePhoto}
      />
    </div>
  );
};

export default Gallery;
