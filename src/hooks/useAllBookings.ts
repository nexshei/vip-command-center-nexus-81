
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type MeetingRequest = Database['public']['Tables']['meeting_requests']['Row'];
type VVIPServiceRequest = Database['public']['Tables']['vvip_service_requests']['Row'];

export interface UnifiedBooking {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  event_type?: string;
  event_date?: string;
  location?: string;
  status: string;
  created_at: string;
  source: 'meeting_request' | 'vvip_service';
  protocol_officers?: string;
  vision?: string;
  service_type?: string;
  requirements?: string;
  estimated_cost?: number;
}

export const useAllBookings = () => {
  return useQuery({
    queryKey: ['all-bookings'],
    queryFn: async (): Promise<UnifiedBooking[]> => {
      // Fetch meeting requests
      const { data: meetingRequests, error: meetingError } = await supabase
        .from('meeting_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (meetingError) throw meetingError;

      // Fetch VVIP service requests
      const { data: vvipRequests, error: vvipError } = await supabase
        .from('vvip_service_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (vvipError) throw vvipError;

      // Combine and normalize the data
      const unifiedBookings: UnifiedBooking[] = [
        ...(meetingRequests || []).map((request: MeetingRequest) => ({
          id: request.id,
          full_name: request.full_name,
          email: request.email,
          phone: request.phone,
          event_type: request.event_type || undefined,
          event_date: request.event_date || undefined,
          location: request.location || undefined,
          status: request.status || 'pending',
          created_at: request.created_at || '',
          source: 'meeting_request' as const,
          protocol_officers: request.protocol_officers || undefined,
          vision: request.vision || undefined,
        })),
        ...(vvipRequests || []).map((request: VVIPServiceRequest) => ({
          id: request.id,
          full_name: request.full_name,
          email: request.email,
          phone: request.phone,
          event_type: request.event_type || undefined,
          event_date: request.event_date || undefined,
          location: request.location || undefined,
          status: request.status || 'pending',
          created_at: request.created_at || '',
          source: 'vvip_service' as const,
          service_type: request.service_type || undefined,
          requirements: request.requirements || undefined,
          estimated_cost: request.estimated_cost || undefined,
          protocol_officers: request.protocol_officers || undefined,
        }))
      ];

      // Sort by created_at descending
      return unifiedBookings.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  });
};
