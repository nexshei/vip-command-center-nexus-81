
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Plus, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users,
  Eye,
  Edit,
  Download
} from 'lucide-react';

const Careers = () => {
  const [showJobForm, setShowJobForm] = useState(false);

  const jobListings = [
    {
      id: 1,
      title: "VIP Protocol Specialist",
      department: "Protocol Services",
      location: "Nairobi, Kenya",
      type: "Full-time",
      salary: "KSH 150,000 - 200,000",
      applicants: 12,
      status: "Active",
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Senior Client Relations Manager",
      department: "Client Services",
      location: "Mombasa, Kenya",
      type: "Full-time",
      salary: "KSH 120,000 - 180,000",
      applicants: 8,
      status: "Active",
      posted: "1 week ago"
    },
    {
      id: 3,
      title: "Executive Assistant",
      department: "Administration",
      location: "Nairobi, Kenya",
      type: "Part-time",
      salary: "KSH 80,000 - 120,000",
      applicants: 24,
      status: "Draft",
      posted: "3 days ago"
    }
  ];

  const handleExportApplications = () => {
    const data = jobListings.map(job => ({
      position: job.title,
      applicants: job.applicants,
      status: job.status,
      department: job.department
    }));
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `career-applications-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Career Portal</h1>
          <p className="text-vip-gold/80 mt-2">Manage job postings and applications for VIP protocol positions</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={handleExportApplications}
            variant="outline" 
            className="border-vip-gold/30 text-vip-black hover:bg-vip-gold/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Applications
          </Button>
          <Button 
            onClick={() => setShowJobForm(!showJobForm)}
            className="bg-vip-gold text-white hover:bg-vip-gold-dark"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white border border-vip-gold/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Active Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">12</div>
            <p className="text-xs text-vip-gold/60">+3 this month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-vip-gold/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">89</div>
            <p className="text-xs text-ios-green">+15 this week</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-vip-gold/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Interviews Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">7</div>
            <p className="text-xs text-vip-gold/60">This week</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-vip-gold/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Positions Filled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">5</div>
            <p className="text-xs text-ios-green">This quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Job Posting Form */}
      {showJobForm && (
        <Card className="bg-white border border-vip-gold/20 shadow-sm">
          <CardHeader className="border-b border-vip-gold/10">
            <CardTitle className="text-vip-black">Create New Job Posting</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-3">
                <Label htmlFor="job-title" className="text-sm font-medium text-vip-black">Job Title</Label>
                <Input 
                  id="job-title" 
                  placeholder="e.g., VIP Protocol Specialist"
                  className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="department" className="text-sm font-medium text-vip-black">Department</Label>
                <Select>
                  <SelectTrigger className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-vip-gold/20">
                    <SelectItem value="protocol" className="text-vip-black hover:bg-vip-gold/10">Protocol Services</SelectItem>
                    <SelectItem value="client" className="text-vip-black hover:bg-vip-gold/10">Client Services</SelectItem>
                    <SelectItem value="admin" className="text-vip-black hover:bg-vip-gold/10">Administration</SelectItem>
                    <SelectItem value="security" className="text-vip-black hover:bg-vip-gold/10">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="location" className="text-sm font-medium text-vip-black">Location</Label>
                <Input 
                  id="location" 
                  placeholder="e.g., Nairobi, Kenya"
                  className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="salary" className="text-sm font-medium text-vip-black">Salary Range</Label>
                <Input 
                  id="salary" 
                  placeholder="e.g., KSH 150,000 - 200,000"
                  className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
                />
              </div>
              <div className="col-span-2 grid gap-3">
                <Label htmlFor="description" className="text-sm font-medium text-vip-black">Job Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Detailed job description and requirements..."
                  rows={4}
                  className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowJobForm(false)}
                className="border-vip-gold/30 text-vip-black hover:bg-vip-gold/10"
              >
                Cancel
              </Button>
              <Button className="bg-vip-gold text-white hover:bg-vip-gold-dark">
                Post Job
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Listings */}
      <Card className="bg-white border border-vip-gold/20 shadow-sm">
        <CardHeader className="border-b border-vip-gold/10">
          <CardTitle className="flex items-center text-vip-black">
            <Briefcase className="h-5 w-5 mr-2 text-vip-gold" />
            Current Job Listings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-vip-gold/10">
            {jobListings.map((job) => (
              <div key={job.id} className="p-6 hover:bg-vip-gold/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-vip-black">{job.title}</h3>
                      <Badge 
                        variant={job.status === 'Active' ? 'default' : 'secondary'}
                        className={job.status === 'Active' ? 'bg-ios-green text-white' : 'bg-vip-gold/20 text-vip-black'}
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-vip-gold/70">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.type}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {job.applicants} applicants
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-vip-gold/30 text-vip-black hover:bg-vip-gold/10">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-vip-gold/30 text-vip-black hover:bg-vip-gold/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Careers;
