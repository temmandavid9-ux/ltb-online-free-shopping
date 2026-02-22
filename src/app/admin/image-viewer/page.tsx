'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import masterLinks from '@/lib/image-assets/all-links.json';

export default function ImageViewerPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-headline mb-8">Eden 0² Master Image Gallery</h1>
      <p className="text-muted-foreground mb-12">This page displays every verified link currently stored in your master folder.</p>

      {Object.entries(masterLinks.folders).map(([category, urls]) => (
        <section key={category} className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">{category} ({urls.length} links)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {urls.map((url, idx) => (
              <Card key={idx} className="overflow-hidden">
                <div className="aspect-square relative group">
                  <Image 
                    src={url} 
                    alt={`${category} ${idx}`} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-3">
                  <p className="text-[10px] font-mono break-all text-muted-foreground">{url}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section> section>
      ))}
    </div>
  );
}
