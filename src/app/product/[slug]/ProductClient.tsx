'use client';
import { useSearchParams } from "next/navigation";

export default function ProductClient({ slug }: { slug: string }) {
  const searchParams = useSearchParams(); 
  // This is where your product UI logic lives
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-black uppercase">Product: {slug}</h1>
      <p className="text-muted-foreground mt-4">Viewing asset from registry...</p>
      {/* Your existing product UI elements go here */}
    </div>
  );
}
