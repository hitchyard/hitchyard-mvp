"use server";

import { createClient } from "@supabase/supabase-js";

interface PostLoadInput {
  origin_zip: string;
  destination_zip: string;
  load_weight: number;
  commodity_type: string;
}

export async function postLoadAction(input: PostLoadInput) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        error: "Supabase configuration is missing",
      };
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        error: "User not authenticated",
      };
    }

    // Insert load into loads table
    const { error } = await supabase.from("loads").insert({
      user_id: user.id,
      origin_zip: input.origin_zip,
      destination_zip: input.destination_zip,
      load_weight: input.load_weight,
      commodity_type: input.commodity_type,
      status: "posted",
      created_at: new Date().toISOString(),
    });

    if (error) {
      return {
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    return {
      error: (err as Error)?.message ?? String(err),
    };
  }
}
