
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Package, AlertTriangle, CheckCircle, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  status: 'good' | 'low' | 'out';
  lastUpdated: string;
}

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const inventoryItems: InventoryItem[] = [
    { id: '1', name: 'Luxury Vehicles', category: 'Transport', quantity: 8, minStock: 3, status: 'good', lastUpdated: '2 hours ago' },
    { id: '2', name: 'Security Personnel', category: 'Staff', quantity: 2, minStock: 5, status: 'low', lastUpdated: '1 day ago' },
    { id: '3', name: 'Event Decorations', category: 'Equipment', quantity: 25, minStock: 10, status: 'good', lastUpdated: '3 hours ago' },
    { id: '4', name: 'Catering Supplies', category: 'Consumables', quantity: 0, minStock: 20, status: 'out', lastUpdated: '1 week ago' },
    { id: '5', name: 'Audio Equipment', category: 'Equipment', quantity: 15, minStock: 8, status: 'good', lastUpdated: '5 hours ago' },
    { id: '6', name: 'Protocol Officers', category: 'Staff', quantity: 4, minStock: 6, status: 'low', lastUpdated: '2 days ago' },
    { id: '7', name: 'VIP Lounges', category: 'Venues', quantity: 3, minStock: 2, status: 'good', lastUpdated: '1 hour ago' },
    { id: '8', name: 'Meeting Rooms', category: 'Venues', quantity: 1, minStock: 3, status: 'low', lastUpdated: '4 hours ago' },
  ];

  const totalItems = inventoryItems.length;
  const lowStockItems = inventoryItems.filter(item => item.status === 'low').length;
  const outOfStockItems = inventoryItems.filter(item => item.status === 'out').length;
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

  const filteredItems = inventoryItems.filter(item => {
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

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Inventory Management</h1>
          <p className="text-vip-gold/80 mt-2">Manage VIP resources and booking availability</p>
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

            <Button variant="outline" className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
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
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-vip-gold/20 rounded-lg vip-glass-light hover:bg-vip-gold/5 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-vip-black">{item.name}</h3>
                    <p className="text-sm text-vip-gold/80">{item.category}</p>
                    <p className="text-xs text-vip-gold/60">Last updated: {item.lastUpdated}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-vip-gold/80">Current Stock</p>
                    <p className="text-lg font-bold text-vip-black">{item.quantity}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-vip-gold/80">Min Stock</p>
                    <p className="text-lg font-medium text-vip-gold/80">{item.minStock}</p>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status === 'good' ? 'Good Stock' : 
                       item.status === 'low' ? 'Low Stock' : 'Out of Stock'}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
