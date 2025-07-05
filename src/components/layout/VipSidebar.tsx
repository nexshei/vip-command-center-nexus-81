
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
    <Sidebar className="border-r border-vip-gold/30 bg-black/95 backdrop-blur-md">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-vip-gold font-serif text-lg px-4 py-6">
            VVIP Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-white text-black font-semibold shadow-lg border border-vip-gold/30'
                            : 'bg-white/90 text-black hover:bg-white hover:shadow-md border border-transparent hover:border-vip-gold/20'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
