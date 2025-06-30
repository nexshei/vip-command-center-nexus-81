
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@/hooks/useClients';

interface EmailData {
  to_email: string;
  subject: string;
  body: string;
  client_id?: string;
  client_name?: string;
}

interface EmailRecord {
  id: string;
  from_email: string;
  to_email: string;
  subject: string;
  body: string;
  status: string;
  sent_at: string;
  client_id?: string;
  client_name?: string;
}

export const useEmailOperations = () => {
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendEmail = async (emailData: EmailData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate the email sending
      const newEmail: EmailRecord = {
        id: Date.now().toString(),
        from_email: 'admin@sirole-vvip.com',
        to_email: emailData.to_email,
        subject: emailData.subject,
        body: emailData.body,
        status: 'sent',
        sent_at: new Date().toISOString(),
        client_id: emailData.client_id,
        client_name: emailData.client_name
      };

      setEmails(prev => [newEmail, ...prev]);
      
      toast({
        title: "Email Sent",
        description: `Email sent successfully to ${emailData.to_email}`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailToClient = async (client: Client, subject: string, body: string): Promise<boolean> => {
    return sendEmail({
      to_email: client.email,
      subject,
      body,
      client_id: client.id,
      client_name: client.full_name
    });
  };

  return {
    emails,
    isLoading,
    sendEmail,
    sendEmailToClient,
    setEmails
  };
};
