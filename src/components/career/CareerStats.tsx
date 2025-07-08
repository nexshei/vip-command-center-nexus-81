import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CareerStatsProps {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  hiredApplicants: number;
}

export const CareerStats = ({ 
  totalJobs, 
  activeJobs, 
  totalApplications, 
  hiredApplicants 
}: CareerStatsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-vip-gold/80">Total Job Postings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-vip-black">{totalJobs}</div>
          <p className="text-xs text-vip-gold/60">All positions</p>
        </CardContent>
      </Card>
      
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-vip-gold/80">Active Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-vip-black">{activeJobs}</div>
          <p className="text-xs text-ios-green">Accepting applications</p>
        </CardContent>
      </Card>

      <Card className="vip-glass border-vip-gold/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-vip-gold/80">Total Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-vip-black">{totalApplications}</div>
          <p className="text-xs text-vip-gold/60">Received applications</p>
        </CardContent>
      </Card>

      <Card className="vip-glass border-vip-gold/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-vip-gold/80">Successful Hires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-vip-black">{hiredApplicants}</div>
          <p className="text-xs text-ios-green">Positions filled</p>
        </CardContent>
      </Card>
    </div>
  );
};