
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];
type ContactSubmissionUpdate = Database['public']['Tables']['contact_submissions']['Update'];

export const useContactSubmissions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['contact-submissions'],
    queryFn: async (): Promise<ContactSubmission[]> => {
      console.log('🔍 Starting contact submissions fetch...');
      
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('📋 Raw Supabase response:', { data, error });
      
      if (error) {
        console.error('❌ Error fetching contact submissions:', error);
        throw error;
      }
      
      console.log('✅ Contact submissions fetched successfully:', data?.length || 0, 'records');
      return data || [];
    },
    retry: 1,
    retryDelay: 1000
  });

  // Set up real-time subscription
  useEffect(() => {
    console.log('🔄 Setting up contact submissions real-time subscription...');
    
    const channel = supabase
      .channel('contact-submissions-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_submissions'
        },
        (payload) => {
          console.log('⚡ Real-time update in contact_submissions:', payload);
          queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Contact Submission",
              description: `New message received from ${payload.new.full_name || 'Unknown'}`
            });
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🧹 Cleaning up contact submissions subscription...');
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  return query;
};

export const useUpdateContactSubmission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & ContactSubmissionUpdate) => {
      console.log('Updating contact submission:', id, updates);
      
      const { data, error } = await supabase
        .from('contact_submissions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating contact submission:', error);
        throw error;
      }
      
      console.log('Contact submission updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
    }
  });
};
