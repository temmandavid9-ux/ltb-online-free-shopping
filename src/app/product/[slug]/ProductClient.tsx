'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductClient({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
        Product: {slug}
      </h1>
      <p className="text-muted-foreground uppercase text-xs font-bold tracking-[0.3em]">
        Verified Registry Asset
      </p>
      
      {/* Note: If you have more UI code from your original product page, 
         paste it here inside the return block.
      */}
    </div>
  );
}
