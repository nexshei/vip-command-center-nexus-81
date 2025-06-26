
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  description: string | null;
  requirements: string[] | null;
  employment_type: string | null;
  salary_range: string | null;
  application_deadline: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

interface EditJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  onJobUpdated: (job: Job) => void;
}

export const EditJobModal = ({ open, onOpenChange, job, onJobUpdated }: EditJobModalProps) => {
  const [formData, setFormData] = useState<Partial<Job>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (job) {
      setFormData({
        ...job,
        requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements || ''
      });
    }
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    const updatedJob: Job = {
      ...job,
      ...formData,
      requirements: typeof formData.requirements === 'string' 
        ? formData.requirements.split('\n').filter(req => req.trim()) 
        : formData.requirements || null,
      updated_at: new Date().toISOString()
    };

    onJobUpdated(updatedJob);
    
    toast({
      title: "Job Updated",
      description: `${updatedJob.title} has been updated successfully.`,
    });

    onOpenChange(false);
  };

  const resetFormAndClose = () => {
    setFormData({});
    onOpenChange(false);
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold">Edit Job Posting</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-vip-black">Job Title *</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium text-vip-black">Department</Label>
              <Select 
                value={formData.department || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
              >
                <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Protocol Services">Protocol Services</SelectItem>
                  <SelectItem value="Event Management">Event Management</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-vip-black">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-vip-black">Status</Label>
              <Select 
                value={formData.status || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_range" className="text-sm font-medium text-vip-black">Salary Range</Label>
              <Input
                id="salary_range"
                value={formData.salary_range || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, salary_range: e.target.value }))}
                placeholder="e.g. $50,000 - $70,000"
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-vip-black">Job Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-sm font-medium text-vip-black">Requirements</Label>
            <Textarea
              id="requirements"
              value={typeof formData.requirements === 'string' ? formData.requirements : (formData.requirements || []).join('\n')}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              placeholder="Enter each requirement on a new line"
              rows={4}
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-vip-gold/20">
            <Button type="button" variant="outline" onClick={resetFormAndClose} className="px-6 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
              Cancel
            </Button>
            <Button type="submit" className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark">
              Update Job
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
