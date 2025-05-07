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
      client_policies: {
        Row: {
          client_id: string
          created_at: string
          deduction_date: string | null
          id: string
          issue_date: string | null
          month: number
          policies_count: number
          policy_premium: number
          year: number
        }
        Insert: {
          client_id: string
          created_at?: string
          deduction_date?: string | null
          id?: string
          issue_date?: string | null
          month: number
          policies_count?: number
          policy_premium?: number
          year: number
        }
        Update: {
          client_id?: string
          created_at?: string
          deduction_date?: string | null
          id?: string
          issue_date?: string | null
          month?: number
          policies_count?: number
          policy_premium?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_policies_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          id: string
          location: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          name?: string
        }
        Relationships: []
      }
      loa_docs: {
        Row: {
          file_name: string
          file_path: string
          id: string
          policy_id: string
          uploaded_at: string
        }
        Insert: {
          file_name: string
          file_path: string
          id?: string
          policy_id: string
          uploaded_at?: string
        }
        Update: {
          file_name?: string
          file_path?: string
          id?: string
          policy_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loa_docs_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "client_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_docs: {
        Row: {
          file_name: string
          file_path: string
          id: string
          policy_id: string
          uploaded_at: string
        }
        Insert: {
          file_name: string
          file_path: string
          id?: string
          policy_id: string
          uploaded_at?: string
        }
        Update: {
          file_name?: string
          file_path?: string
          id?: string
          policy_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pdf_docs_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "client_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_numbers: {
        Row: {
          id: string
          policy_id: string
          policy_number: string
        }
        Insert: {
          id?: string
          policy_id: string
          policy_number: string
        }
        Update: {
          id?: string
          policy_id?: string
          policy_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "policy_numbers_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "client_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_products: {
        Row: {
          id: string
          policy_id: string
          product: string
        }
        Insert: {
          id?: string
          policy_id: string
          product: string
        }
        Update: {
          id?: string
          policy_id?: string
          product?: string
        }
        Relationships: [
          {
            foreignKeyName: "policy_products_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "client_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_docs: {
        Row: {
          file_name: string
          file_path: string
          id: string
          policy_id: string
          uploaded_at: string
        }
        Insert: {
          file_name: string
          file_path: string
          id?: string
          policy_id: string
          uploaded_at?: string
        }
        Update: {
          file_name?: string
          file_path?: string
          id?: string
          policy_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_docs_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "client_policies"
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
