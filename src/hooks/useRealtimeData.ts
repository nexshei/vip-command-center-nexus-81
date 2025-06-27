
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RealtimeStats {
  totalClients: number;
  totalMeetingRequests: number;
  totalContactSubmissions: number;
  totalApplications: number;
  totalStaff: number;
  totalInventoryItems: number;
  totalJobPostings: number;
  totalSubscribers: number;
  lastUpdated: Date;
}

export const useRealtimeData = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<RealtimeStats>({
    totalClients: 0,
    totalMeetingRequests: 0,
    totalContactSubmissions: 0,
    totalApplications: 0,
    totalStaff: 0,
    totalInventoryItems: 0,
    totalJobPostings: 0,
    totalSubscribers: 0,
    lastUpdated: new Date()
  });

  const fetchAllCounts = async () => {
    try {
      console.log('🔍 Fetching real-time database counts...');
      
      // Test connection to each table individually
      const tableTests = [
        'clients',
        'meeting_requests',
        'contact_submissions',
        'career_applications',
        'staff_members',
        'inventory_items',
        'job_postings',
        'newsletter_subscriptions'
      ];

      console.log('📊 Testing individual table connections...');
      for (const tableName of tableTests) {
        try {
          const testResult = await supabase.from(tableName).select('id', { count: 'exact', head: true });
          console.log(`✅ ${tableName}: ${testResult.count} records, error: ${testResult.error?.message || 'none'}`);
        } catch (err) {
          console.error(`❌ ${tableName} test failed:`, err);
        }
      }
      
      const [
        { count: clientsCount, error: clientsError },
        { count: meetingRequestsCount, error: meetingError },
        { count: contactSubmissionsCount, error: contactError },
        { count: applicationsCount, error: appsError },
        { count: staffCount, error: staffError },
        { count: inventoryCount, error: inventoryError },
        { count: jobsCount, error: jobsError },
        { count: subscribersCount, error: subsError }
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('meeting_requests').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('career_applications').select('*', { count: 'exact', head: true }),
        supabase.from('staff_members').select('*', { count: 'exact', head: true }),
        supabase.from('inventory_items').select('*', { count: 'exact', head: true }),
        supabase.from('job_postings').select('*', { count: 'exact', head: true }),
        supabase.from('newsletter_subscriptions').select('*', { count: 'exact', head: true })
      ]);

      // Log any errors
      const errors = [
        { table: 'clients', error: clientsError },
        { table: 'meeting_requests', error: meetingError },
        { table: 'contact_submissions', error: contactError },
        { table: 'career_applications', error: appsError },
        { table: 'staff_members', error: staffError },
        { table: 'inventory_items', error: inventoryError },
        { table: 'job_postings', error: jobsError },
        { table: 'newsletter_subscriptions', error: subsError }
      ].filter(item => item.error);

      if (errors.length > 0) {
        console.error('🚨 Errors found in table queries:', errors);
      }

      const newStats = {
        totalClients: clientsCount || 0,
        totalMeetingRequests: meetingRequestsCount || 0,
        totalContactSubmissions: contactSubmissionsCount || 0,
        totalApplications: applicationsCount || 0,
        totalStaff: staffCount || 0,
        totalInventoryItems: inventoryCount || 0,
        totalJobPostings: jobsCount || 0,
        totalSubscribers: subscribersCount || 0,
        lastUpdated: new Date()
      };

      console.log('📊 Database counts fetched:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('💥 Error fetching counts:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAllCounts();

    // Set up real-time subscriptions for all tables
    const channels = [
      'clients',
      'meeting_requests', 
      'contact_submissions',
      'career_applications',
      'staff_members',
      'inventory_items',
      'job_postings',
      'newsletter_subscriptions'
    ].map(tableName => {
      return supabase
        .channel(`${tableName}-realtime`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: tableName
          },
          (payload) => {
            console.log(`Real-time update in ${tableName}:`, payload);
            fetchAllCounts();
            
            // Show toast for new records
            if (payload.eventType === 'INSERT') {
              toast({
                title: "Database Updated",
                description: `New record added to ${tableName.replace('_', ' ')}`
              });
            }
          }
        )
        .subscribe();
    });

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [toast]);

  return { stats, refreshStats: fetchAllCounts };
};
