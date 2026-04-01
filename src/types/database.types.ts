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
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          billing_key: string | null
          customer_key: string | null
          status: string
          plan: string
          amount: number
          started_at: string
          next_billing_at: string | null
          cancelled_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          billing_key?: string | null
          customer_key?: string | null
          status?: string
          plan?: string
          amount?: number
          started_at?: string
          next_billing_at?: string | null
          cancelled_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          billing_key?: string | null
          customer_key?: string | null
          status?: string
          plan?: string
          amount?: number
          started_at?: string
          next_billing_at?: string | null
          cancelled_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          user_id: string
          subscription_id: string | null
          payment_key: string | null
          order_id: string | null
          amount: number | null
          status: string
          item: string | null
          paid_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_id?: string | null
          payment_key?: string | null
          order_id?: string | null
          amount?: number | null
          status?: string
          item?: string | null
          paid_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_id?: string | null
          payment_key?: string | null
          order_id?: string | null
          amount?: number | null
          status?: string
          paid_at?: string
        }
        Relationships: []
      }
      shops: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          status: string
          platform: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          status?: string
          platform: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          status?: string
          platform?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          shop_id: string | null
          name: string
          sku: string | null
          price: number
          stock_quantity: number
          status: string
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          shop_id?: string | null
          name: string
          sku?: string | null
          price: number
          stock_quantity?: number
          status?: string
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          shop_id?: string | null
          name?: string
          sku?: string | null
          price?: number
          stock_quantity?: number
          status?: string
          image_url?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          shop_id: string | null
          order_number: string
          status: string
          total_amount: number
          customer_name: string | null
          customer_phone: string | null
          shipping_address: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          shop_id?: string | null
          order_number: string
          status?: string
          total_amount: number
          customer_name?: string | null
          customer_phone?: string | null
          shipping_address?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          shop_id?: string | null
          order_number?: string
          status?: string
          total_amount?: number
          customer_name?: string | null
          customer_phone?: string | null
          shipping_address?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          created_at: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
        }
        Insert: {
          id?: string
          created_at?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
        }
        Update: {
          id?: string
          created_at?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
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
