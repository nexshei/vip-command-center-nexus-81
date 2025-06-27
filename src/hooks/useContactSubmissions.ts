
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['contact-submissions'],
    queryFn: async (): Promise<ContactSubmission[]> => {
      console.log('🔍 Starting contact submissions fetch...');
      
      // Test basic connection first
      try {
        const connectionTest = await supabase.from('contact_submissions').select('count', { count: 'exact', head: true });
        console.log('📊 Connection test result:', connectionTest);
        
        if (connectionTest.error) {
          console.error('❌ Connection test failed:', connectionTest.error);
          throw connectionTest.error;
        }
        
        console.log('✅ Connection successful. Total count:', connectionTest.count);
      } catch (testError) {
        console.error('💥 Connection test error:', testError);
        throw testError;
      }

      // Now fetch actual data
      console.log('📥 Fetching contact submissions data...');
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('📋 Raw Supabase response:', { data, error });
      
      if (error) {
        console.error('❌ Error fetching contact submissions:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      console.log('✅ Contact submissions fetched successfully:', data?.length || 0, 'records');
      console.log('📝 Sample data:', data?.[0]);
      
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
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
      });

    return () => {
      console.log('🧹 Cleaning up contact submissions subscription...');
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  // Log query state changes
  useEffect(() => {
    console.log('📊 Query state update:', {
      isLoading: query.isLoading,
      isError: query.isError,
      error: query.error,
      dataLength: query.data?.length,
      status: query.status
    });
  }, [query.isLoading, query.isError, query.error, query.data, query.status]);

  return query;
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
      
      console.log('Updating contact submission:', id, updateData);
      
      const { data, error } = await supabase
        .from('contact_submissions')
        .update(updateData)
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
