
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
      <div className="min-h-screen flex w-full bg-vip-black">
        <VipSidebar />
        <main className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="border-b border-vip-gold/20 vip-glass-dark sticky top-0 z-40">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="text-vip-gold hover:text-vip-gold-light transition-colors">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
                
                {/* Logo */}
                <div className="flex items-center space-x-3">
                  <img 
                    src="/lovable-uploads/af24075c-d7ee-41bc-a3d3-d50d1b766753.png" 
                    alt="Sir Ole VVIP Protocol" 
                    className="h-8 w-8 object-contain"
                  />
                  <div className="hidden md:block">
                    <h1 className="text-lg font-serif font-bold text-vip-gold">Sir Ole VVIP</h1>
                    <p className="text-xs text-vip-gold/70">Protocol Dashboard</p>
                  </div>
                </div>
                
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
                  <Input
                    placeholder="Search clients, bookings, or protocols..."
                    className="pl-10 w-64 border-vip-gold/30 focus:border-vip-gold bg-black/50 text-vip-gold placeholder:text-vip-gold/50 vip-glass"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative text-vip-gold hover:text-vip-gold-light hover:bg-vip-gold/10 vip-glass"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-vip-red rounded-full text-[10px] flex items-center justify-center text-white animate-pulse">
                    3
                  </span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto bg-gradient-to-br from-vip-black via-bg-secondary to-vip-black">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
