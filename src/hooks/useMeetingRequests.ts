
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MeetingRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  event_type: string | null;
  event_date: string | null;
  location: string | null;
  vision: string | null;
  protocol_officers: string[] | null;
  status: string;
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
    mutationFn: async ({ id, ...updates }: Partial<MeetingRequest> & { id: string }) => {
      const { data, error } = await supabase
        .from('meeting_requests')
        .update(updates)
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
