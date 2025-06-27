
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, Reply } from 'lucide-react';

interface ViewMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: any;
}

export const ViewMessageModal = ({ open, onOpenChange, message }: ViewMessageModalProps) => {
  if (!message) return null;

  const handleReply = () => {
    const mailtoLink = `mailto:${message.email}?subject=Re: ${message.subject || 'Your Contact Submission'}&body=Dear ${message.full_name},%0D%0A%0D%0AThank you for contacting us.%0D%0A%0D%0ABest regards,%0D%0AVVIP Protocol Team`;
    window.open(mailtoLink, '_blank');
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold flex items-center">
            <Mail className="h-5 w-5 mr-2 text-vip-gold" />
            Contact Message Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-vip-gold/80">Name</label>
                <p className="text-vip-black font-medium">{message.full_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-vip-gold/80">Email</label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-vip-gold/60" />
                  <a 
                    href={`mailto:${message.email}`}
                    className="text-vip-gold hover:underline"
                  >
                    {message.email}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-vip-gold/80">Subject</label>
                <p className="text-vip-black font-medium">{message.subject || "No Subject"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-vip-gold/80">Status</label>
                <Badge className={getStatusColor(message.status)}>
                  {message.status?.toUpperCase() || 'PENDING'}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-vip-gold/80">Date Received</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-vip-gold/60" />
                  <p className="text-vip-black">
                    {new Date(message.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-vip-gold/80">Message</label>
            <div className="bg-white/50 border border-vip-gold/20 rounded-lg p-4">
              <p className="text-vip-black whitespace-pre-wrap leading-relaxed">
                {message.message}
              </p>
            </div>
          </div>

          {/* Admin Notes */}
          {message.admin_notes && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-vip-gold/80">Admin Notes</label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900 whitespace-pre-wrap leading-relaxed">
                  {message.admin_notes}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-vip-gold/20">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="px-6 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
            >
              Close
            </Button>
            <Button 
              onClick={handleReply}
              className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark flex items-center"
            >
              <Reply className="h-4 w-4 mr-2" />
              Reply via Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
