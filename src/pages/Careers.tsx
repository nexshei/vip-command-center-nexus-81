
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useRealtimeQuery } from '@/hooks/useRealtimeQuery';
import JobOpeningModal from '@/components/modals/JobOpeningModal';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';
import { 
  Plus, 
  Search, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar,
  Eye,
  Edit,
  Trash2,
  Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  cover_letter: string;
  cv_url: string;
  professional_photo_url: string;
  created_at: string;
}

const Careers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  // Fetch data with proper error handling
  const { data: jobsData, isLoading: jobsLoading, error: jobsError, refetch: refetchJobs } = useRealtimeQuery('careers');
  const { data: applicationsData, isLoading: applicationsLoading, error: applicationsError } = useRealtimeQuery('career_applications');

  // Safely handle data with proper type checking
  const jobs: Job[] = Array.isArray(jobsData) ? jobsData : [];
  const applications: Application[] = Array.isArray(applicationsData) ? applicationsData : [];

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      const { error } = await supabase
        .from('careers')
        .delete()
        .eq('id', jobToDelete.id);

      if (error) throw error;

      toast({
        title: "Job Deleted",
        description: "The job opening has been successfully deleted."
      });

      setIsDeleteModalOpen(false);
      setJobToDelete(null);
      refetchJobs();
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete job opening.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApplicationsForJob = (jobTitle: string) => {
    return applications.filter(app => app.position === jobTitle).length;
  };

  if (jobsLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vip-gold"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Career Management</h1>
          <p className="text-vip-gold/80 mt-2">Manage job openings and track applications</p>
        </div>
        <Button 
          onClick={() => {
            setSelectedJob(null);
            setIsJobModalOpen(true);
          }}
          className="bg-vip-gold text-white hover:bg-vip-gold-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Job Opening
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white border border-vip-gold/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-vip-gold/60" />
              <Input
                placeholder="Search jobs by title, department, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-vip-gold/30 focus:border-vip-gold"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border border-vip-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-vip-gold" />
              <div className="ml-4">
                <p className="text-sm font-medium text-vip-gold/80">Total Jobs</p>
                <p className="text-2xl font-bold text-vip-black">{jobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-vip-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-vip-gold/80">Active Jobs</p>
                <p className="text-2xl font-bold text-vip-black">
                  {jobs.filter(job => job.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-vip-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-vip-gold/80">Applications</p>
                <p className="text-2xl font-bold text-vip-black">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-vip-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-vip-gold/80">This Month</p>
                <p className="text-2xl font-bold text-vip-black">
                  {jobs.filter(job => {
                    const created = new Date(job.created_at);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <Card className="bg-white border border-vip-gold/20">
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-vip-gold/60 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-vip-black mb-2">No jobs found</h3>
            <p className="text-vip-gold/60 mb-4">
              {searchTerm ? 'No jobs match your search criteria.' : 'Get started by creating your first job opening.'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => {
                  setSelectedJob(null);
                  setIsJobModalOpen(true);
                }}
                className="bg-vip-gold text-white hover:bg-vip-gold-dark"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Job Opening
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="bg-white border border-vip-gold/20 hover:shadow-lg transition-shadow">
              <CardHeader className="border-b border-vip-gold/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-vip-black line-clamp-2">{job.title}</CardTitle>
                    <div className="flex items-center mt-2 space-x-4">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      <span className="text-sm text-vip-gold/60 flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {getApplicationsForJob(job.title)} applicants
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-vip-gold/70">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {job.department}
                  </div>
                  <div className="flex items-center text-sm text-vip-gold/70">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                  {job.salary_range && (
                    <div className="flex items-center text-sm text-vip-gold/70">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {job.salary_range}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-vip-gold/70">
                    <Calendar className="h-4 w-4 mr-2" />
                    {job.employment_type}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-vip-gold/10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedJob(job);
                      setIsJobModalOpen(true);
                    }}
                    className="text-vip-gold border-vip-gold/30 hover:bg-vip-gold hover:text-white"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setJobToDelete(job);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <JobOpeningModal
        open={isJobModalOpen}
        onOpenChange={setIsJobModalOpen}
        job={selectedJob}
        onJobUpdated={() => {
          refetchJobs();
          setIsJobModalOpen(false);
          setSelectedJob(null);
        }}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDeleteJob}
        title="Delete Job Opening"
        description={`Are you sure you want to delete "${jobToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Careers;
