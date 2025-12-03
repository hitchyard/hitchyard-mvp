"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../utils/supabase/client";

interface UserProfile {
  first_name: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      try {
        const sb = supabase();

        // Check if user is logged in
        const {
          data: { user },
          error: authError,
        } = await sb.auth.getUser();

        if (authError || !user) {
          // User not logged in, redirect to signup
          router.push("/signup");
          return;
        }

        // Fetch user profile
        const { data, error: profileError } = await sb
          .from("user_profiles")
          .select("first_name")
          .eq("id", user.id)
          .single();

        if (profileError) {
          setError(profileError.message);
        } else if (data) {
          setFirstName((data as UserProfile).first_name);
        }
      } catch (err) {
        setError((err as Error)?.message ?? String(err));
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchProfile();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-deep-green border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => router.push("/signup")}
            className="mt-4 px-4 py-2 bg-deep-green text-white rounded-md hover:bg-[#0e2b26]"
          >
            Back to Sign Up
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold font-spartan text-white mb-2">
          Welcome, {firstName || "User"}
        </h1>
        <p className="text-gray-400 mb-8">Manage and post your loads here.</p>

        <div className="mt-8">
          <Link
            href="/post-load"
            className="inline-flex items-center justify-center px-6 py-3 bg-deep-green text-white rounded-md hover:bg-[#0e2b26] focus:ring-2 focus:ring-charcoal-black transition"
          >
            Post a New Load
          </Link>
        </div>
      </div>
    </main>
  );
}
