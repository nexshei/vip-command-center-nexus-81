
import React, { useState } from 'react';
import { useRealtimeQuery } from '@/hooks/useRealtimeQuery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AddInventoryModal } from '@/components/modals/AddInventoryModal';
import { EditItemModal } from '@/components/modals/EditItemModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Package, Plus, Search, MapPin, Edit, Trash2 } from 'lucide-react';

const Inventory = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const { data: inventory, isLoading, error, refetch } = useRealtimeQuery('inventory', {
    orderBy: 'created_at',
  });

  const filteredInventory = inventory?.filter((item: any) =>
    item.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', selectedItem.id);

      if (error) throw error;

      toast({
        title: "Item Deleted",
        description: `${selectedItem.item_name} has been removed from inventory.`,
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openEditModal = (item: any) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const openDeleteModal = (item: any) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_use':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'maintenance':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'unavailable':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-black min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-vip-gold">Inventory Management</h1>
            <p className="text-vip-gold/70 mt-1">Track and manage VVIP protocol equipment</p>
          </div>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-vip-gold text-black hover:bg-vip-gold/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
            <Input
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-vip-gold/30 bg-black text-vip-gold"
            />
          </div>
          <Badge variant="outline" className="border-vip-gold/30 text-vip-gold">
            {filteredInventory.length} Items
          </Badge>
        </div>
      </div>

      {isLoading && (
        <Card className="bg-black border-vip-gold/30">
          <CardContent className="p-8 text-center">
            <div className="text-vip-gold/70">Loading inventory...</div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="bg-black border-red-500/30">
          <CardContent className="p-8 text-center">
            <div className="text-red-400">Error loading inventory: {error.message}</div>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredInventory.map((item: any) => (
            <Card key={item.id} className="bg-black border-vip-gold/30 hover:border-vip-gold/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-vip-gold/20 flex items-center justify-center">
                      <Package className="h-5 w-5 text-vip-gold" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-vip-gold">{item.item_name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status?.replace('_', ' ') || 'Unknown'}
                        </Badge>
                        <span className="text-sm text-vip-gold/70">Qty: {item.quantity || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(item)}
                      className="text-vip-gold hover:text-vip-gold-light hover:bg-vip-gold/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteModal(item)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.description && (
                  <p className="text-sm text-vip-gold/80">{item.description}</p>
                )}
                {item.location && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-vip-gold/60" />
                    <span className="text-vip-gold/80">{item.location}</span>
                  </div>
                )}
                <div className="text-xs text-vip-gold/50 pt-2 border-t border-vip-gold/20">
                  Added: {new Date(item.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredInventory.length === 0 && !isLoading && (
            <div className="col-span-full">
              <Card className="bg-black border-vip-gold/30">
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-vip-gold/40 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-vip-gold mb-2">No Items Found</h3>
                  <p className="text-vip-gold/70 mb-4">
                    {searchTerm ? 'No items match your search criteria.' : 'Start tracking your VVIP protocol equipment.'}
                  </p>
                  <Button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-vip-gold text-black hover:bg-vip-gold/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Item
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      <AddInventoryModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={() => {
          refetch();
          setIsAddModalOpen(false);
        }}
      />

      <EditItemModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        item={selectedItem}
        onSuccess={() => {
          refetch();
          setEditModalOpen(false);
          setSelectedItem(null);
        }}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Inventory Item"
        description="Are you sure you want to delete"
        itemName={selectedItem?.item_name || ''}
        onConfirm={handleDeleteItem}
      />
    </div>
  );
};

export default Inventory;
