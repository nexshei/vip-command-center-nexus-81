
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
      return 'bg-green-100 text-green-800';
    }
    return 'bg-red-100 text-red-800';
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Subscribers</h1>
          <p className="text-white/60 mt-1">Manage your newsletter subscriber base</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportSubscribers} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-vip-gold" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold">{subscribers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unsubscribed</p>
                <p className="text-2xl font-bold">{inactiveCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold">{thisMonthCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-serif">Subscriber Management</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subscribers</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Unsubscribed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {subscribers.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No subscribers found</p>
              <p className="text-gray-400 text-sm">
                Subscribers will appear here when users sign up for your newsletter
              </p>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No subscribers match your filters</p>
              <p className="text-gray-400 text-sm">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email Address</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscribed Date</TableHead>
                      <TableHead>Unsubscribed Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSubscribers.map((subscriber) => (
                      <TableRow key={subscriber.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <p className="font-medium">{subscriber.email}</p>
                              <p className="text-xs text-gray-500">ID: {subscriber.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
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
                              <span className="text-sm">{formatDate(subscriber.subscribed_at)}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {subscriber.unsubscribed_at ? (
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="text-sm">{formatDate(subscriber.unsubscribed_at)}</span>
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
                            >
                              {subscriber.is_active === false ? 'Activate' : 'Deactivate'}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedSubscriberId(subscriber.id);
                                setSelectedSubscriberEmail(subscriber.email);
                                setShowDeleteModal(true);
                              }}
                              className="border-red-300 text-red-600 hover:bg-red-50"
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
  );
};

export default Subscribers;
