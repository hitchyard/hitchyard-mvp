"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const sb = supabase();
      const { error: signUpError } = await sb.auth.signUp({ email, password });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Successful signup — redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error)?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4 text-[#1A1D21]">Create an account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-[#1A1D21]" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B1F1A]"
            aria-label="Email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-[#1A1D21]" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B1F1A]"
            aria-label="Password"
          />
        </div>

        {error && (
          <div role="alert" className="text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0B1F1A] text-white rounded-md disabled:opacity-60 hover:bg-[#0e2b26] focus:ring-2 focus:ring-[#1A1D21]"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}

            <span>{loading ? "Signing up..." : "Sign up"}</span>
          </button>
        </div>
      </form>
    </main>
  );
}
