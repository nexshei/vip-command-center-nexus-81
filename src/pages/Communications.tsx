
import React from 'react';
import { Mail, MessageSquare, Send, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Communications = () => {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Communications</h1>
          <p className="text-vip-gold/80 mt-2">Client communications and campaign management</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Emails Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">1,247</div>
            <p className="text-xs text-ios-green">+156 this week</p>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Open Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">87.3%</div>
            <p className="text-xs text-ios-green">+2.1% improvement</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">23.8%</div>
            <p className="text-xs text-ios-green">+1.5% increase</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">8</div>
            <p className="text-xs text-vip-gold/60">Running campaigns</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader>
            <CardTitle className="text-vip-black">Send Quick Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select recipient group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vvip">VVIP Clients</SelectItem>
                <SelectItem value="vip">VIP Clients</SelectItem>
                <SelectItem value="premium">Premium Clients</SelectItem>
                <SelectItem value="all">All Clients</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Subject line" />
            <Textarea placeholder="Your message..." rows={4} />
            <Button className="w-full bg-vip-gold text-white hover:bg-vip-gold-dark">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader>
            <CardTitle className="text-vip-black">Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'VVIP Event Invitation', sent: '234 recipients', status: 'Active', rate: '92.1%' },
                { name: 'Monthly Newsletter', sent: '847 recipients', status: 'Completed', rate: '85.7%' },
                { name: 'Service Update', sent: '156 recipients', status: 'Draft', rate: '-' },
              ].map((campaign, index) => (
                <div key={index} className="p-3 border border-vip-gold/20 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-vip-black">{campaign.name}</h4>
                      <p className="text-sm text-vip-gold/80">{campaign.sent}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        campaign.status === 'Active' ? 'bg-ios-green text-white' :
                        campaign.status === 'Completed' ? 'bg-ios-blue text-white' :
                        'bg-vip-gold text-black'
                      }`}>
                        {campaign.status}
                      </span>
                      <p className="text-xs text-vip-gold/60 mt-1">Open: {campaign.rate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Communications;
