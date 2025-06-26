
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Package, TrendingDown, ShoppingCart } from 'lucide-react';

interface LowStockItem {
  id: string;
  item_name: string;
  current_quantity: number;
  minimum_threshold: number;
  location: string;
  urgency: 'critical' | 'warning' | 'info';
}

interface InventoryNotificationsProps {
  lowStockItems: LowStockItem[];
  onReorderItem: (itemId: string) => void;
}

export const InventoryNotifications = ({ lowStockItems, onReorderItem }: InventoryNotificationsProps) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <TrendingDown className="h-4 w-4 text-yellow-600" />;
      case 'info': return <Package className="h-4 w-4 text-blue-600" />;
      default: return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  if (lowStockItems.length === 0) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-green-700">
            <Package className="h-5 w-5" />
            <span className="font-medium">All inventory levels are healthy</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-vip-gold/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-serif text-vip-black flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-vip-gold" />
          Inventory Alerts
          <Badge className="ml-2 bg-vip-red text-white">
            {lowStockItems.length} items
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {lowStockItems.map((item) => (
          <div key={item.id} className={`p-3 rounded-lg border ${getUrgencyColor(item.urgency)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getUrgencyIcon(item.urgency)}
                <div>
                  <h4 className="font-semibold">{item.item_name}</h4>
                  <p className="text-sm opacity-80">
                    Current: {item.current_quantity} | Minimum: {item.minimum_threshold}
                  </p>
                  <p className="text-xs opacity-60">Location: {item.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getUrgencyColor(item.urgency)}>
                  {item.urgency.toUpperCase()}
                </Badge>
                <Button
                  size="sm"
                  onClick={() => onReorderItem(item.id)}
                  className="bg-vip-gold text-white hover:bg-vip-gold-dark"
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Reorder
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
