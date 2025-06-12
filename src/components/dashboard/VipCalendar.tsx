
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Crown, ChevronLeft, ChevronRight } from 'lucide-react';

const VipCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const upcomingEvents = [
    {
      id: 1,
      title: "Royal Diplomatic Reception",
      client: "Embassy of Sweden",
      time: "10:00 AM",
      duration: "3 hours",
      location: "Mayfair Suite",
      type: "diplomatic",
      priority: "high",
      date: "Today"
    },
    {
      id: 2,
      title: "VIP Corporate Meeting",
      client: "Pemberton Holdings",
      time: "2:30 PM",
      duration: "2 hours",
      location: "Executive Boardroom",
      type: "corporate",
      priority: "medium",
      date: "Today"
    },
    {
      id: 3,
      title: "Private Consultation",
      client: "Lord Wellington",
      time: "9:00 AM",
      duration: "1.5 hours",
      location: "Private Office",
      type: "consultation",
      priority: "high",
      date: "Tomorrow"
    },
    {
      id: 4,
      title: "Protocol Training Session",
      client: "Internal Staff",
      time: "11:00 AM",
      duration: "4 hours",
      location: "Training Centre",
      type: "training",
      priority: "low",
      date: "Tomorrow"
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'diplomatic': return 'bg-vip-navy text-white';
      case 'corporate': return 'bg-vip-gold text-white';
      case 'consultation': return 'bg-vip-copper text-white';
      case 'training': return 'bg-vip-steel text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') return <Crown className="h-4 w-4" />;
    return null;
  };

  return (
    <Card className="border-0 vip-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-serif text-vip-navy flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-vip-gold" />
          VIP Schedule
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-vip-navy">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-vip-steel">
            {currentDate.toLocaleDateString('en-GB', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
          <Button variant="ghost" size="sm" className="text-vip-navy">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingEvents.map((event, index) => (
          <div 
            key={event.id}
            className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-vip-light/30 transition-colors vip-hover-lift animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex-shrink-0 mt-1">
              <div className="w-3 h-3 rounded-full bg-vip-gold"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-vip-navy flex items-center">
                    {event.title}
                    {getPriorityIcon(event.priority)}
                  </h4>
                  <p className="text-xs text-vip-steel">{event.client}</p>
                </div>
                <Badge className={getEventTypeColor(event.type)}>
                  {event.type}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-vip-steel">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {event.time} ({event.duration})
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {event.location}
                </div>
              </div>
              
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  event.date === 'Today' 
                    ? 'bg-vip-copper/20 text-vip-copper' 
                    : 'bg-vip-steel/20 text-vip-steel'
                }`}>
                  {event.date}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-white"
          >
            View Full Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VipCalendar;
