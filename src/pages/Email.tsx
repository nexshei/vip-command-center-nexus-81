
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send, Inbox, Search, Calendar } from 'lucide-react';

interface EmailRecord {
  id: string;
  from_email: string;
  to_email: string;
  subject: string;
  body: string;
  status: string;
  sent_at: string;
}

// Mock data for emails
const mockEmails: EmailRecord[] = [
  {
    id: '1',
    from_email: 'admin@sirole-vvip.com',
    to_email: 'ambassador.johnson@embassy.com',
    subject: 'VIP Event Confirmation',
    body: 'Dear Ambassador Johnson, we are pleased to confirm your VIP event scheduled for next week...',
    status: 'sent',
    sent_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    from_email: 'admin@sirole-vvip.com',
    to_email: 'sarah.williams@megacorp.com',
    subject: 'Corporate Summit Details',
    body: 'Dear Ms. Williams, please find attached the detailed agenda for the upcoming corporate summit...',
    status: 'sent',
    sent_at: '2024-01-16T14:30:00Z'
  }
];

const Email = () => {
  const [isComposing, setIsComposing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [emails, setEmails] = useState<EmailRecord[]>(mockEmails);
  const [emailForm, setEmailForm] = useState({
    to_email: '',
    subject: '',
    body: ''
  });
  const { toast } = useToast();

  const filteredEmails = emails.filter((email) =>
    email.to_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.from_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailForm.to_email || !emailForm.subject || !emailForm.body) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate sending email
    const newEmail: EmailRecord = {
      id: Date.now().toString(),
      from_email: 'admin@sirole-vvip.com',
      to_email: emailForm.to_email,
      subject: emailForm.subject,
      body: emailForm.body,
      status: 'sent',
      sent_at: new Date().toISOString()
    };

    setEmails(prev => [newEmail, ...prev]);

    toast({
      title: "Email Sent",
      description: `Email sent successfully to ${emailForm.to_email}`,
    });

    setEmailForm({ to_email: '', subject: '', body: '' });
    setIsComposing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'sent':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-black min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-vip-gold">Email Management</h1>
            <p className="text-vip-gold/70 mt-1">Send and track VVIP communications</p>
          </div>
          <Button 
            onClick={() => setIsComposing(!isComposing)}
            className="bg-vip-gold text-black hover:bg-vip-gold/90"
          >
            <Mail className="h-4 w-4 mr-2" />
            {isComposing ? 'Cancel' : 'Compose Email'}
          </Button>
        </div>

        {isComposing && (
          <Card className="bg-black border-vip-gold/30 mb-6">
            <CardHeader>
              <CardTitle className="text-vip-gold flex items-center">
                <Send className="h-5 w-5 mr-2" />
                Compose New Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-vip-gold">To</label>
                  <Input
                    type="email"
                    placeholder="recipient@example.com"
                    value={emailForm.to_email}
                    onChange={(e) => setEmailForm({ ...emailForm, to_email: e.target.value })}
                    className="border-vip-gold/30 bg-black text-vip-gold"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-vip-gold">Subject</label>
                  <Input
                    placeholder="Email subject"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                    className="border-vip-gold/30 bg-black text-vip-gold"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-vip-gold">Message</label>
                  <Textarea
                    placeholder="Compose your message..."
                    value={emailForm.body}
                    onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                    className="border-vip-gold/30 bg-black text-vip-gold min-h-[120px]"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <Button type="submit" className="bg-vip-gold text-black hover:bg-vip-gold/90">
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsComposing(false)}
                    className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
            <Input
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-vip-gold/30 bg-black text-vip-gold"
            />
          </div>
          <Badge variant="outline" className="border-vip-gold/30 text-vip-gold">
            <Inbox className="h-3 w-3 mr-1" />
            {filteredEmails.length} Emails
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {filteredEmails.map((email) => (
          <Card key={email.id} className="bg-black border-vip-gold/30 hover:border-vip-gold/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Mail className="h-4 w-4 text-vip-gold/60" />
                    <span className="text-sm font-medium text-vip-gold">
                      From: {email.from_email}
                    </span>
                    <span className="text-sm text-vip-gold/70">
                      To: {email.to_email}
                    </span>
                    <Badge className={getStatusColor(email.status)}>
                      {email.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-medium text-vip-gold mb-2">{email.subject}</h3>
                  <p className="text-sm text-vip-gold/80 line-clamp-2">{email.body}</p>
                </div>
                <div className="flex items-center text-xs text-vip-gold/50 ml-4">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(email.sent_at).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredEmails.length === 0 && (
          <Card className="bg-black border-vip-gold/30">
            <CardContent className="p-8 text-center">
              <Inbox className="h-12 w-12 text-vip-gold/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-vip-gold mb-2">No Emails Found</h3>
              <p className="text-vip-gold/70 mb-4">
                {searchTerm ? 'No emails match your search criteria.' : 'Start sending VVIP communications.'}
              </p>
              <Button 
                onClick={() => setIsComposing(true)}
                className="bg-vip-gold text-black hover:bg-vip-gold/90"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send First Email
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Email;
