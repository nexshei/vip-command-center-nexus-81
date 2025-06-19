
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { X, Plus, Briefcase } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  salary_range: string;
  status: string;
  description: string;
  requirements: string[];
  application_deadline: string;
  created_at: string;
  updated_at: string;
}

interface JobOpeningModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  job?: Job | null;
  onJobAdded?: () => void;
  onJobUpdated?: () => void;
}

const JobOpeningModal: React.FC<JobOpeningModalProps> = ({ 
  open, 
  onClose, 
  job, 
  onJobAdded,
  onJobUpdated 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [requirements, setRequirements] = useState<string[]>(['']);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    employment_type: 'full-time',
    salary_range: '',
    status: 'active',
    description: '',
    application_deadline: ''
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        department: job.department || '',
        location: job.location || '',
        employment_type: job.employment_type || 'full-time',
        salary_range: job.salary_range || '',
        status: job.status || 'active',
        description: job.description || '',
        application_deadline: job.application_deadline || ''
      });
      setRequirements(job.requirements && job.requirements.length > 0 ? job.requirements : ['']);
    } else {
      setFormData({
        title: '',
        department: '',
        location: '',
        employment_type: 'full-time',
        salary_range: '',
        status: 'active',
        description: '',
        application_deadline: ''
      });
      setRequirements(['']);
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const jobData = {
        ...formData,
        requirements: requirements.filter(req => req.trim() !== '')
      };

      if (job) {
        const { error } = await supabase
          .from('careers')
          .update(jobData)
          .eq('id', job.id);

        if (error) throw error;

        toast({
          title: "Job Updated",
          description: "The job opening has been successfully updated."
        });

        onJobUpdated?.();
      } else {
        const { error } = await supabase
          .from('careers')
          .insert([jobData]);

        if (error) throw error;

        toast({
          title: "Job Created",
          description: "The job opening has been successfully created."
        });

        onJobAdded?.();
      }
    } catch (error: any) {
      toast({
        title: job ? "Update Failed" : "Creation Failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-vip-black">
            {job ? 'Edit Job Opening' : 'Create Job Opening'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-vip-black">Job Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="border-vip-gold/30 focus:border-vip-gold"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium text-vip-black">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="border-vip-gold/30 focus:border-vip-gold"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-vip-black">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="border-vip-gold/30 focus:border-vip-gold"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employment_type" className="text-sm font-medium text-vip-black">Employment Type</Label>
              <Select
                value={formData.employment_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, employment_type: value }))}
              >
                <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold">
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
              <Label htmlFor="salary_range" className="text-sm font-medium text-vip-black">Salary Range</Label>
              <Input
                id="salary_range"
                value={formData.salary_range}
                onChange={(e) => setFormData(prev => ({ ...prev, salary_range: e.target.value }))}
                className="border-vip-gold/30 focus:border-vip-gold"
                placeholder="e.g. $50,000 - $70,000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-vip-black">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
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
              className="border-vip-gold/30 focus:border-vip-gold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-vip-black">Job Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="border-vip-gold/30 focus:border-vip-gold min-h-[100px]"
              placeholder="Describe the role, responsibilities, and requirements..."
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-vip-black">Requirements</Label>
              <Button
                type="button"
                onClick={addRequirement}
                size="sm"
                variant="outline"
                className="text-vip-gold border-vip-gold/30 hover:bg-vip-gold hover:text-white"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={req}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    className="border-vip-gold/30 focus:border-vip-gold"
                    placeholder="Enter a requirement..."
                  />
                  {requirements.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-vip-gold/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
              className="text-vip-black border-vip-gold/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-vip-gold text-white hover:bg-vip-gold-dark"
            >
              {isLoading ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Create a trigger component for the CareerPortal
export const JobOpeningModalTrigger: React.FC<{ onJobAdded: (job: any) => void }> = ({ onJobAdded }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-vip-gold text-white hover:bg-vip-gold-dark flex items-center gap-2"
      >
        <Briefcase className="h-4 w-4" />
        Create Job Opening
      </Button>
      
      <JobOpeningModal
        open={isOpen}
        onClose={setIsOpen}
        onJobAdded={() => {
          setIsOpen(false);
          onJobAdded({});
        }}
      />
    </>
  );
};

export default JobOpeningModal;
