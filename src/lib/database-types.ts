export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string;
          org_id: string;
          client_id: string;
          session_type: string;
          scheduled_start: string;
          scheduled_end: string;
          location: string | null;
          status: string;
          skill_scores: Json;
          payment_amount: string | null;
          payment_method: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      follow_ups: {
        Row: {
          id: string;
          org_id: string;
          client_id: string;
          session_id: string | null;
          type: string;
          due_at: string;
          completed_at: string | null;
          notes: string | null;
          created_at: string;
        };
      };
      clients: {
        Row: {
          id: string;
          org_id: string;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string;
          date_of_birth: string | null;
          license_type: string | null;
          experience_level: string;
          notes: string | null;
          total_sessions: number;
          total_paid: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}