
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Package, Users, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EventAllocation {
  itemId: string;
  itemName: string;
  allocatedQuantity: number;
  returnedQuantity: number;
  status: 'allocated' | 'returned' | 'missing';
}

interface InventoryEvent {
  id: string;
  name: string;
  date: string;
  allocations: EventAllocation[];
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
}

interface EventInventoryTrackerProps {
  events: InventoryEvent[];
  onUpdateEvent: (eventId: string, updates: Partial<InventoryEvent>) => void;
}

export const EventInventoryTracker = ({ events, onUpdateEvent }: EventInventoryTrackerProps) => {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const { toast } = useToast();

  const updateAllocationReturn = (eventId: string, allocationIndex: number, returnedQuantity: number) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const updatedAllocations = event.allocations.map((allocation, index) => {
      if (index === allocationIndex) {
        const status = returnedQuantity === allocation.allocatedQuantity ? 'returned' : 
                      returnedQuantity > 0 ? 'allocated' : 'missing';
        return { ...allocation, returnedQuantity, status };
      }
      return allocation;
    });

    onUpdateEvent(eventId, { allocations: updatedAllocations });
    
    toast({
      title: "Return Updated",
      description: `Inventory return has been recorded for ${event.name}.`,
    });
  };

  const completeEvent = (eventId: string) => {
    onUpdateEvent(eventId, { status: 'completed' });
    toast({
      title: "Event Completed",
      description: "Event inventory tracking has been completed.",
    });
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case 'returned': return 'bg-green-100 text-green-800';
      case 'allocated': return 'bg-yellow-100 text-yellow-800';
      case 'missing': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (events.length === 0) {
    return (
      <Card className="bg-white border border-vip-gold/20">
        <CardContent className="p-8 text-center">
          <Package className="h-12 w-12 mx-auto text-vip-gold/50 mb-4" />
          <p className="text-vip-gold/70">No active event inventory tracking</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-vip-gold/20">
      <CardHeader>
        <CardTitle className="text-lg font-serif text-vip-black flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-vip-gold" />
          Event Inventory Tracking
          <Badge className="ml-2 bg-vip-gold text-white">
            {events.filter(e => e.status === 'active').length} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="border border-vip-gold/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div>
                  <h3 className="font-semibold text-vip-black">{event.name}</h3>
                  <p className="text-sm text-vip-gold/70">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={getEventStatusColor(event.status)}>
                  {getEventStatusIcon(event.status)}
                  <span className="ml-1">{event.status}</span>
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                  className="border-vip-gold/30 text-vip-gold"
                >
                  {expandedEvent === event.id ? 'Collapse' : 'View Details'}
                </Button>
                {event.status === 'active' && (
                  <Button
                    size="sm"
                    onClick={() => completeEvent(event.id)}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Complete Event
                  </Button>
                )}
              </div>
            </div>

            {expandedEvent === event.id && (
              <div className="mt-4 space-y-3 border-t border-vip-gold/10 pt-4">
                <h4 className="font-medium text-vip-black flex items-center">
                  <Package className="h-4 w-4 mr-2 text-vip-gold" />
                  Item Allocations ({event.allocations.length})
                </h4>
                {event.allocations.map((allocation, index) => (
                  <div key={index} className="bg-vip-gold/5 p-3 rounded border">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-vip-black">{allocation.itemName}</span>
                          <Badge className={getItemStatusColor(allocation.status)}>
                            {allocation.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-vip-gold/70">
                          Allocated: {allocation.allocatedQuantity} | 
                          Returned: {allocation.returnedQuantity} | 
                          Missing: {allocation.allocatedQuantity - allocation.returnedQuantity}
                        </div>
                      </div>
                      {event.status === 'active' && (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            min="0"
                            max={allocation.allocatedQuantity}
                            value={allocation.returnedQuantity}
                            onChange={(e) => updateAllocationReturn(event.id, index, parseInt(e.target.value) || 0)}
                            className="w-20 border-vip-gold/30"
                            placeholder="0"
                          />
                          <span className="text-sm text-vip-gold/70">returned</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
