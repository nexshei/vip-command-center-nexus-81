
import React from 'react';
import { BarChart3, Download, TrendingUp, Users, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Analytics = () => {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Analytics & Reports</h1>
          <p className="text-vip-gold/80 mt-2">Performance metrics and business intelligence</p>
        </div>
        <div className="flex space-x-3">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80 flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">KSH 12.4M</div>
            <p className="text-xs text-ios-green flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +23.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Client Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">+156</div>
            <p className="text-xs text-ios-green">New clients this month</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Booking Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">94.2%</div>
            <p className="text-xs text-ios-green">+2.1% increase</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Avg. Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">KSH 45,600</div>
            <p className="text-xs text-vip-gold/60">Per booking</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader>
            <CardTitle className="text-vip-black">Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { service: 'VIP Consultations', revenue: 'KSH 4.8M', percentage: 38.7, color: 'bg-vip-gold' },
                { service: 'Protocol Services', revenue: 'KSH 3.2M', percentage: 25.8, color: 'bg-ios-blue' },
                { service: 'Event Management', revenue: 'KSH 2.4M', percentage: 19.4, color: 'bg-ios-green' },
                { service: 'Subscriptions', revenue: 'KSH 2.0M', percentage: 16.1, color: 'bg-ios-purple' },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-vip-black">{item.service}</span>
                    <span className="text-sm font-semibold text-vip-black">{item.revenue}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader>
            <CardTitle className="text-vip-black">Quick Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Monthly Performance Report', description: 'Complete business metrics for this month' },
                { name: 'Client Satisfaction Survey', description: 'Feedback and ratings from VIP clients' },
                { name: 'Revenue Analytics', description: 'Detailed revenue breakdown and trends' },
                { name: 'Booking Patterns', description: 'Analysis of booking trends and patterns' },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-vip-gold/20 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-vip-black">{report.name}</h4>
                    <p className="text-sm text-vip-gold/80">{report.description}</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-white">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
