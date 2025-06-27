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
      gallery_items: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          is_featured: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          title?: string
          updated_at?: string | null
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
