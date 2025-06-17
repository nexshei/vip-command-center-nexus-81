
import React from 'react';
import { useRealtimeQuery } from '@/hooks/useRealtimeQuery';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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
  const { data: photos, isLoading, error } = useRealtimeQuery('gallery_photos', {
    orderBy: 'display_order'
  });

  const galleryPhotos = (photos && Array.isArray(photos) ? photos : []) as GalleryPhoto[];

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
            <Card key={photo.id} className="vip-glass border-vip-gold/20 hover:border-vip-gold/40 transition-colors">
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
                    <Badge className="absolute top-2 right-2 bg-vip-gold text-black">
                      Featured
                    </Badge>
                  )}
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
                  
                  <p className="text-xs text-vip-gold/60">
                    Added: {new Date(photo.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
