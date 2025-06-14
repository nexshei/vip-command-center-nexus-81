
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Briefcase, 
  Plus, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users,
  Eye,
  Edit,
  Download,
  FileText,
  Mail,
  Phone,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Careers = () => {
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('');

  // Mock job applications data
  const jobApplications = [
    {
      id: 1,
      fullName: "Alice Wanjiku Muthoni",
      email: "alice.muthoni@email.com",
      phone: "+254 712 345 678",
      position: "Protocol Officer",
      appliedDate: "2024-01-15",
      status: "pending",
      coverLetter: "I am passionate about diplomatic protocol and have 5 years experience...",
      cv: "alice_cv.pdf",
      photo: "alice_photo.jpg"
    },
    {
      id: 2,
      fullName: "John Kiprotich Mwangi",
      email: "john.mwangi@email.com",
      phone: "+254 722 456 789",
      position: "Professional Usher",
      appliedDate: "2024-01-18",
      status: "approved",
      coverLetter: "With my background in hospitality and event management...",
      cv: "john_cv.pdf",
      photo: "john_photo.jpg"
    },
    {
      id: 3,
      fullName: "Grace Achieng Odhiambo",
      email: "grace.odhiambo@email.com",
      phone: "+254 733 567 890",
      position: "Event Manager",
      appliedDate: "2024-01-20",
      status: "rejected",
      coverLetter: "I have successfully managed over 50 high-profile events...",
      cv: "grace_cv.pdf",
      photo: "grace_photo.jpg"
    },
    {
      id: 4,
      fullName: "Peter Kamau Ndung'u",
      email: "peter.kamau@email.com",
      phone: "+254 744 678 901",
      position: "VVIP Security Specialist",
      appliedDate: "2024-01-22",
      status: "pending",
      coverLetter: "Former military officer with extensive VIP protection experience...",
      cv: "peter_cv.pdf",
      photo: "peter_photo.jpg"
    }
  ];

  const availablePositions = [
    {
      id: 1,
      title: "Protocol Officer",
      description: "Lead diplomatic and corporate protocol services, ensuring adherence to international etiquette standards and managing high-profile events with precision.",
      type: "Full-time",
      location: "Nairobi",
      requirements: [
        "Bachelor's degree in International Relations, Communications, or related field",
        "3+ years experience in protocol or diplomatic services",
        "Excellent communication and interpersonal skills",
        "Knowledge of international etiquette and cultural sensitivity",
        "Fluency in English and Swahili; additional languages preferred"
      ]
    },
    {
      id: 2,
      title: "Professional Usher",
      description: "Provide exceptional guest reception and guidance services for VIP events and ceremonies.",
      type: "Full-time / Part-time",
      location: "Nairobi",
      requirements: [
        "Professional appearance and demeanor",
        "Excellent customer service skills",
        "Experience in hospitality or events",
        "Multilingual capabilities preferred"
      ]
    },
    {
      id: 3,
      title: "Event Manager",
      description: "Plan, coordinate and execute high-profile events with attention to detail and excellence.",
      type: "Full-time",
      location: "Nairobi",
      requirements: [
        "Event management certification",
        "5+ years in luxury event planning",
        "Strong organizational skills",
        "Vendor management experience"
      ]
    },
    {
      id: 4,
      title: "VVIP Security Specialist",
      description: "Provide discrete and professional security services for VIP clients and events.",
      type: "Full-time",
      location: "Nairobi",
      requirements: [
        "Security training certification",
        "Military or law enforcement background",
        "VIP protection experience",
        "Physical fitness requirements"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'approved': return 'bg-green-500 text-white';
      case 'rejected': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleApproveApplication = (id: number) => {
    console.log('Approving application:', id);
  };

  const handleRejectApplication = (id: number) => {
    console.log('Rejecting application:', id);
  };

  const handlePostJob = () => {
    console.log('Posting new job');
    setShowJobForm(false);
  };

  const filteredApplications = selectedPosition 
    ? jobApplications.filter(app => app.position === selectedPosition)
    : jobApplications;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Career Management</h1>
          <p className="text-vip-gold/80 mt-2">Manage job applications and postings for VIP protocol positions</p>
        </div>
        <Button 
          onClick={() => setShowJobForm(!showJobForm)}
          className="bg-vip-gold text-white hover:bg-vip-gold-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white border border-vip-gold/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{jobApplications.length}</div>
            <p className="text-xs text-vip-gold/60">All positions</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-vip-gold/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">
              {jobApplications.filter(app => app.status === 'pending').length}
            </div>
            <p className="text-xs text-yellow-600">Needs attention</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-vip-gold/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">
              {jobApplications.filter(app => app.status === 'approved').length}
            </div>
            <p className="text-xs text-green-600">Ready for hiring</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-vip-gold/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Available Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{availablePositions.length}</div>
            <p className="text-xs text-vip-gold/60">Active openings</p>
          </CardContent>
        </Card>
      </div>

      {/* Job Posting Form */}
      {showJobForm && (
        <Card className="bg-white border border-vip-gold/20 shadow-sm">
          <CardHeader className="border-b border-vip-gold/10">
            <CardTitle className="text-vip-black">Post New Job Opening</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-3">
                <Label htmlFor="job-title" className="text-sm font-medium text-vip-black">Job Title</Label>
                <Input 
                  id="job-title" 
                  placeholder="e.g., Senior Protocol Officer"
                  className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="job-type" className="text-sm font-medium text-vip-black">Employment Type</Label>
                <Select>
                  <SelectTrigger className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-vip-gold/20">
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="location" className="text-sm font-medium text-vip-black">Location</Label>
                <Input 
                  id="location" 
                  placeholder="e.g., Nairobi, Kenya"
                  className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="salary" className="text-sm font-medium text-vip-black">Salary Range</Label>
                <Input 
                  id="salary" 
                  placeholder="e.g., KSH 150,000 - 200,000"
                  className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
                />
              </div>
              <div className="col-span-2 grid gap-3">
                <Label htmlFor="description" className="text-sm font-medium text-vip-black">Job Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Detailed job description and responsibilities..."
                  rows={4}
                  className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
                />
              </div>
              <div className="col-span-2 grid gap-3">
                <Label htmlFor="requirements" className="text-sm font-medium text-vip-black">Requirements</Label>
                <Textarea 
                  id="requirements" 
                  placeholder="List the requirements for this position..."
                  rows={3}
                  className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowJobForm(false)}
                className="border-vip-gold/30 text-vip-black hover:bg-vip-gold/10"
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePostJob}
                className="bg-vip-gold text-white hover:bg-vip-gold-dark"
              >
                Post Job Opening
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applications Filter */}
      <Card className="bg-white border border-vip-gold/20 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-vip-black">
              <Users className="h-5 w-5 mr-2 text-vip-gold" />
              Job Applications ({filteredApplications.length})
            </CardTitle>
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger className="w-64 border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold">
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent className="bg-white border-vip-gold/20">
                <SelectItem value="">All Positions</SelectItem>
                {availablePositions.map((position) => (
                  <SelectItem key={position.id} value={position.title}>
                    {position.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-vip-gold/20">
                <TableHead className="text-vip-black font-semibold">Candidate</TableHead>
                <TableHead className="text-vip-black font-semibold">Position</TableHead>
                <TableHead className="text-vip-black font-semibold">Applied Date</TableHead>
                <TableHead className="text-vip-black font-semibold">Status</TableHead>
                <TableHead className="text-vip-black font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id} className="border-vip-gold/10 hover:bg-vip-gold/5">
                  <TableCell>
                    <div>
                      <div className="font-medium text-vip-black">{application.fullName}</div>
                      <div className="flex items-center text-sm text-vip-gold/70 mt-1">
                        <Mail className="h-3 w-3 mr-1" />
                        {application.email}
                      </div>
                      <div className="flex items-center text-sm text-vip-gold/70">
                        <Phone className="h-3 w-3 mr-1" />
                        {application.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-vip-black">{application.position}</TableCell>
                  <TableCell className="text-vip-black">
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="border-vip-gold/30 text-vip-black hover:bg-vip-gold/10">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-vip-black">Application Details - {application.fullName}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-semibold text-vip-black">Position</Label>
                                <p className="text-vip-gold/80">{application.position}</p>
                              </div>
                              <div>
                                <Label className="font-semibold text-vip-black">Applied Date</Label>
                                <p className="text-vip-gold/80">{new Date(application.appliedDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div>
                              <Label className="font-semibold text-vip-black">Cover Letter</Label>
                              <p className="text-vip-gold/80 mt-1">{application.coverLetter}</p>
                            </div>
                            <div className="flex space-x-4">
                              <Button variant="outline" className="flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Download CV
                              </Button>
                              <Button variant="outline" className="flex items-center">
                                <Download className="h-4 w-4 mr-2" />
                                Download Photo
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {application.status === 'pending' && (
                        <>
                          <Button 
                            onClick={() => handleApproveApplication(application.id)}
                            size="sm" 
                            className="bg-green-500 text-white hover:bg-green-600"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button 
                            onClick={() => handleRejectApplication(application.id)}
                            size="sm" 
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Available Positions */}
      <Card className="bg-white border border-vip-gold/20 shadow-sm">
        <CardHeader className="border-b border-vip-gold/10">
          <CardTitle className="flex items-center text-vip-black">
            <Briefcase className="h-5 w-5 mr-2 text-vip-gold" />
            Available Positions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-vip-gold/10">
            {availablePositions.map((position) => (
              <div key={position.id} className="p-6 hover:bg-vip-gold/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-vip-black">{position.title}</h3>
                      <Badge variant="outline" className="border-vip-gold/30 text-vip-black">
                        {position.type}
                      </Badge>
                    </div>
                    <p className="text-vip-gold/70 mb-3">{position.description}</p>
                    <div className="flex items-center text-sm text-vip-gold/70 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {position.location}
                    </div>
                    <div>
                      <h4 className="font-medium text-vip-black mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside text-sm text-vip-gold/70 space-y-1">
                        {position.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-vip-gold/30 text-vip-black hover:bg-vip-gold/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Careers;
