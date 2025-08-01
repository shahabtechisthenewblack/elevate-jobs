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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          country: string | null
          created_at: string
          employee_count: number | null
          fortune_500_rank: number | null
          founded_year: number | null
          funding_stage: string | null
          headquarters: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          state: string | null
          stock_symbol: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          employee_count?: number | null
          fortune_500_rank?: number | null
          founded_year?: number | null
          funding_stage?: string | null
          headquarters?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          state?: string | null
          stock_symbol?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          employee_count?: number | null
          fortune_500_rank?: number | null
          founded_year?: number | null
          funding_stage?: string | null
          headquarters?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          state?: string | null
          stock_symbol?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      layoff_alerts: {
        Row: {
          alert_type: string
          id: string
          layoff_id: string
          sent_at: string
          user_id: string
        }
        Insert: {
          alert_type?: string
          id?: string
          layoff_id: string
          sent_at?: string
          user_id: string
        }
        Update: {
          alert_type?: string
          id?: string
          layoff_id?: string
          sent_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "layoff_alerts_layoff_id_fkey"
            columns: ["layoff_id"]
            isOneToOne: false
            referencedRelation: "layoffs"
            referencedColumns: ["id"]
          },
        ]
      }
      layoffs: {
        Row: {
          city: string | null
          City: string | null
          city_name: string | null
          company: string[] | null
          Company: string | null
          company_name: string | null
          county: string | null
          created_at: string | null
          date_announced: string | null
          departments_affected: string[] | null
          employees_laid_off: number | null
          id: string
          industry: string | null
          Industry: string | null
          industry_name: string | null
          is_verified: boolean | null
          job_titles_affected: string[] | null
          percentage_laid_off: number | null
          reason: string | null
          region: string[] | null
          Region: string | null
          region_name: string | null
          severance_offered: boolean | null
          source_name: string | null
          source_url: string | null
          State: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          City?: string | null
          city_name?: string | null
          company?: string[] | null
          Company?: string | null
          company_name?: string | null
          county?: string | null
          created_at?: string | null
          date_announced?: string | null
          departments_affected?: string[] | null
          employees_laid_off?: number | null
          id?: string
          industry?: string | null
          Industry?: string | null
          industry_name?: string | null
          is_verified?: boolean | null
          job_titles_affected?: string[] | null
          percentage_laid_off?: number | null
          reason?: string | null
          region?: string[] | null
          Region?: string | null
          region_name?: string | null
          severance_offered?: boolean | null
          source_name?: string | null
          source_url?: string | null
          State?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          City?: string | null
          city_name?: string | null
          company?: string[] | null
          Company?: string | null
          company_name?: string | null
          county?: string | null
          created_at?: string | null
          date_announced?: string | null
          departments_affected?: string[] | null
          employees_laid_off?: number | null
          id?: string
          industry?: string | null
          Industry?: string | null
          industry_name?: string | null
          is_verified?: boolean | null
          job_titles_affected?: string[] | null
          percentage_laid_off?: number | null
          reason?: string | null
          region?: string[] | null
          Region?: string | null
          region_name?: string | null
          severance_offered?: boolean | null
          source_name?: string | null
          source_url?: string | null
          State?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      uploaded_resumes: {
        Row: {
          created_at: string
          extracted_text: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          extracted_text?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          extracted_text?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_company_watchlist: {
        Row: {
          added_at: string
          company_id: string
          id: string
          notification_email: boolean | null
          notification_push: boolean | null
          user_id: string
        }
        Insert: {
          added_at?: string
          company_id: string
          id?: string
          notification_email?: boolean | null
          notification_push?: boolean | null
          user_id: string
        }
        Update: {
          added_at?: string
          company_id?: string
          id?: string
          notification_email?: boolean | null
          notification_push?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_company_watchlist_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
