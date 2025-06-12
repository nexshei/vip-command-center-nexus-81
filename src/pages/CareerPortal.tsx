
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Clock, Users, Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const CareerPortal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const { toast } = useToast();

  const jobs = [
    {
      id: 1,
      title: 'VIP Protocol Specialist',
      department: 'Protocol Services',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      experience: '3-5 years',
      applications: 12,
      status: 'Active',
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Event Coordination Manager',
      department: 'Event Management',
      location: 'Mombasa, Kenya',
      type: 'Full-time',
      experience: '2-4 years',
      applications: 8,
      status: 'Active',
      posted: '1 week ago'
    },
    {
      id: 3,
      title: 'Client Relations Executive',
      department: 'Client Services',
      location: 'Kisumu, Kenya',
      type: 'Contract',
      experience: '1-3 years',
      applications: 15,
      status: 'Closed',
      posted: '2 weeks ago'
    }
  ];

  const departments = [
    { name: 'Protocol Services', positions: 3, openings: 2 },
    { name: 'Event Management', positions: 5, openings: 1 },
    { name: 'Client Services', positions: 4, openings: 3 },
    { name: 'Security', positions: 6, openings: 2 },
    { name: 'Administration', positions: 2, openings: 0 }
  ];

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Job Posted",
      description: `${jobTitle} position has been posted successfully.`,
    });
    // Reset form
    setJobTitle('');
    setDepartment('');
    setLocation('');
    setDescription('');
    setRequirements('');
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Career Portal</h1>
          <p className="text-gray-600 mt-2">Manage job postings and recruitment</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-vip-gold text-vip-black hover:bg-vip-gold-dark">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white border border-neutral-medium">
            <DialogHeader className="pb-4 border-b border-neutral-medium">
              <DialogTitle className="text-2xl font-serif font-bold text-vip-black">Create Job Posting</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateJob} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-vip-black font-medium">Job Title</Label>
                  <Input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Enter job title"
                    className="bg-neutral-light border-neutral-medium text-vip-black"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-vip-black font-medium">Department</Label>
                  <Select value={department} onValueChange={setDepartment} required>
                    <SelectTrigger className="bg-neutral-light border-neutral-medium text-vip-black">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-neutral-medium">
                      <SelectItem value="protocol" className="text-vip-black">Protocol Services</SelectItem>
                      <SelectItem value="events" className="text-vip-black">Event Management</SelectItem>
                      <SelectItem value="clients" className="text-vip-black">Client Services</SelectItem>
                      <SelectItem value="security" className="text-vip-black">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-vip-black font-medium">Location</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  className="bg-neutral-light border-neutral-medium text-vip-black"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-vip-black font-medium">Job Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter job description..."
                  className="bg-neutral-light border-neutral-medium text-vip-black"
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-vip-black font-medium">Requirements</Label>
                <Textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Enter job requirements..."
                  className="bg-neutral-light border-neutral-medium text-vip-black"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" className="border-neutral-medium text-vip-black">
                  Cancel
                </Button>
                <Button type="submit" className="bg-vip-gold text-vip-black hover:bg-vip-gold-dark">
                  Post Job
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white border border-neutral-medium shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">20</div>
            <p className="text-xs text-gray-500">Across all departments</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-neutral-medium shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">8</div>
            <p className="text-xs text-ios-green">Currently hiring</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-neutral-medium shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">35</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-neutral-medium shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">5</div>
            <p className="text-xs text-gray-500">Active hiring</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Job Listings */}
        <div className="lg:col-span-2">
          <Card className="bg-white border border-neutral-medium shadow-lg">
            <CardHeader className="border-b border-neutral-medium">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-vip-black">
                  <Briefcase className="h-5 w-5 mr-2 text-vip-gold" />
                  Job Listings
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64 bg-neutral-light border-neutral-medium text-vip-black"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="p-6 border-b border-neutral-medium last:border-b-0 hover:bg-neutral-light transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-vip-black text-lg">{job.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {job.department}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.experience}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={job.status === 'Active' ? 'default' : 'secondary'} 
                                 className={job.status === 'Active' ? 'bg-ios-green text-white' : 'bg-gray-400 text-white'}>
                            {job.status}
                          </Badge>
                          <Badge variant="outline" className="border-vip-gold text-vip-gold">
                            {job.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Users className="h-4 w-4 mr-1" />
                          {job.applications} applications
                        </div>
                        <p className="text-xs text-gray-500">{job.posted}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Departments */}
        <Card className="bg-white border border-neutral-medium shadow-lg">
          <CardHeader className="border-b border-neutral-medium">
            <CardTitle className="text-vip-black">Departments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {departments.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-neutral-light">
                <div>
                  <h4 className="font-medium text-vip-black">{dept.name}</h4>
                  <p className="text-sm text-gray-600">{dept.positions} total positions</p>
                </div>
                <Badge className={dept.openings > 0 ? 'bg-ios-green text-white' : 'bg-gray-400 text-white'}>
                  {dept.openings} open
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CareerPortal;
