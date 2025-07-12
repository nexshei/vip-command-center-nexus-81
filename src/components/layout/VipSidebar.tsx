
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Briefcase,
  Settings,
  BookOpen,
  Mail,
  BarChart3,
  Package,
  UserCheck,
  ClipboardList,
  ShoppingCart
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'All Bookings',
    url: '/all-bookings',
    icon: Calendar,
  },
  {
    title: 'Item Bookings',
    url: '/item-bookings',
    icon: ShoppingCart,
  },
  {
    title: 'Clients',
    url: '/clients',
    icon: Users,
  },
  {
    title: 'Staff Management',
    url: '/staff',
    icon: UserCheck,
  },
  {
    title: 'Contact Messages',
    url: '/contact-messages',
    icon: MessageSquare,
  },
  {
    title: 'Career Applications',
    url: '/careers',
    icon: Briefcase,
  },
  {
    title: 'Inventory',
    url: '/inventory',
    icon: Package,
  },
  {
    title: 'Email Center',
    url: '/email',
    icon: Mail,
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Subscribers',
    url: '/subscribers',
    icon: BookOpen,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export function VipSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r-0 bg-gradient-to-b from-black via-gray-900 to-black backdrop-blur-md shadow-2xl">
      <SidebarContent className="p-0">
        <SidebarGroup className="p-0">
          {/* Professional Header with Logo */}
          <div className="px-6 py-8 border-b border-vip-gold/20 bg-gradient-to-r from-vip-gold/5 to-transparent">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vip-gold to-vip-gold-dark flex items-center justify-center shadow-lg">
                <img 
                  src="/lovable-uploads/af24075c-d7ee-41bc-a3d3-d50d1b766753.png" 
                  alt="VVIP" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div>
                <SidebarGroupLabel className="text-vip-gold font-serif text-lg font-bold mb-0 p-0">
                  VVIP Dashboard
                </SidebarGroupLabel>
                <p className="text-vip-gold/60 text-xs font-medium">Protocol Management</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <SidebarGroupContent className="px-4 py-6">
            <SidebarMenu className="space-y-2">
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `group flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 ease-in-out relative overflow-hidden ${
                          isActive
                            ? 'bg-vip-gold/20 text-vip-gold font-semibold border border-vip-gold/30 shadow-sm'
                            : 'text-gray-300 hover:text-white hover:bg-gray-800/30 font-medium border border-transparent hover:border-gray-600/20'
                        }`
                      }
                    >
                      
                      {/* Icon with Enhanced Styling */}
                      <div className={`relative z-10 flex items-center justify-center w-5 h-5 ${isActive(item.url) ? 'text-vip-gold' : 'text-gray-400 group-hover:text-vip-gold'} transition-colors duration-300`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      
                      {/* Text with Better Typography */}
                      <span className={`relative z-10 font-medium text-sm tracking-wide ${isActive(item.url) ? 'text-vip-gold' : 'text-gray-300 group-hover:text-white'} transition-colors duration-300`}>
                        {item.title}
                      </span>
                      
                      {/* Active Indicator */}
                      {isActive(item.url) && (
                        <div className="absolute right-2 w-1 h-6 bg-vip-gold rounded-full shadow-sm" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>

          {/* Professional Footer */}
          <div className="mt-auto px-6 py-4 border-t border-vip-gold/20 bg-gradient-to-r from-transparent to-vip-gold/5">
            <div className="text-center">
              <p className="text-xs text-vip-gold/60 font-medium">Sir Dennis Olele</p>
              <p className="text-xs text-vip-gold/40">© 2025 VVIP Protocol</p>
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
