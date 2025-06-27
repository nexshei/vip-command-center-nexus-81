
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Search, Mail, Phone, Building, Edit, Trash2, User } from 'lucide-react';
import { AddClientModal } from '@/components/modals/AddClientModal';
import { EditItemModal } from '@/components/modals/EditItemModal';
import { useClients, useDeleteClient, type Client } from '@/hooks/useClients';
import { supabase } from '@/integrations/supabase/client';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const { data: clients = [], isLoading, error } = useClients();
  const deleteClientMutation = useDeleteClient();

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('clients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients'
        },
        (payload) => {
          console.log('Clients table changed:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredClients = clients.filter((client) =>
    client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClient = async (client: Client) => {
    try {
      await deleteClientMutation.mutateAsync(client.id);
      toast({
        title: "Client Deleted",
        description: `${client.full_name} has been removed from the client database.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client.",
        variant: "destructive"
      });
    }
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleClientUpdated = () => {
    setSelectedClient(null);
    setIsEditModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-vip-gold">Loading clients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-red-600">Error loading clients. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-black min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-vip-gold">Client Management</h1>
            <p className="text-vip-gold/70 mt-1">Manage your VVIP client database</p>
          </div>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-vip-gold text-black hover:bg-vip-gold/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-vip-gold/30 bg-black text-vip-gold"
            />
          </div>
          <Badge variant="outline" className="border-vip-gold/30 text-vip-gold">
            {filteredClients.length} Clients
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card key={client.id} className="bg-black border-vip-gold/30 hover:border-vip-gold/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-vip-gold/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-vip-gold" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-vip-gold">{client.full_name}</CardTitle>
                    {client.company && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Building className="h-3 w-3 text-vip-gold/60" />
                        <span className="text-sm text-vip-gold/70">{client.company}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClient(client)}
                    className="text-vip-gold hover:text-vip-gold-light hover:bg-vip-gold/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClient(client)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    disabled={deleteClientMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {client.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-vip-gold/60" />
                  <a 
                    href={`mailto:${client.email}`}
                    className="text-sm text-vip-gold/80 hover:text-vip-gold hover:underline"
                  >
                    {client.email}
                  </a>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-vip-gold/60" />
                  <span className="text-sm text-vip-gold/80">{client.phone}</span>
                </div>
              )}
              {client.notes && (
                <p className="text-sm text-vip-gold/70 line-clamp-2">{client.notes}</p>
              )}
              <div className="text-xs text-vip-gold/50 pt-2 border-t border-vip-gold/20">
                Added: {new Date(client.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredClients.length === 0 && (
          <div className="col-span-full">
            <Card className="bg-black border-vip-gold/30">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-vip-gold/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-vip-gold mb-2">No Clients Found</h3>
                <p className="text-vip-gold/70 mb-4">
                  {searchTerm ? 'No clients match your search criteria.' : 'Start building your VVIP client database.'}
                </p>
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-vip-gold text-black hover:bg-vip-gold/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Client
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddClientModal 
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onClientAdded={() => {}}
      />
      
      {selectedClient && (
        <EditItemModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          item={selectedClient}
          type="client"
          onItemUpdated={handleClientUpdated}
        />
      )}
    </div>
  );
};

export default Clients;
