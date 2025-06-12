
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import VipSidebar from './VipSidebar';
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <VipSidebar />
        <main className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="text-vip-navy hover:text-vip-gold transition-colors">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-steel" />
                  <Input
                    placeholder="Search clients, bookings, or protocols..."
                    className="pl-10 w-64 border-vip-steel/20 focus:border-vip-gold bg-white/50"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative text-vip-navy hover:text-vip-gold hover:bg-vip-gold/10"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-vip-copper rounded-full text-[10px] flex items-center justify-center text-white">
                    3
                  </span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
