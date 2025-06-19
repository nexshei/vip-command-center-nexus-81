import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRealtimeQuery } from '@/hooks/useRealtimeQuery';
import AddStaffModal from '@/components/modals/AddStaffModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone,
  MapPin,
  Edit,
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react';

interface StaffMember {
  id: string;
  full_name: string;
  role: string;
  email: string;
  phone: string;
  status: string;
  notes: string;
  created_at: string;
}

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

  // Use proper error handling for the query
  const { 
    data: staffData, 
    isLoading, 
    error 
  } = useRealtimeQuery('staff', {
    queryKey: ['staff'],
    table: 'staff'
  });

  // Handle data with proper error checking
  const staff: StaffMember[] = (!error && Array.isArray(staffData)) ? staffData : [];

  const filteredStaff = staff.filter(member =>
    member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStaff = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setIsEditModalOpen(true);
  };

  const handleDeleteStaff = (staffMember: StaffMember) => {
    setStaffToDelete(staffMember);
    setIsDeleteModalOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vip-gold mx-auto mb-4"></div>
          <p className="text-vip-gold">Loading staff...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Staff Management</h1>
          <p className="text-vip-gold/80 mt-2">Manage team members and protocol officers</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-vip-gold text-white hover:bg-vip-gold-dark flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-vip-gold/60" />
            <Input
              placeholder="Search staff members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
            />
          </div>
        </div>
        
        <Card className="bg-white border border-vip-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-vip-gold" />
              <div className="ml-3">
                <p className="text-sm font-medium text-vip-gold/80">Total Staff</p>
                <p className="text-2xl font-bold text-vip-black">{staff.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-vip-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-vip-gold/80">Active</p>
                <p className="text-2xl font-bold text-vip-black">{staff.filter(s => s.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Grid */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredStaff.map((member) => (
          <Card key={member.id} className="bg-white border border-vip-gold/20 hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-vip-gold/10">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 border border-vip-gold/30">
                    <AvatarFallback className="bg-vip-gold/20 text-vip-gold text-sm">
                      {getInitials(member.full_name || 'UN')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-vip-black">{member.full_name}</CardTitle>
                    <p className="text-sm text-vip-gold/70">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditStaff(member)}
                    className="text-vip-gold hover:text-vip-gold-dark"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteStaff(member)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={member.status === 'active' ? 'default' : 'secondary'}
                    className={member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  >
                    {member.status === 'active' ? (
                      <UserCheck className="h-3 w-3 mr-1" />
                    ) : (
                      <UserX className="h-3 w-3 mr-1" />
                    )}
                    {member.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {member.email && (
                    <div className="flex items-center text-sm text-vip-black/80">
                      <Mail className="h-4 w-4 mr-2 text-vip-gold/60" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                  
                  {member.phone && (
                    <div className="flex items-center text-sm text-vip-black/80">
                      <Phone className="h-4 w-4 mr-2 text-vip-gold/60" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>

                {member.notes && (
                  <div className="text-sm text-vip-black/70 bg-vip-gold/5 p-3 rounded border">
                    <p className="line-clamp-3">{member.notes}</p>
                  </div>
                )}

                <div className="text-xs text-vip-gold/60 pt-2 border-t border-vip-gold/10">
                  Added {new Date(member.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-vip-gold/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-vip-black mb-2">No staff members found</h3>
          <p className="text-vip-gold/70 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Add your first staff member to get started'}
          </p>
          {!searchTerm && (
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-vip-gold text-white hover:bg-vip-gold-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStaffAdded={() => {
          setIsAddModalOpen(false);
        }}
      />

      {selectedStaff && (
        <AddStaffModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedStaff(null);
          }}
          staff={selectedStaff}
          onStaffUpdated={() => {
            setIsEditModalOpen(false);
            setSelectedStaff(null);
          }}
        />
      )}

      {staffToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setStaffToDelete(null);
          }}
          onConfirm={() => {
            setIsDeleteModalOpen(false);
            setStaffToDelete(null);
          }}
          title="Delete Staff Member"
          description={`Are you sure you want to delete "${staffToDelete.full_name}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default Staff;
