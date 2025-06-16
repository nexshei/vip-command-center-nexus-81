
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

const DashboardStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Today's Bookings
          </CardTitle>
          <Calendar className="h-4 w-4 text-vip-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">3</div>
          <p className="text-xs text-green-600">
            2 confirmed
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            This Week
          </CardTitle>
          <Calendar className="h-4 w-4 text-vip-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">12</div>
          <p className="text-xs text-green-600">
            +3 from last week
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            VVIP Clients
          </CardTitle>
          <Users className="h-4 w-4 text-vip-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">48</div>
          <p className="text-xs text-green-600">
            +5 this month
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Revenue
          </CardTitle>
          <DollarSign className="h-4 w-4 text-vip-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">KSh 2.4M</div>
          <p className="text-xs text-green-600">
            +20% this month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
