
import React, { useState } from 'react';
import { useRealtimeQuery } from '@/hooks/useRealtimeQuery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AddClientModal } from '@/components/modals/AddClientModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Search, Mail, Phone, Building, Trash2 } from 'lucide-react';

const Clients = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const { data: clients, isLoading, error, refetch } = useRealtimeQuery('clients', {
    orderBy: 'created_at',
  });

  const filteredClients = clients?.filter((client: any) =>
    client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientToDelete.id);

      if (error) throw error;

      toast({
        title: "Client Deleted",
        description: `${clientToDelete.full_name} has been removed from the database.`,
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openDeleteModal = (client: any) => {
    setClientToDelete(client);
    setDeleteModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-black min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-vip-gold">VVIP Clients</h1>
            <p className="text-vip-gold/70 mt-1">Manage your exclusive client database</p>
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

      {isLoading && (
        <Card className="bg-black border-vip-gold/30">
          <CardContent className="p-8 text-center">
            <div className="text-vip-gold/70">Loading clients...</div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="bg-black border-red-500/30">
          <CardContent className="p-8 text-center">
            <div className="text-red-400">Error loading clients: {error.message}</div>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client: any) => (
            <Card key={client.id} className="bg-black border-vip-gold/30 hover:border-vip-gold/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-vip-gold/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-vip-gold" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-vip-gold">{client.full_name}</CardTitle>
                      {client.company && (
                        <p className="text-sm text-vip-gold/70">{client.company}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteModal(client)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {client.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-vip-gold/60" />
                    <span className="text-vip-gold/80">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-vip-gold/60" />
                    <span className="text-vip-gold/80">{client.phone}</span>
                  </div>
                )}
                {client.company && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Building className="h-4 w-4 text-vip-gold/60" />
                    <span className="text-vip-gold/80">{client.company}</span>
                  </div>
                )}
                {client.notes && (
                  <div className="text-sm text-vip-gold/70 mt-2 p-2 bg-vip-gold/5 rounded">
                    {client.notes}
                  </div>
                )}
                <div className="text-xs text-vip-gold/50 pt-2 border-t border-vip-gold/20">
                  Added: {new Date(client.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredClients.length === 0 && !isLoading && (
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
      )}

      <AddClientModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={() => {
          refetch();
          setIsAddModalOpen(false);
        }}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Client"
        description="Are you sure you want to delete"
        itemName={clientToDelete?.full_name || ''}
        onConfirm={handleDeleteClient}
      />
    </div>
  );
};

export default Clients;
