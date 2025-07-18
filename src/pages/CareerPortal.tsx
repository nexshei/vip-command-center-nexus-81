import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { JobOpeningModalTrigger } from '@/components/modals/JobOpeningModal';
import { EditJobModal } from '@/components/modals/EditJobModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { useJobs, useDeleteJob, type JobPosting } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import { supabase } from '@/integrations/supabase/client';
import { CareerStats } from '@/components/career/CareerStats';
import { ApplicationsList } from '@/components/career/ApplicationsList';
import { JobPostingsList } from '@/components/career/JobPostingsList';
import { HiringSuccessStories } from '@/components/career/HiringSuccessStories';

const CareerPortal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [selectedApplicationName, setSelectedApplicationName] = useState<string>('');

  const { data: jobs = [], isLoading: jobsLoading, refetch: refetchJobs } = useJobs();
  const { data: applications = [], refetch: refetchApplications } = useApplications();
  const deleteJobMutation = useDeleteJob();
  const { toast } = useToast();

  // Calculate statistics
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status === 'active').length;
  const totalApplications = applications.length;
  const hiredApplicants = applications.filter(app => app.status === 'approved').length;

  const handleJobAdded = () => {
    refetchJobs();
    toast({
      title: "Job Posted Successfully",
      description: "The job posting is now live and accepting applications.",
    });
  };

  const handleJobUpdated = (updatedJob: JobPosting) => {
    refetchJobs();
    setEditingJob(null);
    setIsEditModalOpen(false);
  };

  const handleEditJob = (job: JobPosting) => {
    setEditingJob(job);
    setIsEditModalOpen(true);
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJobMutation.mutateAsync(jobId);
      toast({
        title: "Job Deleted",
        description: "The job posting has been removed successfully.",
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job posting.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteApplicationClick = (applicationId: string, applicationName: string) => {
    setSelectedApplicationId(applicationId);
    setSelectedApplicationName(applicationName);
    setShowDeleteModal(true);
  };

  const handleDeleteApplication = async () => {
    if (!selectedApplicationId) return;
    
    try {
      const { error } = await supabase
        .from('career_applications')
        .delete()
        .eq('id', selectedApplicationId);

      if (error) throw error;

      refetchApplications();
      toast({
        title: "Application Deleted",
        description: "The career application has been removed successfully.",
        variant: "destructive"
      });
      setShowDeleteModal(false);
      setSelectedApplicationId(null);
      setSelectedApplicationName('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete application.",
        variant: "destructive"
      });
    }
  };

  const handleViewApplicants = (job: JobPosting) => {
    toast({
      title: "View Applicants",
      description: `Showing applicants for ${job.title}. Check the Careers page for detailed application management.`,
    });
  };

  if (jobsLoading) {
    return (
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vip-gold"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-vip-gold mb-2">Career Portal Management</h1>
            <p className="text-vip-gold/60">Professional management of job openings and recruitment excellence</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => { 
                refetchJobs(); 
                refetchApplications(); 
                toast({ title: "Refreshed", description: "Career data has been refreshed successfully" }); 
              }} 
              variant="outline"
              className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10 transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <JobOpeningModalTrigger onJobAdded={handleJobAdded} />
          </div>
        </div>

      {/* Summary Stats */}
      <CareerStats 
        totalJobs={totalJobs}
        activeJobs={activeJobs}
        totalApplications={totalApplications}
        hiredApplicants={hiredApplicants}
      />

      {/* Applications Table */}
      <ApplicationsList 
        applications={applications}
        onDeleteApplication={handleDeleteApplicationClick}
      />

      {/* Job Postings */}
      <JobPostingsList
        jobs={jobs}
        applications={applications}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onEditJob={handleEditJob}
        onDeleteJob={handleDeleteJob}
        onViewApplicants={handleViewApplicants}
        deleteJobPending={deleteJobMutation.isPending}
      />

      {/* Hiring Success Stories */}
      <HiringSuccessStories applications={applications} />

      {/* Edit Job Modal */}
      <EditJobModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        job={editingJob}
        onJobUpdated={handleJobUpdated}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteApplication}
        title="Delete Career Application"
        description="Are you sure you want to delete this career application? This action cannot be undone."
        itemName={selectedApplicationName}
      />
      </div>
    </div>
  );
};

export default CareerPortal;
