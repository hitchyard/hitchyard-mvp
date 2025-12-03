import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-charcoal-black flex items-center justify-center p-8">
      <div className="w-full max-w-5xl">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold font-spartan text-white">Hitchyard</h1>
          <p className="text-lg text-gray-300 mt-3">
            Premium ride-sharing and logistics for modern mobility.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipper Card */}
          <div className="bg-white bg-opacity-4 border border-gray-700 rounded-lg p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold font-spartan text-white">I AM A SHIPPER</h2>
              <p className="text-gray-400 mt-3">Post shipments and connect with vetted carriers across the network.</p>
            </div>
            <div className="mt-6">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3 bg-deep-green text-white font-semibold rounded-md hover:bg-[#0e2b26] focus:outline-none focus:ring-2 focus:ring-deep-green transition"
              >
                Post a Load
              </Link>
            </div>
          </div>

          {/* Carrier Card */}
          <div className="bg-white bg-opacity-4 border border-gray-700 rounded-lg p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold font-spartan text-white">I AM A CARRIER</h2>
              <p className="text-gray-400 mt-3">Find available loads, place competitive bids, and grow your business.</p>
            </div>
            <div className="mt-6">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-deep-green text-deep-green bg-transparent font-semibold rounded-md hover:bg-deep-green hover:text-white focus:outline-none focus:ring-2 focus:ring-deep-green transition"
              >
                Find Loads
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
