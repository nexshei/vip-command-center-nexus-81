
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Mail, Calendar, User, MessageSquare, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';

interface ContactSubmission {
  id: string;
  full_name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const ContactMessages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [selectedSubmissionName, setSelectedSubmissionName] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading, error } = useQuery({
    queryKey: ['contact-submissions'],
    queryFn: async (): Promise<ContactSubmission[]> => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: string; status: string; adminNotes?: string }) => {
      const updateData: any = { status };
      if (adminNotes !== undefined) {
        updateData.admin_notes = adminNotes;
      }
      
      const { data, error } = await supabase
        .from('contact_submissions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
      toast({
        title: "Status Updated",
        description: "Contact submission status has been updated.",
      });
    }
  });

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || submission.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-emerald-100 text-emerald-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (submission: ContactSubmission, newStatus: string) => {
    updateStatusMutation.mutate({ id: submission.id, status: newStatus });
  };

  const handleSaveNotes = () => {
    if (selectedSubmission) {
      updateStatusMutation.mutate({ 
        id: selectedSubmission.id, 
        status: selectedSubmission.status,
        adminNotes: adminNotes 
      });
      setSelectedSubmission(null);
      setAdminNotes('');
    }
  };

  const handleDeleteSubmission = async () => {
    if (!selectedSubmissionId) return;
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', selectedSubmissionId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-vip-gold">Loading contact messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error loading contact messages. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Contact Messages</h1>
          <p className="text-vip-gold/80 mt-2">Manage and respond to contact submissions</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{submissions.length}</div>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">
              {submissions.filter(s => s.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">
              {submissions.filter(s => s.status === 'reviewed').length}
            </div>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">
              {submissions.filter(s => s.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="vip-glass border-vip-gold/20">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-vip-gold/50" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-vip-gold/30"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48 border-vip-gold/30">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-vip-black">
            <MessageSquare className="h-5 w-5 mr-2 text-vip-gold" />
            Contact Submissions ({filteredSubmissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.full_name}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>{submission.subject || 'No subject'}</TableCell>
                  <TableCell>
                    <Select
                      value={submission.status}
                      onValueChange={(value) => handleStatusUpdate(submission, value)}
                    >
                      <SelectTrigger className="w-36 h-9 border border-gray-300 bg-white hover:bg-gray-50 focus:border-blue-500">
                        <SelectValue>
                          <Badge className={`${getStatusColor(submission.status)} text-xs`}>
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedSubmissionId(submission.id);
                        setSelectedSubmissionName(submission.full_name);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Message Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-vip-black">Message Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-vip-black">Name</label>
                  <p className="text-vip-gold/80">{selectedSubmission.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-vip-black">Email</label>
                  <p className="text-vip-gold/80">{selectedSubmission.email}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-vip-black">Subject</label>
                <p className="text-vip-gold/80">{selectedSubmission.subject || 'No subject'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-vip-black">Message</label>
                <div className="p-3 bg-white/50 rounded border border-vip-gold/20">
                  <p className="text-vip-black whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-vip-black">Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add your notes here..."
                  className="mt-1 border-vip-gold/30"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSubmission(null);
                    setAdminNotes('');
                  }}
                  className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveNotes}
                  className="bg-vip-gold text-white hover:bg-vip-gold-dark"
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? 'Saving...' : 'Save Notes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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

export default ContactMessages;
