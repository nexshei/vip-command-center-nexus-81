
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
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
  
  const superAdminActions = [
    {
      title: "Create VIP Booking",
      description: "Schedule new protocol service",
      icon: Plus,
      action: () => console.log('Create booking'),
      className: "vip-gold-gradient hover:opacity-90 text-white"
    },
    {
      title: "Export Analytics",
      description: "Download monthly reports",
      icon: Download,
      action: () => console.log('Export analytics'),
      className: "bg-vip-navy hover:bg-vip-navy/90 text-white"
    },
    {
      title: "System Health",
      description: "Monitor platform status",
      icon: BarChart3,
      action: () => console.log('System health'),
      className: "bg-vip-copper hover:bg-vip-copper/90 text-white"
    },
    {
      title: "Global Settings",
      description: "Configure system parameters",
      icon: Settings,
      action: () => console.log('Settings'),
      className: "border-2 border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-white"
    }
  ];

  const protocolAdminActions = [
    {
      title: "New Booking",
      description: "Create VIP appointment",
      icon: Calendar,
      action: () => console.log('New booking'),
      className: "vip-gold-gradient hover:opacity-90 text-white"
    },
    {
      title: "Client Check-in",
      description: "Process arrival protocols",
      icon: Users,
      action: () => console.log('Check-in'),
      className: "bg-vip-navy hover:bg-vip-navy/90 text-white"
    },
    {
      title: "Send Communication",
      description: "Email/SMS to clients",
      icon: Mail,
      action: () => console.log('Send message'),
      className: "bg-vip-copper hover:bg-vip-copper/90 text-white"
    },
    {
      title: "Generate Report",
      description: "Create service summary",
      icon: FileText,
      action: () => console.log('Generate report'),
      className: "border-2 border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-white"
    }
  ];

  const actions = user?.role === 'super_admin' ? superAdminActions : protocolAdminActions;

  return (
    <Card className="border-0 vip-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-vip-navy flex items-center">
          <Zap className="h-5 w-5 mr-2 text-vip-gold" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {actions.map((action, index) => (
            <Button
              key={action.title}
              onClick={action.action}
              className={`${action.className} h-auto p-4 flex flex-col items-start space-y-2 transition-all duration-300 vip-hover-lift animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-2 w-full">
                <action.icon className="h-5 w-5" />
                <span className="font-semibold">{action.title}</span>
              </div>
              <span className="text-sm opacity-90 text-left">{action.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
