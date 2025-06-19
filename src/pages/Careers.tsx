
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
  Plus, 
  Search, 
  MapPin, 
  Clock,
  Users,
  Edit,
  Trash2,
  Calendar,
  DollarSign
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
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');

  // Use proper query structure for useRealtimeQuery
  const { 
    data: jobsData, 
    isLoading: jobsLoading, 
    error: jobsError 
  } = useRealtimeQuery('careers', {
    table: 'careers'
  });

  const { 
    data: applicationsData, 
    isLoading: applicationsLoading, 
    error: applicationsError 
  } = useRealtimeQuery('career_applications', {
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

  const filteredApplications = applications.filter(app =>
    app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const handleDeleteJob = (job: Job) => {
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (jobsLoading || applicationsLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vip-gold mx-auto mb-4"></div>
          <p className="text-vip-gold">Loading careers...</p>
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
          <p className="text-vip-gold/80 mt-2">Manage job openings and applications</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-vip-gold text-white hover:bg-vip-gold-dark flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Post New Job
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-vip-gold/10 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'jobs'
              ? 'bg-vip-gold text-white'
              : 'text-vip-gold hover:bg-vip-gold/20'
          }`}
        >
          Job Openings
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'applications'
              ? 'bg-vip-gold text-white'
              : 'text-vip-gold hover:bg-vip-gold/20'
          }`}
        >
          Applications
        </button>
      </div>

      {/* Search and Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-vip-gold/60" />
            <Input
              placeholder={`Search ${activeTab === 'jobs' ? 'jobs' : 'applications'}...`}
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
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-vip-gold/80">Applications</p>
                <p className="text-2xl font-bold text-vip-black">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'jobs' ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="bg-white border border-vip-gold/20 hover:shadow-md transition-shadow">
              <CardHeader className="border-b border-vip-gold/10">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-vip-black">{job.title}</CardTitle>
                    <p className="text-sm text-vip-gold/70">{job.department}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
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
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-vip-black/80">
                      <MapPin className="h-4 w-4 mr-2 text-vip-gold/60" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-vip-black/80">
                      <Clock className="h-4 w-4 mr-2 text-vip-gold/60" />
                      <span>{job.employment_type}</span>
                    </div>
                    {job.salary_range && (
                      <div className="flex items-center text-vip-black/80">
                        <DollarSign className="h-4 w-4 mr-2 text-vip-gold/60" />
                        <span>{job.salary_range}</span>
                      </div>
                    )}
                    {job.application_deadline && (
                      <div className="flex items-center text-vip-black/80">
                        <Calendar className="h-4 w-4 mr-2 text-vip-gold/60" />
                        <span>Due: {new Date(job.application_deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {job.description && (
                    <div className="text-sm text-vip-black/70">
                      <p className="line-clamp-3">{job.description}</p>
                    </div>
                  )}

                  <div className="text-xs text-vip-gold/60 pt-2 border-t border-vip-gold/10">
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="bg-white border border-vip-gold/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-vip-black">{application.full_name}</h3>
                    <p className="text-vip-gold/70">{application.position}</p>
                    <p className="text-sm text-vip-black/70 mt-1">{application.email} • {application.phone}</p>
                    
                    {application.cover_letter && (
                      <div className="mt-3 text-sm text-vip-black/70 bg-vip-gold/5 p-3 rounded border">
                        <p className="line-clamp-3">{application.cover_letter}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-vip-gold/60">
                      Applied {new Date(application.created_at).toLocaleDateString()}
                    </p>
                    {application.cv_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(application.cv_url, '_blank')}
                        className="mt-2 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                      >
                        View CV
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty states */}
      {activeTab === 'jobs' && filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-vip-gold/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-vip-black mb-2">No job openings found</h3>
          <p className="text-vip-gold/70 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Post your first job opening to get started'}
          </p>
          {!searchTerm && (
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-vip-gold text-white hover:bg-vip-gold-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          )}
        </div>
      )}

      {activeTab === 'applications' && filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-vip-gold/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-vip-black mb-2">No applications found</h3>
          <p className="text-vip-gold/70">
            {searchTerm ? 'Try adjusting your search terms' : 'No applications have been submitted yet'}
          </p>
        </div>
      )}

      {/* Modals */}
      <JobOpeningModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onJobAdded={() => {
          setIsAddModalOpen(false);
        }}
      />

      {selectedJob && (
        <JobOpeningModal
          open={isEditModalOpen}
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
          open={isDeleteModalOpen}
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
