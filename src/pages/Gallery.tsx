
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useRealtimeQuery } from '@/hooks/useRealtimeQuery';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GalleryAddModal } from '@/components/gallery/GalleryAddModal';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { GalleryStats } from '@/components/gallery/GalleryStats';
import { Plus, Search, Filter, Images } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Gallery = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch gallery photos with real-time updates
  const { data: photos, isLoading, error, refetch } = useRealtimeQuery("gallery_photos", { 
    orderBy: "display_order" 
  });

  // Filter photos based on search and category
  const filteredPhotos = React.useMemo(() => {
    if (!photos) return [];
    
    return photos.filter(photo => {
      const matchesSearch = !searchTerm || 
        photo.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        photo.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [photos, searchTerm, selectedCategory]);

  // Get unique categories
  const categories = React.useMemo(() => {
    if (!photos) return [];
    const uniqueCategories = [...new Set(photos.map(photo => photo.category))];
    return uniqueCategories.filter(Boolean);
  }, [photos]);

  const handleAddPhoto = () => {
    setIsAddModalOpen(true);
  };

  const handlePhotoAdded = () => {
    setIsAddModalOpen(false);
    refetch();
    toast({
      title: "Photo Added",
      description: "The photo has been successfully added to the gallery.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Images className="h-8 w-8 text-vip-gold" />
            <div>
              <h1 className="text-3xl font-serif font-bold text-vip-gold">Gallery</h1>
              <p className="text-vip-gold/80 mt-1">Manage and showcase your photo collection</p>
            </div>
          </div>
          <Button 
            onClick={handleAddPhoto}
            className="bg-vip-gold hover:bg-vip-gold-light text-black"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Photo
          </Button>
        </div>

        {/* Stats */}
        <GalleryStats photos={photos || []} />

        {/* Filters and Search */}
        <Card className="bg-black/50 border-vip-gold/30">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
                <Input
                  placeholder="Search photos by category or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-vip-gold/30 focus:border-vip-gold text-vip-gold bg-black"
                />
              </div>
              
              <div className="flex gap-2 items-center">
                <Filter className="h-4 w-4 text-vip-gold/60" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 border-vip-gold/30 text-vip-gold bg-black">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-vip-gold/30">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {filteredPhotos.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="secondary" className="bg-vip-gold/20 text-vip-gold">
                  {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''} found
                </Badge>
                {selectedCategory !== 'all' && (
                  <Badge variant="outline" className="border-vip-gold/30 text-vip-gold">
                    Category: {selectedCategory}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gallery Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vip-gold mx-auto mb-4"></div>
            <p className="text-vip-gold/60">Loading gallery photos...</p>
          </div>
        ) : error ? (
          <Card className="bg-red-900/20 border-red-500/30">
            <CardContent className="p-6 text-center">
              <p className="text-red-400">Error loading photos: {error.message}</p>
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                className="mt-4 border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <GalleryGrid photos={filteredPhotos} onPhotoUpdated={refetch} />
        )}

        {/* Add Photo Modal */}
        <GalleryAddModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onPhotoAdded={handlePhotoAdded}
        />
      </div>
    </DashboardLayout>
  );
};

export default Gallery;
