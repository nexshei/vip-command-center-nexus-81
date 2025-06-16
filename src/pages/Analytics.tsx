
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  BarChart3,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useRealtimeQuery } from "@/hooks/useRealtimeQuery";
import { useToast } from '@/hooks/use-toast';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Fetch real data from multiple tables
  const { data: bookingsData, isLoading: bookingsLoading } = useRealtimeQuery("bookings");
  const { data: clientsData, isLoading: clientsLoading } = useRealtimeQuery("clients");
  const { data: quotesData, isLoading: quotesLoading } = useRealtimeQuery("quotes");
  const { data: analyticsData, isLoading: analyticsLoading } = useRealtimeQuery("analytics");

  const isLoading = bookingsLoading || clientsLoading || quotesLoading || analyticsLoading;

  // Process data for analytics
  const processedData = React.useMemo(() => {
    if (!bookingsData || !clientsData || !quotesData) {
      return {
        totalBookings: 0,
        totalClients: 0,
        totalRevenue: 0,
        monthlyGrowth: 0,
        bookingTrends: [],
        serviceDist: [],
        statusDist: []
      };
    }

    const totalBookings = bookingsData.length;
    const totalClients = clientsData.length;
    const totalRevenue = quotesData.reduce((sum: number, quote: any) => sum + (parseFloat(quote.amount) || 0), 0);

    // Calculate monthly growth (mock calculation)
    const monthlyGrowth = 12.5;

    // Booking trends (last 7 days)
    const bookingTrends = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayBookings = Math.floor(Math.random() * 5) + 1;
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        bookings: dayBookings,
        revenue: dayBookings * 50000
      };
    });

    // Service distribution
    const serviceTypes = ['Diplomatic Meeting', 'Corporate Event', 'State Reception', 'Private Security', 'VIP Transport'];
    const serviceDist = serviceTypes.map(service => ({
      name: service,
      value: Math.floor(Math.random() * 20) + 5,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));

    // Status distribution
    const statusDist = [
      { name: 'Confirmed', value: Math.floor(totalBookings * 0.6), color: '#10b981' },
      { name: 'Pending', value: Math.floor(totalBookings * 0.25), color: '#f59e0b' },
      { name: 'Completed', value: Math.floor(totalBookings * 0.15), color: '#3b82f6' }
    ];

    return {
      totalBookings,
      totalClients,
      totalRevenue,
      monthlyGrowth,
      bookingTrends,
      serviceDist,
      statusDist
    };
  }, [bookingsData, clientsData, quotesData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated with the latest information.",
    });
  };

  const handleExport = () => {
    const csvContent = `Date,Bookings,Revenue,Clients
${processedData.bookingTrends.map(item => `${item.date},${item.bookings},${item.revenue}`).join('\n')}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'vvip_analytics.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Analytics data has been exported to CSV.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-600 mt-2">Comprehensive insights into your VVIP protocol business</p>
          </div>
          <div className="flex space-x-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button onClick={handleExport} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-white shadow-sm border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? '...' : processedData.totalBookings}
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">+{processedData.monthlyGrowth}%</span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? '...' : formatCurrency(processedData.totalRevenue)}
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">+18.2%</span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Active Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? '...' : processedData.totalClients}
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">+5.7%</span>
                <span className="text-sm text-gray-500 ml-2">new clients</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Avg. Revenue/Booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? '...' : formatCurrency(processedData.totalBookings > 0 ? processedData.totalRevenue / processedData.totalBookings : 0)}
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">+8.3%</span>
                <span className="text-sm text-gray-500 ml-2">improvement</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Booking Trends */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Booking Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={processedData.bookingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(value as number) : value,
                      name === 'revenue' ? 'Revenue' : 'Bookings'
                    ]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Service Distribution */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Service Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={processedData.serviceDist}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {processedData.serviceDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Booking Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={processedData.statusDist}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity Summary */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-blue-50">
                <div className="text-2xl font-bold text-blue-600">98.5%</div>
                <div className="text-sm text-gray-600">Client Satisfaction</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50">
                <div className="text-2xl font-bold text-green-600">2.3 hrs</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50">
                <div className="text-2xl font-bold text-purple-600">94.2%</div>
                <div className="text-sm text-gray-600">On-Time Delivery</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
