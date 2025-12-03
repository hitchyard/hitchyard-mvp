"use server";

import { createClient } from "@supabase/supabase-js";

interface SubmitBidInput {
  load_id: string;
  bid_amount: number;
}

export async function submitBidAction(input: SubmitBidInput) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        error: "Supabase configuration is missing",
      };
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Authenticate user securely using Supabase Server Client
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        error: "User not authenticated",
      };
    }

    // Validate bid amount
    if (!input.bid_amount || input.bid_amount <= 0) {
      return {
        error: "Bid amount must be greater than zero",
      };
    }

    // Insert new bid into bids table
    const { error: insertError } = await supabase.from("bids").insert({
      load_id: input.load_id,
      carrier_id: user.id,
      bid_amount: input.bid_amount,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      return {
        error: insertError.message,
      };
    }

    return {
      success: true,
      message: `Your bid of $${input.bid_amount.toFixed(2)} has been submitted successfully.`,
    };
  } catch (err) {
    return {
      error: (err as Error)?.message ?? String(err),
    };
  }
}
