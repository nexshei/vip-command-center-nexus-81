
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import Dashboard from '@/pages/Dashboard';
import Clients from '@/pages/Clients';
import AllBookings from '@/pages/AllBookings';
import ItemBookings from '@/pages/ItemBookings';
import ContactMessages from '@/pages/ContactMessages';
import Careers from '@/pages/Careers';
import Staff from '@/pages/Staff';
import Inventory from '@/pages/Inventory';
import Email from '@/pages/Email';
import Analytics from '@/pages/Analytics';
import Subscribers from '@/pages/Subscribers';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute>
          <Clients />
        </ProtectedRoute>
      } />
      <Route path="/all-bookings" element={
        <ProtectedRoute>
          <AllBookings />
        </ProtectedRoute>
      } />
      <Route path="/item-bookings" element={
        <ProtectedRoute>
          <ItemBookings />
        </ProtectedRoute>
      } />
      <Route path="/contact-messages" element={
        <ProtectedRoute>
          <ContactMessages />
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
      <Route path="/inventory" element={
        <ProtectedRoute>
          <Inventory />
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
      <Route path="/subscribers" element={
        <ProtectedRoute>
          <Subscribers />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
