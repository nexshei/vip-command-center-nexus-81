

import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import VipSidebar from './VipSidebar';
import { Search, Menu, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate('/profile');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-black">
        <VipSidebar />
        <main className="flex-1 flex flex-col">
          {/* Professional Top Navigation */}
          <header className="border-b border-vip-gold/30 bg-black/98 backdrop-blur-md sticky top-0 z-40 shadow-lg">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="text-vip-gold hover:text-vip-gold-light transition-colors p-2 rounded-lg hover:bg-vip-gold/10">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
                
                {/* Professional Logo */}
                <div className="flex items-center space-x-3">
                  <img 
                    src="/lovable-uploads/af24075c-d7ee-41bc-a3d3-d50d1b766753.png" 
                    alt="Sir Dennis Olele VVIP Protocol" 
                    className="h-10 w-10 object-contain"
                  />
                  <div className="hidden md:block">
                    <h1 className="text-lg font-serif font-bold text-vip-gold">Sir Dennis Olele</h1>
                    <p className="text-xs text-vip-gold/70">VVIP Protocol Dashboard</p>
                  </div>
                </div>
                
                {/* Professional Search */}
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
                  <Input
                    placeholder="Search clients, bookings, or protocols..."
                    className="pl-10 w-64 border-vip-gold/30 focus:border-vip-gold text-vip-gold bg-black"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleViewProfile}
                  variant="ghost"
                  className="text-vip-gold hover:text-vip-gold-light hover:bg-vip-gold/10 transition-colors"
                >
                  <User className="h-5 w-5 mr-2" />
                  View Profile
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content with Professional Background */}
          <div className="flex-1 overflow-auto bg-black">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

