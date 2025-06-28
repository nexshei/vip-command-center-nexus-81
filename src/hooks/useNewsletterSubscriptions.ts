
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NewsletterSubscription {
  id: string;
  email: string;
  is_active: boolean | null;
  subscribed_at: string | null;
  unsubscribed_at: string | null;
  source: string | null;
}

export const useNewsletterSubscriptions = () => {
  return useQuery({
    queryKey: ['newsletter_subscriptions'],
    queryFn: async (): Promise<NewsletterSubscription[]> => {
      console.log('🔍 Fetching newsletter subscriptions...');
      
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching newsletter subscriptions:', error);
        throw error;
      }
      
      console.log('✅ Successfully fetched newsletter subscriptions count:', data?.length || 0);
      console.log('✅ Newsletter subscriptions data:', data);
      return data || [];
    },
    retry: 3,
    retryDelay: 1000,
  });
};

export const useUpdateNewsletterSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<NewsletterSubscription> & { id: string }) => {
      console.log('📝 Updating newsletter subscription:', id, updates);
      
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error updating newsletter subscription:', error);
        throw error;
      }
      
      console.log('✅ Successfully updated newsletter subscription:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter_subscriptions'] });
    }
  });
};

export const useAddTestSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      console.log('📝 Adding test newsletter subscription...');
      
      const testEmail = `test-${Date.now()}@example.com`;
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert({
          email: testEmail,
          source: 'admin-test',
          is_active: true
        })
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error adding test subscription:', error);
        throw error;
      }
      
      console.log('✅ Successfully added test subscription:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter_subscriptions'] });
    }
  });
};
