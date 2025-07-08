import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import type { Application } from '@/hooks/useApplications';

interface ApplicationsListProps {
  applications: Application[];
  onDeleteApplication: (applicationId: string, applicationName: string) => void;
}

export const ApplicationsList = ({ applications, onDeleteApplication }: ApplicationsListProps) => {
  return (
    <Card className="vip-glass border-vip-gold/20">
      <CardHeader>
        <CardTitle className="flex items-center text-vip-black">
          <Users className="h-5 w-5 mr-2 text-vip-gold" />
          Career Applications ({applications.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="flex items-center justify-between p-4 border border-vip-gold/20 rounded-lg vip-glass-light hover:bg-vip-gold/5 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-vip-black">{application.full_name}</h3>
                  <Badge className={`${
                    application.status === 'approved' ? 'bg-ios-green text-white' :
                    application.status === 'pending' ? 'bg-ios-orange text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-vip-gold/80">
                  <span>{application.email}</span>
                  <span>•</span>
                  <span>{application.position || 'Position not specified'}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Applied {new Date(application.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-vip-gold/30 text-vip-gold hover:bg-vip-gold/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  onClick={() => onDeleteApplication(application.id, application.full_name)}
                  variant="outline" 
                  size="sm" 
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          
          {applications.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-vip-gold/40 mx-auto mb-4" />
              <p className="text-vip-gold/60">No applications found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};