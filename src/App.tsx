
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import { Button } from './components/ui/button';
import Gallery from "@/pages/Gallery";
import ListBookings from "@/pages/ListBookings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout><div className="p-4"><h1>Dashboard</h1><Button>Click me</Button></div></DashboardLayout>} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/list-bookings" element={<DashboardLayout><ListBookings /></DashboardLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
