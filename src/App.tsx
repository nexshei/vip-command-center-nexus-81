
import React from "react";
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
import ListBookings from "@/pages/ListBookings";
import Clients from "@/pages/Clients";
import Subscriptions from "@/pages/Subscriptions";
import Subscribers from "@/pages/Subscribers";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Analytics from "@/pages/Analytics";
import CreateBooking from "@/pages/CreateBooking";
import GenerateQuote from "@/pages/GenerateQuote";
import Inventory from "@/pages/Inventory";
import Careers from "@/pages/Careers";
import Gallery from "@/pages/Gallery";
import Staff from "@/pages/Staff";
import CareerPortal from "@/pages/CareerPortal";
import Email from "@/pages/Email";
import ContactSubmissions from "@/pages/ContactSubmissions";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient();

const ProtectedRoute = ({ 
  children, 
  requiredRoles 
}: { 
  children: React.ReactNode;
  requiredRoles?: string[];
}) => {
  const { user, isLoading, hasAccess } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center vip-gradient">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg font-serif">Loading VVIP Dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <LoginForm />;
  }

  if (requiredRoles && !hasAccess(requiredRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-vip-gold/70 mb-4">You don't have permission to access this page.</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-vip-gold text-black px-4 py-2 rounded hover:bg-vip-gold/80"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
};

const ProfilePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif font-bold text-vip-black mb-6">User Profile</h1>
      <div className="vip-glass border border-vip-gold/20 rounded-lg p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-vip-gold/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-vip-gold">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-vip-black">{user?.name}</h2>
              <p className="text-sm text-vip-gold/60">{user?.email}</p>
              <p className="text-sm text-vip-gold/60 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-vip-gold/80">Full Name</label>
              <p className="text-vip-black">{user?.name}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-vip-gold/80">Email</label>
              <p className="text-vip-black">{user?.email}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-vip-gold/80">Role</label>
              <p className="text-vip-black capitalize">{user?.role?.replace('_', ' ')}</p>
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
      <Route path="/create-booking" element={
        <ProtectedRoute requiredRoles={['super_admin', 'protocol_admin', 'admin']}>
          <CreateBooking />
        </ProtectedRoute>
      } />
      <Route path="/generate-quote" element={
        <ProtectedRoute requiredRoles={['super_admin', 'protocol_admin', 'admin']}>
          <GenerateQuote />
        </ProtectedRoute>
      } />
      <Route path="/bookings" element={
        <ProtectedRoute requiredRoles={['super_admin', 'protocol_admin', 'admin']}>
          <Bookings />
        </ProtectedRoute>
      } />
      <Route path="/list-bookings" element={
        <ProtectedRoute requiredRoles={['super_admin', 'protocol_admin', 'admin']}>
          <ListBookings />
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute requiredRoles={['super_admin', 'protocol_admin', 'admin']}>
          <Clients />
        </ProtectedRoute>
      } />
      <Route path="/inventory" element={
        <ProtectedRoute requiredRoles={['super_admin', 'protocol_admin', 'admin']}>
          <Inventory />
        </ProtectedRoute>
      } />
      <Route path="/careers" element={
        <ProtectedRoute requiredRoles={['super_admin', 'protocol_admin', 'admin']}>
          <Careers />
        </ProtectedRoute>
      } />
      {/* Gallery removed - no longer accessible */}
      <Route path="/gallery" element={
        <ProtectedRoute requiredRoles={['super_admin']}>
          <Gallery />
        </ProtectedRoute>
      } />
      {/* Staff - Super Admin only */}
      <Route path="/staff" element={
        <ProtectedRoute requiredRoles={['super_admin']}>
          <Staff />
        </ProtectedRoute>
      } />
      <Route path="/subscriptions" element={
        <ProtectedRoute requiredRoles={['super_admin', 'protocol_admin', 'admin']}>
          <Subscriptions />
        </ProtectedRoute>
      } />
      {/* Email - Super Admin only */}
      <Route path="/email" element={
        <ProtectedRoute requiredRoles={['super_admin']}>
          <Email />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
          <Analytics />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      {/* Settings - Super Admin only */}
      <Route path="/settings" element={
        <ProtectedRoute requiredRoles={['super_admin']}>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/subscribers" element={
        <ProtectedRoute requiredRoles={['super_admin', 'protocol_admin', 'admin']}>
          <Subscribers />
        </ProtectedRoute>
      } />
      <Route path="/contact-submissions" element={
        <ProtectedRoute requiredRoles={['super_admin', 'protocol_admin', 'admin']}>
          <React.Suspense fallback={<div>Loading...</div>}>
            <ContactSubmissions />
          </React.Suspense>
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
