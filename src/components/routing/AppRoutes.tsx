import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { ProfilePage } from '@/components/profile/ProfilePage';
import Dashboard from '@/pages/Dashboard';
import Bookings from '@/pages/Bookings';
import ListBookings from '@/pages/ListBookings';
import Clients from '@/pages/Clients';
import Subscriptions from '@/pages/Subscriptions';
import Subscribers from '@/pages/Subscribers';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Analytics from '@/pages/Analytics';
import CreateBooking from '@/pages/CreateBooking';
import GenerateQuote from '@/pages/GenerateQuote';
import Inventory from '@/pages/Inventory';
import Careers from '@/pages/Careers';
import Gallery from '@/pages/Gallery';
import Staff from '@/pages/Staff';
import CareerPortal from '@/pages/CareerPortal';
import Email from '@/pages/Email';
import ContactSubmissions from '@/pages/ContactSubmissions';
import Settings from '@/pages/Settings';
import NewsletterSubscribers from '@/pages/NewsletterSubscribers';

export const AppRoutes: React.FC = () => {
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
      <Route path="/gallery" element={
        <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
          <Gallery />
        </ProtectedRoute>
      } />
      <Route path="/staff" element={
        <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
          <Staff />
        </ProtectedRoute>
      } />
      <Route path="/subscriptions" element={
        <ProtectedRoute requiredRoles={['super_admin', 'protocol_admin', 'admin']}>
          <Subscriptions />
        </ProtectedRoute>
      } />
      <Route path="/email" element={
        <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
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
      <Route path="/newsletter-subscribers" element={
        <ProtectedRoute requiredRoles={['super_admin', 'protocol_admin', 'admin']}>
          <React.Suspense fallback={<div>Loading...</div>}>
            <NewsletterSubscribers />
          </React.Suspense>
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
