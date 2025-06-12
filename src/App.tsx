
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
    <div className="mt-8 text-center text-vip-gold/60">
      <p>Feature under development</p>
      <p className="text-sm mt-2">Coming soon...</p>
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
      <Route path="/subscriptions" element={
        <ProtectedRoute>
          <Subscriptions />
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
      <Route path="/communications" element={
        <ProtectedRoute>
          <ComingSoonPage 
            title="Communications" 
            description="Client communications and campaigns" 
          />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <ComingSoonPage 
            title="Analytics & Reports" 
            description="Performance metrics and business intelligence" 
          />
        </ProtectedRoute>
      } />
      <Route path="/audit" element={
        <ProtectedRoute>
          <ComingSoonPage 
            title="Audit & Security" 
            description="System logs and security monitoring" 
          />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <ComingSoonPage 
            title="System Settings" 
            description="Platform configuration and preferences" 
          />
        </ProtectedRoute>
      } />
      <Route path="/services" element={
        <ProtectedRoute>
          <ComingSoonPage 
            title="Protocol Services" 
            description="Service templates and protocol management" 
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
      <Route path="/reports" element={
        <ProtectedRoute>
          <ComingSoonPage 
            title="Reports" 
            description="Generate and export service reports" 
          />
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
