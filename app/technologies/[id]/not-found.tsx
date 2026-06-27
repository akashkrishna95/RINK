import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#153156] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-helios text-6xl font-black text-white mb-4">404</h1>
        <p className="font-poppins text-[#daf1ff] text-lg mb-6">
          Technology not found
        </p>
        <Link
          href="/technologies"
          className="inline-block bg-[#1b60bb] hover:bg-[#153156] text-white px-8 py-3 rounded-full font-avenir font-semibold transition-colors"
        >
          Back to Technologies
        </Link>
      </div>
    </div>
  );
}
