import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import type { Application } from '@/hooks/useApplications';

interface HiringSuccessStoriesProps {
  applications: Application[];
}

export const HiringSuccessStories = ({ applications }: HiringSuccessStoriesProps) => {
  const hiredApplicants = applications.filter(app => app.status === 'approved');

  if (hiredApplicants.length === 0) {
    return null;
  }

  return (
    <Card className="vip-glass border-vip-gold/20">
      <CardHeader>
        <CardTitle className="flex items-center text-vip-black">
          <CheckCircle className="h-5 w-5 mr-2 text-ios-green" />
          Recent Successful Hires
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hiredApplicants
            .slice(0, 6)
            .map((hire) => (
              <div key={hire.id} className="p-4 border border-ios-green/30 rounded-lg bg-ios-green/5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-vip-black">{hire.full_name}</h4>
                  <Badge className="bg-ios-green text-white text-xs">Hired</Badge>
                </div>
                <p className="text-sm text-vip-gold/80">{hire.position}</p>
                <p className="text-xs text-vip-gold/60 mt-1">
                  Hired on {new Date(hire.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};