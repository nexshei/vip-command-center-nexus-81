import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Calendar, DollarSign, Download, FileText, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Analytics = () => {
  const { toast } = useToast();

  const monthlyRevenue = [
    { month: 'Jan', revenue: 180000, bookings: 45 },
    { month: 'Feb', revenue: 220000, bookings: 52 },
    { month: 'Mar', revenue: 195000, bookings: 48 },
    { month: 'Apr', revenue: 280000, bookings: 65 },
    { month: 'May', revenue: 310000, bookings: 72 },
    { month: 'Jun', revenue: 265000, bookings: 58 }
  ];

  const serviceBreakdown = [
    { name: 'VIP Consultation', value: 35, color: '#D4AF37' },
    { name: 'Protocol Service', value: 28, color: '#4CD964' },
    { name: 'Event Management', value: 22, color: '#FF9500' },
    { name: 'Concierge Service', value: 15, color: '#007AFF' }
  ];

  const clientTierData = [
    { tier: 'VVIP', count: 12, revenue: 180000 },
    { tier: 'VIP', count: 28, revenue: 145000 },
    { tier: 'Premium', count: 45, revenue: 95000 },
    { tier: 'Standard', count: 67, revenue: 68000 }
  ];

  const exportReport = (type: string) => {
    toast({
      title: "Report Generated",
      description: `${type} report has been generated and will be downloaded shortly.`,
    });
    
    // Simulate file download
    const element = document.createElement('a');
    const file = new Blob(['Sample report data...'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${type.toLowerCase().replace(' ', '_')}_report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Analytics & Reports</h1>
          <p className="text-gray-600 mt-2">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => exportReport('Monthly Summary')}
            className="bg-vip-gold text-vip-black hover:bg-vip-gold-dark"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Export Options */}
      <Card className="bg-white border border-neutral-medium shadow-lg">
        <CardHeader className="border-b border-neutral-medium">
          <CardTitle className="flex items-center text-vip-black">
            <FileText className="h-5 w-5 mr-2 text-vip-gold" />
            Quick Export Options
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-3 md:grid-cols-4">
            <Button 
              variant="outline" 
              onClick={() => exportReport('Revenue Report')}
              className="border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-vip-black"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Revenue Report
            </Button>
            <Button 
              variant="outline" 
              onClick={() => exportReport('Client Analysis')}
              className="border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-vip-black"
            >
              <Users className="h-4 w-4 mr-2" />
              Client Analysis
            </Button>
            <Button 
              variant="outline" 
              onClick={() => exportReport('Booking Summary')}
              className="border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-vip-black"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Booking Summary
            </Button>
            <Button 
              variant="outline" 
              onClick={() => exportReport('Performance Metrics')}
              className="border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-vip-black"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance Metrics
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80 flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">KSH 2.8M</div>
            <p className="text-xs text-ios-green flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
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
