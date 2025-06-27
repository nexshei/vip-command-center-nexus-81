
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText, 
  UserCheck, 
  Package, 
  Briefcase, 
  Mail 
} from 'lucide-react';

const DashboardStats = () => {
  const { stats } = useRealtimeData();

  // Simple derived stats without causing re-renders
  const statsData = [
    {
      title: "Total Clients",
      value: stats?.totalClients || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Meeting Requests",
      value: stats?.totalMeetingRequests || 0,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Contact Messages",
      value: stats?.totalContactSubmissions || 0,
      icon: MessageSquare,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Applications",
      value: stats?.totalApplications || 0,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Staff Members",
      value: stats?.totalStaff || 0,
      icon: UserCheck,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      title: "Inventory Items",
      value: stats?.totalInventoryItems || 0,
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Job Postings",
      value: stats?.totalJobPostings || 0,
      icon: Briefcase,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "Subscribers",
      value: stats?.totalSubscribers || 0,
      icon: Mail,
      color: "text-pink-600",
      bgColor: "bg-pink-100"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="bg-black border-vip-gold/30 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-vip-gold/80">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}/20`}>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vip-gold">{stat.value}</div>
              <p className="text-xs text-vip-gold/60 mt-1">
                {stat.value === 1 ? stat.title.slice(0, -1) : stat.title.toLowerCase()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
