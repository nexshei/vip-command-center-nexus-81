
import React, { useState, useRef, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { VipSidebar } from './VipSidebar';
import { UserMenu } from './UserMenu';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { GlobalSearchDropdown } from '@/components/search/GlobalSearchDropdown';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const { searchResults } = useGlobalSearch(searchTerm);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show dropdown when there are results and search term exists
  useEffect(() => {
    setShowDropdown(searchTerm.trim().length > 0 && searchResults.length > 0);
  }, [searchTerm, searchResults]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleResultClick = () => {
    setShowDropdown(false);
    setSearchTerm('');
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
                <SidebarTrigger className="text-vip-gold hover:text-vip-gold-light transition-colors p-2 rounded-lg hover:bg-vip-gold/10" />
                
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
                
                {/* Functional Search */}
                <div className="relative max-w-md" ref={searchRef}>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/60" />
                  <Input
                    placeholder="Search clients, bookings, or protocols..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10 w-64 border-vip-gold/30 focus:border-vip-gold text-vip-gold bg-black"
                  />
                  
                  <GlobalSearchDropdown
                    searchResults={searchResults}
                    isVisible={showDropdown}
                    onResultClick={handleResultClick}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <UserMenu />
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
