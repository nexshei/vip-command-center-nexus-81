
import React, { useState } from 'react';
import { Search, Filter, Eye, Trash2, Mail, Calendar, User } from 'lucide-react';
import { useContactSubmissions, useUpdateContactSubmission } from '@/hooks/useContactSubmissions';
import { supabase } from '@/integrations/supabase/client';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ContactSubmissions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [selectedSubmissionName, setSelectedSubmissionName] = useState<string>('');
  
  const { data: submissions = [], isLoading, error } = useContactSubmissions();
  const updateSubmissionMutation = useUpdateContactSubmission();
  const { toast } = useToast();

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateSubmissionMutation.mutateAsync({
        id,
        status: newStatus as any
      });
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewMessage = (submission: any) => {
    setSelectedMessage(submission);
    setIsViewModalOpen(true);
  };

  const handleDeleteSubmission = async () => {
    if (!selectedSubmissionId) return;
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', selectedSubmissionId);

      if (error) throw error;

      // Manually refetch since we don't have a refetch function from the hook
      window.location.reload();
      
      toast({
        title: "Submission Deleted",
        description: "The contact submission has been removed successfully.",
        variant: "destructive"
      });
      setShowDeleteModal(false);
      setSelectedSubmissionId(null);
      setSelectedSubmissionName('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete submission.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vip-gold"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error loading contact submissions</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Contact Submissions</h1>
          <p className="text-vip-gold/60 mt-1">Manage incoming contact messages and inquiries</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-vip-gold" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold">{submissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">
                  {submissions.filter(s => s.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reviewing</p>
                <p className="text-2xl font-bold">
                  {submissions.filter(s => s.status === 'reviewing').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">
                  {submissions.filter(s => s.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No contact submissions found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message Preview</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {submission.full_name}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {submission.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{submission.subject || 'No Subject'}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 truncate max-w-xs">
                        {submission.message.substring(0, 100)}
                        {submission.message.length > 100 && '...'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(submission.created_at || '').toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={submission.status || 'pending'}
                        onValueChange={(value) => handleStatusChange(submission.id, value)}
                      >
                        <SelectTrigger className="w-28">
                          <Badge className={getStatusColor(submission.status)}>
                            {submission.status || 'pending'}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewing">Reviewing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewMessage(submission)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedSubmissionId(submission.id);
                            setSelectedSubmissionName(submission.full_name);
                            setShowDeleteModal(true);
                          }}
                          className="border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-sm">{selectedMessage.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-sm">{selectedMessage.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Subject</label>
                <p className="text-sm">{selectedMessage.subject || 'No Subject'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Message</label>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Date Submitted</label>
                  <p className="text-sm">{new Date(selectedMessage.created_at || '').toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge className={getStatusColor(selectedMessage.status)}>
                    {selectedMessage.status || 'pending'}
                  </Badge>
                </div>
              </div>
              {selectedMessage.admin_notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Admin Notes</label>
                  <p className="text-sm">{selectedMessage.admin_notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteSubmission}
        title="Delete Contact Submission"
        description="Are you sure you want to delete this contact submission? This action cannot be undone."
        itemName={selectedSubmissionName}
      />
    </div>
  );
};

export default ContactSubmissions;
