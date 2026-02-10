"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CartRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/redeem');
  }, [router]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <p>Redirecting to your redemption basket...</p>
    </div>
  );
}
