
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Application } from '@/hooks/useApplications';

interface EditApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application | null;
  onApplicationUpdated: () => void;
}

interface FormData {
  status?: string;
  interview_date?: string;
  admin_notes?: string;
}

export const EditApplicationModal = ({ open, onOpenChange, application, onApplicationUpdated }: EditApplicationModalProps) => {
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (application) {
      setFormData({
        status: application.status,
        interview_date: application.interview_date ? new Date(application.interview_date).toISOString().split('T')[0] : '',
        admin_notes: application.admin_notes || ''
      });
    }
  }, [application]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;

    setIsLoading(true);

    try {
      const updateData = {
        status: formData.status || application.status,
        interview_date: formData.interview_date ? `${formData.interview_date}T00:00:00Z` : null,
        admin_notes: formData.admin_notes || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('career_applications')
        .update(updateData)
        .eq('id', application.id);

      if (error) throw error;

      onApplicationUpdated();
      
      toast({
        title: "Application Updated",
        description: `${application.full_name}'s application has been updated successfully.`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetFormAndClose = () => {
    setFormData({});
    onOpenChange(false);
  };

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold">
            Edit Application - {application.full_name}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-vip-black">Applicant Information</Label>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <p className="text-sm"><strong>Name:</strong> {application.full_name}</p>
              <p className="text-sm"><strong>Email:</strong> {application.email}</p>
              <p className="text-sm"><strong>Position:</strong> {application.position || 'Not specified'}</p>
              <p className="text-sm"><strong>Applied:</strong> {new Date(application.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-vip-black">Application Status</Label>
            <Select 
              value={formData.status || ''} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interview_date" className="text-sm font-medium text-vip-black">Interview Date</Label>
            <Input
              id="interview_date"
              type="date"
              value={formData.interview_date || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, interview_date: e.target.value }))}
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin_notes" className="text-sm font-medium text-vip-black">Admin Notes</Label>
            <Textarea
              id="admin_notes"
              value={formData.admin_notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, admin_notes: e.target.value }))}
              rows={4}
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
              placeholder="Add notes about this application..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-vip-gold/20">
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetFormAndClose} 
              className="px-6 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
