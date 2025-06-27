
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Eye, Edit, Trash2, Briefcase, MapPin, Calendar, Users, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { JobOpeningModalTrigger } from '@/components/modals/JobOpeningModal';
import { EditJobModal } from '@/components/modals/EditJobModal';
import { useJobs, useDeleteJob, useUpdateJob, type JobPosting } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const { toast } = useToast();

  const { data: jobs = [], isLoading: jobsLoading, error: jobsError } = useJobs();
  const { data: applications = [], isLoading: applicationsLoading } = useApplications();
  const deleteJobMutation = useDeleteJob();
  const updateJobMutation = useUpdateJob();

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = Array.from(new Set(jobs.map(job => job.department).filter(Boolean)));
  const statuses = Array.from(new Set(jobs.map(job => job.status).filter(Boolean)));
  const activeJobs = jobs.filter(job => job.status === 'active').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditJob = (job: JobPosting) => {
    setEditingJob(job);
  };

  const handleJobUpdated = (updatedJob: JobPosting) => {
    setEditingJob(null);
  };

  const handleDeleteJob = async (job: JobPosting) => {
    try {
      await deleteJobMutation.mutateAsync(job.id);
      toast({
        title: "Job Deleted",
        description: `${job.title} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job posting.",
        variant: "destructive"
      });
    }
  };

  const handleViewApplications = (job: JobPosting) => {
    const jobApplications = applications.filter(app => app.position === job.title);
    toast({
      title: "Applications",
      description: `${jobApplications.length} applications found for ${job.title}.`,
    });
  };

  const handleDownloadCV = (application: any) => {
    if (application.cv_url) {
      window.open(application.cv_url, '_blank');
    } else {
      toast({
        title: "No CV Available",
        description: `No CV uploaded for ${application.full_name}.`,
      });
    }
  };

  if (jobsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-vip-gold">Loading career data...</div>
      </div>
    );
  }

  if (jobsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error loading career data. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Career Portal Management</h1>
          <p className="text-vip-gold/80 mt-2">Manage job postings and track applications</p>
        </div>
        <JobOpeningModalTrigger />
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{jobs.length}</div>
            <p className="text-xs text-vip-gold/60">Job postings</p>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{activeJobs}</div>
            <p className="text-xs text-green-600">Currently hiring</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{applications.length}</div>
            <p className="text-xs text-blue-600">Total received</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{departments.length}</div>
            <p className="text-xs text-purple-600">Hiring departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="vip-glass border-vip-gold/20">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-vip-gold/50" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-vip-gold/30"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48 border-vip-gold/30">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48 border-vip-gold/30">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-vip-black">
            <Briefcase className="h-5 w-5 mr-2 text-vip-gold" />
            Job Postings ({filteredJobs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredJobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-vip-gold/60">No jobs found. Create your first job posting to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="p-4 border border-vip-gold/20 rounded-lg vip-glass-light hover:bg-vip-gold/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-vip-black">{job.title}</h3>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-vip-gold/80">
                        {job.department && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {job.department}
                          </div>
                        )}
                        {job.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </div>
                        )}
                        {job.application_deadline && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                          </div>
                        )}
                        {job.salary_range && (
                          <p>Salary: {job.salary_range}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewApplications(job)}
                        variant="outline"
                        size="sm"
                        className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                      >
                        <Users className="h-4 w-4 mr-1" />
                        {applications.filter(app => app.position === job.title).length}
                      </Button>
                      <Button
                        onClick={() => handleEditJob(job)}
                        variant="outline"
                        size="sm"
                        className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteJob(job)}
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        disabled={deleteJobMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-vip-black">
            <Users className="h-5 w-5 mr-2 text-vip-gold" />
            Recent Applications ({applications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applicationsLoading ? (
            <div className="text-center py-8">
              <p className="text-vip-gold/60">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-vip-gold/60">No applications received yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((application) => (
                <div key={application.id} className="p-3 border border-vip-gold/20 rounded-lg vip-glass-light">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-vip-black">{application.full_name}</h4>
                      <p className="text-sm text-vip-gold/80">Applied for: {application.position || 'Unknown Position'}</p>
                      <p className="text-xs text-vip-gold/60">
                        {new Date(application.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getApplicationStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                      <Button
                        onClick={() => handleDownloadCV(application)}
                        variant="outline"
                        size="sm"
                        className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        CV
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Job Modal */}
      <EditJobModal
        open={!!editingJob}
        onOpenChange={(open) => !open && setEditingJob(null)}
        job={editingJob}
        onJobUpdated={handleJobUpdated}
      />
    </div>
  );
};

export default Careers;
