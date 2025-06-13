
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  Plus, 
  Send, 
  Inbox, 
  Sent, 
  FileText, 
  Paperclip, 
  Bold, 
  Italic, 
  Link, 
  List,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  isRead: boolean;
  isStarred?: boolean;
}

const Email = () => {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Compose form state
  const [emailTo, setEmailTo] = useState('');
  const [emailCc, setEmailCc] = useState('');
  const [emailBcc, setEmailBcc] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('');

  const inboxEmails: Email[] = [
    {
      id: '1',
      sender: 'Hon. Peter Maina',
      subject: 'VIP Event Confirmation Required',
      preview: 'Dear Sir Dennis, I hope this message finds you well. I am writing to confirm...',
      date: '2 hours ago',
      isRead: false
    },
    {
      id: '2',
      sender: 'Dr. Sarah Wanjiku',
      subject: 'Protocol Schedule Update',
      preview: 'Good morning, There has been a slight change to tomorrow\'s schedule...',
      date: '5 hours ago',
      isRead: true
    },
    {
      id: '3',
      sender: 'Mr. James Kimani',
      subject: 'Security Briefing Request',
      preview: 'Sir Dennis, Could we arrange a security briefing for the upcoming...',
      date: '1 day ago',
      isRead: true
    },
    {
      id: '4',
      sender: 'Ms. Grace Mutua',
      subject: 'Thank you for excellent service',
      preview: 'Dear Mr. Olele, I wanted to take a moment to express my sincere gratitude...',
      date: '2 days ago',
      isRead: false
    },
  ];

  const sentEmails: Email[] = [
    {
      id: '5',
      sender: 'You',
      subject: 'Re: VIP Transport Arrangement',
      preview: 'Thank you for your inquiry. We have arranged the VIP transport...',
      date: '3 hours ago',
      isRead: true
    },
    {
      id: '6',
      sender: 'You',
      subject: 'Protocol Guidelines Update',
      preview: 'Dear Team, Please find attached the updated protocol guidelines...',
      date: '1 day ago',
      isRead: true
    },
  ];

  const draftEmails: Email[] = [
    {
      id: '7',
      sender: 'You (Draft)',
      subject: 'Monthly Protocol Report',
      preview: 'Executive Summary: This month we have successfully completed...',
      date: 'Draft',
      isRead: true
    },
  ];

  const emailTemplates = [
    { id: 'welcome', name: 'Welcome Message', content: 'Dear [CLIENT_NAME],\n\nWelcome to Sir Dennis Olele VVIP Protocol services...' },
    { id: 'confirmation', name: 'Booking Confirmation', content: 'Dear [CLIENT_NAME],\n\nThis is to confirm your VIP booking for [DATE]...' },
    { id: 'followup', name: 'Follow-up Message', content: 'Dear [CLIENT_NAME],\n\nI hope your recent experience with our services was exceptional...' },
    { id: 'thank-you', name: 'Thank You Note', content: 'Dear [CLIENT_NAME],\n\nThank you for choosing Sir Dennis Olele VVIP Protocol...' },
  ];

  const getCurrentEmails = () => {
    switch (activeFolder) {
      case 'inbox': return inboxEmails;
      case 'sent': return sentEmails;
      case 'drafts': return draftEmails;
      default: return inboxEmails;
    }
  };

  const filteredEmails = getCurrentEmails().filter(email =>
    email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedEmailDetails = () => {
    if (!selectedEmail) return null;
    return getCurrentEmails().find(email => email.id === selectedEmail);
  };

  const handleSendEmail = () => {
    if (!emailTo || !emailSubject || !emailContent) {
      toast({
        title: "Missing Information",
        description: "Please fill in recipient, subject, and content.",
      });
      return;
    }

    toast({
      title: "Email Sent",
      description: `Email sent successfully to ${emailTo}`,
    });

    // Reset form
    setEmailTo('');
    setEmailCc('');
    setEmailBcc('');
    setEmailSubject('');
    setEmailContent('');
    setIsComposing(false);
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Email has been saved to drafts.",
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setEmailContent(template.content);
    }
  };

  const selectedEmailDetails = getSelectedEmailDetails();

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Email Communications</h1>
          <p className="text-vip-gold/80 mt-2">Manage VIP client communications and correspondence</p>
        </div>
        <Button onClick={() => setIsComposing(true)} className="bg-vip-gold text-white hover:bg-vip-gold-dark">
          <Plus className="h-4 w-4 mr-2" />
          Compose New Email
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Email Folders Sidebar */}
        <div className="lg:col-span-1">
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-vip-black">Folders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={activeFolder === 'inbox' ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  activeFolder === 'inbox' 
                    ? 'bg-vip-gold text-white' 
                    : 'text-vip-gold hover:bg-vip-gold/10'
                }`}
                onClick={() => {setActiveFolder('inbox'); setSelectedEmail(null);}}
              >
                <Inbox className="h-4 w-4 mr-2" />
                Inbox ({inboxEmails.filter(e => !e.isRead).length})
              </Button>
              <Button
                variant={activeFolder === 'sent' ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  activeFolder === 'sent' 
                    ? 'bg-vip-gold text-white' 
                    : 'text-vip-gold hover:bg-vip-gold/10'
                }`}
                onClick={() => {setActiveFolder('sent'); setSelectedEmail(null);}}
              >
                <Send className="h-4 w-4 mr-2" />
                Sent ({sentEmails.length})
              </Button>
              <Button
                variant={activeFolder === 'drafts' ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  activeFolder === 'drafts' 
                    ? 'bg-vip-gold text-white' 
                    : 'text-vip-gold hover:bg-vip-gold/10'
                }`}
                onClick={() => {setActiveFolder('drafts'); setSelectedEmail(null);}}
              >
                <FileText className="h-4 w-4 mr-2" />
                Drafts ({draftEmails.length})
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Email List */}
        <div className="lg:col-span-1">
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-vip-black capitalize">{activeFolder}</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
                  <Input
                    placeholder="Search emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48 border-vip-gold/30 focus:border-vip-gold"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    className={`p-3 border-b border-vip-gold/10 cursor-pointer transition-colors ${
                      selectedEmail === email.id 
                        ? 'bg-vip-gold/10' 
                        : 'hover:bg-vip-gold/5'
                    } ${!email.isRead ? 'bg-blue-50/50' : ''}`}
                    onClick={() => setSelectedEmail(email.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className={`text-sm truncate ${
                            !email.isRead ? 'font-bold text-vip-black' : 'font-medium text-vip-black'
                          }`}>
                            {email.sender}
                          </h4>
                          {!email.isRead && <Badge className="bg-blue-500 text-white text-xs">New</Badge>}
                        </div>
                        <p className={`text-sm truncate mt-1 ${
                          !email.isRead ? 'font-semibold text-vip-black' : 'text-vip-gold/80'
                        }`}>
                          {email.subject}
                        </p>
                        <p className="text-xs text-vip-gold/60 truncate mt-1">
                          {email.preview}
                        </p>
                      </div>
                      <span className="text-xs text-vip-gold/60 ml-2">
                        {email.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Content / Compose */}
        <div className="lg:col-span-2">
          {isComposing ? (
            /* Compose Email */
            <Card className="vip-glass border-vip-gold/20">
              <CardHeader>
                <CardTitle className="text-vip-black">Compose New Email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label className="text-vip-black">To *</Label>
                    <Input
                      placeholder="Enter recipient email..."
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      className="border-vip-gold/30 focus:border-vip-gold"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-vip-black">CC</Label>
                      <Input
                        placeholder="CC recipients..."
                        value={emailCc}
                        onChange={(e) => setEmailCc(e.target.value)}
                        className="border-vip-gold/30 focus:border-vip-gold"
                      />
                    </div>
                    <div>
                      <Label className="text-vip-black">BCC</Label>
                      <Input
                        placeholder="BCC recipients..."
                        value={emailBcc}
                        onChange={(e) => setEmailBcc(e.target.value)}
                        className="border-vip-gold/30 focus:border-vip-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-vip-black">Subject *</Label>
                    <Input
                      placeholder="Email subject..."
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="border-vip-gold/30 focus:border-vip-gold"
                    />
                  </div>

                  <div>
                    <Label className="text-vip-black">Template (Optional)</Label>
                    <Select value={emailTemplate} onValueChange={handleTemplateSelect}>
                      <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold">
                        <SelectValue placeholder="Choose email template..." />
                      </SelectTrigger>
                      <SelectContent>
                        {emailTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rich Text Toolbar */}
                  <div className="flex space-x-2 p-2 border border-vip-gold/20 rounded-t-lg">
                    <Button variant="ghost" size="sm" className="text-vip-gold hover:bg-vip-gold/10">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-vip-gold hover:bg-vip-gold/10">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-vip-gold hover:bg-vip-gold/10">
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-vip-gold hover:bg-vip-gold/10">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-vip-gold hover:bg-vip-gold/10">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <textarea
                      placeholder="Compose your email..."
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      className="w-full h-64 p-3 border border-vip-gold/30 rounded-b-lg focus:border-vip-gold focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-vip-gold/20">
                  <Button
                    variant="outline"
                    onClick={() => setIsComposing(false)}
                    className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                  >
                    Cancel
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleSaveDraft}
                      className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button
                      onClick={handleSendEmail}
                      className="bg-vip-gold text-white hover:bg-vip-gold-dark"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : selectedEmailDetails ? (
            /* Email Content View */
            <Card className="vip-glass border-vip-gold/20">
              <CardHeader>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-vip-black">{selectedEmailDetails.subject}</h2>
                  <div className="flex items-center justify-between text-sm text-vip-gold/80">
                    <span>From: {selectedEmailDetails.sender}</span>
                    <span>{selectedEmailDetails.date}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-vip-black leading-relaxed">
                    {selectedEmailDetails.preview}
                  </p>
                  <p className="text-vip-black leading-relaxed mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </p>
                  <p className="text-vip-black leading-relaxed mt-4">
                    Best regards,<br />
                    {selectedEmailDetails.sender}
                  </p>
                </div>
                
                <div className="flex space-x-2 mt-6 pt-4 border-t border-vip-gold/20">
                  <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
                    Reply
                  </Button>
                  <Button variant="outline" className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
                    Forward
                  </Button>
                  <Button variant="outline" className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
                    Archive
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* No Email Selected */
            <Card className="vip-glass border-vip-gold/20">
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Mail className="h-16 w-16 text-vip-gold/40 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-vip-black mb-2">No email selected</h3>
                  <p className="text-vip-gold/60">Choose an email from the list to view its content</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Email;
