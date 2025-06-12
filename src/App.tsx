
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
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
          <div className="p-6">
            <h1 className="text-2xl font-serif text-vip-navy">Bookings & Events</h1>
            <p className="text-vip-steel mt-2">Manage VIP appointments and protocol events</p>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute>
          <div className="p-6">
            <h1 className="text-2xl font-serif text-vip-navy">Client Management</h1>
            <p className="text-vip-steel mt-2">VIP client profiles and relationship management</p>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/subscriptions" element={
        <ProtectedRoute>
          <div className="p-6">
            <h1 className="text-2xl font-serif text-vip-navy">VIP Subscriptions</h1>
            <p className="text-vip-steel mt-2">Manage premium memberships and services</p>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/careers" element={
        <ProtectedRoute>
          <div className="p-6">
            <h1 className="text-2xl font-serif text-vip-navy">Career Portal</h1>
            <p className="text-vip-steel mt-2">Recruitment and staff management</p>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/communications" element={
        <ProtectedRoute>
          <div className="p-6">
            <h1 className="text-2xl font-serif text-vip-navy">Communications</h1>
            <p className="text-vip-steel mt-2">Client communications and campaigns</p>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <div className="p-6">
            <h1 className="text-2xl font-serif text-vip-navy">Analytics & Reports</h1>
            <p className="text-vip-steel mt-2">Performance metrics and business intelligence</p>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/audit" element={
        <ProtectedRoute>
          <div className="p-6">
            <h1 className="text-2xl font-serif text-vip-navy">Audit & Security</h1>
            <p className="text-vip-steel mt-2">System logs and security monitoring</p>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <div className="p-6">
            <h1 className="text-2xl font-serif text-vip-navy">System Settings</h1>
            <p className="text-vip-steel mt-2">Platform configuration and preferences</p>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/services" element={
        <ProtectedRoute>
          <div className="p-6">
            <h1 className="text-2xl font-serif text-vip-navy">Protocol Services</h1>
            <p className="text-vip-steel mt-2">Service templates and protocol management</p>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/staff" element={
        <ProtectedRoute>
          <div className="p-6">
            <h1 className="text-2xl font-serif text-vip-navy">Staff Management</h1>
            <p className="text-vip-steel mt-2">Team coordination and assignments</p>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <div className="p-6">
            <h1 className="text-2xl font-serif text-vip-navy">Reports</h1>
            <p className="text-vip-steel mt-2">Generate and export service reports</p>
          </div>
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
