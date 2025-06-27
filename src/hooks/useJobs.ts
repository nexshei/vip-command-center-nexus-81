
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface JobPosting {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  description: string | null;
  requirements: string[] | null;
  employment_type: string | null;
  salary_range: string | null;
  application_deadline: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async (): Promise<JobPosting[]> => {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobData: Omit<JobPosting, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('job_postings')
        .insert([jobData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<JobPosting> & { id: string }) => {
      const { data, error } = await supabase
        .from('job_postings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('job_postings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    }
  });
};
