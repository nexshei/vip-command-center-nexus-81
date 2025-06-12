
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Crown,
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  Briefcase,
  Settings,
  BarChart3,
  Shield,
  Bell,
  LogOut,
  Star,
  Mail,
  CreditCard,
  UserCheck,
  FileText,
  Zap
} from 'lucide-react';

const VipSidebar = () => {
  const { user, logout } = useAuth();

  const superAdminMenuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Bookings & Events",
      url: "/bookings",
      icon: Calendar,
    },
    {
      title: "Client Management",
      url: "/clients",
      icon: Users,
    },
    {
      title: "VIP Subscriptions",
      url: "/subscriptions",
      icon: CreditCard,
    },
    {
      title: "Career Portal",
      url: "/careers",
      icon: Briefcase,
    },
    {
      title: "Communications",
      url: "/communications",
      icon: MessageSquare,
    },
    {
      title: "Analytics & Reports",
      url: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Audit & Security",
      url: "/audit",
      icon: Shield,
    },
    {
      title: "System Settings",
      url: "/settings",
      icon: Settings,
    },
  ];

  const protocolAdminMenuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Bookings & Events",
      url: "/bookings",
      icon: Calendar,
    },
    {
      title: "Client Profiles",
      url: "/clients",
      icon: Users,
    },
    {
      title: "Protocol Services",
      url: "/services",
      icon: Star,
    },
    {
      title: "Communications",
      url: "/communications",
      icon: Mail,
    },
    {
      title: "Staff Management",
      url: "/staff",
      icon: UserCheck,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
    },
  ];

  const menuItems = user?.role === 'super_admin' ? superAdminMenuItems : protocolAdminMenuItems;

  return (
    <Sidebar className="border-r border-sidebar-border/20">
      <SidebarHeader className="p-6 border-b border-sidebar-border/20">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Crown className="h-8 w-8 text-sidebar-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-sidebar-accent rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-sidebar-foreground">Sir Ole VVIP</h2>
            <p className="text-xs text-sidebar-foreground/70">Protocol Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/80 font-medium mb-3">
            {user?.role === 'super_admin' ? 'Super Admin' : 'Protocol Admin'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 rounded-lg"
                  >
                    <a href={item.url} className="flex items-center space-x-3 p-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-sidebar-foreground/80 font-medium mb-3">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 rounded-lg">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 rounded-lg">
                  <Zap className="h-5 w-5" />
                  <span>Quick Book</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/20">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-sidebar-accent/10">
          <Avatar className="h-10 w-10 border-2 border-sidebar-primary">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground font-bold">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'VIP'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-sidebar-foreground/70 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={logout}
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/20 mt-2"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default VipSidebar;
