
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Mail, MessageSquare, Trash2, Eye, Reply } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSubmissions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Mock contact submissions data
  const [submissions] = useState([
    {
      id: '1',
      name: 'Ambassador Johnson',
      email: 'ambassador.johnson@embassy.com',
      subject: 'VIP Protocol Meeting Request',
      message: 'We would like to schedule a high-level diplomatic meeting for next month. Please provide available dates and protocol requirements.',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      name: 'Sarah Williams',
      email: 'sarah.williams@megacorp.com',
      subject: 'Corporate Event Planning',
      message: 'Our company is planning a major corporate event and requires VIP protocol services. Could you send us a detailed quote?',
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      name: 'Minister Chen',
      email: 'minister.chen@gov.example',
      subject: 'State Reception Organization',
      message: 'We need assistance organizing a state reception for visiting dignitaries. What services do you provide for such events?',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const filteredSubmissions = submissions.filter((submission: any) =>
    submission.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteSubmission = (id: string) => {
    toast({
      title: "Demo Mode",
      description: "In a real application, this would delete the contact submission.",
    });
  };

  const handleViewDetails = (submission: any) => {
    toast({
      title: "Contact Details",
      description: `Opening detailed view for ${submission.name}'s message.`,
    });
  };

  const handleReply = (submission: any) => {
    const mailtoLink = `mailto:${submission.email}?subject=Re: ${submission.subject || 'Your Contact Submission'}&body=Dear ${submission.name},%0D%0A%0D%0AThank you for contacting us.%0D%0A%0D%0ABest regards,%0D%0AVVIP Protocol Team`;
    window.open(mailtoLink, '_blank');
    
    toast({
      title: "Email Client Opened",
      description: `Opening email client to reply to ${submission.name}.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Contact Submissions</h1>
          <p className="text-vip-gold/80 mt-2">View and manage all contact form submissions from your website</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-vip-gold text-vip-gold">
            {filteredSubmissions.length} Total Messages
          </Badge>
        </div>
      </div>

      {/* Stats */}
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
            <CardTitle className="text-sm font-medium text-vip-gold/80">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => toast({ title: "Demo Mode", description: "This is demo data for display purposes." })} 
              variant="outline" 
              size="sm"
              className="border-vip-gold text-vip-gold hover:bg-vip-gold/10"
            >
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
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

      {/* Messages Table */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="text-vip-gold flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            All Contact Messages (Demo Data)
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
                  <TableHead>Message Preview</TableHead>
                  <TableHead>Date Received</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission: any, idx: number) => (
                  <TableRow key={submission.id} className="hover:bg-vip-gold/5">
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell className="font-medium">{submission.name}</TableCell>
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
                          title="Delete Submission"
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
                <p className="text-vip-gold/60">
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactSubmissions;
