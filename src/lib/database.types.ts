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
          user_id: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      pets: {
        Row: {
          id: string
          owner_id: string
          name: string
          species: string
          breed: string | null
          age: number | null
          weight: number | null
          avatar_url: string | null
          cover_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          species: string
          breed?: string | null
          age?: number | null
          weight?: number | null
          avatar_url?: string | null
          cover_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          species?: string
          breed?: string | null
          age?: number | null
          weight?: number | null
          avatar_url?: string | null
          cover_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      medical_records: {
        Row: {
          id: string
          pet_id: string
          type: string
          date: string
          details: string | null
          created_at: string
        }
        Insert: {
          id?: string
          pet_id: string
          type: string
          date: string
          details?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          pet_id?: string
          type?: string
          date?: string
          details?: string | null
          created_at?: string
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
  }
}