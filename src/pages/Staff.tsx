import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Eye, Edit, Trash2, Users, Phone, Mail } from 'lucide-react';
import { useRealtimeQuery } from '@/hooks/useRealtimeQuery';
import { useToast } from '@/hooks/use-toast';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { ViewDetailsModal } from '@/components/modals/ViewDetailsModal';
import { AddStaffModal } from '@/components/modals/AddStaffModal';
import { supabase } from '@/integrations/supabase/client';

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

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [staffModal, setStaffModal] = useState({ open: false, staff: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, staff: null });
  const [viewModal, setViewModal] = useState({ open: false, staff: null });
  const { toast } = useToast();

  // Fetch staff members
  const { data: staffData, isLoading: staffLoading, error: staffError, refetch } = useRealtimeQuery('staff', { orderBy: 'created_at' });

  // Type guard
  const isStaffMember = (item: any): item is StaffMember => {
    return item && typeof item === 'object' && typeof item.id === 'string';
  };

  // Safely handle data with proper error checking - returning correctly typed array
  const staffMembers: StaffMember[] = useMemo(() => {
    if (staffError || !Array.isArray(staffData)) {
      return [];
    }
    return staffData.filter(isStaffMember);
  }, [staffData, staffError]);

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
    setStaffModal({ open: true, staff: null });
  };

  const handleEditStaff = (staff: StaffMember) => {
    setStaffModal({ open: true, staff });
  };

  const handleDeleteStaff = (staff: StaffMember) => {
    setDeleteModal({ open: true, staff });
  };

  const handleViewStaff = (staff: StaffMember) => {
    setViewModal({ open: true, staff });
  };

  const confirmDelete = async () => {
    if (!deleteModal.staff) return;

    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', deleteModal.staff.id);

      if (error) throw error;

      refetch();
      toast({
        title: "Staff Member Deleted",
        description: "The staff member has been successfully deleted.",
      });

      setDeleteModal({ open: false, staff: null });
    } catch (error) {
      console.error('Error deleting staff member:', error);
      toast({
        title: "Error",
        description: "Failed to delete staff member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStaffAdded = (newStaff: any) => {
    refetch();
    toast({
      title: "Staff Added",
      description: "The staff member has been added successfully.",
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
          {staffLoading ? (
            <div className="text-center py-8">
              <p className="text-vip-gold/60">Loading staff...</p>
            </div>
          ) : filteredStaff.length === 0 ? (
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

      {/* Modals */}
      <AddStaffModal
        open={staffModal.open}
        onOpenChange={(open) => setStaffModal({ ...staffModal, open })}
        onStaffAdded={handleStaffAdded}
      />

      <DeleteConfirmationModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        title="Delete Staff Member"
        description="Are you sure you want to delete this staff member?"
        itemName={deleteModal.staff?.full_name || 'Staff Member'}
        onConfirm={confirmDelete}
      />

      <ViewDetailsModal
        open={viewModal.open}
        onOpenChange={(open) => setViewModal({ ...viewModal, open })}
        title="Staff Member Details"
      >
        {viewModal.staff && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-vip-black">Full Name</h3>
              <p className="text-vip-gold/80">{viewModal.staff.full_name || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-vip-black">Role</h3>
              <p className="text-vip-gold/80">{viewModal.staff.role || 'Not assigned'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-vip-black">Email</h3>
              <p className="text-vip-gold/80">{viewModal.staff.email || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-vip-black">Phone</h3>
              <p className="text-vip-gold/80">{viewModal.staff.phone || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-vip-black">Status</h3>
              <p className="text-vip-gold/80">{viewModal.staff.status || 'Not set'}</p>
            </div>
            {viewModal.staff.notes && (
              <div>
                <h3 className="font-semibold text-vip-black">Notes</h3>
                <p className="text-vip-gold/80 whitespace-pre-wrap">{viewModal.staff.notes}</p>
              </div>
            )}
          </div>
        )}
      </ViewDetailsModal>
    </div>
  );
};

export default Staff;
