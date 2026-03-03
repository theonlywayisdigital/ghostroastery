import { createClient } from "@supabase/supabase-js";
import {
  createBrowserClient as createBrowserSupabaseClient,
  createServerClient as createSSRServerClient,
} from "@supabase/ssr";
import type { Database } from "@/types/database";

// Browser client (for client components)
export const createBrowserClient = () => {
  return createBrowserSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Cookie-based auth server client (reads user session from cookies)
// Use this for checking who is logged in on the server side.
export async function createAuthServerClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return createSSRServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored in Server Components (read-only cookies)
          }
        },
      },
    }
  );
}

// Server client with service role (for server-side operations)
// Use this for admin operations that bypass RLS.
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Public client (for non-authenticated requests from server)
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
