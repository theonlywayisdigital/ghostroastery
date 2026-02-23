export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          business_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          business_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          business_name?: string | null;
          created_at?: string;
        };
      };
      delivery_addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          line1: string;
          line2: string | null;
          city: string;
          postcode: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          line1: string;
          line2?: string | null;
          city: string;
          postcode: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string;
          line1?: string;
          line2?: string | null;
          city?: string;
          postcode?: string;
          is_default?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          bag_style: string;
          bag_colour: string;
          bag_size: string;
          roast_profile: string;
          grind: string;
          quantity: number;
          price_per_bag: number;
          total_price: number;
          label_file_url: string | null;
          delivery_address_id: string;
          stripe_payment_id: string | null;
          payment_status: string;
          order_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id: string;
          bag_style: string;
          bag_colour: string;
          bag_size: string;
          roast_profile: string;
          grind: string;
          quantity: number;
          price_per_bag: number;
          total_price: number;
          label_file_url?: string | null;
          delivery_address_id: string;
          stripe_payment_id?: string | null;
          payment_status?: string;
          order_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string;
          bag_style?: string;
          bag_colour?: string;
          bag_size?: string;
          roast_profile?: string;
          grind?: string;
          quantity?: number;
          price_per_bag?: number;
          total_price?: number;
          label_file_url?: string | null;
          delivery_address_id?: string;
          stripe_payment_id?: string | null;
          payment_status?: string;
          order_status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types
export type User = Database["public"]["Tables"]["users"]["Row"];
export type DeliveryAddress =
  Database["public"]["Tables"]["delivery_addresses"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];

export type NewUser = Database["public"]["Tables"]["users"]["Insert"];
export type NewDeliveryAddress =
  Database["public"]["Tables"]["delivery_addresses"]["Insert"];
export type NewOrder = Database["public"]["Tables"]["orders"]["Insert"];
