
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Eye, Edit, Trash2, Image as ImageIcon, Star } from 'lucide-react';
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
}

// Mock data for gallery photos
const mockPhotos: GalleryPhoto[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=500',
    alt_text: 'VIP event photography',
    category: 'Events',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    is_featured: true,
    display_order: 1
  },
  {
    id: '2', 
    src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500',
    alt_text: 'Corporate meeting setup',
    category: 'Corporate',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
    is_featured: false,
    display_order: 2
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500',
    alt_text: 'Elegant venue decoration',
    category: 'Venues',
    created_at: '2024-01-17T10:00:00Z',
    updated_at: '2024-01-17T10:00:00Z',
    is_featured: true,
    display_order: 3
  }
];

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [photos, setPhotos] = useState<GalleryPhoto[]>(mockPhotos);
  const { toast } = useToast();

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         photo.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(photos.map(photo => photo.category)));
  const featuredPhotos = photos.filter(photo => photo.is_featured).length;

  const handleAddPhoto = () => {
    toast({
      title: "Feature Unavailable",
      description: "Photo upload feature requires database connection.",
    });
  };

  const handleEditPhoto = (photo: GalleryPhoto) => {
    toast({
      title: "Feature Unavailable", 
      description: "Photo editing feature requires database connection.",
    });
  };

  const handleDeletePhoto = (photo: GalleryPhoto) => {
    setPhotos(prev => prev.filter(p => p.id !== photo.id));
    toast({
      title: "Photo Deleted",
      description: "The photo has been removed from the gallery.",
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
          {filteredPhotos.length === 0 ? (
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
    </div>
  );
};

export default Gallery;
