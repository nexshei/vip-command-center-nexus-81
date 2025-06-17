
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
import { Home, Calendar, FileText, Users, Settings, Plus, Package, Mail, UserCheck, MessageSquare, List } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";

export const VipSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      description: 'Overview of all VIP services'
    },
    {
      name: 'Create Booking',
      icon: Plus,
      path: '/create-booking',
      description: 'Schedule new VVIP events'
    },
    {
      name: 'List Bookings',
      icon: List,
      path: '/list-bookings',
      description: 'View all bookings from admin dashboard'
    },
    {
      name: 'Bookings & Quotes',
      icon: Calendar,
      path: '/bookings',
      description: 'View and manage all bookings'
    },
    {
      name: 'Generate Quote',
      icon: FileText,
      path: '/generate-quote',
      description: 'Create custom service quotes'
    },
    {
      name: 'Clients',
      icon: Users,
      path: '/clients',
      description: 'Manage VVIP client database'
    },
    {
      name: 'Contact Messages',
      icon: MessageSquare,
      path: '/contact-submissions',
      description: 'View contact form submissions'
    },
    {
      name: 'Inventory',
      icon: Package,
      path: '/inventory',
      description: 'Track protocol equipment'
    },
    {
      name: 'Email',
      icon: Mail,
      path: '/email',
      description: 'Send and track communications'
    },
    {
      name: 'VVIP Subscribers',
      icon: UserCheck,
      path: '/subscribers',
      description: 'Manage subscription members'
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/settings',
      description: 'Configure system settings'
    },
  ];

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
              {navigationItems.map((item) => (
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
