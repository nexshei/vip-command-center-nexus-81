
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock, MapPin, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const VipCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();
  const { toast } = useToast();

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
      date: "Today",
      value: "KSH 750,000"
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
      date: "Today",
      value: "KSH 500,000"
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
      date: "Tomorrow",
      value: "KSH 320,000"
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
      date: "Tomorrow",
      value: "KSH 150,000"
    },
    {
      id: 5,
      title: "High-Profile Security Brief",
      client: "Government Officials",
      time: "3:00 PM",
      duration: "2 hours",
      location: "Secure Conference Room",
      type: "security",
      priority: "high",
      date: "Wednesday",
      value: "KSH 600,000"
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'diplomatic': return 'bg-vip-gold text-black';
      case 'corporate': return 'bg-black text-vip-gold';
      case 'consultation': return 'bg-gray-800 text-white';
      case 'training': return 'bg-gray-200 text-black';
      case 'security': return 'bg-vip-gold/80 text-black';
      default: return 'bg-gray-100 text-black';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') return <Crown className="h-4 w-4 text-vip-gold animate-professional-pulse" />;
    return null;
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    setCurrentDate(newDate);
    console.log('Navigating to previous month:', newDate);
    toast({
      title: "Month Changed",
      description: `Viewing ${newDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`,
    });
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    setCurrentDate(newDate);
    console.log('Navigating to next month:', newDate);
    toast({
      title: "Month Changed",
      description: `Viewing ${newDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`,
    });
  };

  const handleViewCalendar = () => {
    console.log('Navigating to full calendar view');
    toast({
      title: "Opening Calendar",
      description: "Loading full calendar view...",
    });
    navigate('/bookings');
  };

  const handleEventClick = (event: any) => {
    console.log('Event clicked:', event);
    toast({
      title: "Opening Event",
      description: `Loading details for ${event.title}`,
    });
    navigate('/bookings');
  };

  return (
    <Card className="professional-card border-vip-gold/20">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100">
        <CardTitle className="text-lg font-serif text-vip-black flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-vip-gold" />
          VIP Schedule
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-vip-gold hover:bg-vip-gold/10 hover:text-vip-gold border border-vip-gold/20"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-vip-black min-w-[120px] text-center">
            {currentDate.toLocaleDateString('en-GB', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-vip-gold hover:bg-vip-gold/10 hover:text-vip-gold border border-vip-gold/20"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96 scroll-container">
          <div className="p-4 space-y-3">
            {upcomingEvents.map((event, index) => (
              <div 
                key={event.id}
                className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-vip-off-white transition-all duration-300 vip-hover-lift cursor-pointer group"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleEventClick(event)}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-vip-gold animate-professional-pulse"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-vip-black flex items-center group-hover:text-vip-gold transition-colors">
                        {event.title}
                        {getPriorityIcon(event.priority)}
                      </h4>
                      <p className="text-xs text-gray-600">{event.client}</p>
                      <p className="text-xs font-semibold text-vip-gold mt-1">{event.value}</p>
                    </div>
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
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
                        ? 'bg-vip-gold/20 text-vip-gold' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {event.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-gray-100">
          <Button 
            onClick={handleViewCalendar}
            className="w-full professional-button"
          >
            View Full Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VipCalendar;
