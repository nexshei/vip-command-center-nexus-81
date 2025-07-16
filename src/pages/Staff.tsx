
import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Phone, Mail, Calendar, Eye } from 'lucide-react';
import { useStaff, useDeleteStaff } from '@/hooks/useStaff';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AddStaffModal } from '@/components/modals/AddStaffModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedStaffName, setSelectedStaffName] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  
  const { data: staff = [], isLoading, error } = useStaff();
  const deleteStaffMutation = useDeleteStaff();
  const { toast } = useToast();

  const filteredStaff = staff.filter(member =>
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteStaff = async () => {
    if (!selectedStaffId) return;
    
    try {
      await deleteStaffMutation.mutateAsync(selectedStaffId);
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      });
      setShowDeleteModal(false);
      setSelectedStaffId(null);
      setSelectedStaffName('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
    }
  };

  const handleEditStaff = (member: any) => {
    setEditingStaff(member);
    setIsAddModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            <p className="text-red-600">Error loading staff: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-vip-gold">Staff Members</h1>
            <p className="text-vip-gold/60 mt-1">Manage your team and personnel</p>
          </div>
          <Button
            onClick={() => {
            setEditingStaff(null);
            setIsAddModalOpen(true);
          }}
          className="bg-vip-gold hover:bg-vip-gold/80 text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStaff.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No staff members found</p>
              <Button
                onClick={() => {
                  setEditingStaff(null);
                  setIsAddModalOpen(true);
                }}
                className="mt-4 bg-vip-gold hover:bg-vip-gold/80 text-black"
              >
                Add Your First Staff Member
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Hire Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={member.profile_image_url || ''} />
                          <AvatarFallback>
                            {member.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.full_name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{member.position}</p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {member.email}
                        </p>
                        {member.phone && (
                          <p className="text-sm flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {member.phone}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{member.department || 'N/A'}</TableCell>
                    <TableCell>
                      {member.hire_date ? (
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(member.hire_date).toLocaleDateString()}
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(member.status || 'active')}>
                        {member.status || 'Active'}
                      </Badge>
                    </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                window.open(`mailto:${member.email}`, '_blank');
                              }}
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditStaff(member)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditStaff(member)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedStaffId(member.id);
                                setSelectedStaffName(member.full_name);
                                setShowDeleteModal(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
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

      <AddStaffModal 
        open={isAddModalOpen} 
        onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if (!open) setEditingStaff(null);
        }}
        editingStaff={editingStaff}
      />

      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteStaff}
        title="Delete Staff Member"
        description="Are you sure you want to delete this staff member? This action cannot be undone."
        itemName={selectedStaffName}
      />
      </div>
    </div>
  );
};

export default Staff;
