
import React from 'react';
import { CreditCard, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Subscriptions = () => {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">VIP Subscriptions</h1>
          <p className="text-vip-gold/80 mt-2">Manage premium memberships and services</p>
        </div>
        <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
          <Plus className="h-4 w-4 mr-2" />
          New Plan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Active Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">234</div>
            <p className="text-xs text-ios-green">+12 this month</p>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Monthly Revenue (KSH)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">4.2M</div>
            <p className="text-xs text-ios-green">+18% growth</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Churn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">2.3%</div>
            <p className="text-xs text-ios-green">-0.5% improvement</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Avg. Value (KSH)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">18,500</div>
            <p className="text-xs text-vip-gold/60">Per subscriber</p>
          </CardContent>
        </Card>
      </div>

      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-vip-black">
            <CreditCard className="h-5 w-5 mr-2 text-vip-gold" />
            Subscription Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-vip-gold/60">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Subscription management portal coming soon...</p>
            <p className="text-sm mt-2">Feature under development</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscriptions;
