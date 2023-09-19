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
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: string
      }
      get_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: Json
      }
      get_claims: {
        Args: {
          uid: string
        }
        Returns: Json
      }
      get_my_claim: {
        Args: {
          claim: string
        }
        Returns: Json
      }
      get_my_claims: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_claims_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      set_claim: {
        Args: {
          uid: string
          claim: string
          value: Json
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  rsvp: {
    Tables: {
      invites: {
        Row: {
          created_at: string
          id: string
          invited_to: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          invited_to: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          invited_to?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      responses: {
        Row: {
          created_at: string
          id: number
          is_vegan: boolean | null
          is_vegetarian: boolean | null
          no_dairy: boolean | null
          no_gluten: boolean | null
          no_nuts: boolean | null
          other: string | null
          rsvp_user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          no_dairy?: boolean | null
          no_gluten?: boolean | null
          no_nuts?: boolean | null
          other?: string | null
          rsvp_user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          no_dairy?: boolean | null
          no_gluten?: boolean | null
          no_nuts?: boolean | null
          other?: string | null
          rsvp_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "responses_rsvp_user_id_fkey"
            columns: ["rsvp_user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string
          first_name: string
          id: string
          invite_id: string
          is_coming: boolean | null
          last_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          first_name: string
          id?: string
          invite_id: string
          is_coming?: boolean | null
          last_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          invite_id?: string
          is_coming?: boolean | null
          last_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_invite_id_fkey"
            columns: ["invite_id"]
            referencedRelation: "invites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
