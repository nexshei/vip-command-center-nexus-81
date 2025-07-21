
import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Phone, Mail, MapPin, Eye, RefreshCw } from 'lucide-react';
import { useClients, useDeleteClient, Client } from '@/hooks/useClients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AddClientModal } from '@/components/modals/AddClientModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { ClientEmailComposer } from '@/components/email/ClientEmailComposer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ViewClientModal } from '@/components/modals/ViewClientModal';
import { EditClientModal } from '@/components/modals/EditClientModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedClientName, setSelectedClientName] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [clientToEmail, setClientToEmail] = useState<Client | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const { data: clients = [], isLoading, error, refetch } = useClients();
  const deleteClientMutation = useDeleteClient();
  const { toast } = useToast();

  const filteredClients = clients.filter(client =>
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClient = async () => {
    if (!selectedClientId) return;
    
    try {
      await deleteClientMutation.mutateAsync(selectedClientId);
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
      setShowDeleteModal(false);
      setSelectedClientId(null);
      setSelectedClientName('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
    }
  };

  const handleEmailClient = (client: Client) => {
    setClientToEmail(client);
    setEmailDialogOpen(true);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setViewModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setEditModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
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
            <p className="text-red-600">Error loading clients: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-vip-gold">Client Management</h1>
            <p className="text-vip-gold/60 mt-2">Exceptional management of your exclusive VIP client relationships</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10">
              <Plus className="h-3 w-3 mr-1" />
              {filteredClients.length} Total Clients
            </Badge>
            <Button
              onClick={() => {
                refetch();
                toast({
                  title: "Refreshed",
                  description: "Client data has been refreshed successfully.",
                });
              }}
              variant="outline"
              size="sm"
              className="text-vip-gold border-vip-gold/30 hover:bg-vip-gold/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              variant="outline"
              size="sm"
              className="text-vip-gold border-vip-gold/30 hover:bg-vip-gold/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>

      {/* Filters */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-gray-300">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search clients by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <Button variant="outline" className="bg-vip-gold/20 border-vip-gold/50 text-vip-gold hover:bg-vip-gold/30 focus:ring-2 focus:ring-vip-gold/50">
              <Filter className="w-4 h-4 mr-2 text-vip-gold" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Clients Table */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-300">Client Records</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No clients found matching your criteria.</p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                variant="outline"
                className="mt-4 text-vip-gold border-vip-gold/30 hover:bg-vip-gold/10"
              >
                Add Your First Client
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-400">Name</TableHead>
                  <TableHead className="text-gray-400">Contact</TableHead>
                  <TableHead className="text-gray-400">Company</TableHead>
                  <TableHead className="text-gray-400">Type</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{client.full_name}</p>
                        {client.address && (
                          <p className="text-sm text-gray-300 flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {client.address}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-300 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {client.email}
                        </p>
                        {client.phone && (
                          <p className="text-sm text-gray-300 flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {client.phone}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{client.company || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {client.client_type || 'Individual'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewClient(client)}
                          className="text-vip-gold hover:bg-vip-gold/10"
                          title="View Client"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEmailClient(client)}
                          className="text-vip-gold hover:bg-vip-gold/10"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditClient(client)}
                          className="text-vip-gold hover:bg-vip-gold/10"
                          title="Edit Client"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedClientId(client.id);
                            setSelectedClientName(client.full_name);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:bg-red-50"
                          title="Delete Client"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddClientModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />

      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteClient}
        title="Delete Client"
        description="Are you sure you want to delete this client? This action cannot be undone."
        itemName={selectedClientName}
      />

      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-2xl bg-black border-vip-gold/30">
          <DialogHeader>
            <DialogTitle className="text-vip-gold">
              Send Email to {clientToEmail?.full_name}
            </DialogTitle>
          </DialogHeader>
          {clientToEmail && (
            <ClientEmailComposer
              selectedClient={clientToEmail}
              onEmailSent={() => setEmailDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Client Modal */}
      <ViewClientModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        client={selectedClient}
      />

      {/* Edit Client Modal */}
      <EditClientModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        client={selectedClient}
      />
      </div>
    </div>
  );
};

export default Clients;
