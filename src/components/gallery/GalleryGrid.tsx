
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GalleryPhotoModal } from './GalleryPhotoModal';
import { Star, Edit, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface GalleryGridProps {
  photos: any[];
  onPhotoUpdated: () => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ photos, onPhotoUpdated }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewPhoto = (photo: any) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const { error } = await supabase
        .from('gallery_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      toast({
        title: "Photo Deleted",
        description: "The photo has been successfully deleted.",
      });
      onPhotoUpdated();
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "An error occurred while deleting the photo.",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (photoId: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('gallery_photos')
        .update({ is_featured: !currentFeatured })
        .eq('id', photoId);

      if (error) throw error;

      toast({
        title: "Photo Updated",
        description: `Photo ${!currentFeatured ? 'marked as featured' : 'removed from featured'}.`,
      });
      onPhotoUpdated();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "An error occurred while updating the photo.",
        variant: "destructive",
      });
    }
  };

  if (photos.length === 0) {
    return (
      <Card className="bg-black/50 border-vip-gold/30">
        <CardContent className="p-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-vip-gold/20 rounded-full flex items-center justify-center">
              <Eye className="h-8 w-8 text-vip-gold/60" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-vip-gold">No photos found</h3>
              <p className="text-vip-gold/60 mt-1">Start building your gallery by adding some photos.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="bg-black/50 border-vip-gold/30 overflow-hidden group hover:border-vip-gold/60 transition-all duration-300">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={photo.src}
                alt={photo.alt_text || 'Gallery photo'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleViewPhoto(photo)}
                    className="bg-vip-gold/20 hover:bg-vip-gold/30 text-vip-gold border-vip-gold/30"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleToggleFeatured(photo.id, photo.is_featured)}
                    className={`border-vip-gold/30 ${
                      photo.is_featured 
                        ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400' 
                        : 'bg-vip-gold/20 hover:bg-vip-gold/30 text-vip-gold'
                    }`}
                  >
                    <Star className={`h-4 w-4 ${photo.is_featured ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Featured Badge */}
              {photo.is_featured && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                </div>
              )}
            </div>

            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs border-vip-gold/30 text-vip-gold">
                    {photo.category}
                  </Badge>
                  <span className="text-xs text-vip-gold/60">
                    #{photo.display_order || 0}
                  </span>
                </div>
                {photo.alt_text && (
                  <p className="text-sm text-vip-gold/80 line-clamp-2">
                    {photo.alt_text}
                  </p>
                )}
                <p className="text-xs text-vip-gold/60">
                  Added {new Date(photo.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Photo Modal */}
      <GalleryPhotoModal
        photo={selectedPhoto}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPhoto(null);
        }}
        onPhotoUpdated={onPhotoUpdated}
      />
    </>
  );
};
