
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Mail, User } from 'lucide-react';
import { useClients, Client } from '@/hooks/useClients';
import { useEmailOperations } from '@/hooks/useEmailOperations';

interface ClientEmailComposerProps {
  selectedClient?: Client;
  onEmailSent?: () => void;
}

export const ClientEmailComposer: React.FC<ClientEmailComposerProps> = ({ 
  selectedClient, 
  onEmailSent 
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(selectedClient?.id || '');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  
  const { data: clients = [] } = useClients();
  const { sendEmailToClient, isLoading } = useEmailOperations();

  const currentClient = selectedClient || clients.find(c => c.id === selectedClientId);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentClient || !subject.trim() || !body.trim()) {
      return;
    }

    const success = await sendEmailToClient(currentClient, subject, body);
    if (success) {
      setSubject('');
      setBody('');
      if (!selectedClient) {
        setSelectedClientId('');
      }
      onEmailSent?.();
    }
  };

  return (
    <Card className="bg-black border-vip-gold/30">
      <CardHeader>
        <CardTitle className="text-vip-gold flex items-center">
          <Send className="h-5 w-5 mr-2" />
          Send Email to Client
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendEmail} className="space-y-4">
          {!selectedClient && (
            <div>
              <label className="text-sm font-medium text-vip-gold">Select Client</label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger className="border-vip-gold/30 bg-black text-vip-gold">
                  <SelectValue placeholder="Choose a client..." />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{client.full_name}</span>
                        <span className="text-sm text-gray-500">({client.email})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {currentClient && (
            <div className="p-3 bg-vip-gold/10 rounded-md border border-vip-gold/30">
              <div className="flex items-center space-x-2 text-vip-gold">
                <Mail className="h-4 w-4" />
                <span className="font-medium">{currentClient.full_name}</span>
                <span className="text-sm">({currentClient.email})</span>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-vip-gold">Subject</label>
            <Input
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border-vip-gold/30 bg-black text-vip-gold"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-vip-gold">Message</label>
            <Textarea
              placeholder="Compose your message..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="border-vip-gold/30 bg-black text-vip-gold min-h-[120px]"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="bg-vip-gold text-black hover:bg-vip-gold/90"
            disabled={!currentClient || !subject.trim() || !body.trim() || isLoading}
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? 'Sending...' : 'Send Email'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
