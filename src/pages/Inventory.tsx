import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Package, MapPin, Calendar, RefreshCw } from 'lucide-react';
import { useInventory, useDeleteInventoryItem } from '@/hooks/useInventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AddItemModal } from '@/components/modals/AddItemModal';
import { EditItemModal } from '@/components/modals/EditItemModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const { data: inventory = [], isLoading, error, refetch } = useInventory();
  const deleteItemMutation = useDeleteInventoryItem();
  const { toast } = useToast();

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteItem = async () => {
    if (!selectedItemId) return;
    
    try {
      await deleteItemMutation.mutateAsync(selectedItemId);
      toast({
        title: "Success",
        description: "Inventory item deleted successfully",
      });
      setShowDeleteModal(false);
      setSelectedItemId(null);
      setSelectedItemName('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete inventory item",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleItemUpdated = () => {
    refetch();
    toast({
      title: "Success",
      description: "Inventory item updated successfully",
    });
  };

  const handleItemAdded = (newItem: any) => {
    toast({
      title: "Item Added",
      description: `${newItem.name} has been added to the inventory.`,
    });
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuantityStatus = (quantity: number | null) => {
    if (!quantity || quantity === 0) return 'text-red-600';
    if (quantity < 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatPrice = (price: number | null) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vip-gold"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error loading inventory: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-vip-gold mb-2">Inventory Management</h1>
            <p className="text-vip-gold/60">Professional tracking and management of your premium event inventory</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => { 
                refetch(); 
                toast({ title: "Refreshed", description: "Inventory data has been refreshed successfully" }); 
              }} 
              variant="outline"
              className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10 transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-vip-gold hover:bg-vip-gold/80 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-vip-gold" />
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">Total Items</p>
                <p className="text-2xl font-bold text-white">{inventory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">In Stock</p>
                <p className="text-2xl font-bold text-white">
                  {inventory.filter(item => (item.quantity || 0) > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">Out of Stock</p>
                <p className="text-2xl font-bold text-white">
                  {inventory.filter(item => (item.quantity || 0) === 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">Low Stock</p>
                <p className="text-2xl font-bold text-white">
                  {inventory.filter(item => (item.quantity || 0) > 0 && (item.quantity || 0) < 10).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <Button variant="outline" size="sm" className="text-vip-gold border-vip-gold/30 hover:bg-vip-gold/10">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInventory.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No inventory items found</p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 bg-vip-gold hover:bg-vip-gold/80 text-black"
              >
                Add Your First Item
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-400">Item</TableHead>
                  <TableHead className="text-gray-400">Category</TableHead>
                  <TableHead className="text-gray-400">Quantity</TableHead>
                  <TableHead className="text-gray-400">Unit Price</TableHead>
                  <TableHead className="text-gray-400">Location</TableHead>
                  <TableHead className="text-gray-400">Condition</TableHead>
                  <TableHead className="text-gray-400">Last Checked</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id} className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        {item.supplier && (
                          <p className="text-sm text-gray-300">Supplier: {item.supplier}</p>
                        )}
                      </div>
                    </TableCell>
                     <TableCell>
                      <Badge variant="outline" className="capitalize border-vip-gold/30 text-vip-gold">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${getQuantityStatus(item.quantity)}`}>
                        {item.quantity || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300">{formatPrice(item.unit_price)}</TableCell>
                    <TableCell>
                      {item.location ? (
                        <div className="flex items-center text-gray-300">
                          <MapPin className="w-3 h-3 mr-1" />
                          {item.location}
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-vip-gold/20 text-vip-gold border-vip-gold/30">
                        {item.condition || 'Good'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.last_checked ? (
                        <div className="flex items-center text-gray-300">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(item.last_checked).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditItem(item)}
                          className="text-vip-gold hover:bg-vip-gold/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItemId(item.id);
                            setSelectedItemName(item.name);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddItemModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
      />

      <EditItemModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        item={selectedItem}
        onSuccess={handleItemUpdated}
        type="inventory"
      />

      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteItem}
        title="Delete Inventory Item"
        description="Are you sure you want to delete this inventory item? This action cannot be undone."
        itemName={selectedItemName}
      />
      </div>
    </div>
  );
};

export default Inventory;
