
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
      
      // Test individual table connections with proper table names
      console.log('📊 Testing individual table connections...');
      
      try {
        const clientsTest = await supabase.from('clients').select('id', { count: 'exact', head: true });
        console.log(`✅ clients: ${clientsTest.count} records, error: ${clientsTest.error?.message || 'none'}`);
      } catch (err) {
        console.error('❌ clients test failed:', err);
      }

      try {
        const meetingRequestsTest = await supabase.from('meeting_requests').select('id', { count: 'exact', head: true });
        console.log(`✅ meeting_requests: ${meetingRequestsTest.count} records, error: ${meetingRequestsTest.error?.message || 'none'}`);
      } catch (err) {
        console.error('❌ meeting_requests test failed:', err);
      }

      try {
        const contactSubmissionsTest = await supabase.from('contact_submissions').select('id', { count: 'exact', head: true });
        console.log(`✅ contact_submissions: ${contactSubmissionsTest.count} records, error: ${contactSubmissionsTest.error?.message || 'none'}`);
      } catch (err) {
        console.error('❌ contact_submissions test failed:', err);
      }

      try {
        const applicationsTest = await supabase.from('career_applications').select('id', { count: 'exact', head: true });
        console.log(`✅ career_applications: ${applicationsTest.count} records, error: ${applicationsTest.error?.message || 'none'}`);
      } catch (err) {
        console.error('❌ career_applications test failed:', err);
      }

      try {
        const staffTest = await supabase.from('staff_members').select('id', { count: 'exact', head: true });
        console.log(`✅ staff_members: ${staffTest.count} records, error: ${staffTest.error?.message || 'none'}`);
      } catch (err) {
        console.error('❌ staff_members test failed:', err);
      }

      try {
        const inventoryTest = await supabase.from('inventory_items').select('id', { count: 'exact', head: true });
        console.log(`✅ inventory_items: ${inventoryTest.count} records, error: ${inventoryTest.error?.message || 'none'}`);
      } catch (err) {
        console.error('❌ inventory_items test failed:', err);
      }

      try {
        const jobsTest = await supabase.from('job_postings').select('id', { count: 'exact', head: true });
        console.log(`✅ job_postings: ${jobsTest.count} records, error: ${jobsTest.error?.message || 'none'}`);
      } catch (err) {
        console.error('❌ job_postings test failed:', err);
      }

      try {
        const subscribersTest = await supabase.from('newsletter_subscriptions').select('id', { count: 'exact', head: true });
        console.log(`✅ newsletter_subscriptions: ${subscribersTest.count} records, error: ${subscribersTest.error?.message || 'none'}`);
      } catch (err) {
        console.error('❌ newsletter_subscriptions test failed:', err);
      }
      
      // Fetch all counts with proper table names
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

    // Set up real-time subscriptions with proper table names
    const channels = [
      supabase
        .channel('clients-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'clients'
          },
          (payload) => {
            console.log('Real-time update in clients:', payload);
            fetchAllCounts();
            if (payload.eventType === 'INSERT') {
              toast({
                title: "Database Updated",
                description: "New record added to clients"
              });
            }
          }
        )
        .subscribe(),

      supabase
        .channel('meeting-requests-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'meeting_requests'
          },
          (payload) => {
            console.log('Real-time update in meeting_requests:', payload);
            fetchAllCounts();
            if (payload.eventType === 'INSERT') {
              toast({
                title: "Database Updated",
                description: "New record added to meeting requests"
              });
            }
          }
        )
        .subscribe(),

      supabase
        .channel('contact-submissions-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'contact_submissions'
          },
          (payload) => {
            console.log('Real-time update in contact_submissions:', payload);
            fetchAllCounts();
            if (payload.eventType === 'INSERT') {
              toast({
                title: "Database Updated",
                description: "New record added to contact submissions"
              });
            }
          }
        )
        .subscribe(),

      supabase
        .channel('career-applications-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'career_applications'
          },
          (payload) => {
            console.log('Real-time update in career_applications:', payload);
            fetchAllCounts();
            if (payload.eventType === 'INSERT') {
              toast({
                title: "Database Updated",
                description: "New record added to career applications"
              });
            }
          }
        )
        .subscribe(),

      supabase
        .channel('staff-members-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'staff_members'
          },
          (payload) => {
            console.log('Real-time update in staff_members:', payload);
            fetchAllCounts();
            if (payload.eventType === 'INSERT') {
              toast({
                title: "Database Updated",
                description: "New record added to staff members"
              });
            }
          }
        )
        .subscribe(),

      supabase
        .channel('inventory-items-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'inventory_items'
          },
          (payload) => {
            console.log('Real-time update in inventory_items:', payload);
            fetchAllCounts();
            if (payload.eventType === 'INSERT') {
              toast({
                title: "Database Updated",
                description: "New record added to inventory items"
              });
            }
          }
        )
        .subscribe(),

      supabase
        .channel('job-postings-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'job_postings'
          },
          (payload) => {
            console.log('Real-time update in job_postings:', payload);
            fetchAllCounts();
            if (payload.eventType === 'INSERT') {
              toast({
                title: "Database Updated",
                description: "New record added to job postings"
              });
            }
          }
        )
        .subscribe(),

      supabase
        .channel('newsletter-subscriptions-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'newsletter_subscriptions'
          },
          (payload) => {
            console.log('Real-time update in newsletter_subscriptions:', payload);
            fetchAllCounts();
            if (payload.eventType === 'INSERT') {
              toast({
                title: "Database Updated",
                description: "New record added to newsletter subscriptions"
              });
            }
          }
        )
        .subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [toast]);

  return { stats, refreshStats: fetchAllCounts };
};
