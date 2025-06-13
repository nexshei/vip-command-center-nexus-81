import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Bookings from "@/pages/Bookings";
import Clients from "@/pages/Clients";
import Subscriptions from "@/pages/Subscriptions";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Analytics from "@/pages/Analytics";
import Communications from "@/pages/Communications";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center vip-gradient">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg font-serif">Loading VIP Dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <LoginForm />;
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
};

const ComingSoonPage = ({ title, description }: { title: string; description: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-serif text-vip-black">{title}</h1>
    <p className="text-vip-gold/80 mt-2">{description}</p>
    <div className="mt-16 text-center">
      <div className="inline-block p-8 vip-glass border border-vip-gold/20 rounded-lg">
        <h2 className="text-xl font-semibold text-vip-gold mb-2">Feature under development</h2>
        <p className="text-vip-gold/70">Coming soon...</p>
      </div>
    </div>
  </div>
);

const ProfilePage = () => (
  <div className="p-6 max-w-4xl mx-auto">
    <h1 className="text-3xl font-serif font-bold text-vip-black mb-6">Admin Profile</h1>
    <div className="vip-glass border border-vip-gold/20 rounded-lg p-6">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-vip-gold/20 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-vip-gold">DO</span>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-vip-black">Sir Dennis Olele</h2>
            <p className="text-vip-gold/80">Super Administrator</p>
            <p className="text-sm text-vip-gold/60">admin@sirolele.com</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-vip-gold/80">Full Name</label>
            <p className="text-vip-black">Sir Dennis Olele</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-vip-gold/80">Role</label>
            <p className="text-vip-black">Super Administrator</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-vip-gold/80">Email</label>
            <p className="text-vip-black">admin@sirolele.com</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-vip-gold/80">Phone</label>
            <p className="text-vip-black">+254 700 000 000</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Index />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/create-booking" element={
        <ProtectedRoute>
          <ComingSoonPage 
            title="Create Booking" 
            description="Create new VIP bookings and appointments" 
          />
        </ProtectedRoute>
      } />
      <Route path="/generate-quote" element={
        <ProtectedRoute>
          <ComingSoonPage 
            title="Generate Quote" 
            description="Create custom quotes for VIP services" 
          />
        </ProtectedRoute>
      } />
      <Route path="/bookings" element={
        <ProtectedRoute>
          <Bookings />
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute>
          <Clients />
        </ProtectedRoute>
      } />
      <Route path="/inventory" element={
        <ProtectedRoute>
          <ComingSoonPage 
            title="Inventory Management" 
            description="Manage supplies and resources" 
          />
        </ProtectedRoute>
      } />
      <Route path="/staff" element={
        <ProtectedRoute>
          <ComingSoonPage 
            title="Staff Management" 
            description="Team coordination and assignments" 
          />
        </ProtectedRoute>
      } />
      <Route path="/subscriptions" element={
        <ProtectedRoute>
          <Subscriptions />
        </ProtectedRoute>
      } />
      <Route path="/communications" element={
        <ProtectedRoute>
          <Communications />
        </ProtectedRoute>
      } />
      <Route path="/email" element={
        <ProtectedRoute>
          <ComingSoonPage 
            title="Email Management" 
            description="Advanced email campaigns and automation" 
          />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      } />
      <Route path="/careers" element={
        <ProtectedRoute>
          <ComingSoonPage 
            title="Career Portal" 
            description="Recruitment and staff management" 
          />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
