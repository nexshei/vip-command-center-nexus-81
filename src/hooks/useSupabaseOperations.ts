
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type TableName = keyof Database['public']['Tables'];

export const useSupabaseOperations = <T extends TableName>(tableName: T) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔍 Fetching all records from ${tableName}...`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error(`❌ Error fetching ${tableName}:`, error);
        setError(error.message);
        throw error;
      }
      
      console.log(`✅ Successfully fetched ${data?.length || 0} records from ${tableName}`);
      return data || [];
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to fetch ${tableName}: ${errorMessage}`,
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const insertRecord = async (record: any) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`➕ Inserting record into ${tableName}:`, record);
      
      const { data, error } = await supabase
        .from(tableName)
        .insert(record)
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Error inserting into ${tableName}:`, error);
        setError(error.message);
        throw error;
      }
      
      console.log(`✅ Successfully inserted record into ${tableName}:`, data);
      toast({
        title: "Success",
        description: `Record added to ${tableName} successfully`
      });
      
      return data;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to insert into ${tableName}: ${errorMessage}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRecord = async (id: string, updates: any) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`📝 Updating record in ${tableName} with ID ${id}:`, updates);
      
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Error updating ${tableName}:`, error);
        setError(error.message);
        throw error;
      }
      
      console.log(`✅ Successfully updated record in ${tableName}:`, data);
      toast({
        title: "Success",
        description: `Record in ${tableName} updated successfully`
      });
      
      return data;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to update ${tableName}: ${errorMessage}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🗑️ Deleting record from ${tableName} with ID ${id}`);
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`❌ Error deleting from ${tableName}:`, error);
        setError(error.message);
        throw error;
      }
      
      console.log(`✅ Successfully deleted record from ${tableName}`);
      toast({
        title: "Success",
        description: `Record deleted from ${tableName} successfully`
      });
      
      return true;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to delete from ${tableName}: ${errorMessage}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCount = async () => {
    try {
      console.log(`🔢 Getting count for ${tableName}...`);
      
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error(`❌ Error getting count for ${tableName}:`, error);
        throw error;
      }
      
      console.log(`✅ Count for ${tableName}: ${count}`);
      return count || 0;
      
    } catch (err) {
      console.error(`❌ Failed to get count for ${tableName}:`, err);
      return 0;
    }
  };

  return {
    fetchAll,
    insertRecord,
    updateRecord,
    deleteRecord,
    getCount,
    loading,
    error
  };
};
