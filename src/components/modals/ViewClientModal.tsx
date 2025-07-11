import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Building, FileText, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

interface Client {
  id: string;
  full_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  client_type: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ViewClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}

export const ViewClientModal = ({ open, onOpenChange, client }: ViewClientModalProps) => {
  if (!client) return null;

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClientTypeBadgeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'individual': return 'bg-blue-100 text-blue-800';
      case 'corporate': return 'bg-purple-100 text-purple-800';
      case 'vip': return 'bg-yellow-100 text-yellow-800';
      case 'government': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Client Details - {client.full_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Full Name</p>
                <p className="text-sm text-gray-700">{client.full_name}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  Email Address
                </p>
                <p className="text-sm text-gray-700">{client.email}</p>
              </div>
              
              {client.phone && (
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Phone Number
                  </p>
                  <p className="text-sm text-gray-700">{client.phone}</p>
                </div>
              )}

              {client.company && (
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    Company
                  </p>
                  <p className="text-sm text-gray-700">{client.company}</p>
                </div>
              )}

              {client.address && (
                <div className="space-y-2 md:col-span-2">
                  <p className="text-sm font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Address
                  </p>
                  <p className="text-sm text-gray-700">{client.address}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Client Classification */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold border-b pb-2">Client Classification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Client Type</p>
                <Badge className={getClientTypeBadgeColor(client.client_type || 'individual')}>
                  {(client.client_type || 'individual').charAt(0).toUpperCase() + (client.client_type || 'individual').slice(1)}
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Status</p>
                <Badge className={getStatusBadgeColor(client.status)}>
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Notes */}
          {client.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold border-b pb-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Notes
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{client.notes}</p>
                </div>
              </div>
            </>
          )}

          {/* Timeline */}
          <Separator />
          <div className="space-y-3">
            <h3 className="text-lg font-semibold border-b pb-2 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Client Since</p>
                <p className="text-sm text-gray-700">
                  {format(new Date(client.created_at), 'EEEE, MMMM dd, yyyy')}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(client.created_at), 'HH:mm')}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-gray-700">
                  {format(new Date(client.updated_at), 'EEEE, MMMM dd, yyyy')}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(client.updated_at), 'HH:mm')}
                </p>
              </div>
            </div>
          </div>

          {/* Client ID */}
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium">Client ID</p>
            <p className="text-xs font-mono text-gray-500 bg-gray-100 p-2 rounded border">
              {client.id}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};