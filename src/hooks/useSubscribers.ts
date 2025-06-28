
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
      console.log('🔍 Fetching newsletter subscriptions...');
      
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching newsletter subscriptions:', error);
        throw error;
      }
      
      console.log('✅ Successfully fetched newsletter subscriptions:', data);
      return data || [];
    },
    retry: 3,
    retryDelay: 1000,
  });
};

export const useUpdateSubscriber = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Subscriber> & { id: string }) => {
      console.log('📝 Updating subscriber:', id, updates);
      
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error updating subscriber:', error);
        throw error;
      }
      
      console.log('✅ Successfully updated subscriber:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
    }
  });
};
