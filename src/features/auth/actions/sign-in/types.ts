import { AuthResponse } from "@supabase/supabase-js";

export interface SignInActionResponse {
  success: boolean;
  data?: AuthResponse["data"];
  error?: string;
}
