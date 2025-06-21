
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Eye, Edit, Trash2, Users, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StaffMember {
  id: string;
  full_name: string | null;
  role: string | null;
  email: string | null;
  phone: string | null;
  status: string | null;
  notes: string | null;
  created_at: string | null;
}

// Mock data for staff members
const mockStaff: StaffMember[] = [
  {
    id: '1',
    full_name: 'John Smith',
    role: 'Protocol Officer',
    email: 'john.smith@vip.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    notes: 'Senior protocol officer with diplomatic experience',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    full_name: 'Sarah Johnson',
    role: 'Event Coordinator',
    email: 'sarah.johnson@vip.com',
    phone: '+1 (555) 234-5678',
    status: 'active',
    notes: 'Specializes in large-scale VIP events',
    created_at: '2024-01-16T10:00:00Z'
  },
  {
    id: '3',
    full_name: 'Michael Brown',
    role: 'Security Head',
    email: 'michael.brown@vip.com',
    phone: '+1 (555) 345-6789',
    status: 'on_leave',
    notes: 'Currently on medical leave',
    created_at: '2024-01-17T10:00:00Z'
  }
];

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(mockStaff);
  const { toast } = useToast();

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.role?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || staff.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || staff.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roles = Array.from(new Set(staffMembers.map(staff => staff.role).filter(Boolean)));
  const statuses = Array.from(new Set(staffMembers.map(staff => staff.status).filter(Boolean)));
  const activeStaff = staffMembers.filter(staff => staff.status === 'active').length;

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddStaff = () => {
    toast({
      title: "Feature Unavailable",
      description: "Staff management features require database connection.",
    });
  };

  const handleEditStaff = (staff: StaffMember) => {
    toast({
      title: "Feature Unavailable",
      description: "Staff editing features require database connection.",
    });
  };

  const handleDeleteStaff = (staff: StaffMember) => {
    setStaffMembers(prev => prev.filter(s => s.id !== staff.id));
    toast({
      title: "Staff Member Deleted",
      description: `${staff.full_name} has been removed from the staff list.`,
    });
  };

  const handleViewStaff = (staff: StaffMember) => {
    toast({
      title: "Feature Unavailable",
      description: "Staff details view requires database connection.",
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Staff Management</h1>
          <p className="text-vip-gold/80 mt-2">Manage your team members and their roles</p>
        </div>
        <Button onClick={handleAddStaff} className="bg-vip-gold text-black hover:bg-vip-gold/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{staffMembers.length}</div>
            <p className="text-xs text-vip-gold/60">Team members</p>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Active Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{activeStaff}</div>
            <p className="text-xs text-green-600">Currently active</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{roles.length}</div>
            <p className="text-xs text-blue-600">Different roles</p>
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
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-vip-gold/30"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48 border-vip-gold/30">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>
                    {role}
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

      {/* Staff List */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-vip-black">
            <Users className="h-5 w-5 mr-2 text-vip-gold" />
            Staff Members ({filteredStaff.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStaff.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-vip-gold/60">No staff members found. Add your first team member to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStaff.map((staff) => (
                <div key={staff.id} className="p-4 border border-vip-gold/20 rounded-lg vip-glass-light hover:bg-vip-gold/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-vip-black">{staff.full_name || 'Unknown'}</h3>
                        {staff.status && (
                          <Badge className={getStatusColor(staff.status)}>
                            {staff.status}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-vip-gold/80">
                        {staff.role && <p>Role: {staff.role}</p>}
                        {staff.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {staff.email}
                          </div>
                        )}
                        {staff.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {staff.phone}
                          </div>
                        )}
                        {staff.created_at && (
                          <p>Joined: {new Date(staff.created_at).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewStaff(staff)}
                        variant="outline"
                        size="sm"
                        className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleEditStaff(staff)}
                        variant="outline"
                        size="sm"
                        className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteStaff(staff)}
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
    </div>
  );
};

export default Staff;
