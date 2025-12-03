import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-charcoal-black flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl font-bold font-spartan text-white">
          Hitchyard
        </h1>
        <p className="text-lg text-gray-300">
          Premium ride-sharing and logistics for modern mobility.
        </p>
        <div className="pt-8">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-3 bg-deep-green text-white font-semibold rounded-md hover:bg-[#0e2b26] focus:ring-2 focus:ring-offset-2 focus:ring-offset-charcoal-black focus:ring-deep-green transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
