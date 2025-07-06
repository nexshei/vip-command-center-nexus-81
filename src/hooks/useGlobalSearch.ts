
import { useState, useEffect, useMemo } from 'react';
import { useClients } from './useClients';
import { useMeetingRequests } from './useMeetingRequests';
import { useContactSubmissions } from './useContactSubmissions';
import { useApplications } from './useApplications';
import { useSubscribers } from './useSubscribers';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'client' | 'booking' | 'contact' | 'application' | 'subscriber' | 'item-booking';
  url: string;
  data: any;
}

export const useGlobalSearch = (searchTerm: string) => {
  const [itemBookings, setItemBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: clients = [] } = useClients();
  const { data: meetings = [] } = useMeetingRequests();
  const { data: contacts = [] } = useContactSubmissions();
  const { data: applications = [] } = useApplications();
  const { data: subscribers = [] } = useSubscribers();

  // Fetch item bookings
  useEffect(() => {
    const fetchItemBookings = async () => {
      try {
        const { data, error } = await supabase
          .from('item_bookings')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setItemBookings(data || []);
      } catch (error) {
        console.error('Error fetching item bookings:', error);
        setItemBookings([]);
      }
    };

    fetchItemBookings();
  }, []);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase();
    const results: SearchResult[] = [];

    // Search clients
    clients.forEach(client => {
      const matches = 
        client.full_name?.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term) ||
        client.company?.toLowerCase().includes(term) ||
        client.phone?.includes(term);
      
      if (matches) {
        results.push({
          id: client.id,
          title: client.full_name,
          subtitle: `Client - ${client.email}${client.company ? ` | ${client.company}` : ''}`,
          type: 'client',
          url: '/clients',
          data: client
        });
      }
    });

    // Search meeting requests/bookings
    meetings.forEach(meeting => {
      const matches = 
        meeting.full_name?.toLowerCase().includes(term) ||
        meeting.email?.toLowerCase().includes(term) ||
        meeting.event_type?.toLowerCase().includes(term) ||
        meeting.location?.toLowerCase().includes(term) ||
        meeting.vision?.toLowerCase().includes(term);
      
      if (matches) {
        results.push({
          id: meeting.id,
          title: meeting.full_name,
          subtitle: `Booking - ${meeting.event_type || 'Event'} | ${meeting.location || 'TBD'}`,
          type: 'booking',
          url: '/all-bookings',
          data: meeting
        });
      }
    });

    // Search item bookings
    itemBookings.forEach(booking => {
      const matches = 
        booking.full_name?.toLowerCase().includes(term) ||
        booking.email?.toLowerCase().includes(term) ||
        booking.phone?.includes(term);
      
      if (matches) {
        results.push({
          id: booking.id,
          title: booking.full_name,
          subtitle: `Item Booking - ${new Date(booking.event_date).toLocaleDateString()}`,
          type: 'item-booking',
          url: '/item-bookings',
          data: booking
        });
      }
    });

    // Search contact submissions
    contacts.forEach(contact => {
      const matches = 
        contact.full_name?.toLowerCase().includes(term) ||
        contact.email?.toLowerCase().includes(term) ||
        contact.subject?.toLowerCase().includes(term) ||
        contact.message?.toLowerCase().includes(term);
      
      if (matches) {
        results.push({
          id: contact.id,
          title: contact.full_name,
          subtitle: `Contact - ${contact.subject || 'Message'}`,
          type: 'contact',
          url: '/contact-messages',
          data: contact
        });
      }
    });

    // Search applications
    applications.forEach(app => {
      const matches = 
        app.full_name?.toLowerCase().includes(term) ||
        app.email?.toLowerCase().includes(term) ||
        app.position?.toLowerCase().includes(term);
      
      if (matches) {
        results.push({
          id: app.id,
          title: app.full_name,
          subtitle: `Application - ${app.position || 'Position not specified'}`,
          type: 'application',
          url: '/careers',
          data: app
        });
      }
    });

    // Search subscribers
    subscribers.forEach(subscriber => {
      const matches = subscriber.email?.toLowerCase().includes(term);
      
      if (matches) {
        results.push({
          id: subscriber.id,
          title: subscriber.email,
          subtitle: 'Newsletter Subscriber',
          type: 'subscriber',
          url: '/subscribers',
          data: subscriber
        });
      }
    });

    return results.slice(0, 10); // Limit to 10 results
  }, [searchTerm, clients, meetings, contacts, applications, subscribers, itemBookings]);

  return { searchResults, isLoading };
};
