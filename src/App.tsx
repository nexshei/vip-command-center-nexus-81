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
import Staff from "@/pages/Staff";
import CareerPortal from "@/pages/CareerPortal";
import Email from "@/pages/Email";
import ContactSubmissions from "@/pages/ContactSubmissions";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
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
  
  return <DashboardLayout>{children}</DashboardLayout>;
};

const ProfilePage = () => {
  const { user, profile } = useAuth();
  
  if (!user || !profile) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vip-gold mx-auto mb-4"></div>
          <p className="text-vip-gold">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif font-bold text-vip-black mb-6">Admin Profile</h1>
      <div className="vip-glass border border-vip-gold/20 rounded-lg p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-vip-gold/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-vip-gold">
                {profile.full_name
                  ?.split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .substring(0, 2) || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-vip-black">{profile.full_name}</h2>
              <p className="text-vip-gold/80 capitalize">{profile.role?.replace('_', ' ')}</p>
              <p className="text-sm text-vip-gold/60">{profile.email}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-vip-gold/80">Full Name</label>
              <p className="text-vip-black">{profile.full_name}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-vip-gold/80">Role</label>
              <p className="text-vip-black capitalize">{profile.role?.replace('_', ' ')}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-vip-gold/80">Email</label>
              <p className="text-vip-black">{profile.email}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-vip-gold/80">Phone</label>
              <p className="text-vip-black">{profile.phone || 'Not provided'}</p>
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
        <ProtectedRoute>
          <CreateBooking />
        </ProtectedRoute>
      } />
      <Route path="/generate-quote" element={
        <ProtectedRoute>
          <GenerateQuote />
        </ProtectedRoute>
      } />
      <Route path="/bookings" element={
        <ProtectedRoute>
          <Bookings />
        </ProtectedRoute>
      } />
      <Route path="/list-bookings" element={
        <ProtectedRoute>
          <ListBookings />
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute>
          <Clients />
        </ProtectedRoute>
      } />
      <Route path="/inventory" element={
        <ProtectedRoute>
          <Inventory />
        </ProtectedRoute>
      } />
      <Route path="/careers" element={
        <ProtectedRoute>
          <Careers />
        </ProtectedRoute>
      } />
      <Route path="/staff" element={
        <ProtectedRoute>
          <Staff />
        </ProtectedRoute>
      } />
      <Route path="/subscriptions" element={
        <ProtectedRoute>
          <Subscriptions />
        </ProtectedRoute>
      } />
      <Route path="/email" element={
        <ProtectedRoute>
          <Email />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/subscribers" element={
        <ProtectedRoute>
          <Subscribers />
        </ProtectedRoute>
      } />
      <Route path="/contact-submissions" element={
        <ProtectedRoute>
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
