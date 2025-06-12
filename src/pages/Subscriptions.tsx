
import React from 'react';
import { CreditCard, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NewPlanModal } from '@/components/modals/NewPlanModal';

const Subscriptions = () => {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">VIP Subscriptions</h1>
          <p className="text-vip-gold/80 mt-2">Manage premium memberships and services</p>
        </div>
        <NewPlanModal />
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Sample subscription plans */}
        {[
          { name: 'VVIP Elite', price: 'KSH 50,000', duration: 'Monthly', subscribers: 45, color: 'bg-vip-red' },
          { name: 'VIP Premium', price: 'KSH 25,000', duration: 'Monthly', subscribers: 89, color: 'bg-vip-gold' },
          { name: 'Premium Plus', price: 'KSH 15,000', duration: 'Monthly', subscribers: 100, color: 'bg-ios-blue' },
        ].map((plan, index) => (
          <Card key={index} className="vip-glass border-vip-gold/20 hover:border-vip-gold/40 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-vip-black">{plan.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs text-white ${plan.color}`}>
                  {plan.subscribers} subscribers
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold text-vip-black">{plan.price}</div>
                  <div className="text-sm text-vip-gold/60">per {plan.duration.toLowerCase()}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-vip-gold/80">• Priority booking access</div>
                  <div className="text-sm text-vip-gold/80">• Dedicated concierge service</div>
                  <div className="text-sm text-vip-gold/80">• 24/7 support hotline</div>
                  <div className="text-sm text-vip-gold/80">• Exclusive event invitations</div>
                </div>
                <Button variant="outline" className="w-full border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-white">
                  Manage Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
