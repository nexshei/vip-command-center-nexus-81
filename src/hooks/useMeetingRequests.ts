
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type RequestStatus = Database['public']['Enums']['request_status'];
type EventType = Database['public']['Enums']['event_type'];
type ProtocolOfficersRange = Database['public']['Enums']['protocol_officers_range'];

export interface MeetingRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  event_type: EventType | null;
  event_date: string | null;
  location: string | null;
  vision: string | null;
  protocol_officers: ProtocolOfficersRange | null;
  status: RequestStatus;
  admin_notes: string | null;
  meeting_scheduled_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useMeetingRequests = () => {
  return useQuery({
    queryKey: ['meeting-requests'],
    queryFn: async (): Promise<MeetingRequest[]> => {
      const { data, error } = await supabase
        .from('meeting_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};

export const useUpdateMeetingRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, event_type, protocol_officers, ...updates }: {
      id: string;
      status?: RequestStatus;
      event_type?: EventType;
      protocol_officers?: ProtocolOfficersRange;
      [key: string]: any;
    }) => {
      const updateData: any = { ...updates };
      
      // Ensure status is a valid enum value
      if (status) {
        const validStatuses: RequestStatus[] = ['pending', 'reviewing', 'approved', 'in_progress', 'completed', 'cancelled'];
        updateData.status = validStatuses.includes(status) ? status : 'pending';
      }
      
      // Ensure event_type is a valid enum value
      if (event_type) {
        const validEventTypes: EventType[] = ['corporate', 'wedding', 'diplomatic', 'private', 'government', 'other'];
        updateData.event_type = validEventTypes.includes(event_type) ? event_type : 'other';
      }
      
      // Ensure protocol_officers is a valid enum value
      if (protocol_officers) {
        const validRanges: ProtocolOfficersRange[] = ['1-5', '5-10', '10-20', '20+'];
        updateData.protocol_officers = validRanges.includes(protocol_officers) ? protocol_officers : '1-5';
      }
      
      const { data, error } = await supabase
        .from('meeting_requests')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting-requests'] });
    }
  });
};
