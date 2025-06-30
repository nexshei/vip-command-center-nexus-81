
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobAdded?: () => void;
}

export const JobOpeningModal = ({ open, onOpenChange, onJobAdded }: JobOpeningModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    status: 'active',
    description: '',
    requirements: '',
    employment_type: 'full-time',
    salary_range: '',
    application_deadline: ''
  });

  const { toast } = useToast();
  const createJobMutation = useCreateJob();

  const resetFormAndClose = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      status: 'active',
      description: '',
      requirements: '',
      employment_type: 'full-time',
      salary_range: '',
      application_deadline: ''
    });
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
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
        salary_range: formData.salary_range || null,
        application_deadline: formData.application_deadline || null,
        status: formData.status
      };

      await createJobMutation.mutateAsync(jobData);

      toast({
        title: "Job Posted Successfully",
        description: `${formData.title} position has been posted and is now accepting applications.`,
      });

      if (onJobAdded) {
        onJobAdded();
      }

      resetFormAndClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job posting. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] vip-glass border-vip-gold/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold">Create New Job Posting</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-vip-black">Job Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g. Senior Protocol Officer"
              required
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium text-vip-black">Department</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-white border-vip-gold/30 z-50">
                  <SelectItem value="Protocol Services">Protocol Services</SelectItem>
                  <SelectItem value="Event Management">Event Management</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Human Resources">Human Resources</SelectItem>
                  <SelectItem value="Communications">Communications</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-vip-black">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g. Nairobi, Kenya"
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employment_type" className="text-sm font-medium text-vip-black">Employment Type</Label>
              <Select value={formData.employment_type} onValueChange={(value) => handleInputChange('employment_type', value)}>
                <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-vip-gold/30 z-50">
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_range" className="text-sm font-medium text-vip-black">Salary Range</Label>
              <Input
                id="salary_range"
                value={formData.salary_range}
                onChange={(e) => handleInputChange('salary_range', e.target.value)}
                placeholder="e.g. KSh 80,000 - 120,000"
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-vip-black">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-vip-gold/30 z-50">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="application_deadline" className="text-sm font-medium text-vip-black">Application Deadline</Label>
              <Input
                id="application_deadline"
                type="date"
                value={formData.application_deadline}
                onChange={(e) => handleInputChange('application_deadline', e.target.value)}
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-vip-black">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the role, responsibilities, and key duties..."
              rows={4}
              required
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-sm font-medium text-vip-black">Requirements *</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              placeholder="List qualifications, experience, skills, and education requirements (one per line)..."
              rows={4}
              required
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
            />
            <p className="text-xs text-vip-gold/60">Enter each requirement on a new line</p>
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
              {createJobMutation.isPending ? 'Creating...' : 'Create Job Posting'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const JobOpeningModalTrigger = ({ onJobAdded }: { onJobAdded?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
          <Plus className="h-4 w-4 mr-2" />
          Create New Job Posting
        </Button>
      </DialogTrigger>
      <JobOpeningModal 
        open={isOpen} 
        onOpenChange={setIsOpen} 
        onJobAdded={onJobAdded} 
      />
    </Dialog>
  );
};
