import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Users, Phone, Mail, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddStaffModal } from '@/components/modals/AddStaffModal';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'active' | 'on-leave' | 'inactive';
  phone: string;
  email: string;
  avatar?: string;
  joinDate: string;
}

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { toast } = useToast();

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'Margaret Wanjiku',
      role: 'Protocol Officer',
      department: 'Protocol',
      status: 'active',
      phone: '+254 701 234 567',
      email: 'margaret@sirolele.com',
      joinDate: '2023-01-15'
    },
    {
      id: '2',
      name: 'David Kimani',
      role: 'Security Lead',
      department: 'Security',
      status: 'active',
      phone: '+254 702 345 678',
      email: 'david@sirolele.com',
      joinDate: '2022-11-20'
    },
    {
      id: '3',
      name: 'Grace Muthoni',
      role: 'Event Coordinator',
      department: 'Events',
      status: 'on-leave',
      phone: '+254 703 456 789',
      email: 'grace@sirolele.com',
      joinDate: '2023-03-10'
    },
    {
      id: '4',
      name: 'John Ochieng',
      role: 'Transport Manager',
      department: 'Logistics',
      status: 'active',
      phone: '+254 704 567 890',
      email: 'john@sirolele.com',
      joinDate: '2022-08-05'
    },
    {
      id: '5',
      name: 'Susan Akinyi',
      role: 'Communications Lead',
      department: 'Marketing',
      status: 'active',
      phone: '+254 705 678 901',
      email: 'susan@sirolele.com',
      joinDate: '2023-05-22'
    },
    {
      id: '6',
      name: 'Peter Mutua',
      role: 'Protocol Assistant',
      department: 'Protocol',
      status: 'inactive',
      phone: '+254 706 789 012',
      email: 'peter@sirolele.com',
      joinDate: '2022-12-01'
    },
  ]);

  const totalStaff = staffMembers.length;
  const activeStaff = staffMembers.filter(staff => staff.status === 'active').length;
  const onLeaveStaff = staffMembers.filter(staff => staff.status === 'on-leave').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-ios-green text-white';
      case 'on-leave': return 'bg-ios-orange text-white';
      case 'inactive': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || staff.role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddStaff = () => {
    setAddModalOpen(true);
  };

  const handleStaffAdded = (newStaff: StaffMember) => {
    setStaffMembers([...staffMembers, newStaff]);
  };

  const handleViewProfile = (staffId: string) => {
    toast({
      title: "View Profile",
      description: "Opening staff member profile...",
    });
  };

  const handleEditStaff = (staffId: string) => {
    toast({
      title: "Edit Staff",
      description: "Opening edit form for staff member...",
    });
  };

  const handleContact = (phone: string) => {
    toast({
      title: "Calling",
      description: `Dialing ${phone}...`,
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Staff Directory</h1>
          <p className="text-vip-gold/80 mt-2">Manage VIP protocol team members and assignments</p>
        </div>
        <Button onClick={handleAddStaff} className="bg-vip-gold text-black hover:bg-vip-gold-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add New Staff Member
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Total Staff Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalStaff}</div>
            <p className="text-xs text-vip-gold/60">Team members</p>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Active Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeStaff}</div>
            <p className="text-xs text-ios-green">Currently working</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">On Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{onLeaveStaff}</div>
            <p className="text-xs text-ios-orange">Temporarily away</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="text-white">Search & Filter Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
              <Input
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-vip-gold/30 focus:border-vip-gold bg-white text-black"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold bg-white text-black">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="protocol">Protocol</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="communications">Communications</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-vip-gold/30 focus:border-vip-gold bg-white text-black">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff Directory */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Users className="h-5 w-5 mr-2 text-vip-gold" />
            Staff Members ({filteredStaff.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStaff.map((staff) => (
              <div key={staff.id} className="p-4 border border-vip-gold/20 rounded-lg vip-glass-light hover:bg-vip-gold/5 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-vip-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-vip-gold font-semibold text-sm">
                      {getInitials(staff.name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{staff.name}</h3>
                    <p className="text-sm text-vip-gold/80">{staff.role}</p>
                    <p className="text-xs text-vip-gold/60">{staff.department}</p>
                    
                    <div className="mt-2">
                      <Badge className={`${getStatusColor(staff.status)} text-xs`}>
                        {staff.status === 'active' ? 'Active' : 
                         staff.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center text-xs text-vip-gold/70">
                        <Phone className="h-3 w-3 mr-1" />
                        <span className="truncate">{staff.phone}</span>
                      </div>
                      <div className="flex items-center text-xs text-vip-gold/70">
                        <Mail className="h-3 w-3 mr-1" />
                        <span className="truncate">{staff.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-3">
                      <Button 
                        onClick={() => handleViewProfile(staff.id)}
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        onClick={() => handleEditStaff(staff.id)}
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10 text-xs"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        onClick={() => handleContact(staff.phone)}
                        variant="outline" 
                        size="sm" 
                        className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddStaffModal 
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onStaffAdded={handleStaffAdded}
      />
    </div>
  );
};

export default Staff;
