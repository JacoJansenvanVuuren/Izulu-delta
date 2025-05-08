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
      clients: {
        Row: {
          created_at: string | null
          deduction_date: string | null
          id: string
          issue_date: string | null
          loa_doc_url: string | null
          location: string | null
          name: string
          pdf_docs_url: string[] | null
          policies_count: number | null
          policy_numbers: string[] | null
          policy_premium: number | null
          products: string[] | null
          schedule_docs_url: string[] | null
        }
        Insert: {
          created_at?: string | null
          deduction_date?: string | null
          id?: string
          issue_date?: string | null
          loa_doc_url?: string | null
          location?: string | null
          name: string
          pdf_docs_url?: string[] | null
          policies_count?: number | null
          policy_numbers?: string[] | null
          policy_premium?: number | null
          products?: string[] | null
          schedule_docs_url?: string[] | null
        }
        Update: {
          created_at?: string | null
          deduction_date?: string | null
          id?: string
          issue_date?: string | null
          loa_doc_url?: string | null
          location?: string | null
          name?: string
          pdf_docs_url?: string[] | null
          policies_count?: number | null
          policy_numbers?: string[] | null
          policy_premium?: number | null
          products?: string[] | null
          schedule_docs_url?: string[] | null
        }
        Relationships: []
      }
      clients_april: {
        Row: {
          client_id: string | null
          created_at: string | null
          deductiondate: string | null
          id: string
          issuedate: string | null
          loadocurl: string | null
          location: string | null
          name: string
          pdfdocsurl: string[] | null
          policiescount: number | null
          policynumbers: string[] | null
          policypremium: string | null
          products: string[] | null
          scheduledocsurl: string[] | null
          year: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year: number
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name?: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "clients_april_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_august: {
        Row: {
          client_id: string | null
          created_at: string | null
          deductiondate: string | null
          id: string
          issuedate: string | null
          loadocurl: string | null
          location: string | null
          name: string
          pdfdocsurl: string[] | null
          policiescount: number | null
          policynumbers: string[] | null
          policypremium: string | null
          products: string[] | null
          scheduledocsurl: string[] | null
          year: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year: number
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name?: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "clients_august_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_december: {
        Row: {
          client_id: string | null
          created_at: string | null
          deductiondate: string | null
          id: string
          issuedate: string | null
          loadocurl: string | null
          location: string | null
          name: string
          pdfdocsurl: string[] | null
          policiescount: number | null
          policynumbers: string[] | null
          policypremium: string | null
          products: string[] | null
          scheduledocsurl: string[] | null
          year: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year: number
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name?: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "clients_december_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_february: {
        Row: {
          client_id: string | null
          created_at: string | null
          deductiondate: string | null
          id: string
          issuedate: string | null
          loadocurl: string | null
          location: string | null
          name: string
          pdfdocsurl: string[] | null
          policiescount: number | null
          policynumbers: string[] | null
          policypremium: string | null
          products: string[] | null
          scheduledocsurl: string[] | null
          year: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year: number
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name?: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "clients_february_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_january: {
        Row: {
          client_id: string | null
          created_at: string | null
          deductiondate: string | null
          id: string
          issuedate: string | null
          loadocurl: string | null
          location: string | null
          name: string
          pdfdocsurl: string[] | null
          policiescount: number | null
          policynumbers: string[] | null
          policypremium: string | null
          products: string[] | null
          scheduledocsurl: string[] | null
          year: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year: number
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name?: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "clients_january_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_july: {
        Row: {
          client_id: string | null
          created_at: string | null
          deductiondate: string | null
          id: string
          issuedate: string | null
          loadocurl: string | null
          location: string | null
          name: string
          pdfdocsurl: string[] | null
          policiescount: number | null
          policynumbers: string[] | null
          policypremium: string | null
          products: string[] | null
          scheduledocsurl: string[] | null
          year: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year: number
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name?: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "clients_july_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_june: {
        Row: {
          client_id: string | null
          created_at: string | null
          deductiondate: string | null
          id: string
          issuedate: string | null
          loadocurl: string | null
          location: string | null
          name: string
          pdfdocsurl: string[] | null
          policiescount: number | null
          policynumbers: string[] | null
          policypremium: string | null
          products: string[] | null
          scheduledocsurl: string[] | null
          year: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year: number
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name?: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "clients_june_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_march: {
        Row: {
          client_id: string | null
          created_at: string | null
          deductiondate: string | null
          id: string
          issuedate: string | null
          loadocurl: string | null
          location: string | null
          name: string
          pdfdocsurl: string[] | null
          policiescount: number | null
          policynumbers: string[] | null
          policypremium: string | null
          products: string[] | null
          scheduledocsurl: string[] | null
          year: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year: number
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name?: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "clients_march_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_may: {
        Row: {
          client_id: string | null
          created_at: string | null
          deductiondate: string | null
          id: string
          issuedate: string | null
          loadocurl: string | null
          location: string | null
          name: string
          pdfdocsurl: string[] | null
          policiescount: number | null
          policynumbers: string[] | null
          policypremium: string | null
          products: string[] | null
          scheduledocsurl: string[] | null
          year: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year: number
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name?: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "clients_may_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_november: {
        Row: {
          client_id: string | null
          created_at: string | null
          deductiondate: string | null
          id: string
          issuedate: string | null
          loadocurl: string | null
          location: string | null
          name: string
          pdfdocsurl: string[] | null
          policiescount: number | null
          policynumbers: string[] | null
          policypremium: string | null
          products: string[] | null
          scheduledocsurl: string[] | null
          year: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year: number
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name?: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "clients_november_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_october: {
        Row: {
          client_id: string | null
          created_at: string | null
          deductiondate: string | null
          id: string
          issuedate: string | null
          loadocurl: string | null
          location: string | null
          name: string
          pdfdocsurl: string[] | null
          policiescount: number | null
          policynumbers: string[] | null
          policypremium: string | null
          products: string[] | null
          scheduledocsurl: string[] | null
          year: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year: number
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name?: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "clients_october_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_september: {
        Row: {
          client_id: string | null
          created_at: string | null
          deductiondate: string | null
          id: string
          issuedate: string | null
          loadocurl: string | null
          location: string | null
          name: string
          pdfdocsurl: string[] | null
          policiescount: number | null
          policynumbers: string[] | null
          policypremium: string | null
          products: string[] | null
          scheduledocsurl: string[] | null
          year: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year: number
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          deductiondate?: string | null
          id?: string
          issuedate?: string | null
          loadocurl?: string | null
          location?: string | null
          name?: string
          pdfdocsurl?: string[] | null
          policiescount?: number | null
          policynumbers?: string[] | null
          policypremium?: string | null
          products?: string[] | null
          scheduledocsurl?: string[] | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "clients_september_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
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
