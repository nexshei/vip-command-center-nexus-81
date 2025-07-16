
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Calendar, 
  Users, 
  Mail, 
  FileText, 
  Download, 
  Zap
} from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasAccess } = useAuth();
  
  const actions = [
    {
      title: "New Booking",
      description: "Create VVIP appointment",
      icon: Plus,
      action: () => navigate('/create-booking'),
      primary: true,
      allowedRoles: ['super_admin', 'protocol_admin', 'admin']
    },
    {
      title: "View Calendar",
      description: "Check schedule",
      icon: Calendar,
      action: () => navigate('/bookings'),
      primary: false,
      allowedRoles: ['super_admin', 'protocol_admin', 'admin']
    },
    {
      title: "Manage Clients",
      description: "Client directory",
      icon: Users,
      action: () => navigate('/clients'),
      primary: false,
      allowedRoles: ['super_admin', 'protocol_admin', 'admin']
    },
    {
      title: "Send Message",
      description: "Communication",
      icon: Mail,
      action: () => navigate('/email'),
      primary: false,
      allowedRoles: ['super_admin', 'admin'] // Removed protocol_admin access
    },
    {
      title: "Generate Quote",
      description: "Create estimate",
      icon: FileText,
      action: () => navigate('/generate-quote'),
      primary: false,
      allowedRoles: ['super_admin', 'protocol_admin', 'admin']
    },
    {
      title: "Export Data",
      description: "Download reports",
      icon: Download,
      action: async () => {
        if (!hasAccess(['super_admin', 'admin'])) {
          toast({
            title: "Access Restricted",
            description: "You don't have permission to export data.",
            variant: "destructive"
          });
          return;
        }
        
        try {
          // Fetch real data from various tables for export
          const [clients, contactSubmissions, meetingRequests, vvipRequests, applications] = await Promise.all([
            supabase.from('clients').select('*'),
            supabase.from('contact_submissions').select('*'),
            supabase.from('meeting_requests').select('*'),
            supabase.from('vvip_service_requests').select('*'),
            supabase.from('career_applications').select('*')
          ]);

          // Create comprehensive CSV data
          const currentDate = new Date().toISOString().split('T')[0];
          const csvContent = `data:text/csv;charset=utf-8,Report Type,Total Count,Status Breakdown,Date Generated
Clients,${clients.data?.length || 0},"Active: ${clients.data?.filter(c => c.status === 'active').length || 0}",${currentDate}
Contact Submissions,${contactSubmissions.data?.length || 0},"Pending: ${contactSubmissions.data?.filter(s => s.status === 'pending').length || 0} | Resolved: ${contactSubmissions.data?.filter(s => s.status === 'resolved').length || 0}",${currentDate}
Meeting Requests,${meetingRequests.data?.length || 0},"Pending: ${meetingRequests.data?.filter(m => m.status === 'pending').length || 0} | Approved: ${meetingRequests.data?.filter(m => m.status === 'approved').length || 0}",${currentDate}
VVIP Service Requests,${vvipRequests.data?.length || 0},"Pending: ${vvipRequests.data?.filter(v => v.status === 'pending').length || 0} | In Progress: ${vvipRequests.data?.filter(v => v.status === 'in_progress').length || 0}",${currentDate}
Career Applications,${applications.data?.length || 0},"Pending: ${applications.data?.filter(a => a.status === 'pending').length || 0} | Approved: ${applications.data?.filter(a => a.status === 'approved').length || 0}",${currentDate}`;

          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", `vvip_comprehensive_report_${currentDate}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast({
            title: "Export Complete",
            description: "Comprehensive report downloaded successfully.",
          });
        } catch (error) {
          toast({
            title: "Export Failed",
            description: "Failed to generate report. Please try again.",
            variant: "destructive"
          });
        }
      },
      primary: false,
      allowedRoles: ['super_admin', 'admin'] // No data export for protocol admin
    }
  ];

  // Filter actions based on user role
  const filteredActions = actions.filter(action => hasAccess(action.allowedRoles));

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-gray-900 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-vip-gold" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredActions.map((action, index) => (
            <Button
              key={action.title}
              onClick={action.action}
              variant={action.primary ? "default" : "outline"}
              className={`h-auto p-4 flex flex-col items-start space-y-2 transition-all duration-200 ${
                action.primary 
                  ? 'bg-vip-gold text-black hover:bg-vip-gold-light' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2 w-full">
                <action.icon className="h-4 w-4" />
                <span className="font-medium text-sm">{action.title}</span>
              </div>
              <span className="text-xs opacity-70 text-left w-full">{action.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
