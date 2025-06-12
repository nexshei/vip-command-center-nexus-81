import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Clients from './pages/Clients';
import Subscriptions from './pages/Subscriptions';
import Communications from './pages/Communications';
import Analytics from './pages/Analytics';
import SystemSettings from './pages/SystemSettings';
import CareerPortal from './pages/CareerPortal';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/communications" element={<Communications />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/career" element={<CareerPortal />} />
            <Route path="/settings" element={<SystemSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
