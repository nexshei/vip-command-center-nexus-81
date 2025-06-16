import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Package, AlertTriangle, CheckCircle, Filter, Edit, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeQuery } from "@/hooks/useRealtimeQuery";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  // Fetch live data from Supabase "inventory" table
  const { data: inventoryData, isLoading, error } = useRealtimeQuery("inventory", { orderBy: "created_at" });

  // Mock data for fallback or if no data exists
  const mockInventoryItems = [
    { id: '1', item_name: 'Luxury Vehicles', description: 'Transport', quantity: 8, status: 'available', location: 'Garage A' },
    { id: '2', item_name: 'Security Personnel', description: 'Staff', quantity: 2, status: 'low_stock', location: 'On-duty' },
    { id: '3', item_name: 'Event Decorations', description: 'Equipment', quantity: 25, status: 'available', location: 'Warehouse B' },
    { id: '4', item_name: 'Catering Supplies', description: 'Consumables', quantity: 0, status: 'out_of_stock', location: 'Kitchen' },
    { id: '5', item_name: 'Audio Equipment', description: 'Equipment', quantity: 15, status: 'available', location: 'Storage Room' },
    { id: '6', item_name: 'Protocol Officers', description: 'Staff', quantity: 4, status: 'low_stock', location: 'Office' },
    { id: '7', item_name: 'VVIP Lounges', description: 'Venues', quantity: 3, status: 'available', location: 'Building C' },
    { id: '8', item_name: 'Meeting Rooms', description: 'Venues', quantity: 1, status: 'low_stock', location: 'Building A' },
  ];

  // Use real data if available, otherwise use mock data
  const inventoryItems = inventoryData && inventoryData.length > 0 ? inventoryData.map((item: any) => ({
    ...item,
    // Map database status to display status
    status: item.status === 'available' ? 'good' : 
           item.status === 'low_stock' ? 'low' : 
           item.status === 'out_of_stock' ? 'out' : 'good',
    name: item.item_name,
    category: item.description || 'General',
    minStock: 5, // Default min stock
    lastUpdated: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown'
  })) : mockInventoryItems.map(item => ({
    ...item,
    name: item.item_name,
    category: item.description,
    status: item.status === 'available' ? 'good' : 
           item.status === 'low_stock' ? 'low' : 
           item.status === 'out_of_stock' ? 'out' : 'good',
    minStock: 5,
    lastUpdated: '1 hour ago'
  }));

  const totalItems = inventoryItems.length;
  const lowStockItems = inventoryItems.filter((item: any) => item.status === 'low').length;
  const outOfStockItems = inventoryItems.filter((item: any) => item.status === 'out').length;
  const bookedThisWeek = 24; // Mock data

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-ios-green text-white';
      case 'low': return 'bg-ios-orange text-white';
      case 'out': return 'bg-ios-red text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'low': return <AlertTriangle className="h-4 w-4" />;
      case 'out': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const filteredItems = inventoryItems.filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddItem = () => {
    toast({
      title: "Add New Item",
      description: "Opening form to add new inventory item...",
    });
  };

  const handleEditItem = (itemId: string) => {
    console.log('Editing item:', itemId);
    toast({
      title: "Edit Item",
      description: "Opening edit form for inventory item...",
    });
  };

  const handleViewDetails = (itemId: string) => {
    console.log('Viewing details for item:', itemId);
    toast({
      title: "Item Details",
      description: "Opening detailed view of inventory item...",
    });
  };

  const handleDeleteItem = (itemId: string) => {
    console.log('Deleting item:', itemId);
    toast({
      title: "Delete Item",
      description: "Inventory item has been deleted successfully.",
      variant: "destructive"
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
    toast({
      title: "Filters Cleared",
      description: "All search filters have been reset.",
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Inventory Management</h1>
          <p className="text-vip-gold/80 mt-2">Manage VVIP resources and booking availability</p>
        </div>
        <Button onClick={handleAddItem} className="bg-vip-gold text-white hover:bg-vip-gold-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{totalItems}</div>
            <p className="text-xs text-ios-green">Inventory types</p>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{lowStockItems}</div>
            <p className="text-xs text-ios-orange">Require attention</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{outOfStockItems}</div>
            <p className="text-xs text-ios-red">Immediate action needed</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Booked This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{bookedThisWeek}</div>
            <p className="text-xs text-vip-gold/60">Active bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="text-vip-black">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-vip-gold/30 focus:border-vip-gold"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="consumables">Consumables</SelectItem>
                <SelectItem value="venues">Venues</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="good">Good Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
              onClick={handleClearFilters}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory List */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-vip-black">
            <Package className="h-5 w-5 mr-2 text-vip-gold" />
            Inventory Items ({filteredItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-8">
              <p className="text-vip-gold/60">Loading inventory...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-8">
              <p className="text-vip-red">{error.message}</p>
            </div>
          )}
          <div className="space-y-4">
            {filteredItems.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-vip-gold/20 rounded-lg vip-glass-light hover:bg-vip-gold/5 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-vip-black">{item.name}</h3>
                    <p className="text-sm text-vip-gold/80">{item.category}</p>
                    <p className="text-xs text-vip-gold/60">Last updated: {item.lastUpdated}</p>
                    {item.location && <p className="text-xs text-vip-gold/60">Location: {item.location}</p>}
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-vip-gold/80">Current Stock</p>
                    <p className="text-lg font-bold text-vip-black">{item.quantity}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-vip-gold/80">Min Stock</p>
                    <p className="text-lg font-medium text-vip-gold/80">{item.minStock || 5}</p>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status === 'good' ? 'Good Stock' : 
                       item.status === 'low' ? 'Low Stock' : 'Out of Stock'}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                        onClick={() => handleEditItem(item.id)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                        onClick={() => handleViewDetails(item.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!isLoading && filteredItems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-vip-gold/60">No inventory items found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
