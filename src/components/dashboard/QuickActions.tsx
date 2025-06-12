
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  Users, 
  Mail, 
  FileText, 
  Download, 
  Settings,
  Crown,
  Zap,
  BarChart3
} from 'lucide-react';

const QuickActions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const superAdminActions = [
    {
      title: "Create VIP Booking",
      description: "Schedule new protocol service",
      icon: Plus,
      action: () => navigate('/bookings'),
      className: "bg-vip-gold hover:bg-vip-gold-light text-black font-semibold vip-glow"
    },
    {
      title: "Export Analytics",
      description: "Download monthly reports",
      icon: Download,
      action: () => {
        // Create a mock CSV download
        const csvContent = "data:text/csv;charset=utf-8,Date,Revenue,Bookings,Clients\n2024-01,KSH 8900000,24,156\n2024-02,KSH 9200000,28,162";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "vip_analytics.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      className: "bg-ios-blue hover:bg-ios-blue/90 text-white vip-glass"
    },
    {
      title: "System Health",
      description: "Monitor platform status",
      icon: BarChart3,
      action: () => navigate('/analytics'),
      className: "bg-ios-orange hover:bg-ios-orange/90 text-white vip-glass"
    },
    {
      title: "Global Settings",
      description: "Configure system parameters",
      icon: Settings,
      action: () => navigate('/settings'),
      className: "border-2 border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-black vip-glass"
    }
  ];

  const protocolAdminActions = [
    {
      title: "New Booking",
      description: "Create VIP appointment",
      icon: Calendar,
      action: () => navigate('/bookings'),
      className: "bg-vip-gold hover:bg-vip-gold-light text-black font-semibold vip-glow"
    },
    {
      title: "Client Check-in",
      description: "Process arrival protocols",
      icon: Users,
      action: () => navigate('/clients'),
      className: "bg-ios-green hover:bg-ios-green/90 text-black vip-glass"
    },
    {
      title: "Send Communication",
      description: "Email/SMS to clients",
      icon: Mail,
      action: () => navigate('/communications'),
      className: "bg-ios-purple hover:bg-ios-purple/90 text-white vip-glass"
    },
    {
      title: "Generate Report",
      description: "Create service summary",
      icon: FileText,
      action: () => {
        // Generate a mock PDF report
        const reportContent = `
          Sir Ole VVIP Protocol Report
          Generated: ${new Date().toLocaleDateString()}
          
          Summary:
          - Active Bookings: 24
          - Revenue: KSH 8,900,000
          - Client Satisfaction: 4.9/5
          - Protocols Completed: 156
        `;
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'vip_protocol_report.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      className: "border-2 border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-black vip-glass"
    }
  ];

  const actions = user?.role === 'super_admin' ? superAdminActions : protocolAdminActions;

  return (
    <Card className="border-vip-gold/20 vip-glass-dark vip-glow">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-vip-gold flex items-center">
          <Zap className="h-5 w-5 mr-2 text-vip-gold animate-pulse-gold" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {actions.map((action, index) => (
            <Button
              key={action.title}
              onClick={action.action}
              className={`${action.className} h-auto p-6 flex flex-col items-start space-y-3 transition-all duration-300 vip-hover-lift animate-fade-in-up group`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="p-2 rounded-lg bg-black/20 group-hover:bg-black/30 transition-colors">
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="font-semibold text-left">{action.title}</span>
              </div>
              <span className="text-sm opacity-80 text-left w-full">{action.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
