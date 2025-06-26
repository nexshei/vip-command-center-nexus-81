
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
import { Home, Calendar, FileText, Users, Settings, Plus, Package, Mail, UserCheck, MessageSquare, List, Image, UserCog, Briefcase } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from "@/lib/utils";

export const VipSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission, user } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      permission: 'dashboard',
      description: 'Overview of all VIP services'
    },
    {
      name: 'Create Booking',
      icon: Plus,
      path: '/create-booking',
      permission: 'create-booking',
      description: 'Schedule new VVIP events'
    },
    {
      name: 'Events',
      icon: Calendar,
      path: '/bookings',
      permission: 'bookings',
      description: 'View and manage all events'
    },
    {
      name: 'List Bookings',
      icon: List,
      path: '/list-bookings',
      permission: 'list-bookings',
      description: 'View meeting requests from frontend'
    },
    {
      name: 'Generate Quote',
      icon: FileText,
      path: '/generate-quote',
      permission: 'generate-quote',
      description: 'Create custom service quotes'
    },
    {
      name: 'Clients',
      icon: Users,
      path: '/clients',
      permission: 'clients',
      description: 'Manage VVIP client database'
    },
    {
      name: 'Contact Messages',
      icon: MessageSquare,
      path: '/contact-submissions',
      permission: 'contact-messages',
      description: 'View contact form submissions'
    },
    {
      name: 'Inventory',
      icon: Package,
      path: '/inventory',
      permission: 'inventory',
      description: 'Track protocol equipment'
    },
    {
      name: 'Careers',
      icon: Briefcase,
      path: '/careers',
      permission: 'careers',
      description: 'Manage job postings and applications'
    },
    {
      name: 'Gallery',
      icon: Image,
      path: '/gallery',
      permission: 'gallery',
      description: 'Manage photo gallery'
    },
    {
      name: 'Staff',
      icon: UserCog,
      path: '/staff',
      permission: 'staff',
      description: 'Manage staff members'
    },
    {
      name: 'Email',
      icon: Mail,
      path: '/email',
      permission: 'email',
      description: 'Send and track communications'
    },
    {
      name: 'VVIP Subscribers',
      icon: UserCheck,
      path: '/subscribers',
      permission: 'subscribers',
      description: 'Manage subscription members'
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/settings',
      permission: 'settings',
      description: 'Configure system settings'
    },
  ];

  // Filter navigation items based on user permissions
  const allowedItems = navigationItems.filter(item => hasPermission(item.permission));

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
            <p className="text-xs text-vip-gold/70">
              {user?.role || 'User'} Access
            </p>
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
              {allowedItems.map((item) => (
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
