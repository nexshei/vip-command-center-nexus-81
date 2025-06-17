
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Images, Star, Grid, Tag } from 'lucide-react';

interface GalleryStatsProps {
  photos: any[];
}

export const GalleryStats: React.FC<GalleryStatsProps> = ({ photos }) => {
  const totalPhotos = photos.length;
  const featuredPhotos = photos.filter(photo => photo.is_featured).length;
  const categories = [...new Set(photos.map(photo => photo.category))].filter(Boolean).length;
  const recentPhotos = photos.filter(photo => {
    const photoDate = new Date(photo.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return photoDate > weekAgo;
  }).length;

  const stats = [
    {
      title: 'Total Photos',
      value: totalPhotos,
      icon: Images,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Featured',
      value: featuredPhotos,
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      title: 'Categories',
      value: categories,
      icon: Tag,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Added This Week',
      value: recentPhotos,
      icon: Grid,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="bg-black/50 border-vip-gold/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-vip-gold/60">{stat.title}</p>
                  <p className="text-2xl font-bold text-vip-gold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
