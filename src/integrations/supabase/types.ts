export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics: {
        Row: {
          created_at: string | null
          id: string
          metric_name: string | null
          metric_value: number | null
          notes: string | null
          record_date: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_name?: string | null
          metric_value?: number | null
          notes?: string | null
          record_date?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_name?: string | null
          metric_value?: number | null
          notes?: string | null
          record_date?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          approval_status: string | null
          client_id: string | null
          client_name: string | null
          created_at: string | null
          id: string
          notes: string | null
          revenue: number | null
          scheduled_at: string | null
          service_type: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approval_status?: string | null
          client_id?: string | null
          client_name?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          revenue?: number | null
          scheduled_at?: string | null
          service_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approval_status?: string | null
          client_id?: string | null
          client_name?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          revenue?: number | null
          scheduled_at?: string | null
          service_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      career_applications: {
        Row: {
          cover_letter: string | null
          created_at: string | null
          cv_url: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          position: string | null
          professional_photo_url: string | null
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string | null
          cv_url?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          position?: string | null
          professional_photo_url?: string | null
        }
        Update: {
          cover_letter?: string | null
          created_at?: string | null
          cv_url?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          position?: string | null
          professional_photo_url?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          company: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          notes: string | null
          phone: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      communications: {
        Row: {
          channel: string | null
          created_at: string | null
          id: string
          message: string | null
          receiver_id: string | null
          sender_id: string | null
          subject: string | null
        }
        Insert: {
          channel?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          subject?: string | null
        }
        Update: {
          channel?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      emails: {
        Row: {
          body: string | null
          from_email: string | null
          id: string
          sent_at: string | null
          status: string | null
          subject: string | null
          to_email: string | null
        }
        Insert: {
          body?: string | null
          from_email?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          to_email?: string | null
        }
        Update: {
          body?: string | null
          from_email?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          to_email?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          item_name: string | null
          location: string | null
          quantity: number | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          item_name?: string | null
          location?: string | null
          quantity?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          item_name?: string | null
          location?: string | null
          quantity?: number | null
          status?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          department: string | null
          description: string | null
          id: string
          location: string | null
          posted_at: string | null
          requirements: string | null
          status: string | null
          title: string | null
        }
        Insert: {
          department?: string | null
          description?: string | null
          id?: string
          location?: string | null
          posted_at?: string | null
          requirements?: string | null
          status?: string | null
          title?: string | null
        }
        Update: {
          department?: string | null
          description?: string | null
          id?: string
          location?: string | null
          posted_at?: string | null
          requirements?: string | null
          status?: string | null
          title?: string | null
        }
        Relationships: []
      }
      meeting_requests: {
        Row: {
          created_at: string | null
          email: string
          event_date: string | null
          event_type: string | null
          full_name: string
          id: string
          location: string | null
          phone: string
          protocol_officers: string | null
          vision: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          event_date?: string | null
          event_type?: string | null
          full_name: string
          id?: string
          location?: string | null
          phone: string
          protocol_officers?: string | null
          vision?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          event_date?: string | null
          event_type?: string | null
          full_name?: string
          id?: string
          location?: string | null
          phone?: string
          protocol_officers?: string | null
          vision?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          quote_details: string | null
          requested_service: string | null
          requester_id: string | null
          requester_name: string | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          quote_details?: string | null
          requested_service?: string | null
          requester_id?: string | null
          requester_name?: string | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          quote_details?: string | null
          requested_service?: string | null
          requester_id?: string | null
          requester_name?: string | null
          status?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          notes: string | null
          phone: string | null
          role: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          active: boolean | null
          client_id: string | null
          created_at: string | null
          end_date: string | null
          id: string
          notes: string | null
          start_date: string | null
          tier: string | null
        }
        Insert: {
          active?: boolean | null
          client_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          tier?: string | null
        }
        Update: {
          active?: boolean | null
          client_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          tier?: string | null
        }
        Relationships: []
      }
      vvip_service_requests: {
        Row: {
          created_at: string | null
          email: string
          event_date: string | null
          event_type: string | null
          full_name: string
          id: string
          location: string | null
          phone: string
          protocol_officers: string | null
          requirements: string | null
          service_type: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          event_date?: string | null
          event_type?: string | null
          full_name: string
          id?: string
          location?: string | null
          phone: string
          protocol_officers?: string | null
          requirements?: string | null
          service_type?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          event_date?: string | null
          event_type?: string | null
          full_name?: string
          id?: string
          location?: string | null
          phone?: string
          protocol_officers?: string | null
          requirements?: string | null
          service_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
