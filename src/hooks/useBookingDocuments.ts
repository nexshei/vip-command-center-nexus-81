
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBookingDocuments = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const saveBookingDocument = async (bookingId: string, bookingData: any) => {
    setIsUploading(true);
    try {
      // First, ensure the documents bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
      
      if (!documentsBucket) {
        // Create the documents bucket if it doesn't exist
        const { error: bucketError } = await supabase.storage.createBucket('documents', {
          public: false,
          allowedMimeTypes: ['application/json', 'application/pdf', 'text/plain'],
          fileSizeLimit: 1024 * 1024 * 10 // 10MB
        });
        
        if (bucketError) {
          console.error('Error creating documents bucket:', bucketError);
          throw new Error(`Failed to create documents bucket: ${bucketError.message}`);
        }
      }

      // Create a document with booking details
      const documentContent = {
        id: bookingId,
        clientName: bookingData.full_name,
        eventType: bookingData.event_type,
        eventDate: bookingData.event_date,
        location: bookingData.location,
        email: bookingData.email,
        phone: bookingData.phone,
        protocolOfficers: bookingData.protocol_officers,
        vision: bookingData.vision,
        status: bookingData.status,
        createdAt: new Date().toISOString(),
      };

      // Convert to JSON string for storage
      const documentBlob = new Blob([JSON.stringify(documentContent, null, 2)], {
        type: 'application/json',
      });

      // Generate filename
      const fileName = `booking_${bookingId}_${Date.now()}.json`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(`bookings/${fileName}`, documentBlob, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Storage error:', error);
        throw new Error(`Failed to save document: ${error.message}`);
      }

      console.log('Document saved successfully:', data);
      
      toast({
        title: "Document Saved",
        description: "Booking document has been saved to storage.",
      });

      return data;
    } catch (error: any) {
      console.error('Error saving booking document:', error);
      toast({
        title: "Storage Error",
        description: error.message || "Failed to save document to storage.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    saveBookingDocument,
    isUploading,
  };
};
