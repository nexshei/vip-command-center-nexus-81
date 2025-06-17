
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Briefcase, Users, Eye, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
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
  employment_type: string;
  salary_range: string | null;
  application_deadline: string | null;
  status: 'active' | 'closed' | 'draft';
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
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobModal, setJobModal] = useState({ open: false, job: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null, type: '' });
  const [viewModal, setViewModal] = useState({ open: false, item: null, type: '' });
  const { toast } = useToast();

  // Fetch jobs and applications
  const { data: jobsData, isLoading: jobsLoading, error: jobsError, refetch: refetchJobs } = useRealtimeQuery('careers', { orderBy: 'created_at' });
  const { data: applicationsData, isLoading: applicationsLoading, error: applicationsError, refetch: refetchApplications } = useRealtimeQuery('career_applications', { orderBy: 'created_at' });

  // Type guards
  const isJob = (item: any): item is Job => {
    return item && typeof item === 'object' && typeof item.id === 'string' && typeof item.title === 'string';
  };

  const isApplication = (item: any): item is Application => {
    return item && typeof item === 'object' && typeof item.id === 'string' && typeof item.full_name === 'string';
  };

  // Safely handle data
  const jobs: Job[] = !jobsError && Array.isArray(jobsData) ? jobsData.filter(isJob) : [];
  const applications: Application[] = !applicationsError && Array.isArray(applicationsData) ? applicationsData.filter(isApplication) : [];

  const getStatusColor = (status: string) => {
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
    setDeleteModal({ open: true, item: job, type: 'job' });
  };

  const handleViewJob = (job: Job) => {
    setViewModal({ open: true, item: job, type: 'job' });
  };

  const handleViewApplication = (application: Application) => {
    setViewModal({ open: true, item: application, type: 'application' });
  };

  const handleDeleteApplication = (application: Application) => {
    setDeleteModal({ open: true, item: application, type: 'application' });
  };

  const confirmDelete = async () => {
    if (!deleteModal.item) return;

    try {
      const table = deleteModal.type === 'job' ? 'careers' : 'career_applications';
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', deleteModal.item.id);

      if (error) throw error;

      if (deleteModal.type === 'job') {
        refetchJobs();
      } else {
        refetchApplications();
      }

      toast({
        title: `${deleteModal.type === 'job' ? 'Job' : 'Application'} Deleted`,
        description: `The ${deleteModal.type} has been successfully deleted.`,
      });

      setDeleteModal({ open: false, item: null, type: '' });
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: "Error",
        description: `Failed to delete ${deleteModal.type}. Please try again.`,
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

  const activeJobs = jobs.filter(job => job.status === 'active').length;
  const totalApplications = applications.length;

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
          Post New Job
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
            <p className="text-xs text-green-600">Currently accepting applications</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{totalApplications}</div>
            <p className="text-xs text-blue-600">Total received</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Job Postings
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center text-vip-black">
                <Briefcase className="h-5 w-5 mr-2 text-vip-gold" />
                Job Postings ({jobs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="text-center py-8">
                  <p className="text-vip-gold/60">Loading jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-vip-gold/60">No job postings yet. Create your first job posting to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
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
                              <p>Department: {job.department}</p>
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
                            onClick={() => handleViewJob(job)}
                            variant="outline"
                            size="sm"
                            className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                          >
                            <Eye className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center text-vip-black">
                <Users className="h-5 w-5 mr-2 text-vip-gold" />
                Applications ({applications.length})
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
                          <h3 className="font-semibold text-vip-black mb-1">{application.full_name}</h3>
                          <div className="space-y-1 text-sm text-vip-gold/80">
                            <p>Email: {application.email}</p>
                            {application.phone && <p>Phone: {application.phone}</p>}
                            {application.position && <p>Position: {application.position}</p>}
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
                          <Button
                            onClick={() => handleDeleteApplication(application)}
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
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <JobOpeningModal
        open={jobModal.open}
        onOpenChange={(open) => setJobModal({ ...jobModal, open })}
        job={jobModal.job}
        onJobUpdated={handleJobUpdated}
      />

      <DeleteConfirmationModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        title={`Delete ${deleteModal.type === 'job' ? 'Job' : 'Application'}`}
        description={`Are you sure you want to delete this ${deleteModal.type}?`}
        itemName={deleteModal.item?.title || deleteModal.item?.full_name || ''}
        onConfirm={confirmDelete}
      />

      <ViewDetailsModal
        open={viewModal.open}
        onOpenChange={(open) => setViewModal({ ...viewModal, open })}
        title={viewModal.type === 'job' ? 'Job Details' : 'Application Details'}
      >
        {viewModal.item && viewModal.type === 'job' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-vip-black">Title</h3>
              <p className="text-vip-gold/80">{viewModal.item.title}</p>
            </div>
            {viewModal.item.department && (
              <div>
                <h3 className="font-semibold text-vip-black">Department</h3>
                <p className="text-vip-gold/80">{viewModal.item.department}</p>
              </div>
            )}
            {viewModal.item.location && (
              <div>
                <h3 className="font-semibold text-vip-black">Location</h3>
                <p className="text-vip-gold/80">{viewModal.item.location}</p>
              </div>
            )}
            {viewModal.item.description && (
              <div>
                <h3 className="font-semibold text-vip-black">Description</h3>
                <p className="text-vip-gold/80">{viewModal.item.description}</p>
              </div>
            )}
            {viewModal.item.requirements && (
              <div>
                <h3 className="font-semibold text-vip-black">Requirements</h3>
                <ul className="text-vip-gold/80 list-disc list-inside">
                  {viewModal.item.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {viewModal.item && viewModal.type === 'application' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-vip-black">Full Name</h3>
              <p className="text-vip-gold/80">{viewModal.item.full_name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-vip-black">Email</h3>
              <p className="text-vip-gold/80">{viewModal.item.email}</p>
            </div>
            {viewModal.item.phone && (
              <div>
                <h3 className="font-semibold text-vip-black">Phone</h3>
                <p className="text-vip-gold/80">{viewModal.item.phone}</p>
              </div>
            )}
            {viewModal.item.position && (
              <div>
                <h3 className="font-semibold text-vip-black">Position Applied For</h3>
                <p className="text-vip-gold/80">{viewModal.item.position}</p>
              </div>
            )}
            {viewModal.item.cover_letter && (
              <div>
                <h3 className="font-semibold text-vip-black">Cover Letter</h3>
                <p className="text-vip-gold/80 whitespace-pre-wrap">{viewModal.item.cover_letter}</p>
              </div>
            )}
            {viewModal.item.cv_url && (
              <div>
                <h3 className="font-semibold text-vip-black">CV</h3>
                <a href={viewModal.item.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View CV
                </a>
              </div>
            )}
          </div>
        )}
      </ViewDetailsModal>
    </div>
  );
};

export default Careers;
