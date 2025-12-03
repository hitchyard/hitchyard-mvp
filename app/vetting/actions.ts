"use server";

import { createClient } from "@supabase/supabase-js";

interface VettingFormData {
  company_name: string;
  dot_number: string;
  legal_entity_type: string;
}

export async function submitVettingAction(input: VettingFormData) {
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

    // Insert form data into vetting_requests table with user_id
    const { error: insertError } = await supabase
      .from("vetting_requests")
      .insert({
        user_id: user.id,
        company_name: input.company_name,
        dot_number: input.dot_number,
        legal_entity_type: input.legal_entity_type,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      return {
        error: insertError.message,
      };
    }

    // Update user_profiles table to set is_vetting_pending to true
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        is_vetting_pending: true,
      })
      .eq("user_id", user.id);

    if (updateError) {
      return {
        error: updateError.message,
      };
    }

    // Send vetting data to Airtable CRM webhook (non-blocking)
    const airtableWebhookUrl = process.env.VETTING_WEBHOOK_URL || "https://airtable.com/app4qYpj81N8RlSaa/wflfG0IarWWfoJCcm";
    try {
      await fetch(airtableWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          company_name: input.company_name,
          dot_number: input.dot_number,
          legal_entity_type: input.legal_entity_type,
          submitted_at: new Date().toISOString(),
        }),
      });
    } catch (webhookErr) {
      // Log webhook error but don't fail the main operation
      console.error("Airtable webhook notification failed:", (webhookErr as Error)?.message ?? String(webhookErr));
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
