
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobOpeningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobAdded?: (job: any) => void;
}

export const JobOpeningModal = ({ open, onOpenChange, onJobAdded }: JobOpeningModalProps) => {
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const { toast } = useToast();

  const resetFormAndClose = () => {
    setJobTitle('');
    setDepartment('');
    setLocation('');
    setStatus('');
    setDescription('');
    setRequirements('');
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating job opening:', { 
      jobTitle, 
      department, 
      location, 
      status, 
      description, 
      requirements 
    });
    
    const newJob = {
      id: Date.now().toString(),
      title: jobTitle,
      department,
      location,
      status,
      description,
      requirements,
      posted_at: new Date().toISOString(),
      applicants: 0,
      datePosted: new Date().toISOString().split('T')[0],
    };

    if (onJobAdded) {
      onJobAdded(newJob);
    }

    toast({
      title: "Job Opening Created",
      description: `${jobTitle} position has been posted successfully.`,
    });

    resetFormAndClose();
  };

  const handleCancel = () => {
    resetFormAndClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black text-xl font-semibold">Create New Job Opening</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-sm font-medium text-vip-black">Job Title *</Label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Protocol Officer"
              required
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium text-vip-black">Department *</Label>
              <Select value={department} onValueChange={setDepartment} required>
                <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Protocol">Protocol</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Events">Events & Coordination</SelectItem>
                  <SelectItem value="Logistics">Logistics & Transport</SelectItem>
                  <SelectItem value="Communications">Communications</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Finance">Finance & Accounting</SelectItem>
                  <SelectItem value="Human Resources">Human Resources</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-vip-black">Location *</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Nairobi, Kenya"
                required
                className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-vip-black">Status *</Label>
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-vip-black">Job Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="List qualifications, experience, skills, and education requirements..."
              rows={4}
              required
              className="w-full border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-vip-gold/20">
            <Button type="button" variant="outline" onClick={handleCancel} className="px-6 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
              Cancel
            </Button>
            <Button type="submit" className="px-6 bg-vip-gold text-white hover:bg-vip-gold-dark">
              Create Job
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const JobOpeningModalTrigger = ({ onJobAdded }: { onJobAdded?: (job: any) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
          <Plus className="h-4 w-4 mr-2" />
          Create New Job Opening
        </Button>
      </DialogTrigger>
      <JobOpeningModal open={isOpen} onOpenChange={setIsOpen} onJobAdded={onJobAdded} />
    </Dialog>
  );
};
