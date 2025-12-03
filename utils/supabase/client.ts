import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client suitable for Next.js Client Components.
 * Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
 */
export function supabase(): SupabaseClient {
	if (!_supabase) {
		const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

		if (!url || !key) {
			throw new Error(
				'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables'
			);
		}

		_supabase = createClient(url, key);
	}

	return _supabase;
}

export type { SupabaseClient };

