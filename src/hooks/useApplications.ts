
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  cover_letter: string | null;
  cv_url: string | null;
  professional_photo_url: string | null;
  position: string | null;
  status: string;
  admin_notes: string | null;
  interview_date: string | null;
  created_at: string;
  updated_at: string;
}

export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async (): Promise<Application[]> => {
      const { data, error } = await supabase
        .from('career_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};
