
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, Package, Plus, Edit, Trash2 } from 'lucide-react';
import { EditItemModal } from '@/components/modals/EditItemModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';

// Mock data for inventory items
const mockInventoryItems = [
  {
    id: '1',
    item_name: 'VIP Welcome Banners',
    description: 'Premium fabric banners for event entrances',
    quantity: 25,
    location: 'Storage Room A',
    status: 'Available'
  },
  {
    id: '2',
    item_name: 'Red Carpet Runners',
    description: '50ft premium red carpet runners',
    quantity: 8,
    location: 'Storage Room B',
    status: 'Available'
  },
  {
    id: '3',
    item_name: 'Protocol Podiums',
    description: 'Adjustable height speaking podiums',
    quantity: 3,
    location: 'Equipment Room',
    status: 'In Use'
  }
];

const Inventory = () => {
  const [items, setItems] = useState(mockInventoryItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const { toast } = useToast();

  const filteredItems = items.filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return <Badge className="bg-green-500 text-white">Available</Badge>;
      case 'In Use':
        return <Badge className="bg-yellow-500 text-white">In Use</Badge>;
      case 'Maintenance':
        return <Badge className="bg-red-500 text-white">Maintenance</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
    }
  };

  const handleItemUpdated = () => {
    toast({
      title: "Item Updated",
      description: "Inventory item has been updated successfully.",
    });
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    setDeletingItem(null);
    toast({
      title: "Item Deleted",
      description: "Inventory item has been removed.",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-white mb-2">
              VVIP Inventory Management
            </h1>
            <p className="text-xl text-vip-gold">
              Track and manage protocol equipment and supplies
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Package className="h-8 w-8 text-vip-gold" />
            <span className="text-2xl font-bold text-white">{items.length}</span>
            <span className="text-vip-gold">Total Items</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white border border-vip-gold/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-vip-black mb-2">
                {items.filter(item => item.status === 'Available').length}
              </div>
              <p className="text-vip-gold font-medium">Available Items</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-vip-gold/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-vip-black mb-2">
                {items.filter(item => item.status === 'In Use').length}
              </div>
              <p className="text-vip-gold font-medium">Items In Use</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-vip-gold/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-vip-black mb-2">
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
              <p className="text-vip-gold font-medium">Total Quantity</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Add */}
        <Card className="bg-white border border-vip-gold/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold" />
                <Input
                  placeholder="Search inventory items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
                />
              </div>
              <Button className="bg-vip-gold text-black hover:bg-vip-gold/80">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Items */}
        <Card className="bg-white border border-vip-gold/20">
          <CardHeader className="border-b border-vip-gold/10">
            <CardTitle className="text-xl font-serif text-vip-black">Inventory Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4 p-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="border border-vip-gold/20 rounded-lg p-4 hover:bg-vip-gold/5 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-vip-gold" />
                        <h3 className="font-semibold text-vip-black">{item.item_name}</h3>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-vip-black/70">{item.description}</p>
                      <div className="flex space-x-4 text-sm text-vip-black/60">
                        <span>Quantity: {item.quantity}</span>
                        <span>Location: {item.location}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingItem(item)}
                        className="border-vip-gold/30 text-vip-black hover:bg-vip-gold hover:text-black"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingItem(item)}
                        className="border-red-300 text-red-600 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div className="text-center text-vip-black/60 py-8">
                  {searchTerm ? 'No items match your search.' : 'No inventory items yet.'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <EditItemModal
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
        item={editingItem}
        onItemUpdated={handleItemUpdated}
      />
      <DeleteConfirmationModal
        open={!!deletingItem}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        title="Delete Inventory Item"
        description={`Are you sure you want to delete "${deletingItem?.item_name}"? This action cannot be undone.`}
        onConfirm={() => deletingItem && handleDeleteItem(deletingItem.id)}
      />
    </div>
  );
};

export default Inventory;
