
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateJob } from '@/hooks/useJobs';

interface JobOpeningModalProps {
  onJobAdded: () => void;
}

interface FormData {
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string;
  employment_type: string;
  application_deadline: string;
  status: string;
}

export const JobOpeningModalTrigger = ({ onJobAdded }: JobOpeningModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    department: '',
    location: '',
    description: '',
    requirements: '',
    employment_type: 'full-time',
    application_deadline: '',
    status: 'active'
  });
  
  const { toast } = useToast();
  const createJobMutation = useCreateJob();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requirementsArray = formData.requirements 
      ? formData.requirements.split('\n').filter(req => req.trim()) 
      : [];

    const jobData = {
      title: formData.title,
      department: formData.department || null,
      location: formData.location || null,
      description: formData.description || null,
      requirements: requirementsArray.length > 0 ? requirementsArray : null,
      employment_type: formData.employment_type || null,
      application_deadline: formData.application_deadline || null,
      status: formData.status
    };

    try {
      await createJobMutation.mutateAsync(jobData);
      onJobAdded();
      
      toast({
        title: "Job Posted Successfully",
        description: `${formData.title} has been posted and is now accepting applications.`,
      });

      // Reset form and close modal
      setFormData({
        title: '',
        department: '',
        location: '',
        description: '',
        requirements: '',
        employment_type: 'full-time',
        application_deadline: '',
        status: 'active'
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetFormAndClose = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      description: '',
      requirements: '',
      employment_type: 'full-time',
      application_deadline: '',
      status: 'active'
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
          <Plus className="w-4 h-4 mr-2" />
          Create New Job Posting
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold">Create New Job Posting</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-vip-black">Job Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
              placeholder="e.g. Senior Event Coordinator"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium text-vip-black">Department</Label>
              <Select 
                value={formData.department} 
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
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
                placeholder="e.g. Nairobi, Kenya"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employment_type" className="text-sm font-medium text-vip-black">Employment Type</Label>
              <Select 
                value={formData.employment_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, employment_type: value }))}
              >
                <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-vip-black">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="application_deadline" className="text-sm font-medium text-vip-black">Application Deadline</Label>
            <Input
              id="application_deadline"
              type="date"
              value={formData.application_deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, application_deadline: e.target.value }))}
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-vip-black">Job Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-sm font-medium text-vip-black">Requirements</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              placeholder="Enter each requirement on a new line"
              rows={4}
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
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
              disabled={createJobMutation.isPending}
            >
              {createJobMutation.isPending ? 'Posting...' : 'Post Job'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
