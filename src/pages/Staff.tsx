
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, Users, Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { AddStaffModal } from '@/components/modals/AddStaffModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';

// Mock data for staff members
const mockStaffMembers = [
  {
    id: '1',
    full_name: 'Sarah Johnson',
    email: 'sarah.johnson@vipprotocol.com',
    phone: '+254-700-123-456',
    role: 'Senior Protocol Officer',
    status: 'Active',
    notes: 'Specialized in diplomatic events'
  },
  {
    id: '2',
    full_name: 'Michael Chen',
    email: 'michael.chen@vipprotocol.com',
    phone: '+254-700-234-567',
    role: 'Security Coordinator',
    status: 'Active',
    notes: 'Former military background'
  },
  {
    id: '3',
    full_name: 'Amanda Williams',
    email: 'amanda.w@vipprotocol.com',
    phone: '+254-700-345-678',
    role: 'Event Coordinator',
    status: 'On Leave',
    notes: 'Temporary leave until next month'
  }
];

const Staff = () => {
  const [staff, setStaff] = useState(mockStaffMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingStaff, setDeletingStaff] = useState(null);
  const { toast } = useToast();

  const filteredStaff = staff.filter(member =>
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case 'On Leave':
        return <Badge className="bg-yellow-500 text-white">On Leave</Badge>;
      case 'Inactive':
        return <Badge className="bg-red-500 text-white">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
    }
  };

  const handleStaffAdded = () => {
    toast({
      title: "Staff Member Added",
      description: "New staff member has been added successfully.",
    });
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaff(prev => prev.filter(member => member.id !== staffId));
    setDeletingStaff(null);
    toast({
      title: "Staff Member Removed",
      description: "Staff member has been removed from the system.",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-white mb-2">
              VVIP Staff Management
            </h1>
            <p className="text-xl text-vip-gold">
              Manage your protocol team and staff members
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-vip-gold" />
            <span className="text-2xl font-bold text-white">{staff.length}</span>
            <span className="text-vip-gold">Total Staff</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white border border-vip-gold/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-vip-black mb-2">
                {staff.filter(member => member.status === 'Active').length}
              </div>
              <p className="text-vip-gold font-medium">Active Staff</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-vip-gold/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-vip-black mb-2">
                {staff.filter(member => member.status === 'On Leave').length}
              </div>
              <p className="text-vip-gold font-medium">On Leave</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-vip-gold/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-vip-black mb-2">
                {staff.length}
              </div>
              <p className="text-vip-gold font-medium">Total Staff</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Add */}
        <Card className="bg-white border border-vip-gold/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold" />
                <Input
                  placeholder="Search staff members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
                />
              </div>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-vip-gold text-black hover:bg-vip-gold/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Staff Members */}
        <Card className="bg-white border border-vip-gold/20">
          <CardHeader className="border-b border-vip-gold/10">
            <CardTitle className="text-xl font-serif text-vip-black">Staff Members</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4 p-6">
              {filteredStaff.map((member) => (
                <div key={member.id} className="border border-vip-gold/20 rounded-lg p-4 hover:bg-vip-gold/5 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-vip-gold/20 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-vip-gold" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-vip-black">{member.full_name}</h3>
                          <p className="text-sm text-vip-gold">{member.role}</p>
                        </div>
                        {getStatusBadge(member.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-vip-black/60">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                      {member.notes && (
                        <p className="text-sm text-vip-black/60">{member.notes}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-vip-gold/30 text-vip-black hover:bg-vip-gold hover:text-black"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingStaff(member)}
                        className="border-red-300 text-red-600 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredStaff.length === 0 && (
                <div className="text-center text-vip-black/60 py-8">
                  {searchTerm ? 'No staff members match your search.' : 'No staff members yet.'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AddStaffModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onStaffAdded={handleStaffAdded}
      />
      <DeleteConfirmationModal
        open={!!deletingStaff}
        onOpenChange={(open) => !open && setDeletingStaff(null)}
        title="Remove Staff Member"
        description={`Are you sure you want to remove`}
        itemName={deletingStaff?.full_name || ''}
        onConfirm={() => deletingStaff && handleDeleteStaff(deletingStaff.id)}
      />
    </div>
  );
};

export default Staff;
