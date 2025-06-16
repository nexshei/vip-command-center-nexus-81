
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

const DashboardStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-vip-gold/80">
            Today's Bookings
          </CardTitle>
          <Calendar className="h-4 w-4 text-vip-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-vip-black">0</div>
          <p className="text-xs text-vip-gold/60">
            No active
          </p>
        </CardContent>
      </Card>
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-vip-gold/80">
            This Week
          </CardTitle>
          <Calendar className="h-4 w-4 text-vip-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-vip-black">0</div>
          <p className="text-xs text-vip-gold/60">
            No active
          </p>
        </CardContent>
      </Card>
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-vip-gold/80">
            VVIP Clients
          </CardTitle>
          <Users className="h-4 w-4 text-vip-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-vip-black">12</div>
          <p className="text-xs text-ios-green">
            +2 new this month
          </p>
        </CardContent>
      </Card>
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-vip-gold/80">
            Revenue
          </CardTitle>
          <DollarSign className="h-4 w-4 text-vip-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-vip-black">KSh 2.4M</div>
          <p className="text-xs text-ios-green">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
