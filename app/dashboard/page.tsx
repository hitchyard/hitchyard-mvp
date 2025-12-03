"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../utils/supabase/client";

interface UserProfile {
  first_name: string | null;
}

interface Load {
  id: string;
  origin_zip: string;
  destination_zip: string;
  load_weight: number;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string | null>(null);
  const [loads, setLoads] = useState<Load[]>([]);
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

        // Fetch user's loads
        const { data: loadsData, error: loadsError } = await sb
          .from("loads")
          .select("id, origin_zip, destination_zip, load_weight, status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (loadsError) {
          setError(loadsError.message);
        } else if (loadsData) {
          setLoads(loadsData as Load[]);
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold font-spartan text-white mb-2">
          Welcome, {firstName || "User"}
        </h1>
        <p className="text-gray-400 mb-8">Manage and post your loads here.</p>

        <div className="mt-8 mb-12">
          <Link
            href="/post-load"
            className="inline-flex items-center justify-center px-6 py-3 bg-deep-green text-white rounded-md hover:bg-[#0e2b26] focus:ring-2 focus:ring-charcoal-black transition font-semibold"
          >
            Post a New Load
          </Link>
        </div>

        {/* Your Posted Loads Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold font-spartan text-white mb-6">
            Your Posted Loads
          </h2>

          {loads.length === 0 ? (
            <div className="bg-white bg-opacity-5 rounded-lg p-8 text-center">
              <p className="text-gray-400">
                No loads posted yet. Start by{" "}
                <Link href="/post-load" className="text-deep-green hover:underline">
                  posting your first load
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full bg-white bg-opacity-5">
                <thead>
                  <tr className="border-b border-gray-700 bg-charcoal-black">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white">
                      Origin ZIP
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white">
                      Destination ZIP
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white">
                      Weight (lbs)
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white">
                      Posted
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loads.map((load, index) => (
                    <tr
                      key={load.id}
                      className={`border-b border-gray-700 ${
                        index % 2 === 0 ? "bg-opacity-3" : "bg-opacity-1"
                      } hover:bg-opacity-5 transition`}
                    >
                      <td className="px-6 py-4 text-gray-200">{load.origin_zip}</td>
                      <td className="px-6 py-4 text-gray-200">{load.destination_zip}</td>
                      <td className="px-6 py-4 text-gray-200">
                        {load.load_weight.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            load.status === "posted"
                              ? "bg-deep-green text-white"
                              : load.status === "assigned"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-600 text-white"
                          }`}
                        >
                          {load.status.charAt(0).toUpperCase() + load.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(load.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
