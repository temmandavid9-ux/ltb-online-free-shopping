'use client';

import { Suspense } from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Suspense fallback={<div className="p-20 text-center">404</div>}>
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-black text-white">
        <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">
          404 - Asset Not Found
        </h2>
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-8">
          The requested path does not exist in the registry.
        </p>
        <Link 
          href="/" 
          className="px-8 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase hover:bg-primary transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </Suspense>
  );
}
