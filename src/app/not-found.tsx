import Link from 'next/link';
import { FaHome, FaSearch } from 'react-icons/fa';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brut-bg p-4">
      <div className="w-full max-w-lg border-4 border-black bg-brut-paper p-8 shadow-brut-xl text-center">
        <div className="mb-6">
          <span className="font-display text-[120px] leading-none text-black opacity-10">
            404
          </span>
        </div>

        <div className="-mt-16 mb-6">
          <h1 className="font-display text-5xl text-black md:text-6xl">
            PAGE{' '}
            <span className="inline-block rotate-2 border-4 border-black bg-brut-pink px-3 shadow-brut-sm">
              LOST
            </span>
          </h1>
        </div>

        <div className="mb-6 inline-block border-4 border-black bg-black px-4 py-1.5">
          <p className="font-mono text-[11px] tracking-[0.3em] text-brut-lime">
            ERROR 404 — NOT FOUND
          </p>
        </div>

        <p className="mb-8 text-sm font-semibold text-black">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="brut-btn bg-brut-yellow text-xs">
            <FaHome />
            Back to Home
          </Link>
          <Link href="/#projects" className="brut-btn bg-brut-cyan text-xs">
            <FaSearch />
            View Projects
          </Link>
        </div>
      </div>
    </main>
  );
}
