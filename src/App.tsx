
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/toast";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Bookings from "@/pages/Bookings";
import Clients from "@/pages/Clients";
import Settings from "@/pages/Settings";
import Inventory from "@/pages/Inventory";
import Gallery from "@/pages/Gallery";
import Staff from "@/pages/Staff";
import Subscribers from "@/pages/Subscribers";
import Subscriptions from "@/pages/Subscriptions";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute permission="dashboard">
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/bookings" element={
                <ProtectedRoute permission="bookings">
                  <DashboardLayout>
                    <Bookings />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/clients" element={
                <ProtectedRoute permission="clients">
                  <DashboardLayout>
                    <Clients />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/inventory" element={
                <ProtectedRoute permission="inventory">
                  <DashboardLayout>
                    <Inventory />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/gallery" element={
                <ProtectedRoute permission="gallery">
                  <DashboardLayout>
                    <Gallery />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/staff" element={
                <ProtectedRoute permission="staff">
                  <DashboardLayout>
                    <Staff />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/subscribers" element={
                <ProtectedRoute permission="subscribers">
                  <DashboardLayout>
                    <Subscribers />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute permission="settings">
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
