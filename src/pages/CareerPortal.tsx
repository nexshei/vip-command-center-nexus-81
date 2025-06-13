
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Briefcase, Users, Calendar, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobOpening {
  id: string;
  title: string;
  department: string;
  status: 'open' | 'closed' | 'on-hold';
  applicants: number;
  datePosted: string;
  location: string;
}

interface Applicant {
  id: string;
  name: string;
  position: string;
  stage: 'new' | 'screening' | 'interviewing' | 'offer-sent' | 'hired' | 'rejected';
  appliedDate: string;
  email: string;
}

const CareerPortal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const jobOpenings: JobOpening[] = [
    {
      id: '1',
      title: 'Senior Protocol Officer',
      department: 'Protocol',
      status: 'open',
      applicants: 12,
      datePosted: '2024-01-15',
      location: 'Nairobi'
    },
    {
      id: '2',
      title: 'VIP Security Specialist',
      department: 'Security',
      status: 'open',
      applicants: 8,
      datePosted: '2024-01-10',
      location: 'Nairobi'
    },
    {
      id: '3',
      title: 'Event Coordinator',
      department: 'Events',
      status: 'on-hold',
      applicants: 15,
      datePosted: '2024-01-05',
      location: 'Nairobi'
    },
    {
      id: '4',
      title: 'Executive Driver',
      department: 'Logistics',
      status: 'open',
      applicants: 6,
      datePosted: '2024-01-20',
      location: 'Nairobi'
    },
  ];

  const applicants: Applicant[] = [
    { id: '1', name: 'Alice Wanjiru', position: 'Senior Protocol Officer', stage: 'new', appliedDate: '2024-01-22', email: 'alice@email.com' },
    { id: '2', name: 'John Mwangi', position: 'Senior Protocol Officer', stage: 'screening', appliedDate: '2024-01-21', email: 'john@email.com' },
    { id: '3', name: 'Grace Achieng', position: 'VIP Security Specialist', stage: 'interviewing', appliedDate: '2024-01-20', email: 'grace@email.com' },
    { id: '4', name: 'Peter Kiprotich', position: 'Senior Protocol Officer', stage: 'offer-sent', appliedDate: '2024-01-18', email: 'peter@email.com' },
    { id: '5', name: 'Mary Nyokabi', position: 'Event Coordinator', stage: 'hired', appliedDate: '2024-01-15', email: 'mary@email.com' },
    { id: '6', name: 'David Omondi', position: 'Executive Driver', stage: 'rejected', appliedDate: '2024-01-12', email: 'david@email.com' },
  ];

  const totalJobs = jobOpenings.length;
  const openJobs = jobOpenings.filter(job => job.status === 'open').length;
  const totalApplicants = applicants.length;
  const newApplicants = applicants.filter(app => app.stage === 'new').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-ios-green text-white';
      case 'closed': return 'bg-gray-500 text-white';
      case 'on-hold': return 'bg-ios-orange text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'new': return 'bg-blue-500 text-white';
      case 'screening': return 'bg-ios-orange text-white';
      case 'interviewing': return 'bg-purple-500 text-white';
      case 'offer-sent': return 'bg-ios-purple text-white';
      case 'hired': return 'bg-ios-green text-white';
      case 'rejected': return 'bg-ios-red text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const kanbanStages = [
    { id: 'new', title: 'New Applicants', color: 'border-blue-500' },
    { id: 'screening', title: 'Screening', color: 'border-ios-orange' },
    { id: 'interviewing', title: 'Interviewing', color: 'border-purple-500' },
    { id: 'offer-sent', title: 'Offer Sent', color: 'border-ios-purple' },
    { id: 'hired', title: 'Hired', color: 'border-ios-green' },
    { id: 'rejected', title: 'Rejecte d', color: 'border-ios-red' },
  ];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || job.department.toLowerCase() === departmentFilter;
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleCreateJob = () => {
    toast({
      title: "Create New Job Opening",
      description: "Opening form to create new job posting...",
    });
  };

  const handleViewApplicants = (jobId: string) => {
    toast({
      title: "View Applicants",
      description: "Loading applicants for this position...",
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Career Portal Management</h1>
          <p className="text-vip-gold/80 mt-2">Manage job openings and track recruitment pipeline</p>
        </div>
        <Button onClick={handleCreateJob} className="bg-vip-gold text-white hover:bg-vip-gold-dark">
          <Plus className="h-4 w-4 mr-2" />
          Create New Job Opening
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Total Job Openings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{totalJobs}</div>
            <p className="text-xs text-vip-gold/60">Active positions</p>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{openJobs}</div>
            <p className="text-xs text-ios-green">Accepting applications</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{totalApplicants}</div>
            <p className="text-xs text-vip-gold/60">All applications</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">New Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{newApplicants}</div>
            <p className="text-xs text-ios-orange">Needs review</p>
          </CardContent>
        </Card>
      </div>

      {/* Job Openings */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-vip-black">
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-vip-gold" />
              Job Openings ({filteredJobs.length})
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 border-vip-gold/30 focus:border-vip-gold"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-40 border-vip-gold/30 focus:border-vip-gold">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="protocol">Protocol</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border border-vip-gold/20 rounded-lg vip-glass-light hover:bg-vip-gold/5 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-vip-black">{job.title}</h3>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status === 'open' ? 'Open' : 
                       job.status === 'closed' ? 'Closed' : 'On Hold'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-vip-gold/80">
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Posted {new Date(job.datePosted).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {job.applicants} applicants
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleViewApplicants(job.id)}
                    variant="outline" 
                    size="sm" 
                    className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                  >
                    View Applicants
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Applicant Tracking Kanban Board */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-vip-black">
            <Users className="h-5 w-5 mr-2 text-vip-gold" />
            Applicant Tracking Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4">
            {kanbanStages.map((stage) => {
              const stageApplicants = applicants.filter(app => app.stage === stage.id);
              return (
                <div key={stage.id} className={`border-t-4 ${stage.color} bg-white rounded-lg p-4 min-h-[300px]`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm text-vip-black">{stage.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {stageApplicants.length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {stageApplicants.map((applicant) => (
                      <div key={applicant.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer">
                        <h4 className="font-medium text-sm text-vip-black">{applicant.name}</h4>
                        <p className="text-xs text-vip-gold/80 mt-1">{applicant.position}</p>
                        <p className="text-xs text-vip-gold/60 mt-1">Applied {new Date(applicant.appliedDate).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerPortal;
