import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Home, Calendar, FileText, Users, Settings, Plus } from "lucide-react"
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils"

interface VipSidebarProps {
  onNavigate: (path: string) => void;
}

export const VipSidebar = ({ onNavigate }: VipSidebarProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: Home,
      path: '/',
      description: 'Overview of all VIP services'
    },
    {
      name: 'Create Booking',
      icon: Plus,
      path: '/create-booking',
      description: 'Schedule new VVIP events'
    },
    {
      name: 'List Events',
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
      name: 'Settings',
      icon: Settings,
      path: '/settings',
      description: 'Configure system settings'
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 pt-10 w-64">
        <div className="flex flex-col h-full">
          <div className="px-4 mb-4">
            <h2 className="text-2xl font-bold">VVIP Panel</h2>
            <p className="text-sm text-muted-foreground">
              Manage exclusive services
            </p>
          </div>
          <div className="space-y-1 flex-1 p-2">
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={cn("w-full justify-start font-normal",
                  window.location.pathname === item.path ? "bg-secondary hover:bg-secondary" : "hover:bg-accent hover:text-accent-foreground")}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
