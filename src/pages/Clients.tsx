
import React, { useState } from 'react';
import { Users, Plus, Search, Phone, Mail as MailIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AddClientModal } from '@/components/modals/AddClientModal';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeQuery } from "@/hooks/useRealtimeQuery";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Fetch live data from Supabase "clients" table
  const { data: clients, isLoading, error } = useRealtimeQuery("clients", { orderBy: "created_at" });

  const filteredClients = (clients || []).filter((client: any) => 
    (client.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClientClick = (client: any) => {
    console.log('Opening client details:', client);
    toast({
      title: "Opening Client Profile",
      description: `Loading profile for ${client.full_name}`,
    });
  };

  const handleStatsCardClick = (cardType: string) => {
    console.log('Stats card clicked:', cardType);
    toast({
      title: "Loading Details",
      description: `Opening ${cardType} details...`,
    });
  };

  const handleContactClient = (client: any, method: 'email' | 'phone') => {
    console.log(`Contacting ${client.full_name} via ${method}`);
    toast({
      title: `Contacting ${client.full_name}`,
      description: `Opening ${method} application...`,
    });
  };

  // Calculate counts for stats cards using live data
  const totalClients = (clients || []).length;
  // Identify tiers based on client notes or company (adjust logic if needed)
  const vipTierCount = (clients || []).filter((client: any) =>
    (client.notes || '').toLowerCase().includes('vip') ||
    (client.company || '').toLowerCase().includes('vip')
  ).length;
  const premiumTierCount = (clients || []).filter((client: any) =>
    (client.notes || '').toLowerCase().includes('premium') ||
    (client.company || '').toLowerCase().includes('premium')
  ).length;
  // For "Active This Month" - just demo, could filter by created_at or add last_activity logic
  const activeThisMonth = (clients || []).filter((client: any) => {
    if (!client.created_at) return false;
    const created = new Date(client.created_at);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const getTierColor = (tier: string) => {
    if (!tier) return 'bg-gray-500 text-white';
    const t = tier.toLowerCase();
    if (t.includes('vip')) return 'bg-vip-gold text-black';
    if (t.includes('premium')) return 'bg-ios-purple text-white';
    return 'bg-gray-500 text-white';
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">Client Management</h1>
          <p className="text-vip-gold/80 mt-2">VIP client profiles and relationship management</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 border-vip-gold/30 focus:border-vip-gold bg-white/80 text-vip-black placeholder:text-vip-gold/50"
            />
          </div>
          <AddClientModal />
        </div>
      </div>

      {/* Client Statistics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card 
          className="vip-glass border-vip-gold/20 cursor-pointer hover:bg-vip-gold/5 transition-colors"
          onClick={() => handleStatsCardClick("Total Clients")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{totalClients}</div>
            <p className="text-xs text-ios-green">+23 this month</p>
          </CardContent>
        </Card>
        <Card 
          className="vip-glass border-vip-gold/20 cursor-pointer hover:bg-vip-gold/5 transition-colors"
          onClick={() => handleStatsCardClick("VIP Tier")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">VIP Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{vipTierCount + premiumTierCount}</div>
            <p className="text-xs text-vip-gold/60">Premium clients</p>
          </CardContent>
        </Card>
        <Card 
          className="vip-glass border-vip-gold/20 cursor-pointer hover:bg-vip-gold/5 transition-colors"
          onClick={() => handleStatsCardClick("Active This Month")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-vip-gold/80">Active This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vip-black">{activeThisMonth}</div>
            <p className="text-xs text-vip-gold/60">Engaged clients</p>
          </CardContent>
        </Card>
      </div>

      {/* Client Directory */}
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-vip-black">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-vip-gold" />
              Client Directory ({filteredClients.length})
            </div>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline" 
              size="sm"
              className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
            >
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading && (
              <div className="text-center py-8">
                <p className="text-vip-gold/60">Loading clients...</p>
              </div>
            )}
            {error && (
              <div className="text-center py-8">
                <p className="text-vip-red">{error.message}</p>
              </div>
            )}
            {filteredClients.map((client: any) => (
              <div 
                key={client.id} 
                className="flex items-center justify-between p-4 border border-vip-gold/20 rounded-lg vip-glass-light hover:bg-vip-gold/5 transition-colors cursor-pointer"
                onClick={() => handleClientClick(client)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-vip-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-vip-gold font-semibold text-sm">
                      {(client.full_name || 'NA').split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-vip-black">{client.full_name || 'Unknown'}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(client.notes || client.company || '')}`}>
                        {/* Simple heuristic: notes/company may mention VIP/Premium */}
                        {(/vip/i.test(client.notes) || /vip/i.test(client.company)) ? 'VIP'
                          : /premium/i.test(client.notes) || /premium/i.test(client.company) ? 'Premium'
                          : 'Standard'}
                      </span>
                    </div>
                    <p className="text-sm text-vip-gold/80">{client.company || '-'}</p>
                    <div className="flex items-center space-x-4 text-xs text-vip-gold/60 mt-1">
                      <span className="flex items-center">
                        <MailIcon className="h-3 w-3 mr-1" />
                        {client.email || '-'}
                      </span>
                      <span className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {client.phone || '-'}
                      </span>
                      <span>Joined: {client.created_at ? new Date(client.created_at).toLocaleDateString() : '-'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContactClient(client, 'email');
                    }}
                    variant="outline"
                    size="sm"
                    className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                  >
                    <MailIcon className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContactClient(client, 'phone');
                    }}
                    variant="outline"
                    size="sm"
                    className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                  >
                    <Phone className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            {!isLoading && filteredClients.length === 0 && (
              <div className="text-center py-8">
                <p className="text-vip-gold/60">No clients found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
