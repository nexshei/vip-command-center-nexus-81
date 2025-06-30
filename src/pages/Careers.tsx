
import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, User, Calendar, Briefcase, Clock, TrendingUp, Award, MapPin, Users } from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { useJobs } from '@/hooks/useJobs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobOpeningModalTrigger } from '@/components/modals/JobOpeningModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('applications');
  
  const { data: applications = [], isLoading, error, refetch: refetchApplications } = useApplications();
  const { data: jobs = [], refetch: refetchJobs } = useJobs();
  const { toast } = useToast();

  const handleJobAdded = () => {
    refetchJobs();
    refetchApplications();
    toast({
      title: "Job Posted Successfully",
      description: "The job posting is now live and accepting applications.",
    });
  };

  const filteredApplications = applications.filter(application => {
    const matchesSearch = 
      application.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.position?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewApplication = (application: any) => {
    setSelectedApplication(application);
    setIsViewModalOpen(true);
  };

  const getJobApplicationsCount = (jobTitle: string) => {
    return applications.filter(app => app.position === jobTitle).length;
  };

  const getJobSuccessRate = (jobTitle: string) => {
    const jobApplications = applications.filter(app => app.position === jobTitle);
    const hiredCount = jobApplications.filter(app => app.status === 'approved').length;
    return jobApplications.length > 0 ? Math.round((hiredCount / jobApplications.length) * 100) : 0;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vip-gold"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error loading career data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Career Management</h1>
          <p className="text-vip-gold/60 mt-1">Manage job postings and applications</p>
        </div>
        <JobOpeningModalTrigger onJobAdded={handleJobAdded} />
      </div>

      {/* Enhanced Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-800">Total Jobs</p>
                <p className="text-2xl font-bold text-blue-900">{jobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-green-800">Active Jobs</p>
                <p className="text-2xl font-bold text-green-900">{jobs.filter(j => j.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-800">Applications</p>
                <p className="text-2xl font-bold text-purple-900">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-yellow-800">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {applications.filter(a => a.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-emerald-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-emerald-800">Hired</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {applications.filter(a => a.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Job History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <Card className="vip-glass border-vip-gold/20">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No career applications found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Interview Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <p className="font-medium">{application.full_name}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {application.position || 'Not Specified'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm">{application.email}</p>
                            {application.phone && (
                              <p className="text-sm text-gray-500">{application.phone}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(application.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {application.interview_date ? (
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(application.interview_date).toLocaleDateString()}
                            </div>
                          ) : (
                            'Not Scheduled'
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewApplication(application)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job) => {
                const applicationsCount = getJobApplicationsCount(job.title);
                const successRate = getJobSuccessRate(job.title);
                const hiredCount = applications.filter(app => app.position === job.title && app.status === 'approved').length;
                
                return (
                  <Card key={job.id} className="relative overflow-hidden border-l-4 border-l-vip-gold hover:shadow-lg transition-shadow">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-vip-gold/10 to-transparent rounded-bl-full"></div>
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-vip-black flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-vip-gold" />
                            {job.title}
                          </CardTitle>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            {job.department && (
                              <span className="flex items-center gap-1">
                                <Badge variant="secondary" className="text-xs">
                                  {job.department}
                                </Badge>
                              </span>
                            )}
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {job.location}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge className={getJobStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                          <p className="text-lg font-bold text-blue-600">{applicationsCount}</p>
                          <p className="text-xs text-blue-800">Applications</p>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <p className="text-lg font-bold text-green-600">{hiredCount}</p>
                          <p className="text-xs text-green-800">Hired</p>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded-lg">
                          <p className="text-lg font-bold text-purple-600">{successRate}%</p>
                          <p className="text-xs text-purple-800">Success Rate</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Employment Type:</span>
                          <span className="font-medium">{job.employment_type || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Posted:</span>
                          <span className="font-medium">{new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                        {job.application_deadline && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Deadline:</span>
                            <span className="font-medium">{new Date(job.application_deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {job.description && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700 line-clamp-3">{job.description}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          Last updated: {new Date(job.updated_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {jobs.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Job Postings Yet</h3>
                  <p className="text-gray-500 mb-4">Start by creating your first job posting to build your hiring history.</p>
                  <JobOpeningModalTrigger onJobAdded={handleJobAdded} />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-sm">{selectedApplication.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-sm">{selectedApplication.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-sm">{selectedApplication.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Position Applied</label>
                  <p className="text-sm">{selectedApplication.position || 'Not specified'}</p>
                </div>
              </div>
              {selectedApplication.cover_letter && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Cover Letter</label>
                  <div className="bg-gray-50 p-3 rounded-md mt-1">
                    <p className="text-sm whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">CV/Resume</label>
                  {selectedApplication.cv_url ? (
                    <a href={selectedApplication.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      View CV/Resume
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">Not provided</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Professional Photo</label>
                  {selectedApplication.professional_photo_url ? (
                    <a href={selectedApplication.professional_photo_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      View Photo
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">Not provided</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge className={getStatusColor(selectedApplication.status)}>
                    {selectedApplication.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Applied Date</label>
                  <p className="text-sm">{new Date(selectedApplication.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Interview Date</label>
                  <p className="text-sm">
                    {selectedApplication.interview_date 
                      ? new Date(selectedApplication.interview_date).toLocaleDateString() 
                      : 'Not scheduled'
                    }
                  </p>
                </div>
              </div>
              {selectedApplication.admin_notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Admin Notes</label>
                  <div className="bg-gray-50 p-3 rounded-md mt-1">
                    <p className="text-sm whitespace-pre-wrap">{selectedApplication.admin_notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Careers;
