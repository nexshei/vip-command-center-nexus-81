
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader
} from "@/components/ui/sidebar";
import { Home, Calendar, FileText, Users, Plus, Package, Mail, MessageSquare, List, Briefcase, UserCheck } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';

export const VipSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasAccess } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      description: 'Overview of all VIP services',
      allowedRoles: ['super_admin', 'protocol_admin', 'admin', 'user']
    },
    {
      name: 'Create Booking',
      icon: Plus,
      path: '/create-booking',
      description: 'Schedule new VVIP events',
      allowedRoles: ['super_admin', 'protocol_admin', 'admin']
    },
    {
      name: 'Events',
      icon: Calendar,
      path: '/bookings',
      description: 'View and manage all events',
      allowedRoles: ['super_admin', 'protocol_admin', 'admin']
    },
    {
      name: 'List Bookings',
      icon: List,
      path: '/list-bookings',
      description: 'View meeting requests from frontend',
      allowedRoles: ['super_admin', 'protocol_admin', 'admin']
    },
    {
      name: 'Generate Quote',
      icon: FileText,
      path: '/generate-quote',
      description: 'Create custom service quotes',
      allowedRoles: ['super_admin', 'protocol_admin', 'admin']
    },
    {
      name: 'Clients',
      icon: Users,
      path: '/clients',
      description: 'Manage VVIP client database',
      allowedRoles: ['super_admin', 'protocol_admin', 'admin']
    },
    {
      name: 'Contact Messages',
      icon: MessageSquare,
      path: '/contact-submissions',
      description: 'View contact form submissions',
      allowedRoles: ['super_admin', 'protocol_admin', 'admin']
    },
    {
      name: 'Subscribers',
      icon: UserCheck,
      path: '/subscribers',
      description: 'Manage newsletter subscribers',
      allowedRoles: ['super_admin', 'protocol_admin', 'admin']
    },
    {
      name: 'Inventory',
      icon: Package,
      path: '/inventory',
      description: 'Track protocol equipment',
      allowedRoles: ['super_admin', 'protocol_admin', 'admin']
    },
    {
      name: 'Careers',
      icon: Briefcase,
      path: '/careers',
      description: 'Manage job postings and applications',
      allowedRoles: ['super_admin', 'protocol_admin', 'admin']
    },
    {
      name: 'Staff',
      icon: Users,
      path: '/staff',
      description: 'View staff members',
      allowedRoles: ['super_admin', 'admin']
    },
    {
      name: 'Email',
      icon: Mail,
      path: '/email',
      description: 'Send communications',
      allowedRoles: ['super_admin', 'admin']
    }
  ];

  // Filter navigation items based on user role
  const filteredItems = navigationItems.filter(item => 
    hasAccess(item.allowedRoles)
  );

  return (
    <Sidebar className="border-r border-vip-gold/30 bg-black">
      <SidebarHeader className="p-4 border-b border-vip-gold/30">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/af24075c-d7ee-41bc-a3d3-d50d1b766753.png" 
            alt="Sir Dennis Olele VVIP Protocol" 
            className="h-8 w-8 object-contain"
          />
          <div>
            <h2 className="text-lg font-serif font-bold text-vip-gold">VVIP Panel</h2>
            <p className="text-xs text-vip-gold/70">Manage exclusive services</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-black">
        <SidebarGroup>
          <SidebarGroupLabel className="text-vip-gold/80 font-medium">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild
                    className={cn(
                      "w-full text-vip-gold/80 hover:text-vip-gold hover:bg-vip-gold/10 transition-colors",
                      location.pathname === item.path && "bg-vip-gold/20 text-vip-gold font-medium"
                    )}
                  >
                    <button
                      onClick={() => navigate(item.path)}
                      className="flex items-center space-x-3 w-full text-left"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
