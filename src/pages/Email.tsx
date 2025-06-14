
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Inbox,
  SendHorizontal,
  FileText,
  Trash2,
  Edit,
  Archive,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockEmails = [
  { id: 1, sender: 'Hon. Peter Maina', subject: 'Regarding our upcoming meeting', time: '10:45 AM', read: false },
  { id: 2, sender: 'Dr. Sarah Wanjiku', subject: 'Follow-up on consultation', time: 'Yesterday', read: true },
  { id: 3, sender: 'Nairobi Hospital Admin', subject: 'Invoice #1024', time: '2 days ago', read: true },
];

const Email = () => {
  const { toast } = useToast();

  const handleSendEmail = () => {
    toast({
      title: "Email Sent",
      description: "Your email has been sent successfully.",
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Email Communications</h1>
          <p className="text-vip-gold/80 mt-2">Manage all your outgoing and incoming correspondence</p>
        </div>
        <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
          <Edit className="h-4 w-4 mr-2" />
          Compose New Email
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Folders & List */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-vip-black">Folders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-vip-black">
                  <Inbox className="h-4 w-4 mr-2 text-vip-gold" /> Inbox <Badge className="ml-auto bg-vip-gold text-white">3</Badge>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-vip-gold/80">
                  <SendHorizontal className="h-4 w-4 mr-2" /> Sent
                </Button>
                <Button variant="ghost" className="w-full justify-start text-vip-gold/80">
                  <FileText className="h-4 w-4 mr-2" /> Drafts
                </Button>
                <Button variant="ghost" className="w-full justify-start text-vip-gold/80">
                  <Archive className="h-4 w-4 mr-2" /> Archived
                </Button>
                <Button variant="ghost" className="w-full justify-start text-vip-gold/80">
                  <Trash2 className="h-4 w-4 mr-2" /> Trash
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-vip-black">Inbox</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockEmails.map((email) => (
                  <div key={email.id} className={`p-3 rounded-lg cursor-pointer ${!email.read ? 'bg-vip-gold/10' : 'hover:bg-vip-gold/5'}`}>
                    <div className="flex justify-between items-start">
                      <p className={`font-semibold ${!email.read ? 'text-vip-black' : 'text-vip-black/80'}`}>{email.sender}</p>
                      <p className="text-xs text-vip-gold/80">{email.time}</p>
                    </div>
                    <p className={`text-sm truncate ${!email.read ? 'text-vip-gold' : 'text-vip-gold/80'}`}>{email.subject}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Composer */}
        <Card className="vip-glass border-vip-gold/20 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-vip-black">Compose New Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="to" className="text-vip-black">To</Label>
              <Input id="to" placeholder="recipient@example.com" className="border-vip-gold/30 focus:border-vip-gold" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject" className="text-vip-black">Subject</Label>
              <Input id="subject" placeholder="Email Subject" className="border-vip-gold/30 focus:border-vip-gold" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="body" className="text-vip-black">Message</Label>
              <Textarea id="body" placeholder="Compose your message..." rows={12} className="border-vip-gold/30 focus:border-vip-gold" />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-vip-gold/20 mt-4">
              <Button variant="outline" className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={handleSendEmail} className="bg-vip-gold text-white hover:bg-vip-gold-dark">
                <SendHorizontal className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Email;
