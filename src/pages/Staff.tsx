import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Users, Phone, Mail, Eye, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddStaffModal } from '@/components/modals/AddStaffModal';
import { useRealtimeQuery } from "@/hooks/useRealtimeQuery";
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { ViewDetailsModal } from '@/components/modals/ViewDetailsModal';
import { EditItemModal } from '@/components/modals/EditItemModal';

interface StaffMember {
  id: string;
  full_name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'on-leave' | 'inactive';
  notes?: string;
  created_at: string;
}

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [viewModal, setViewModal] = useState({ open: false, item: null });
  const [editModal, setEditModal] = useState({ open: false, item: null });
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const { toast } = useToast();

  // Fetch live data from Supabase "staff" table
  const { data: staffData, isLoading, error } = useRealtimeQuery("staff", { orderBy: "created_at" });

  // Mock data for fallback
  const mockStaffMembers = [
    {
      id: '1',
      full_name: 'Margaret Wanjiku',
      role: 'Protocol Officer',
      email: 'margaret@sirolele.com',
      phone: '+254 701 234 567',
      status: 'active' as const,
      notes: 'Protocol department',
      created_at: '2023-01-15'
    },
    {
      id: '2',
      full_name: 'David Kimani',
      role: 'Security Lead',
      email: 'david@sirolele.com',
      phone: '+254 702 345 678',
      status: 'active' as const,
      notes: 'Security department',
      created_at: '2022-11-20'
    },
    {
      id: '3',
      full_name: 'Grace Muthoni',
      role: 'Event Coordinator',
      email: 'grace@sirolele.com',
      phone: '+254 703 456 789',
      status: 'on-leave' as const,
      notes: 'Events department',
      created_at: '2023-03-10'
    },
    {
      id: '4',
      full_name: 'John Ochieng',
      role: 'Transport Manager',
      email: 'john@sirolele.com',
      phone: '+254 704 567 890',
      status: 'active' as const,
      notes: 'Logistics department',
      created_at: '2022-08-05'
    },
    {
      id: '5',
      full_name: 'Susan Akinyi',
      role: 'Communications Lead',
      email: 'susan@sirolele.com',
      phone: '+254 705 678 901',
      status: 'active' as const,
      notes: 'Marketing department',
      created_at: '2023-05-22'
    },
    {
      id: '6',
      full_name: 'Peter Mutua',
      role: 'Protocol Assistant',
      email: 'peter@sirolele.com',
      phone: '+254 706 789 012',
      status: 'inactive' as const,
      notes: 'Protocol department',
      created_at: '2022-12-01'
    },
  ];

  // Use real data if available, otherwise use mock data and state
  useEffect(() => {
    if (staffData && staffData.length > 0) {
      setStaffMembers(staffData.map((staff: any) => ({
        ...staff,
        status: ['active', 'on-leave', 'inactive'].includes(staff.status) ? staff.status : 'active'
      })));
    } else {
      setStaffMembers(mockStaffMembers);
    }
  }, [staffData]);

  const totalStaff = staffMembers.length;
  const activeStaff = staffMembers.filter((staff: StaffMember) => staff.status === 'active').length;
  const onLeaveStaff = staffMembers.filter((staff: StaffMember) => staff.status === 'on-leave').length;

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

  const getDepartment = (role: string, notes?: string) => {
    if (notes) return notes;
    if (role.toLowerCase().includes('protocol')) return 'Protocol';
    if (role.toLowerCase().includes('security')) return 'Security';
    if (role.toLowerCase().includes('event')) return 'Events';
    if (role.toLowerCase().includes('transport')) return 'Logistics';
    if (role.toLowerCase().includes('communication')) return 'Marketing';
    return 'General';
  };

  const filteredStaff = staffMembers.filter((staff: StaffMember) => {
    const department = getDepartment(staff.role, staff.notes);
    const matchesSearch = staff.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || staff.role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddStaff = () => {
    setAddModalOpen(true);
  };

  const handleStaffAdded = (newStaff: StaffMember) => {
    setStaffMembers([...staffMembers, newStaff]);
    toast({
      title: "Staff Added",
      description: "New staff member has been added successfully.",
    });
  };

  const handleViewProfile = (staff: StaffMember) => {
    setViewModal({ open: true, item: staff });
  };

  const handleEditStaff = (staff: StaffMember) => {
    setEditModal({ open: true, item: staff });
  };

  const handleStaffUpdated = (updatedStaff: StaffMember) => {
    setStaffMembers(staffMembers.map(staff => 
      staff.id === updatedStaff.id ? updatedStaff : staff
    ));
  };

  const handleDeleteStaff = (staff: StaffMember) => {
    setDeleteModal({ open: true, item: staff });
  };

  const confirmDelete = () => {
    if (deleteModal.item) {
      setStaffMembers(staffMembers.filter(staff => staff.id !== deleteModal.item.id));
      toast({
        title: "Staff Member Deleted",
        description: `${deleteModal.item.full_name} has been removed from the staff directory.`,
      });
    }
  };

  const handleContact = (phone: string) => {
    console.log('Calling:', phone);
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
          <h1 className="text-3xl font-serif font-bold text-vip-black">Staff Directory</h1>
          <p className="text-vip-gold/80 mt-2">Manage VVIP protocol team members and assignments</p>
        </div>
        <Button onClick={handleAddStaff} className="bg-vip-gold text-black hover:bg-vip-gold-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add New Staff Member
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* ... keep existing code (stats cards) */}
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Total Staff Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{totalStaff}</div>
            <p className="text-xs text-vip-gold/60">Team members</p>
          </CardContent>
        </Card>
        
        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Active Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{activeStaff}</div>
            <p className="text-xs text-ios-green">Currently working</p>
          </CardContent>
        </Card>

        <Card className="vip-glass border-vip-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">On Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{onLeaveStaff}</div>
            <p className="text-xs text-ios-orange">Temporarily away</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="text-vip-black">Search & Filter Staff</CardTitle>
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
          <CardTitle className="flex items-center text-vip-black">
            <Users className="h-5 w-5 mr-2 text-vip-gold" />
            Staff Members ({filteredStaff.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-8">
              <p className="text-vip-gold/60">Loading staff...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-8">
              <p className="text-vip-red">{error.message}</p>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStaff.map((staff: StaffMember) => (
              <div key={staff.id} className="p-4 border border-vip-gold/20 rounded-lg vip-glass-light hover:bg-vip-gold/5 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-vip-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-vip-gold font-semibold text-sm">
                      {getInitials(staff.full_name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-vip-black truncate">{staff.full_name}</h3>
                    <p className="text-sm text-vip-black">{staff.role}</p>
                    <p className="text-xs text-vip-black">{getDepartment(staff.role, staff.notes)}</p>
                    
                    <div className="mt-2">
                      <Badge className={`${getStatusColor(staff.status)} text-xs`}>
                        {staff.status === 'active' ? 'Active' : 
                         staff.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center text-xs text-vip-black">
                        <Phone className="h-3 w-3 mr-1" />
                        <span className="truncate">{staff.phone}</span>
                      </div>
                      <div className="flex items-center text-xs text-vip-black">
                        <Mail className="h-3 w-3 mr-1" />
                        <span className="truncate">{staff.email}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-1 mt-3">
                      <Button 
                        onClick={() => handleViewProfile(staff)}
                        variant="outline" 
                        size="sm" 
                        className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10 text-xs px-2"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        onClick={() => handleEditStaff(staff)}
                        variant="outline" 
                        size="sm" 
                        className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10 text-xs px-2"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        onClick={() => handleContact(staff.phone)}
                        variant="outline" 
                        size="sm" 
                        className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10 text-xs px-2"
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button 
                        onClick={() => handleDeleteStaff(staff)}
                        variant="outline" 
                        size="sm" 
                        className="border-red-300 text-red-600 hover:bg-red-50 text-xs px-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!isLoading && filteredStaff.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-vip-gold/60">No staff members found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddStaffModal 
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onStaffAdded={handleStaffAdded}
      />

      {/* Modals */}
      <DeleteConfirmationModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        title="Delete Staff Member"
        description="Are you sure you want to remove"
        itemName={deleteModal.item?.full_name || ''}
        onConfirm={confirmDelete}
      />

      <ViewDetailsModal
        open={viewModal.open}
        onOpenChange={(open) => setViewModal({ ...viewModal, open })}
        title="Staff Member Details"
      >
        {viewModal.item && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-vip-black">Full Name</h3>
              <p className="text-vip-gold/80">{viewModal.item.full_name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-vip-black">Role</h3>
              <p className="text-vip-gold/80">{viewModal.item.role}</p>
            </div>
            <div>
              <h3 className="font-semibold text-vip-black">Department</h3>
              <p className="text-vip-gold/80">{getDepartment(viewModal.item.role, viewModal.item.notes)}</p>
            </div>
            <div>
              <h3 className="font-semibold text-vip-black">Email</h3>
              <p className="text-vip-gold/80">{viewModal.item.email}</p>
            </div>
            <div>
              <h3 className="font-semibold text-vip-black">Phone</h3>
              <p className="text-vip-gold/80">{viewModal.item.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold text-vip-black">Status</h3>
              <Badge className={getStatusColor(viewModal.item.status)}>
                {viewModal.item.status === 'active' ? 'Active' : 
                 viewModal.item.status === 'on-leave' ? 'On Leave' : 'Inactive'}
              </Badge>
            </div>
            <div>
              <h3 className="font-semibold text-vip-black">Joined</h3>
              <p className="text-vip-gold/80">{new Date(viewModal.item.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </ViewDetailsModal>

      <EditItemModal
        open={editModal.open}
        onOpenChange={(open) => setEditModal({ ...editModal, open })}
        item={editModal.item}
        onItemUpdated={handleStaffUpdated}
        type="staff"
      />
    </div>
  );
};

export default Staff;
