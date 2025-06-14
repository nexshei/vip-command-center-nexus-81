
import React from 'react';
import { Package, Users, Bell, Calendar, FileText, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Subscriptions = () => {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-white mb-4">VIP Subscription Services</h1>
          <p className="text-xl text-vip-gold">Exclusive membership plans for distinguished clients</p>
        </div>

        {/* Premium Subscription Tiers */}
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="bg-white border-2 border-vip-gold shadow-xl transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="bg-vip-gold text-center py-8">
              <CardTitle className="text-2xl font-bold text-black">GOLD TIER</CardTitle>
              <div className="text-3xl font-bold text-black mt-2">KSh 50,000</div>
              <p className="text-black/80 mt-1">per month</p>
            </CardHeader>
            <CardContent className="p-8 text-black">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Star className="h-5 w-5 text-vip-gold mr-3" />
                  Priority booking services
                </li>
                <li className="flex items-center">
                  <Users className="h-5 w-5 text-vip-gold mr-3" />
                  Dedicated protocol officer
                </li>
                <li className="flex items-center">
                  <Calendar className="h-5 w-5 text-vip-gold mr-3" />
                  24/7 concierge support
                </li>
                <li className="flex items-center">
                  <Package className="h-5 w-5 text-vip-gold mr-3" />
                  Premium event planning
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white border-4 border-vip-gold shadow-2xl transform hover:scale-105 transition-transform duration-300 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-vip-gold text-black px-6 py-2 rounded-full font-bold">
              MOST POPULAR
            </div>
            <CardHeader className="bg-gradient-to-r from-vip-gold to-yellow-400 text-center py-8">
              <CardTitle className="text-2xl font-bold text-black">PLATINUM TIER</CardTitle>
              <div className="text-3xl font-bold text-black mt-2">KSh 150,000</div>
              <p className="text-black/80 mt-1">per month</p>
            </CardHeader>
            <CardContent className="p-8 text-black">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Star className="h-5 w-5 text-vip-gold mr-3" />
                  All Gold tier benefits
                </li>
                <li className="flex items-center">
                  <Users className="h-5 w-5 text-vip-gold mr-3" />
                  Personal security detail
                </li>
                <li className="flex items-center">
                  <Calendar className="h-5 w-5 text-vip-gold mr-3" />
                  Private jet coordination
                </li>
                <li className="flex items-center">
                  <Package className="h-5 w-5 text-vip-gold mr-3" />
                  Luxury accommodation
                </li>
                <li className="flex items-center">
                  <Bell className="h-5 w-5 text-vip-gold mr-3" />
                  Emergency response team
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-vip-gold shadow-xl transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="bg-gradient-to-r from-gray-800 to-black text-center py-8">
              <CardTitle className="text-2xl font-bold text-vip-gold">DIAMOND TIER</CardTitle>
              <div className="text-3xl font-bold text-vip-gold mt-2">KSh 500,000</div>
              <p className="text-vip-gold/80 mt-1">per month</p>
            </CardHeader>
            <CardContent className="p-8 text-black">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Star className="h-5 w-5 text-vip-gold mr-3" />
                  All Platinum tier benefits
                </li>
                <li className="flex items-center">
                  <Users className="h-5 w-5 text-vip-gold mr-3" />
                  Executive protection team
                </li>
                <li className="flex items-center">
                  <Calendar className="h-5 w-5 text-vip-gold mr-3" />
                  Global protocol services
                </li>
                <li className="flex items-center">
                  <Package className="h-5 w-5 text-vip-gold mr-3" />
                  Bespoke lifestyle management
                </li>
                <li className="flex items-center">
                  <FileText className="h-5 w-5 text-vip-gold mr-3" />
                  Unlimited custom requests
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Service Features */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
          <Card className="bg-white border border-vip-gold/50 hover:border-vip-gold transition-colors">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-vip-gold mx-auto mb-4" />
              <h3 className="font-bold text-black mb-2">Protocol Services</h3>
              <p className="text-gray-600 text-sm">Professional diplomatic and social protocol management</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-vip-gold/50 hover:border-vip-gold transition-colors">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-vip-gold mx-auto mb-4" />
              <h3 className="font-bold text-black mb-2">Event Planning</h3>
              <p className="text-gray-600 text-sm">Exclusive event coordination and management services</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-vip-gold/50 hover:border-vip-gold transition-colors">
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 text-vip-gold mx-auto mb-4" />
              <h3 className="font-bold text-black mb-2">Concierge</h3>
              <p className="text-gray-600 text-sm">Personalized lifestyle and travel management</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-vip-gold/50 hover:border-vip-gold transition-colors">
            <CardContent className="p-6 text-center">
              <Bell className="h-12 w-12 text-vip-gold mx-auto mb-4" />
              <h3 className="font-bold text-black mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Round-the-clock assistance and emergency response</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card className="bg-white border-2 border-vip-gold shadow-xl mt-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-black mb-4">Ready to Experience Excellence?</h2>
            <p className="text-gray-600 mb-6">Contact our membership team to discuss your exclusive VIP subscription plan</p>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <p className="font-semibold text-black">Call</p>
                <p className="text-vip-gold">+254 700 000 000</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-black">Email</p>
                <p className="text-vip-gold">vip@sirolele.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscriptions;
