
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type RequestStatus = Database['public']['Enums']['request_status'];

export interface ContactSubmission {
  id: string;
  full_name: string;
  email: string;
  subject: string | null;
  message: string;
  status: RequestStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useContactSubmissions = () => {
  return useQuery({
    queryKey: ['contact-submissions'],
    queryFn: async (): Promise<ContactSubmission[]> => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};

export const useUpdateContactSubmission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, admin_notes, ...updates }: { 
      id: string; 
      status?: RequestStatus;
      admin_notes?: string;
      [key: string]: any;
    }) => {
      const updateData: any = { ...updates };
      
      // Ensure status is a valid enum value
      if (status) {
        const validStatuses: RequestStatus[] = ['pending', 'reviewing', 'approved', 'in_progress', 'completed', 'cancelled'];
        updateData.status = validStatuses.includes(status) ? status : 'pending';
      }
      
      if (admin_notes !== undefined) {
        updateData.admin_notes = admin_notes;
      }
      
      const { data, error } = await supabase
        .from('contact_submissions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
    }
  });
};
