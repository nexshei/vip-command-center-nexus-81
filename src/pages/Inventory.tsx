
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Plus, Search, MapPin, Edit, Trash2, Lock } from 'lucide-react';

interface InventoryItem {
  id: string;
  item_name: string;
  description: string | null;
  quantity: number;
  location: string;
  status: string;
  created_at: string;
}

// Mock data for inventory
const mockInventory: InventoryItem[] = [
  {
    id: '1',
    item_name: 'Luxury Vehicle Fleet',
    description: 'Mercedes S-Class vehicles for VIP transport',
    quantity: 5,
    location: 'Main Garage',
    status: 'available',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    item_name: 'Security Equipment',
    description: 'Metal detectors and communication devices',
    quantity: 15,
    location: 'Security Office',
    status: 'in_use',
    created_at: '2024-01-16T10:00:00Z'
  },
  {
    id: '3',
    item_name: 'Event Decorations',
    description: 'Premium flowers and decorative elements',
    quantity: 25,
    location: 'Storage Room A',
    status: 'available',
    created_at: '2024-01-17T10:00:00Z'
  }
];

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { user, hasPermission } = useAuth();

  const isProtocolAdmin = user?.role === 'protocol_admin';

  const filteredInventory = inventory.filter((item) =>
    item.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteItem = (item: InventoryItem) => {
    if (isProtocolAdmin) {
      toast({
        title: "Access Restricted",
        description: "Item deletion is restricted for Protocol Admin users.",
        variant: "destructive"
      });
      return;
    }
    setInventory(prev => prev.filter(i => i.id !== item.id));
    toast({
      title: "Item Deleted",
      description: `${item.item_name} has been removed from inventory.`,
    });
  };

  const handleAddItem = () => {
    if (isProtocolAdmin) {
      toast({
        title: "Access Restricted",
        description: "Adding new inventory categories is restricted for Protocol Admin users.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Feature Unavailable",
      description: "Inventory management features require database connection.",
    });
  };

  const handleEditItem = (item: InventoryItem) => {
    if (isProtocolAdmin) {
      toast({
        title: "Limited Access",
        description: "You can edit basic item details but not critical system settings.",
      });
    } else {
      toast({
        title: "Feature Unavailable",
        description: "Inventory editing features require database connection.",
      });
    }
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
            <h1 className="text-3xl font-serif font-bold text-vip-gold">
              Inventory Management {isProtocolAdmin && '(Limited Access)'}
            </h1>
            <p className="text-vip-gold/70 mt-1">
              {isProtocolAdmin 
                ? 'Manage existing items (restricted from adding/deleting categories)'
                : 'Track and manage VVIP protocol equipment'
              }
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isProtocolAdmin && (
              <div className="flex items-center text-vip-gold/60">
                <Lock className="h-4 w-4 mr-2" />
                <span className="text-sm">Limited Access</span>
              </div>
            )}
            <Button 
              onClick={handleAddItem}
              className="bg-vip-gold text-black hover:bg-vip-gold/90"
              disabled={isProtocolAdmin}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredInventory.map((item) => (
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
                    onClick={() => handleEditItem(item)}
                    className="text-vip-gold hover:text-vip-gold-light hover:bg-vip-gold/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteItem(item)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    disabled={isProtocolAdmin}
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

        {filteredInventory.length === 0 && (
          <div className="col-span-full">
            <Card className="bg-black border-vip-gold/30">
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-vip-gold/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-vip-gold mb-2">No Items Found</h3>
                <p className="text-vip-gold/70 mb-4">
                  {searchTerm ? 'No items match your search criteria.' : 'Start tracking your VVIP protocol equipment.'}
                </p>
                {!isProtocolAdmin && (
                  <Button 
                    onClick={handleAddItem}
                    className="bg-vip-gold text-black hover:bg-vip-gold/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Item
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
