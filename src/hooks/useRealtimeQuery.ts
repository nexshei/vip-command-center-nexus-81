
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Explicitly type all available Supabase tables for type-safety
export type SupabaseTable =
  | "analytics"
  | "bookings"
  | "career_applications"
  | "careers"
  | "clients"
  | "communications"
  | "contact_submissions"
  | "emails"
  | "gallery_photos"
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
 * Usage: const { data, isLoading, error, refetch } = useRealtimeQuery("bookings", { table: "bookings" })
 */
export function useRealtimeQuery(
  queryKey: string,
  options: { table: SupabaseTable; select?: string; orderBy?: string } = { table: "bookings" }
) {
  const queryClient = useQueryClient();
  const { table, select = "*", orderBy } = options;

  const fetchData = async () => {
    let query = supabase.from(table).select(select);
    if (orderBy) query = query.order(orderBy, { ascending: false });
    const { data, error } = await query;
    if (error) throw error;
    return data;
  };

  const queryKeyArray = [queryKey];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeyArray,
    queryFn: fetchData,
  });

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: queryKeyArray });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, table]);

  return { data, isLoading, error, refetch };
}
