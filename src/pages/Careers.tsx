import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useRealtimeQuery } from '@/hooks/useRealtimeQuery';
import JobOpeningModal from '@/components/modals/JobOpeningModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Plus, 
  Search, 
  Building2,
  Users,
  Edit,
  Trash2
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string[];
  status: string;
  employment_type: string;
  salary_range: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  // Use proper error handling for the queries
  const { 
    data: jobsData, 
    isLoading: jobsLoading, 
    error: jobsError 
  } = useRealtimeQuery('careers', {
    queryKey: ['careers'],
    table: 'careers'
  });

  const { 
    data: applicationsData, 
    isLoading: applicationsLoading, 
    error: applicationsError 
  } = useRealtimeQuery('career_applications', {
    queryKey: ['career_applications'],
    table: 'career_applications'
  });

  // Handle data with proper error checking
  const jobs: Job[] = (!jobsError && Array.isArray(jobsData)) ? jobsData : [];
  const applications: Application[] = (!applicationsError && Array.isArray(applicationsData)) ? applicationsData : [];

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const handleDeleteJob = (job: Job) => {
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  const getApplicationsForJob = (jobTitle: string) => {
    return applications.filter(app => app.position === jobTitle);
  };

  if (jobsLoading || applicationsLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vip-gold mx-auto mb-4"></div>
          <p className="text-vip-gold">Loading careers data...</p>
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
          onClick={() => setIsAddModalOpen(true)}
          className="bg-vip-gold text-white hover:bg-vip-gold-dark flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Job Opening
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-vip-gold/60" />
            <Input
              placeholder="Search job openings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
            />
          </div>
        </div>
        
        <Card className="bg-white border border-vip-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-vip-gold" />
              <div className="ml-3">
                <p className="text-sm font-medium text-vip-gold/80">Active Jobs</p>
                <p className="text-2xl font-bold text-vip-black">{jobs.filter(j => j.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-vip-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-vip-gold" />
              <div className="ml-3">
                <p className="text-sm font-medium text-vip-gold/80">Applications</p>
                <p className="text-2xl font-bold text-vip-black">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="bg-white border border-vip-gold/20 hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-vip-gold/10">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-vip-black">{job.title}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-vip-gold/70">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      {job.department}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditJob(job)}
                    className="text-vip-gold hover:text-vip-gold-dark"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteJob(job)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-vip-black/80 line-clamp-3">{job.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant={job.status === 'active' ? 'default' : 'secondary'} className="bg-vip-gold/10 text-vip-gold">
                      {job.status}
                    </Badge>
                    <Badge variant="outline" className="border-vip-gold/30 text-vip-gold/70">
                      {job.employment_type}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-vip-gold/70">
                    <Users className="h-4 w-4 mr-1" />
                    {getApplicationsForJob(job.title).length} applications
                  </div>
                </div>

                {job.application_deadline && (
                  <div className="flex items-center text-sm text-vip-gold/70">
                    <Calendar className="h-4 w-4 mr-1" />
                    Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                  </div>
                )}

                {job.salary_range && (
                  <div className="text-sm font-medium text-vip-black">
                    Salary: {job.salary_range}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-vip-gold/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-vip-black mb-2">No job openings found</h3>
          <p className="text-vip-gold/70 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first job opening to get started'}
          </p>
          {!searchTerm && (
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-vip-gold text-white hover:bg-vip-gold-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Job Opening
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      <JobOpeningModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onJobAdded={() => {
          setIsAddModalOpen(false);
        }}
      />

      {selectedJob && (
        <JobOpeningModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedJob(null);
          }}
          job={selectedJob}
          onJobUpdated={() => {
            setIsEditModalOpen(false);
            setSelectedJob(null);
          }}
        />
      )}

      {jobToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setJobToDelete(null);
          }}
          onConfirm={() => {
            setIsDeleteModalOpen(false);
            setJobToDelete(null);
          }}
          title="Delete Job Opening"
          description={`Are you sure you want to delete "${jobToDelete.title}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default Careers;
