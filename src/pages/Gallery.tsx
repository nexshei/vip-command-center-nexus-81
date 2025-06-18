import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRealtimeQuery } from '@/hooks/useRealtimeQuery';
import AddPhotoModal from '@/components/modals/AddPhotoModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { 
  Image as ImageIcon, 
  Plus, 
  Search, 
  Filter,
  Star,
  Calendar,
  Edit,
  Trash2,
  Download,
  Eye
} from 'lucide-react';

interface GalleryPhoto {
  id: string;
  src: string;
  alt_text: string;
  category: string;
  is_featured: boolean;
  display_order: number;
  file_size: number;
  content_type: string;
  created_at: string;
  updated_at: string;
}

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<GalleryPhoto | null>(null);

  // Use proper error handling for the query
  const { 
    data: photosData, 
    isLoading, 
    error 
  } = useRealtimeQuery('gallery_photos', {
    queryKey: ['gallery_photos'],
    table: 'gallery_photos'
  });

  // Handle data with proper error checking
  const photos: GalleryPhoto[] = (!error && Array.isArray(photosData)) ? photosData : [];

  const categories = ['all', ...new Set(photos.map(photo => photo.category))];

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditPhoto = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
    setIsEditModalOpen(true);
  };

  const handleDeletePhoto = (photo: GalleryPhoto) => {
    setPhotoToDelete(photo);
    setIsDeleteModalOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vip-gold mx-auto mb-4"></div>
          <p className="text-vip-gold">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Photo Gallery</h1>
          <p className="text-vip-gold/80 mt-2">Manage and organize event photos</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-vip-gold text-white hover:bg-vip-gold-dark flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Photo
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-vip-gold/60" />
            <Input
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-vip-gold/60" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-vip-gold/30 rounded-md bg-white text-vip-black focus:border-vip-gold"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white border border-vip-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-vip-gold" />
              <div className="ml-3">
                <p className="text-sm font-medium text-vip-gold/80">Total Photos</p>
                <p className="text-2xl font-bold text-vip-black">{photos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-vip-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-vip-gold" />
              <div className="ml-3">
                <p className="text-sm font-medium text-vip-gold/80">Featured</p>
                <p className="text-2xl font-bold text-vip-black">{photos.filter(p => p.is_featured).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-vip-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Filter className="h-8 w-8 text-vip-gold" />
              <div className="ml-3">
                <p className="text-sm font-medium text-vip-gold/80">Categories</p>
                <p className="text-2xl font-bold text-vip-black">{categories.length - 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-vip-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-vip-gold" />
              <div className="ml-3">
                <p className="text-sm font-medium text-vip-gold/80">This Month</p>
                <p className="text-2xl font-bold text-vip-black">
                  {photos.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Photo Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPhotos.map((photo) => (
          <Card key={photo.id} className="bg-white border border-vip-gold/20 hover:shadow-md transition-shadow overflow-hidden">
            <div className="relative aspect-square">
              <img 
                src={photo.src} 
                alt={photo.alt_text}
                className="w-full h-full object-cover"
              />
              {photo.is_featured && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-vip-gold text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => handleEditPhoto(photo)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => handleDeletePhoto(photo)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-vip-gold/30 text-vip-gold/70">
                    {photo.category}
                  </Badge>
                  <span className="text-xs text-vip-gold/60">
                    {formatFileSize(photo.file_size)}
                  </span>
                </div>
                <p className="text-sm text-vip-black font-medium line-clamp-2">
                  {photo.alt_text}
                </p>
                <p className="text-xs text-vip-gold/60">
                  {new Date(photo.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-vip-gold/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-vip-black mb-2">No photos found</h3>
          <p className="text-vip-gold/70 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Add your first photo to get started'}
          </p>
          {!searchTerm && (
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-vip-gold text-white hover:bg-vip-gold-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Photo
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      <AddPhotoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPhotoAdded={() => {
          setIsAddModalOpen(false);
        }}
      />

      {selectedPhoto && (
        <AddPhotoModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPhoto(null);
          }}
          photo={selectedPhoto}
          onPhotoUpdated={() => {
            setIsEditModalOpen(false);
            setSelectedPhoto(null);
          }}
        />
      )}

      {photoToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setPhotoToDelete(null);
          }}
          onConfirm={() => {
            setIsDeleteModalOpen(false);
            setPhotoToDelete(null);
          }}
          title="Delete Photo"
          description={`Are you sure you want to delete this photo? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default Gallery;
