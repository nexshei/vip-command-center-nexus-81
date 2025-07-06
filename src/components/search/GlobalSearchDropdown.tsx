
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, MessageSquare, Briefcase, BookOpen, ShoppingCart } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'client' | 'booking' | 'contact' | 'application' | 'subscriber' | 'item-booking';
  url: string;
  data: any;
}

interface GlobalSearchDropdownProps {
  searchResults: SearchResult[];
  isVisible: boolean;
  onResultClick: () => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'client': return Users;
    case 'booking': return Calendar;
    case 'item-booking': return ShoppingCart;
    case 'contact': return MessageSquare;
    case 'application': return Briefcase;
    case 'subscriber': return BookOpen;
    default: return Users;
  }
};

const getTypeBadgeVariant = (type: string) => {
  switch (type) {
    case 'client': return 'default';
    case 'booking': return 'secondary';
    case 'item-booking': return 'outline';
    case 'contact': return 'destructive';
    case 'application': return 'default';
    case 'subscriber': return 'secondary';
    default: return 'outline';
  }
};

export const GlobalSearchDropdown: React.FC<GlobalSearchDropdownProps> = ({
  searchResults,
  isVisible,
  onResultClick
}) => {
  const navigate = useNavigate();

  if (!isVisible || searchResults.length === 0) return null;

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    onResultClick();
  };

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-black border-vip-gold/30 backdrop-blur-sm max-h-96 overflow-y-auto">
      <CardContent className="p-2">
        {searchResults.map((result) => {
          const Icon = getTypeIcon(result.type);
          return (
            <div
              key={result.id}
              onClick={() => handleResultClick(result)}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-vip-gold/10 cursor-pointer transition-colors"
            >
              <div className="flex-shrink-0">
                <Icon className="h-4 w-4 text-vip-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {result.title}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {result.subtitle}
                </p>
              </div>
              <Badge 
                variant={getTypeBadgeVariant(result.type)}
                className="text-xs capitalize"
              >
                {result.type.replace('-', ' ')}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
