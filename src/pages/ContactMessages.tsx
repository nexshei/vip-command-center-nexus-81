
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
      case 'pending': return 'bg-yellow-600 text-white border-0 font-medium';
      case 'reviewing': return 'bg-blue-600 text-white border-0 font-medium';
      case 'reviewed': return 'bg-purple-600 text-white border-0 font-medium';
      case 'resolved': return 'bg-emerald-600 text-white border-0 font-medium';
      case 'completed': return 'bg-green-600 text-white border-0 font-medium';
      default: return 'bg-gray-600 text-white border-0 font-medium';
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-vip-gold">Contact Messages</h1>
            <p className="text-vip-gold/60 mt-2">Manage and respond to contact submissions</p>
          </div>
        </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{submissions.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {submissions.filter(s => s.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {submissions.filter(s => s.status === 'reviewed').length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {submissions.filter(s => s.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48 bg-gray-800/80 border-gray-600 text-white hover:bg-gray-700/80 focus:border-vip-gold/50 shadow-lg backdrop-blur-sm">
                <SelectValue placeholder="Filter by status" className="text-white" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800/95 border-gray-600 backdrop-blur-sm shadow-xl z-50">
                <SelectItem value="all" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20">All Statuses</SelectItem>
                <SelectItem value="pending" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20">
                  <Badge className="bg-yellow-600 text-white border-0 font-medium">Pending</Badge>
                </SelectItem>
                <SelectItem value="reviewing" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20">
                  <Badge className="bg-blue-600 text-white border-0 font-medium">Reviewing</Badge>
                </SelectItem>
                <SelectItem value="reviewed" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20">
                  <Badge className="bg-purple-600 text-white border-0 font-medium">Reviewed</Badge>
                </SelectItem>
                <SelectItem value="resolved" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20">
                  <Badge className="bg-emerald-600 text-white border-0 font-medium">Resolved</Badge>
                </SelectItem>
                <SelectItem value="completed" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20">
                  <Badge className="bg-green-600 text-white border-0 font-medium">Completed</Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-300">
            <MessageSquare className="h-5 w-5 mr-2 text-vip-gold" />
            Contact Submissions ({filteredSubmissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Email</TableHead>
                <TableHead className="text-gray-400">Subject</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Date</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id} className="border-gray-700 hover:bg-gray-800/50">
                  <TableCell className="font-medium text-white">{submission.full_name}</TableCell>
                  <TableCell className="text-gray-300">{submission.email}</TableCell>
                  <TableCell className="text-gray-300">{submission.subject || 'No subject'}</TableCell>
                  <TableCell>
                    <Select
                      value={submission.status}
                      onValueChange={(value) => handleStatusUpdate(submission, value)}
                    >
                      <SelectTrigger className="w-36 h-9 bg-gray-800/80 border-gray-600 text-white hover:bg-gray-700/80 focus:border-vip-gold/50 shadow-md">
                        <SelectValue>
                          <Badge className={`${getStatusColor(submission.status)} text-xs border-0`}>
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800/95 border-gray-600 backdrop-blur-sm shadow-xl z-50">
                        <SelectItem value="pending" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20">
                          <Badge className="bg-yellow-600 text-white border-0 font-medium">Pending</Badge>
                        </SelectItem>
                        <SelectItem value="reviewing" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20">
                          <Badge className="bg-blue-600 text-white border-0 font-medium">Reviewing</Badge>
                        </SelectItem>
                        <SelectItem value="reviewed" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20">
                          <Badge className="bg-purple-600 text-white border-0 font-medium">Reviewed</Badge>
                        </SelectItem>
                        <SelectItem value="resolved" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20">
                          <Badge className="bg-emerald-600 text-white border-0 font-medium">Resolved</Badge>
                        </SelectItem>
                        <SelectItem value="completed" className="text-white hover:bg-vip-gold/20 focus:bg-vip-gold/20">
                          <Badge className="bg-green-600 text-white border-0 font-medium">Completed</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-gray-300">{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedSubmissionId(submission.id);
                        setSelectedSubmissionName(submission.full_name);
                        setShowDeleteModal(true);
                      }}
                      className="border-red-600/30 text-red-400 hover:bg-red-600/10"
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
              <CardTitle className="text-vip-gold">Message Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-vip-gold">Name</label>
                  <p className="text-white">{selectedSubmission.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-vip-gold">Email</label>
                  <p className="text-white">{selectedSubmission.email}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-vip-gold">Subject</label>
                <p className="text-white">{selectedSubmission.subject || 'No subject'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-vip-gold">Message</label>
                <div className="p-3 bg-vip-gold/10 rounded border border-vip-gold/20">
                  <p className="text-white whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-vip-gold">Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add your notes here..."
                  className="mt-1 border-vip-gold/30 bg-vip-gold/5 text-white placeholder:text-vip-gold/50"
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
                  className="bg-vip-gold text-black hover:bg-vip-gold/80"
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
    </div>
  );
};

export default ContactMessages;
