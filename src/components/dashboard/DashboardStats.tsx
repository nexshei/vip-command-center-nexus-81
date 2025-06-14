
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  Star, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Crown
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  description 
}) => {
  const changeColor = {
    positive: 'text-white',
    negative: 'text-white',
    neutral: 'text-white'
  }[changeType];

  return (
    <Card className="vip-hover-lift border-vip-gold/20 vip-glass-dark vip-glow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-vip-gold/80">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-vip-gold/10">
          <Icon className="h-5 w-5 text-vip-gold" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        {change && (
          <div className={`text-sm ${changeColor} flex items-center`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {change}
          </div>
        )}
        {description && (
          <p className="text-xs text-vip-gold/60 mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardStats = () => {
  const stats = [
    {
      title: "Active Bookings",
      value: 24,
      change: "+12% from last month",
      changeType: "positive" as const,
      icon: Calendar,
      description: "VIP appointments this month"
    },
    {
      title: "VIP Clients",
      value: 156,
      change: "+8 new this week",
      changeType: "positive" as const,
      icon: Crown,
      description: "Premium client portfolio"
    },
    {
      title: "Protocol Rating",
      value: "4.9",
      change: "+0.2 this quarter",
      changeType: "positive" as const,
      icon: Star,
      description: "Average service rating"
    },
    {
      title: "Revenue",
      value: "KSH 8.9M",
      change: "+15% from last month",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "Monthly performance"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "booking",
      title: "New VIP booking confirmed",
      client: "Lord Pemberton",
      time: "2 minutes ago",
      status: "confirmed",
      amount: "KSH 250,000",
      icon: CheckCircle
    },
    {
      id: 2,
      type: "urgent",
      title: "Urgent protocol request",
      client: "Embassy of Monaco",
      time: "15 minutes ago",
      status: "pending",
      amount: "KSH 500,000",
      icon: AlertCircle
    },
    {
      id: 3,
      type: "completed",
      title: "Protocol service completed",
      client: "Royal Danish Consulate",
      time: "1 hour ago",
      status: "completed",
      amount: "KSH 750,000",
      icon: CheckCircle
    },
    {
      id: 4,
      type: "reminder",
      title: "Upcoming appointment",
      client: "Sir Wellington Estate",
      time: "3 hours from now",
      status: "scheduled",
      amount: "KSH 320,000",
      icon: Clock
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-ios-green text-black';
      case 'pending': return 'bg-ios-orange text-black';
      case 'completed': return 'bg-ios-blue text-white';
      case 'scheduled': return 'bg-vip-gold text-black';
      default: return 'bg-neutral-dark text-black';
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={stat.title} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="border-vip-gold/20 vip-glass-dark vip-glow">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-vip-gold flex items-center">
            <Clock className="h-5 w-5 mr-2 text-vip-gold" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div 
              key={activity.id} 
              className="flex items-center space-x-4 p-4 rounded-lg hover:bg-vip-gold/5 transition-all duration-300 border border-vip-gold/10 vip-hover-lift animate-fade-in-up"
              style={{ animationDelay: `${(index + 4) * 0.1}s` }}
            >
              <div className="flex-shrink-0 p-2 rounded-lg bg-vip-gold/10">
                <activity.icon className="h-5 w-5 text-vip-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-vip-gold">{activity.title}</p>
                <p className="text-xs text-vip-gold/70">{activity.client}</p>
                <p className="text-xs font-semibold text-vip-gold mt-1">{activity.amount}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status}
                </Badge>
                <span className="text-xs text-vip-gold/60">{activity.time}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
