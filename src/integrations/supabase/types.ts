export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          last_login: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          role?: string | null
        }
        Relationships: []
      }
      career_applications: {
        Row: {
          admin_notes: string | null
          cover_letter: string | null
          created_at: string | null
          cv_url: string | null
          email: string
          full_name: string
          id: string
          interview_date: string | null
          phone: string | null
          position: string | null
          professional_photo_url: string | null
          status: Database["public"]["Enums"]["request_status"] | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          cover_letter?: string | null
          created_at?: string | null
          cv_url?: string | null
          email: string
          full_name: string
          id?: string
          interview_date?: string | null
          phone?: string | null
          position?: string | null
          professional_photo_url?: string | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          cover_letter?: string | null
          created_at?: string | null
          cv_url?: string | null
          email?: string
          full_name?: string
          id?: string
          interview_date?: string | null
          phone?: string | null
          position?: string | null
          professional_photo_url?: string | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          client_type: string | null
          company: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          client_type?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          client_type?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          message: string
          status: Database["public"]["Enums"]["request_status"] | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          message: string
          status?: Database["public"]["Enums"]["request_status"] | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          message?: string
          status?: Database["public"]["Enums"]["request_status"] | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      email_notifications: {
        Row: {
          error_message: string | null
          id: string
          message_type: string
          recipient_email: string
          reference_id: string | null
          reference_table: string | null
          sent_at: string | null
          status: string | null
          subject: string
        }
        Insert: {
          error_message?: string | null
          id?: string
          message_type: string
          recipient_email: string
          reference_id?: string | null
          reference_table?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          error_message?: string | null
          id?: string
          message_type?: string
          recipient_email?: string
          reference_id?: string | null
          reference_table?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: string
          condition: string | null
          created_at: string | null
          id: string
          last_checked: string | null
          location: string | null
          name: string
          notes: string | null
          quantity: number | null
          supplier: string | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          category: string
          condition?: string | null
          created_at?: string | null
          id?: string
          last_checked?: string | null
          location?: string | null
          name: string
          notes?: string | null
          quantity?: number | null
          supplier?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          condition?: string | null
          created_at?: string | null
          id?: string
          last_checked?: string | null
          location?: string | null
          name?: string
          notes?: string | null
          quantity?: number | null
          supplier?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      item_bookings: {
        Row: {
          additional_notes: string | null
          chairs: number | null
          created_at: string
          cups: number | null
          decoration_items: number | null
          email: string | null
          event_date: string
          extension_cables: number | null
          forks_spoons: number | null
          full_name: string
          id: string
          lighting_equipment: number | null
          phone: string | null
          plates: number | null
          sound_system: number | null
          status: string | null
          tablecloths: number | null
          tables: number | null
          tents: number | null
          terms_agreed: boolean | null
          updated_at: string
          water_dispensers: number | null
        }
        Insert: {
          additional_notes?: string | null
          chairs?: number | null
          created_at?: string
          cups?: number | null
          decoration_items?: number | null
          email?: string | null
          event_date: string
          extension_cables?: number | null
          forks_spoons?: number | null
          full_name: string
          id?: string
          lighting_equipment?: number | null
          phone?: string | null
          plates?: number | null
          sound_system?: number | null
          status?: string | null
          tablecloths?: number | null
          tables?: number | null
          tents?: number | null
          terms_agreed?: boolean | null
          updated_at?: string
          water_dispensers?: number | null
        }
        Update: {
          additional_notes?: string | null
          chairs?: number | null
          created_at?: string
          cups?: number | null
          decoration_items?: number | null
          email?: string | null
          event_date?: string
          extension_cables?: number | null
          forks_spoons?: number | null
          full_name?: string
          id?: string
          lighting_equipment?: number | null
          phone?: string | null
          plates?: number | null
          sound_system?: number | null
          status?: string | null
          tablecloths?: number | null
          tables?: number | null
          tents?: number | null
          terms_agreed?: boolean | null
          updated_at?: string
          water_dispensers?: number | null
        }
        Relationships: []
      }
      job_postings: {
        Row: {
          application_deadline: string | null
          created_at: string | null
          department: string | null
          description: string | null
          employment_type: string | null
          id: string
          location: string | null
          requirements: string[] | null
          salary_range: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          application_deadline?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          employment_type?: string | null
          id?: string
          location?: string | null
          requirements?: string[] | null
          salary_range?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          application_deadline?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          employment_type?: string | null
          id?: string
          location?: string | null
          requirements?: string[] | null
          salary_range?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      meeting_requests: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          email: string
          event_date: string | null
          event_type: Database["public"]["Enums"]["event_type"] | null
          full_name: string
          id: string
          location: string | null
          meeting_scheduled_at: string | null
          phone: string
          protocol_officers:
            | Database["public"]["Enums"]["protocol_officers_range"]
            | null
          status: Database["public"]["Enums"]["request_status"] | null
          updated_at: string | null
          vision: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          email: string
          event_date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          full_name: string
          id?: string
          location?: string | null
          meeting_scheduled_at?: string | null
          phone: string
          protocol_officers?:
            | Database["public"]["Enums"]["protocol_officers_range"]
            | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
          vision?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          email?: string
          event_date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          full_name?: string
          id?: string
          location?: string | null
          meeting_scheduled_at?: string | null
          phone?: string
          protocol_officers?:
            | Database["public"]["Enums"]["protocol_officers_range"]
            | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
          vision?: string | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          is_active: boolean | null
          source: string | null
          subscribed_at: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean | null
          source?: string | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean | null
          source?: string | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      staff_members: {
        Row: {
          bio: string | null
          created_at: string | null
          department: string | null
          email: string
          full_name: string
          hire_date: string | null
          id: string
          phone: string | null
          position: string
          profile_image_url: string | null
          salary: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          full_name: string
          hire_date?: string | null
          id?: string
          phone?: string | null
          position: string
          profile_image_url?: string | null
          salary?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          full_name?: string
          hire_date?: string | null
          id?: string
          phone?: string | null
          position?: string
          profile_image_url?: string | null
          salary?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vvip_service_requests: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          email: string
          estimated_cost: number | null
          event_date: string | null
          event_type: Database["public"]["Enums"]["event_type"] | null
          full_name: string
          id: string
          location: string | null
          phone: string
          protocol_officers:
            | Database["public"]["Enums"]["protocol_officers_range"]
            | null
          requirements: string | null
          service_type: Database["public"]["Enums"]["service_type"] | null
          status: Database["public"]["Enums"]["request_status"] | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          email: string
          estimated_cost?: number | null
          event_date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          full_name: string
          id?: string
          location?: string | null
          phone: string
          protocol_officers?:
            | Database["public"]["Enums"]["protocol_officers_range"]
            | null
          requirements?: string | null
          service_type?: Database["public"]["Enums"]["service_type"] | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          email?: string
          estimated_cost?: number | null
          event_date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          full_name?: string
          id?: string
          location?: string | null
          phone?: string
          protocol_officers?:
            | Database["public"]["Enums"]["protocol_officers_range"]
            | null
          requirements?: string | null
          service_type?: Database["public"]["Enums"]["service_type"] | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
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
      event_type:
        | "corporate"
        | "wedding"
        | "diplomatic"
        | "private"
        | "government"
        | "other"
      protocol_officers_range: "1-5" | "5-10" | "10-20" | "20+"
      request_status:
        | "pending"
        | "reviewing"
        | "approved"
        | "in_progress"
        | "completed"
        | "cancelled"
      service_type:
        | "full_protocol"
        | "event_management"
        | "vip_escort"
        | "security_coordination"
        | "logistics_support"
        | "diplomatic_protocol"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      event_type: [
        "corporate",
        "wedding",
        "diplomatic",
        "private",
        "government",
        "other",
      ],
      protocol_officers_range: ["1-5", "5-10", "10-20", "20+"],
      request_status: [
        "pending",
        "reviewing",
        "approved",
        "in_progress",
        "completed",
        "cancelled",
      ],
      service_type: [
        "full_protocol",
        "event_management",
        "vip_escort",
        "security_coordination",
        "logistics_support",
        "diplomatic_protocol",
      ],
    },
  },
} as const
