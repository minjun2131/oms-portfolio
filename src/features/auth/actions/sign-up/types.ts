import { AuthResponse } from "@supabase/supabase-js";

export interface SignUpActionResponse {
  success: boolean;
  data?: AuthResponse["data"];
  error?: string;
}
