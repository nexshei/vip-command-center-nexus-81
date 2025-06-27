import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Mail, MessageSquare, Trash2, Eye, Reply, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ViewMessageModal } from "@/components/modals/ViewMessageModal";
import { useContactSubmissions, useUpdateContactSubmission } from "@/hooks/useContactSubmissions";

const ContactSubmissions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const { toast } = useToast();

  // Fetch real-time contact submissions from database
  const { data: submissions = [], isLoading, error, refetch } = useContactSubmissions();
  const updateSubmission = useUpdateContactSubmission();

  // Debug logging
  console.log('🔍 ContactSubmissions Component - Debug Info:', {
    submissions,
    submissionsLength: submissions?.length,
    isLoading,
    error: error?.message,
    hasData: submissions && submissions.length > 0,
    firstSubmission: submissions?.[0]
  });

  const filteredSubmissions = submissions.filter((submission: any) =>
    submission.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteSubmission = async (id: string) => {
    try {
      await updateSubmission.mutateAsync({ 
        id, 
        status: 'cancelled' as const 
      });
      toast({
        title: "Submission Updated",
        description: "Contact submission has been marked as cancelled.",
      });
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: "Error",
        description: "Failed to update submission status.",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (submission: any) => {
    setSelectedMessage(submission);
    setIsViewModalOpen(true);
  };

  const handleReply = (submission: any) => {
    const mailtoLink = `mailto:${submission.email}?subject=Re: ${submission.subject || 'Your Contact Submission'}&body=Dear ${submission.full_name},%0D%0A%0D%0AThank you for contacting us.%0D%0A%0D%0ABest regards,%0D%0AVVIP Protocol Team`;
    window.open(mailtoLink, '_blank');
    
    toast({
      title: "Email Client Opened",
      description: `Opening email client to reply to ${submission.full_name}.`,
    });
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Contact submissions data has been refreshed.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    console.error('ContactSubmissions Error:', error);
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-vip-black mb-2">Database Connection Error</h3>
          <p className="text-vip-gold/60 mb-4">Failed to load contact submissions: {error.message}</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left">
            <h4 className="font-medium text-red-800 mb-2">Error Details:</h4>
            <pre className="text-sm text-red-600 whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>
          </div>
          <Button onClick={() => refetch()} variant="outline" className="border-vip-gold text-vip-gold hover:bg-vip-gold/10">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="text-center py-12">
          <div className="text-xl text-vip-gold mb-4">Loading contact submissions...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vip-gold mx-auto"></div>
          <p className="text-sm text-vip-gold/60 mt-4">Connecting to database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Contact Submissions</h1>
          <p className="text-vip-gold/80 mt-2">View and manage all contact form submissions from your website</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="border-vip-gold text-vip-gold hover:bg-vip-gold/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Badge variant="outline" className="border-vip-gold text-vip-gold">
            {submissions.length} Total Messages
          </Badge>
        </div>
      </div>

      {/* Enhanced Debug Info Card */}
      <Card className="vip-glass border-blue-500/20 bg-blue-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-blue-800">🔍 Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-700">Total Records:</span>
              <div className="text-blue-900 font-bold">{submissions?.length || 0}</div>
            </div>
            <div>
              <span className="font-medium text-blue-700">Loading State:</span>
              <div className="text-blue-900">{isLoading ? '🔄 Loading' : '✅ Loaded'}</div>
            </div>
            <div>
              <span className="font-medium text-blue-700">Error State:</span>
              <div className="text-blue-900">{error ? '❌ Error' : '✅ No Errors'}</div>
            </div>
            <div>
              <span className="font-medium text-blue-700">Connection:</span>
              <div className="text-blue-900">🟢 Active</div>
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Latest Check:</strong> {new Date().toLocaleTimeString()} | 
              <strong> Data Type:</strong> {typeof submissions} | 
              <strong> Is Array:</strong> {Array.isArray(submissions) ? 'Yes' : 'No'}
            </p>
            {submissions?.[0] && (
              <details className="mt-2">
                <summary className="text-xs font-medium text-blue-800 cursor-pointer">View Sample Record</summary>
                <pre className="text-xs text-blue-600 mt-1 p-2 bg-white rounded border overflow-auto">
                  {JSON.stringify(submissions[0], null, 2)}
                </pre>
              </details>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Total Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{submissions?.length || 0}</div>
            <p className="text-xs text-vip-gold/60">All time submissions</p>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80 flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Recent Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">
              {submissions?.filter((s: any) => {
                const today = new Date().toDateString();
                return new Date(s.created_at).toDateString() === today;
              }).length || 0}
            </div>
            <p className="text-xs text-vip-gold/60">Today's messages</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">
              {submissions?.filter((s: any) => s.status === 'pending').length || 0}
            </div>
            <p className="text-xs text-vip-gold/60">Awaiting response</p>
          </CardContent>
        </Card>
      </div>

      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="text-vip-black">Search Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
            <Input
              placeholder="Search by name, email, subject, or message content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="text-vip-gold flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            All Contact Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Message Preview</TableHead>
                  <TableHead>Date Received</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission: any, idx: number) => (
                  <TableRow key={submission.id} className="hover:bg-vip-gold/5">
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell className="font-medium">{submission.full_name}</TableCell>
                    <TableCell>
                      <a 
                        href={`mailto:${submission.email}`} 
                        className="text-vip-gold hover:underline"
                      >
                        {submission.email}
                      </a>
                    </TableCell>
                    <TableCell className="font-medium">
                      {submission.subject || "No Subject"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status?.toUpperCase() || 'PENDING'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm text-gray-600">
                        {submission.message?.substring(0, 80)}
                        {submission.message?.length > 80 && "..."}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {submission.created_at
                          ? new Date(submission.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleViewDetails(submission)}
                          variant="outline"
                          size="sm"
                          title="View Details"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleReply(submission)}
                          variant="outline"
                          size="sm"
                          title="Reply via Email"
                          className="border-green-300 text-green-600 hover:bg-green-50"
                        >
                          <Reply className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteSubmission(submission.id)}
                          variant="outline"
                          size="sm"
                          title="Mark as Cancelled"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-vip-gold/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-vip-black mb-2">No Contact Submissions</h3>
                <p className="text-vip-gold/60 mb-4">
                  {searchTerm 
                    ? "No messages match your search criteria." 
                    : "No contact form submissions have been received yet."}
                </p>
                {searchTerm && (
                  <Button
                    onClick={() => setSearchTerm('')}
                    variant="outline"
                    className="mt-4 border-vip-gold text-vip-gold hover:bg-vip-gold/10"
                  >
                    Clear Search
                  </Button>
                )}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 <strong>Tip:</strong> To test the system, you can add sample data through your contact form on the website.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Message Modal */}
      <ViewMessageModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        message={selectedMessage}
      />
    </div>
  );
};

export default ContactSubmissions;
