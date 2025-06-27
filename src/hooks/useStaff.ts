
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface StaffMember {
  id: string;
  full_name: string;
  position: string;
  department: string | null;
  email: string;
  phone: string | null;
  hire_date: string | null;
  salary: number | null;
  status: string;
  bio: string | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useStaff = () => {
  return useQuery({
    queryKey: ['staff'],
    queryFn: async (): Promise<StaffMember[]> => {
      const { data, error } = await supabase
        .from('staff_members')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (staffData: Omit<StaffMember, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('staff_members')
        .insert([staffData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    }
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<StaffMember> & { id: string }) => {
      const { data, error } = await supabase
        .from('staff_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    }
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('staff_members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    }
  });
};
