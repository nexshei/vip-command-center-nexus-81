
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Calendar, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DataExportCard = () => {
  const { toast } = useToast();

  // Mock data for export functionality
  const exportData = {
    bookings: [
      { id: 1, client: 'Ambassador Johnson', service: 'Diplomatic Meeting', date: '2024-01-15' },
      { id: 2, client: 'Minister Chen', service: 'State Reception', date: '2024-01-16' }
    ],
    clients: [
      { id: 1, name: 'Ambassador Johnson', email: 'amb.johnson@embassy.com' },
      { id: 2, name: 'Minister Chen', email: 'minister.chen@gov.example' }
    ],
    reports: [
      { id: 1, title: 'Monthly Summary', type: 'summary', date: '2024-01-31' }
    ]
  };

  const handleExport = (type: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    let csvContent = '';
    let filename = '';

    switch (type) {
      case 'bookings':
        csvContent = 'ID,Client,Service,Date\n' + 
          exportData.bookings.map(b => `${b.id},${b.client},${b.service},${b.date}`).join('\n');
        filename = `bookings_${timestamp}.csv`;
        break;
      case 'clients':
        csvContent = 'ID,Name,Email\n' + 
          exportData.clients.map(c => `${c.id},${c.name},${c.email}`).join('\n');
        filename = `clients_${timestamp}.csv`;
        break;
      case 'reports':
        csvContent = 'ID,Title,Type,Date\n' + 
          exportData.reports.map(r => `${r.id},${r.title},${r.type},${r.date}`).join('\n');
        filename = `reports_${timestamp}.csv`;
        break;
      default:
        toast({
          title: "Export Error",
          description: "Unknown export type",
          variant: "destructive"
        });
        return;
    }

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} data exported successfully`,
    });
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 flex items-center">
          <Download className="h-5 w-5 mr-2 text-blue-600" />
          Data Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <Button
            variant="outline"
            onClick={() => handleExport('bookings')}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-600" />
              Export Bookings
            </div>
            <FileText className="h-4 w-4 text-gray-400" />
          </Button>

          <Button
            variant="outline"
            onClick={() => handleExport('clients')}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-green-600" />
              Export Clients
            </div>
            <FileText className="h-4 w-4 text-gray-400" />
          </Button>

          <Button
            variant="outline"
            onClick={() => handleExport('reports')}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-purple-600" />
              Export Reports
            </div>
            <FileText className="h-4 w-4 text-gray-400" />
          </Button>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <p>Data will be exported as CSV files. All exports include timestamp.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataExportCard;
