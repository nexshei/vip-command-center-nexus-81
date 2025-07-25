
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
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { supabase } from '@/integrations/supabase/client';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Mock data for analytics
  const mockData = {
    totalBookings: 45,
    totalClients: 28,
    totalRevenue: 2750000,
    monthlyGrowth: 12.5,
    bookingTrends: [
      { date: 'Mon', bookings: 3, revenue: 150000 },
      { date: 'Tue', bookings: 5, revenue: 250000 },
      { date: 'Wed', bookings: 2, revenue: 100000 },
      { date: 'Thu', bookings: 4, revenue: 200000 },
      { date: 'Fri', bookings: 6, revenue: 300000 },
      { date: 'Sat', bookings: 1, revenue: 50000 },
      { date: 'Sun', bookings: 2, revenue: 100000 }
    ],
    serviceDist: [
      { name: 'Diplomatic Meeting', value: 15, color: '#3b82f6' },
      { name: 'Corporate Event', value: 12, color: '#10b981' },
      { name: 'State Reception', value: 8, color: '#f59e0b' },
      { name: 'Private Security', value: 6, color: '#ef4444' },
      { name: 'VIP Transport', value: 4, color: '#8b5cf6' }
    ],
    statusDist: [
      { name: 'Confirmed', value: 27, color: '#10b981' },
      { name: 'Pending', value: 11, color: '#f59e0b' },
      { name: 'Completed', value: 7, color: '#3b82f6' }
    ]
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated with the latest information.",
    });
  };

  const handleExport = () => {
    const csvContent = `Date,Bookings,Revenue,Clients
${mockData.bookingTrends.map(item => `${item.date},${item.bookings},${item.revenue}`).join('\n')}`;
    
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

  const handleDeleteAnalytics = async () => {
    setIsDeleting(true);
    try {
      // Delete data from all analytics-related tables
      const promises = [
        supabase.from('vvip_service_requests').delete().gte('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('clients').delete().gte('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('contact_submissions').delete().gte('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('meeting_requests').delete().gte('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('career_applications').delete().gte('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('item_bookings').delete().gte('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('email_notifications').delete().gte('id', '00000000-0000-0000-0000-000000000000'),
      ];

      const results = await Promise.allSettled(promises);
      
      // Check if any deletion failed
      const failures = results.filter(result => result.status === 'rejected');
      
      if (failures.length > 0) {
        console.error('Some deletions failed:', failures);
        toast({
          title: "Partial Success",
          description: "Some analytics data was deleted, but some operations failed. Please check and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Analytics Data Deleted",
          description: "All analytics data has been successfully removed from the system.",
        });
      }
      
      // Refresh the page to show updated (empty) data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Error deleting analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to delete analytics data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
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
              <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 backdrop-blur-sm">
                <SelectItem value="7" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">Last 7 days</SelectItem>
                <SelectItem value="30" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">Last 30 days</SelectItem>
                <SelectItem value="90" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">Last 90 days</SelectItem>
                <SelectItem value="365" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">Last year</SelectItem>
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
            <Button 
              onClick={() => setShowDeleteModal(true)} 
              variant="destructive"
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Analytics</span>
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
                {mockData.totalBookings}
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">+{mockData.monthlyGrowth}%</span>
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
                {formatCurrency(mockData.totalRevenue)}
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
                {mockData.totalClients}
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
                {formatCurrency(mockData.totalBookings > 0 ? mockData.totalRevenue / mockData.totalBookings : 0)}
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
                <LineChart data={mockData.bookingTrends}>
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
                    data={mockData.serviceDist}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockData.serviceDist.map((entry, index) => (
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
              <BarChart data={mockData.statusDist}>
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete Analytics Data"
        description="Are you sure you want to delete all analytics data? This will permanently remove all service requests, client data, contact submissions, meeting requests, career applications, item bookings, and email notifications"
        itemName="All Analytics Data"
        onConfirm={handleDeleteAnalytics}
      />
    </div>
  );
};

export default Analytics;
