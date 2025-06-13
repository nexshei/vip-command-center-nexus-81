
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Crown,
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  Briefcase,
  BarChart3,
  Bell,
  LogOut,
  Star,
  Mail,
  CreditCard,
  UserCheck,
  FileText,
  Zap,
  Plus,
  Package,
  User
} from 'lucide-react';

const VipSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const superAdminMenuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Create Booking",
      url: "/create-booking",
      icon: Plus,
    },
    {
      title: "Generate Quote",
      url: "/generate-quote",
      icon: FileText,
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
      title: "Inventory",
      url: "/inventory", 
      icon: Package,
    },
    {
      title: "Staff",
      url: "/staff",
      icon: UserCheck,
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
      title: "Email",
      url: "/email",
      icon: Mail,
    },
    {
      title: "Analytics & Reports",
      url: "/analytics",
      icon: BarChart3,
    },
  ];

  const protocolAdminMenuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Create Booking",
      url: "/create-booking",
      icon: Plus,
    },
    {
      title: "Generate Quote",
      url: "/generate-quote",
      icon: FileText,
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
      title: "Inventory",
      url: "/inventory",
      icon: Package,
    },
    {
      title: "Staff",
      url: "/staff",
      icon: UserCheck,
    },
    {
      title: "Communications",
      url: "/communications",
      icon: Mail,
    },
    {
      title: "Analytics & Reports",
      url: "/analytics",
      icon: BarChart3,
    },
  ];

  const menuItems = user?.role === 'super_admin' ? superAdminMenuItems : protocolAdminMenuItems;

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  return (
    <Sidebar className="border-r border-vip-gold/20 vip-glass-dark">
      <SidebarHeader className="p-6 border-b border-vip-gold/20">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src="/lovable-uploads/af24075c-d7ee-41bc-a3d3-d50d1b766753.png" 
              alt="Sir Dennis Olele VVIP Protocol" 
              className="h-10 w-10 object-contain animate-pulse-gold"
            />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-vip-gold">Sir Dennis Olele</h2>
            <p className="text-xs text-vip-gold/70">VVIP Protocol Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-vip-gold/80 font-medium mb-3">
            {user?.role === 'super_admin' ? 'Super Admin' : 'Protocol Admin'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    className={`hover:bg-vip-gold/10 hover:text-vip-gold-light transition-all duration-200 rounded-lg ${
                      location.pathname === item.url ? 'bg-vip-gold/20 text-vip-gold' : 'text-vip-gold/80'
                    }`}
                    onClick={() => handleNavigation(item.url)}
                  >
                    <div className="flex items-center space-x-3 p-3 w-full">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-vip-gold/20">
        <div className="flex items-center space-x-3 p-3 rounded-lg vip-glass border border-vip-gold/20">
          <Avatar className="h-10 w-10 border-2 border-vip-gold">
            <AvatarFallback className="bg-vip-gold text-black font-bold">
              DO
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-vip-gold truncate">
              Sir Dennis Olele
            </p>
            <p className="text-xs text-vip-gold/70 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={logout}
          variant="ghost" 
          className="w-full justify-start text-vip-gold/80 hover:text-vip-gold hover:bg-vip-gold/10 mt-2"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default VipSidebar;
