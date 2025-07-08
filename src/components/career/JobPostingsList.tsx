import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Briefcase, Users, Calendar, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';
import type { JobPosting } from '@/hooks/useJobs';
import type { Application } from '@/hooks/useApplications';

interface JobPostingsListProps {
  jobs: JobPosting[];
  applications: Application[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (department: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onEditJob: (job: JobPosting) => void;
  onDeleteJob: (jobId: string) => void;
  onViewApplicants: (job: JobPosting) => void;
  deleteJobPending: boolean;
}

export const JobPostingsList = ({
  jobs,
  applications,
  searchTerm,
  setSearchTerm,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  onEditJob,
  onDeleteJob,
  onViewApplicants,
  deleteJobPending
}: JobPostingsListProps) => {
  const getApplicationCount = (jobTitle: string) => {
    return applications.filter(app => 
      app.position?.toLowerCase().includes(jobTitle.toLowerCase())
    ).length;
  };

  const getHiredCount = (jobTitle: string) => {
    return applications.filter(app => 
      app.position?.toLowerCase().includes(jobTitle.toLowerCase()) && 
      app.status === 'approved'
    ).length;
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.department?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || 
                             job.department?.toLowerCase() === departmentFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-ios-green text-white';
      case 'closed': return 'bg-gray-500 text-white';
      case 'draft': return 'bg-ios-orange text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className="vip-glass border-vip-gold/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-vip-black">
          <div className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-vip-gold" />
            Job Postings ({filteredJobs.length})
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-40 border-vip-gold/30 focus:border-vip-gold bg-white text-vip-black">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent className="bg-white border-vip-gold/30 z-50">
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="protocol services">Protocol Services</SelectItem>
                <SelectItem value="event management">Event Management</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="administration">Administration</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 border-vip-gold/30 focus:border-vip-gold bg-white text-vip-black">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-vip-gold/30 z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const applicationCount = getApplicationCount(job.title);
            const hiredCount = getHiredCount(job.title);
            const isFullyStaffed = hiredCount > 0;
            
            return (
              <div key={job.id} className="flex items-center justify-between p-4 border border-vip-gold/20 rounded-lg vip-glass-light hover:bg-vip-gold/5 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-vip-black">{job.title}</h3>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                    {isFullyStaffed && (
                      <Badge className="bg-ios-green text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Filled
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-vip-gold/80">
                    <span>{job.department || 'No Department'}</span>
                    <span>•</span>
                    <span>{job.location || 'Location TBD'}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {applicationCount} applications
                    </span>
                    {hiredCount > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center text-ios-green">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {hiredCount} hired
                        </span>
                      </>
                    )}
                  </div>
                  {job.salary_range && (
                    <div className="mt-1 text-sm text-vip-gold/70">
                      Salary: {job.salary_range}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => onViewApplicants(job)}
                    variant="outline" 
                    size="sm" 
                    className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View ({applicationCount})
                  </Button>
                  <Button 
                    onClick={() => onEditJob(job)}
                    variant="outline" 
                    size="sm" 
                    className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    onClick={() => onDeleteJob(job.id)}
                    variant="outline" 
                    size="sm" 
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    disabled={deleteJobPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
          
          {filteredJobs.length === 0 && (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-vip-gold/40 mx-auto mb-4" />
              <p className="text-vip-gold/60">No job postings found matching your criteria.</p>
              <p className="text-sm text-vip-gold/50 mt-1">Create your first job posting to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};