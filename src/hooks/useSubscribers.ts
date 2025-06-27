
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Subscriber {
  id: string;
  email: string;
  source: string | null;
  is_active: boolean | null;
  subscribed_at: string | null;
  unsubscribed_at: string | null;
}

export const useSubscribers = () => {
  return useQuery({
    queryKey: ['subscribers'],
    queryFn: async (): Promise<Subscriber[]> => {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};

export const useUpdateSubscriber = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Subscriber> & { id: string }) => {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
    }
  });
};
