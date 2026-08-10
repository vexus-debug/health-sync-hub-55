export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      lab_tests: {
        Row: {
          active: boolean
          category_id: string | null
          code: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          input_type: string
          name: string
          options: string[]
          reference_range: string | null
          result_fields: Json
          sort_order: number
          unit: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          active?: boolean
          category_id?: string | null
          code?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          input_type?: string
          name: string
          options?: string[]
          reference_range?: string | null
          result_fields?: Json
          sort_order?: number
          unit?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          active?: boolean
          category_id?: string | null
          code?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          input_type?: string
          name?: string
          options?: string[]
          reference_range?: string | null
          result_fields?: Json
          sort_order?: number
          unit?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_tests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "test_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      pharmacy_items: {
        Row: {
          active: boolean
          category: string
          created_at: string
          id: string
          name: string
          updated_at: string
          uses: string | null
        }
        Insert: {
          active?: boolean
          category: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          uses?: string | null
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          uses?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number | null
          updated_at: string
          uses: string | null
        }
        Insert: {
          active?: boolean
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number | null
          updated_at?: string
          uses?: string | null
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number | null
          updated_at?: string
          uses?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active: boolean | null
          created_at: string | null
          display_name: string | null
          id: string
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      result_audit_log: {
        Row: {
          action: string
          changed_by: string | null
          changed_by_name: string | null
          created_at: string
          field_key: string | null
          field_label: string | null
          form_id: string | null
          id: string
          new_value: string | null
          old_value: string | null
          reason: string | null
          serial: string | null
        }
        Insert: {
          action: string
          changed_by?: string | null
          changed_by_name?: string | null
          created_at?: string
          field_key?: string | null
          field_label?: string | null
          form_id?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          reason?: string | null
          serial?: string | null
        }
        Update: {
          action?: string
          changed_by?: string | null
          changed_by_name?: string | null
          created_at?: string
          field_key?: string | null
          field_label?: string | null
          form_id?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          reason?: string | null
          serial?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "result_audit_log_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "test_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_activity: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          scan_id: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          scan_id?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          scan_id?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_activity_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_appointments: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          patient_id: string | null
          patient_name: string
          patient_phone: string | null
          scan_type: string
          scheduled_at: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          patient_name: string
          patient_phone?: string | null
          scan_type: string
          scheduled_at: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          patient_name?: string
          patient_phone?: string | null
          scan_type?: string
          scheduled_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "scan_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_images: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          scan_id: string
          sort_order: number
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          scan_id: string
          sort_order?: number
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          scan_id?: string
          sort_order?: number
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_images_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_patients: {
        Row: {
          address: string | null
          age: number | null
          created_at: string
          created_by: string | null
          doctor_phone: string | null
          email: string | null
          full_name: string
          gender: string | null
          id: string
          mrn: string
          notes: string | null
          phone: string | null
          primary_doctor: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          age?: number | null
          created_at?: string
          created_by?: string | null
          doctor_phone?: string | null
          email?: string | null
          full_name: string
          gender?: string | null
          id?: string
          mrn: string
          notes?: string | null
          phone?: string | null
          primary_doctor?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          age?: number | null
          created_at?: string
          created_by?: string | null
          doctor_phone?: string | null
          email?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          mrn?: string
          notes?: string | null
          phone?: string | null
          primary_doctor?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      scans: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          body_part: string | null
          clinical_indication: string | null
          created_at: string
          created_by: string | null
          findings: string | null
          id: string
          impression: string | null
          modality: string | null
          patient_id: string
          recommendation: string | null
          referring_doctor: string | null
          report_text: string | null
          reported_at: string | null
          reported_by: string | null
          scan_date: string
          scan_type: string
          serial: string
          status: string
          updated_at: string
          urgent: boolean
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          body_part?: string | null
          clinical_indication?: string | null
          created_at?: string
          created_by?: string | null
          findings?: string | null
          id?: string
          impression?: string | null
          modality?: string | null
          patient_id: string
          recommendation?: string | null
          referring_doctor?: string | null
          report_text?: string | null
          reported_at?: string | null
          reported_by?: string | null
          scan_date?: string
          scan_type: string
          serial: string
          status?: string
          updated_at?: string
          urgent?: boolean
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          body_part?: string | null
          clinical_indication?: string | null
          created_at?: string
          created_by?: string | null
          findings?: string | null
          id?: string
          impression?: string | null
          modality?: string | null
          patient_id?: string
          recommendation?: string | null
          referring_doctor?: string | null
          report_text?: string | null
          reported_at?: string | null
          reported_by?: string | null
          scan_date?: string
          scan_type?: string
          serial?: string
          status?: string
          updated_at?: string
          urgent?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "scans_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "scan_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      scientists: {
        Row: {
          active: boolean | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          role: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          role?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          role?: string | null
        }
        Relationships: []
      }
      staff_permissions: {
        Row: {
          created_at: string
          granted_by: string | null
          id: string
          permission: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by?: string | null
          id?: string
          permission: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by?: string | null
          id?: string
          permission?: string
          user_id?: string
        }
        Relationships: []
      }
      test_categories: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      test_forms: {
        Row: {
          age: number
          approval_status: string
          approved_at: string | null
          approved_by: string | null
          bill: string | null
          clinical_notes: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          date_collected: string
          doctor_phone: string | null
          email: string | null
          examination_required: string | null
          gender: string
          id: string
          institution: string | null
          last_edited_by: string | null
          nature_of_specimen: string | null
          patient_name: string
          phone: string | null
          referred_by: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          results: Json | null
          scientist_id: string | null
          serial: string
          status: string | null
          submitted_at: string | null
          submitted_by: string | null
          tests_requested: string[]
          updated_at: string | null
        }
        Insert: {
          age: number
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          bill?: string | null
          clinical_notes?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          date_collected?: string
          doctor_phone?: string | null
          email?: string | null
          examination_required?: string | null
          gender: string
          id?: string
          institution?: string | null
          last_edited_by?: string | null
          nature_of_specimen?: string | null
          patient_name: string
          phone?: string | null
          referred_by?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          results?: Json | null
          scientist_id?: string | null
          serial: string
          status?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          tests_requested?: string[]
          updated_at?: string | null
        }
        Update: {
          age?: number
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          bill?: string | null
          clinical_notes?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          date_collected?: string
          doctor_phone?: string | null
          email?: string | null
          examination_required?: string | null
          gender?: string
          id?: string
          institution?: string | null
          last_edited_by?: string | null
          nature_of_specimen?: string | null
          patient_name?: string
          phone?: string | null
          referred_by?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          results?: Json | null
          scientist_id?: string | null
          serial?: string
          status?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          tests_requested?: string[]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_forms_scientist_id_fkey"
            columns: ["scientist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_result: {
        Args: { _serial: string }
        Returns: {
          age: number
          completed_at: string
          date_collected: string
          examination_required: string
          gender: string
          nature_of_specimen: string
          patient_name: string
          referred_by: string
          results: Json
          scientist_name: string
          serial: string
          status: string
          tests_requested: string[]
        }[]
      }
      get_public_scan: {
        Args: { _serial: string }
        Returns: {
          age: number
          approved_at: string
          approver_name: string
          body_part: string
          clinical_indication: string
          findings: string
          gender: string
          impression: string
          modality: string
          mrn: string
          patient_name: string
          phone: string
          primary_doctor: string
          recommendation: string
          referring_doctor: string
          report_text: string
          reported_at: string
          reporter_name: string
          scan_date: string
          scan_type: string
          serial: string
          status: string
          urgent: boolean
        }[]
      }
      has_lab_permission: {
        Args: { _permission: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_lab_admin: { Args: { _user_id: string }; Returns: boolean }
      is_senior_scientist: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "lab_admin" | "staff"
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
      app_role: ["lab_admin", "staff"],
    },
  },
} as const
