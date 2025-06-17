
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRealtimeQuery } from '@/hooks/useRealtimeQuery';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Database,
  Calendar,
  Users,
  MessageSquare
} from 'lucide-react';

const DataExportCard = () => {
  const { toast } = useToast();
  
  // Fetch all data for exports
  const { data: bookings } = useRealtimeQuery("bookings");
  const { data: clients } = useRealtimeQuery("clients");
  const { data: quotes } = useRealtimeQuery("quotes");
  const { data: contacts } = useRealtimeQuery("contact_submissions");
  const { data: staff } = useRealtimeQuery("staff");
  const { data: inventory } = useRealtimeQuery("inventory");

  const generateCSV = (data: any[], filename: string, headers: string[]) => {
    if (!data || data.length === 0) {
      toast({
        title: "No Data",
        description: `No ${filename} data available to export.`,
        variant: "destructive"
      });
      return;
    }

    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header.toLowerCase().replace(' ', '_')] || '';
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: `${filename} data exported successfully.`,
    });
  };

  const generateFullReport = () => {
    const reportData = {
      export_date: new Date().toISOString(),
      summary: {
        total_bookings: bookings?.length || 0,
        total_clients: clients?.length || 0,
        total_quotes: quotes?.length || 0,
        total_contacts: contacts?.length || 0,
        total_staff: staff?.length || 0,
        total_inventory: inventory?.length || 0
      },
      bookings: bookings || [],
      clients: clients || [],
      quotes: quotes || [],
      contact_submissions: contacts || [],
      staff: staff || [],
      inventory: inventory || []
    };

    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `vip_dashboard_full_report_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Full Report Downloaded",
      description: "Complete database export downloaded successfully.",
    });
  };

  const exportActions = [
    {
      title: "Bookings Report",
      description: "Export all booking records",
      icon: Calendar,
      action: () => generateCSV(
        bookings, 
        "bookings", 
        ["ID", "Client Name", "Service Type", "Scheduled At", "Status", "Created At"]
      ),
      count: bookings?.length || 0
    },
    {
      title: "Clients Database",
      description: "Export client directory",
      icon: Users,
      action: () => generateCSV(
        clients, 
        "clients", 
        ["ID", "Full Name", "Email", "Phone", "Company", "Created At"]
      ),
      count: clients?.length || 0
    },
    {
      title: "Quotes Report",
      description: "Export all quotations",
      icon: FileText,
      action: () => generateCSV(
        quotes, 
        "quotes", 
        ["ID", "Requester Name", "Requested Service", "Amount", "Status", "Created At"]
      ),
      count: quotes?.length || 0
    },
    {
      title: "Contact Messages",
      description: "Export contact submissions",
      icon: MessageSquare,
      action: () => generateCSV(
        contacts, 
        "contact_submissions", 
        ["ID", "Name", "Email", "Subject", "Message", "Created At"]
      ),
      count: contacts?.length || 0
    }
  ];

  return (
    <Card className="bg-white border border-vip-gold/20 shadow-sm">
      <CardHeader className="border-b border-vip-gold/10">
        <CardTitle className="flex items-center text-vip-black">
          <Database className="h-5 w-5 mr-2 text-vip-gold" />
          Data Export & Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {exportActions.map((action) => (
            <Button
              key={action.title}
              onClick={action.action}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2 border-vip-gold/30 text-vip-black hover:bg-vip-gold/10"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <action.icon className="h-4 w-4 text-vip-gold" />
                  <span className="font-medium text-sm">{action.title}</span>
                </div>
                <span className="text-xs bg-vip-gold/20 text-vip-black px-2 py-1 rounded">
                  {action.count}
                </span>
              </div>
              <span className="text-xs opacity-70 text-left w-full">{action.description}</span>
            </Button>
          ))}
        </div>
        
        <div className="pt-4 border-t border-vip-gold/10">
          <Button
            onClick={generateFullReport}
            className="w-full bg-vip-gold text-white hover:bg-vip-gold-dark"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Download Complete Database Report
          </Button>
          <p className="text-xs text-vip-gold/60 mt-2 text-center">
            Includes all tables and data in JSON format
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataExportCard;
