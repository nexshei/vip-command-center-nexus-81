
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Eye, Edit, Trash2, Briefcase, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { useRealtimeQuery } from '@/hooks/useRealtimeQuery';
import { useToast } from '@/hooks/use-toast';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { ViewDetailsModal } from '@/components/modals/ViewDetailsModal';
import { JobOpeningModal } from '@/components/modals/JobOpeningModal';
import { supabase } from '@/integrations/supabase/client';

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
  status: string | null;
  created_at: string;
  updated_at: string;
}

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  position: string | null;
  cover_letter: string | null;
  cv_url: string | null;
  professional_photo_url: string | null;
  created_at: string;
}

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [jobModal, setJobModal] = useState({ open: false, job: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, job: null });
  const [viewModal, setViewModal] = useState({ open: false, application: null });
  const { toast } = useToast();

  // Fetch job postings
  const { data: jobsData, isLoading: jobsLoading, error: jobsError, refetch: refetchJobs } = useRealtimeQuery('careers', { orderBy: 'created_at' });

  // Fetch job applications
  const { data: applicationsData, isLoading: applicationsLoading, error: applicationsError, refetch: refetchApplications } = useRealtimeQuery('career_applications', { orderBy: 'created_at' });

  // Type guards
  const isJob = (item: any): item is Job => {
    return item && typeof item === 'object' && typeof item.id === 'string' && typeof item.title === 'string';
  };

  const isApplication = (item: any): item is Application => {
    return item && typeof item === 'object' && typeof item.id === 'string' && typeof item.full_name === 'string';
  };

  // Safely handle data with proper error checking
  const jobs: Job[] = (!jobsError && Array.isArray(jobsData)) ? jobsData.filter(isJob) : [];
  const applications: Application[] = (!applicationsError && Array.isArray(applicationsData)) ? applicationsData.filter(isApplication) : [];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = Array.from(new Set(jobs.map(job => job.department).filter(Boolean)));
  const statuses = Array.from(new Set(jobs.map(job => job.status).filter(Boolean)));
  const activeJobs = jobs.filter(job => job.status === 'active').length;

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddJob = () => {
    setJobModal({ open: true, job: null });
  };

  const handleEditJob = (job: Job) => {
    setJobModal({ open: true, job });
  };

  const handleDeleteJob = (job: Job) => {
    setDeleteModal({ open: true, job });
  };

  const handleViewApplication = (application: Application) => {
    setViewModal({ open: true, application });
  };

  const confirmDelete = async () => {
    if (!deleteModal.job) return;

    try {
      const { error } = await supabase
        .from('careers')
        .delete()
        .eq('id', deleteModal.job.id);

      if (error) throw error;

      refetchJobs();
      toast({
        title: "Job Deleted",
        description: "The job posting has been successfully deleted.",
      });

      setDeleteModal({ open: false, job: null });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Error",
        description: "Failed to delete job posting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleJobUpdated = () => {
    refetchJobs();
    toast({
      title: "Job Updated",
      description: "The job posting has been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Career Management</h1>
          <p className="text-vip-gold/80 mt-2">Manage job postings and view applications</p>
        </div>
        <Button onClick={handleAddJob} className="bg-vip-gold text-black hover:bg-vip-gold/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Job Posting
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
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
            <p className="text-xs text-blue-600">Total applications</p>
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
                {departments.map(department => (
                  <SelectItem key={department} value={department}>
                    {department}
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

      {/* Job Postings */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-vip-black">
            <Briefcase className="h-5 w-5 mr-2 text-vip-gold" />
            Job Postings ({filteredJobs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {jobsLoading ? (
            <div className="text-center py-8">
              <p className="text-vip-gold/60">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-vip-gold/60">No job postings found. Create your first job posting to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="p-4 border border-vip-gold/20 rounded-lg vip-glass-light hover:bg-vip-gold/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-vip-black">{job.title}</h3>
                        {job.status && (
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        )}
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
                        {job.employment_type && (
                          <p>Type: {job.employment_type}</p>
                        )}
                        {job.salary_range && (
                          <p>Salary: {job.salary_range}</p>
                        )}
                        {job.application_deadline && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
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

      {/* Job Applications */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-vip-black">
            <Mail className="h-5 w-5 mr-2 text-vip-gold" />
            Job Applications ({applications.length})
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
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="p-4 border border-vip-gold/20 rounded-lg vip-glass-light hover:bg-vip-gold/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-vip-black">{application.full_name}</h3>
                        {application.position && (
                          <Badge className="bg-blue-100 text-blue-800">
                            {application.position}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-vip-gold/80">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {application.email}
                        </div>
                        {application.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {application.phone}
                          </div>
                        )}
                        <p>Applied: {new Date(application.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewApplication(application)}
                        variant="outline"
                        size="sm"
                        className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {application.cv_url && (
                        <Button
                          onClick={() => window.open(application.cv_url, '_blank')}
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-600 hover:bg-green-50"
                        >
                          View CV
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <JobOpeningModal
        open={jobModal.open}
        onOpenChange={(open) => setJobModal({ ...jobModal, open })}
        onJobUpdated={handleJobUpdated}
      />

      <DeleteConfirmationModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        title="Delete Job Posting"
        description="Are you sure you want to delete this job posting?"
        itemName={deleteModal.job?.title || 'Job Posting'}
        onConfirm={confirmDelete}
      />

      <ViewDetailsModal
        open={viewModal.open}
        onOpenChange={(open) => setViewModal({ ...viewModal, open })}
        title="Application Details"
      >
        {viewModal.application && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-vip-black">Full Name</h3>
              <p className="text-vip-gold/80">{viewModal.application.full_name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-vip-black">Email</h3>
              <p className="text-vip-gold/80">{viewModal.application.email}</p>
            </div>
            {viewModal.application.phone && (
              <div>
                <h3 className="font-semibold text-vip-black">Phone</h3>
                <p className="text-vip-gold/80">{viewModal.application.phone}</p>
              </div>
            )}
            {viewModal.application.position && (
              <div>
                <h3 className="font-semibold text-vip-black">Position Applied For</h3>
                <p className="text-vip-gold/80">{viewModal.application.position}</p>
              </div>
            )}
            {viewModal.application.cover_letter && (
              <div>
                <h3 className="font-semibold text-vip-black">Cover Letter</h3>
                <p className="text-vip-gold/80 whitespace-pre-wrap">{viewModal.application.cover_letter}</p>
              </div>
            )}
            {viewModal.application.cv_url && (
              <div>
                <h3 className="font-semibold text-vip-black">CV</h3>
                <Button
                  onClick={() => window.open(viewModal.application.cv_url, '_blank')}
                  className="bg-vip-gold text-black hover:bg-vip-gold/90"
                >
                  View CV
                </Button>
              </div>
            )}
            {viewModal.application.professional_photo_url && (
              <div>
                <h3 className="font-semibold text-vip-black">Professional Photo</h3>
                <img
                  src={viewModal.application.professional_photo_url}
                  alt="Professional photo"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        )}
      </ViewDetailsModal>
    </div>
  );
};

export default Careers;
