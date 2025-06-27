
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Quote {
  id: string;
  clientName: string;
  serviceType: string;
  lineItems: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  taxRate: number;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  expiryDate?: string;
  quoteDetails?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
  fileName?: string;
}

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      // List all files in the quotes folder
      const { data: files, error } = await supabase.storage
        .from('documents')
        .list('quotes', {
          limit: 100,
          offset: 0,
        });

      if (error) {
        console.error('Error listing quote files:', error);
        throw error;
      }

      if (!files || files.length === 0) {
        setQuotes([]);
        setIsLoading(false);
        return;
      }

      // Download and parse each quote file
      const quotePromises = files.map(async (file) => {
        try {
          const { data, error: downloadError } = await supabase.storage
            .from('documents')
            .download(`quotes/${file.name}`);

          if (downloadError) {
            console.error(`Error downloading ${file.name}:`, downloadError);
            return null;
          }

          const text = await data.text();
          const quoteData = JSON.parse(text);
          
          return {
            ...quoteData,
            fileName: file.name
          } as Quote;
        } catch (err) {
          console.error(`Error parsing quote file ${file.name}:`, err);
          return null;
        }
      });

      const quotesData = await Promise.all(quotePromises);
      const validQuotes = quotesData.filter((quote): quote is Quote => quote !== null);
      
      // Sort by creation date (newest first)
      validQuotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setQuotes(validQuotes);
    } catch (error: any) {
      console.error('Error fetching quotes:', error);
      toast({
        title: "Error",
        description: "Failed to load quotes from storage.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQuote = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from('documents')
        .remove([`quotes/${fileName}`]);

      if (error) {
        throw error;
      }

      // Refresh the quotes list
      await fetchQuotes();
      
      toast({
        title: "Quote Deleted",
        description: "Quote has been successfully deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting quote:', error);
      toast({
        title: "Error",
        description: "Failed to delete quote.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return {
    quotes,
    isLoading,
    refetch: fetchQuotes,
    deleteQuote
  };
};
