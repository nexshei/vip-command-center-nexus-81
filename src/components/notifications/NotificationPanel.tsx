
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, User, Calendar, CreditCard, AlertTriangle } from 'lucide-react';

export const NotificationPanel = () => {
  const notifications = [
    {
      id: 1,
      type: 'booking',
      title: 'New VIP Booking Request',
      message: 'Mr. James Mwangi has requested a consultation for tomorrow at 2:00 PM',
      time: '5 minutes ago',
      icon: Calendar,
      priority: 'high'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Received',
      message: 'KSH 150,000 payment received from Sarah Kimani for Premium subscription',
      time: '1 hour ago',
      icon: CreditCard,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'client',
      title: 'New Client Registration',
      message: 'Dr. Grace Mutua has completed VIP registration and verification',
      time: '2 hours ago',
      icon: User,
      priority: 'low'
    },
    {
      id: 4,
      type: 'alert',
      title: 'System Alert',
      message: 'Scheduled maintenance window starting at 11:00 PM tonight',
      time: '3 hours ago',
      icon: AlertTriangle,
      priority: 'medium'
    },
    {
      id: 5,
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'VIP consultation with Hon. Peter Kariuki confirmed for Friday',
      time: '4 hours ago',
      icon: Calendar,
      priority: 'low'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-vip-red text-white';
      case 'medium': return 'bg-vip-gold text-black';
      case 'low': return 'bg-ios-green text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative text-vip-gold hover:text-vip-gold-light hover:bg-vip-gold/10"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-vip-red rounded-full text-[10px] flex items-center justify-center text-white animate-pulse">
            {notifications.length}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] vip-glass border-vip-gold/20 max-h-[600px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-vip-black flex items-center">
            <Bell className="h-5 w-5 mr-2 text-vip-gold" />
            Notifications
            <Badge className="ml-2 bg-vip-gold text-black">
              {notifications.length} new
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {notifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <div 
                key={notification.id}
                className="p-4 rounded-lg border border-vip-gold/20 vip-glass-light hover:bg-vip-gold/5 transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-vip-gold/10">
                    <IconComponent className="h-4 w-4 text-vip-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-vip-black truncate">
                        {notification.title}
                      </h4>
                      <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-vip-gold/80 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-vip-gold/60 mt-2">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-vip-gold/20">
          <Button variant="ghost" className="text-vip-gold hover:text-vip-gold-light">
            Mark all as read
          </Button>
          <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
            View all notifications
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
