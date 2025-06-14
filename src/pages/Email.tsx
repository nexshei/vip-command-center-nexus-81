
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, SendHorizontal, Inbox, Archive, Users, Search } from 'lucide-react';

const Email = () => {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Email Communications</h1>
          <p className="text-vip-gold/80 mt-2">Manage VIP client communications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80 flex items-center">
              <Inbox className="h-4 w-4 mr-2" />
              Inbox
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">24</div>
            <p className="text-xs text-vip-gold/60">New messages</p>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80 flex items-center">
              <SendHorizontal className="h-4 w-4 mr-2" />
              Sent Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">12</div>
            <p className="text-xs text-vip-gold/60">Messages sent</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80 flex items-center">
              <Archive className="h-4 w-4 mr-2" />
              Archived
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">156</div>
            <p className="text-xs text-vip-gold/60">Total archived</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              VIP Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">89</div>
            <p className="text-xs text-vip-gold/60">Active contacts</p>
          </CardContent>
        </Card>
      </div>

      {/* Email Composition */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-vip-black flex items-center">
                <Mail className="h-5 w-5 mr-2 text-vip-gold" />
                Compose Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-vip-black">To</label>
                <Input
                  placeholder="Enter VIP client email..."
                  className="mt-1 border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-vip-black">Subject</label>
                <Input
                  placeholder="Enter message subject..."
                  className="mt-1 border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-vip-black">Message</label>
                <Textarea
                  placeholder="Type your message here..."
                  rows={8}
                  className="mt-1 border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
                  Save Draft
                </Button>
                <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
                  <SendHorizontal className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="text-vip-black">Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { from: 'Hon. Mary Wanjiku', subject: 'Protocol Meeting', time: '2 hours ago' },
                  { from: 'Dr. James Kiprotich', subject: 'Event Coordination', time: '5 hours ago' },
                  { from: 'Ms. Grace Njeri', subject: 'VIP Service Request', time: '1 day ago' },
                ].map((message, index) => (
                  <div key={index} className="p-3 border border-vip-gold/20 rounded-lg vip-glass-light">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-sm text-vip-black">{message.from}</h4>
                        <p className="text-xs text-vip-gold/80">{message.subject}</p>
                      </div>
                      <span className="text-xs text-vip-gold/60">{message.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
                  View All Messages
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Email;
