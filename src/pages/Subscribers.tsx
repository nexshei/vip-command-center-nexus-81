
import React, { useState } from 'react';
import { Search, Mail, Calendar, Download, RefreshCw, UserPlus, Plus, Trash2 } from 'lucide-react';
import { useNewsletterSubscriptions, useUpdateNewsletterSubscription, useDeleteNewsletterSubscription } from '@/hooks/useNewsletterSubscriptions';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const Subscribers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubscriberId, setSelectedSubscriberId] = useState<string | null>(null);
  const [selectedSubscriberEmail, setSelectedSubscriberEmail] = useState<string>('');
  
  const { data: subscribers = [], isLoading, error, refetch } = useNewsletterSubscriptions();
  const updateSubscriber = useUpdateNewsletterSubscription();
  const deleteSubscriber = useDeleteNewsletterSubscription();
  const { toast } = useToast();

  console.log('📊 Subscribers data:', subscribers);
  console.log('📊 Loading state:', isLoading);
  console.log('📊 Error state:', error);

  // Filter subscribers based on search and status
  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && (subscriber.is_active === true || subscriber.is_active === null)) ||
      (statusFilter === 'inactive' && subscriber.is_active === false);
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSubscribers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSubscribers = filteredSubscribers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getStatusColor = (isActive: boolean | null) => {
    if (isActive === null || isActive === true) {
      return 'bg-green-500 text-white border-green-500';
    }
    return 'bg-red-500 text-white border-red-500';
  };

  const getStatusText = (isActive: boolean | null) => {
    if (isActive === null || isActive === true) {
      return 'Active';
    }
    return 'Unsubscribed';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const exportSubscribers = () => {
    if (filteredSubscribers.length === 0) {
      toast({
        title: "No Data",
        description: "No subscribers to export",
        variant: "destructive"
      });
      return;
    }

    const csvContent = [
      ['Email', 'Source', 'Status', 'Subscribed Date', 'Unsubscribed Date'].join(','),
      ...filteredSubscribers.map(subscriber => [
        `"${subscriber.email}"`,
        `"${subscriber.source || 'website'}"`,
        `"${getStatusText(subscriber.is_active)}"`,
        `"${formatDate(subscriber.subscribed_at)}"`,
        `"${formatDate(subscriber.unsubscribed_at)}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `Exported ${filteredSubscribers.length} subscribers to CSV`
    });
  };

  const handleRefresh = () => {
    console.log('🔄 Refreshing subscribers data...');
    refetch();
    toast({
      title: "Refreshing",
      description: "Reloading subscriber data..."
    });
  };

  const toggleSubscriberStatus = async (id: string, currentStatus: boolean | null) => {
    try {
      const newStatus = !currentStatus;
      await updateSubscriber.mutateAsync({
        id,
        is_active: newStatus,
        unsubscribed_at: newStatus ? null : new Date().toISOString()
      });
      
      toast({
        title: "Status Updated",
        description: `Subscriber ${newStatus ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      console.error('Error updating subscriber status:', error);
      toast({
        title: "Error",
        description: "Failed to update subscriber status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSubscriber = async () => {
    if (!selectedSubscriberId) return;
    
    try {
      await deleteSubscriber.mutateAsync(selectedSubscriberId);
      toast({
        title: "Subscriber Deleted",
        description: "The subscriber has been removed successfully.",
        variant: "destructive"
      });
      setShowDeleteModal(false);
      setSelectedSubscriberId(null);
      setSelectedSubscriberEmail('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete subscriber.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vip-gold"></div>
          <span className="ml-3 text-vip-gold">Loading subscribers...</span>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('📛 Subscribers error:', error);
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">
                Error loading subscribers: {error.message}
              </p>
              <div className="space-x-2">
                <Button onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Reload Page
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate stats
  const activeCount = subscribers.filter(s => s.is_active === true || s.is_active === null).length;
  const inactiveCount = subscribers.filter(s => s.is_active === false).length;
  const thisMonthCount = subscribers.filter(s => {
    if (!s.subscribed_at) return false;
    try {
      const subDate = new Date(s.subscribed_at);
      const now = new Date();
      return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear();
    } catch {
      return false;
    }
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-vip-gold">Subscribers</h1>
            <p className="text-vip-gold/60 mt-2">Manage your newsletter subscriber base</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10">
              <Mail className="h-3 w-3 mr-1" />
              {subscribers.length} Total Subscribers
            </Badge>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="text-vip-gold border-vip-gold/30 hover:bg-vip-gold/10">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportSubscribers} variant="outline" size="sm" className="text-vip-gold border-vip-gold/30 hover:bg-vip-gold/10">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Total Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{subscribers.length}</div>
              <p className="text-xs text-gray-400">All time</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Active Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{activeCount}</div>
              <p className="text-xs text-green-300">Currently subscribed</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Unsubscribed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{inactiveCount}</div>
              <p className="text-xs text-red-300">No longer active</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{thisMonthCount}</div>
              <p className="text-xs text-blue-300">New subscribers</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-gray-300">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-vip-gold/50">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 backdrop-blur-sm">
                  <SelectItem value="all" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20 focus:text-white">All Subscribers</SelectItem>
                  <SelectItem value="active" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20 focus:text-white">Active Only</SelectItem>
                  <SelectItem value="inactive" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20 focus:text-white">Unsubscribed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Subscriber Table */}
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-300">Subscriber Management</CardTitle>
          </CardHeader>
          <CardContent>
            {subscribers.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No subscribers found</p>
                <p className="text-gray-400 text-sm">
                  Subscribers will appear here when users sign up for your newsletter
                </p>
              </div>
            ) : filteredSubscribers.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No subscribers match your filters</p>
                <p className="text-gray-400 text-sm">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">Email Address</TableHead>
                      <TableHead className="text-gray-400">Source</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Subscribed Date</TableHead>
                      <TableHead className="text-gray-400">Unsubscribed Date</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSubscribers.map((subscriber) => (
                      <TableRow key={subscriber.id} className="border-gray-700 hover:bg-gray-800/50">
                        <TableCell>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <p className="font-medium text-white">{subscriber.email}</p>
                              <p className="text-xs text-gray-400">ID: {subscriber.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className="capitalize border-vip-gold/30 text-vip-gold bg-vip-gold/10"
                          >
                            {subscriber.source || 'website'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(subscriber.is_active)}>
                            {getStatusText(subscriber.is_active)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {subscriber.subscribed_at ? (
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="text-sm text-gray-300">{formatDate(subscriber.subscribed_at)}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {subscriber.unsubscribed_at ? (
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="text-sm text-gray-300">{formatDate(subscriber.unsubscribed_at)}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleSubscriberStatus(subscriber.id, subscriber.is_active)}
                              disabled={updateSubscriber.isPending}
                              className="text-white bg-vip-gold hover:bg-vip-gold/80 border-vip-gold"
                            >
                              {subscriber.is_active === false ? 'Activate' : 'Deactivate'}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedSubscriberId(subscriber.id);
                                setSelectedSubscriberEmail(subscriber.email);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteSubscriber}
        title="Delete Subscriber"
        description="Are you sure you want to delete this subscriber? This action cannot be undone."
        itemName={selectedSubscriberEmail}
      />
      </div>
    </div>
  );
};

export default Subscribers;
