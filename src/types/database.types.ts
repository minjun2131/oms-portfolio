export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          avatar_url: string | null
          is_deleted: boolean
          deleted_at: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          avatar_url?: string | null
          is_deleted?: boolean
          deleted_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          avatar_url?: string | null
          is_deleted?: boolean
          deleted_at?: string | null
        }
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
