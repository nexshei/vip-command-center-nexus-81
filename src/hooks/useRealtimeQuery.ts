
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Explicitly type all available Supabase tables for type-safety
export type SupabaseTable =
  | "analytics"
  | "bookings"
  | "career_applications"
  | "clients"
  | "communications"
  | "contact_submissions"
  | "emails"
  | "inventory"
  | "jobs"
  | "meeting_requests"
  | "profiles"
  | "quotes"
  | "staff"
  | "subscribers"
  | "subscriptions"
  | "vvip_service_requests";

/**
 * Generic realtime query for a Supabase table.
 * Usage: const { data, isLoading, error } = useRealtimeQuery("bookings")
 */
export function useRealtimeQuery(
  table: SupabaseTable,
  options: { select?: string; orderBy?: string } = {}
) {
  const queryClient = useQueryClient();
  const select = options.select || "*";
  const orderBy = options.orderBy;

  const fetchData = async () => {
    let query = supabase.from(table).select(select);
    if (orderBy) query = query.order(orderBy, { ascending: false });
    const { data, error } = await query;
    if (error) throw error;
    return data;
  };

  const queryKey = [table];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: fetchData,
  });

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, table]);

  return { data, isLoading, error };
}
