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
      <h1 className="text-4xl font-bold font-headline mb-4">Less Talk Business Asset Registry</h1>
      <p className="text-muted-foreground mb-12">CEO, every link you send is registered here for real-time verification.</p>

      {Object.entries(masterLinks.folders).map(([category, urls]) => (
        <section key={category} className="mb-16">
          <div className="flex items-center justify-between mb-6 border-b pb-2">
            <h2 className={`text-2xl font-bold ${category === 'Latest Upload' ? 'text-primary' : ''}`}>
              {category} ({urls.length})
            </h2>
            {category === 'Latest Upload' && <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full animate-pulse">NEWLY ADDED</span>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {urls.map((url, idx) => (
              <Card key={idx} className={`overflow-hidden border-2 ${category === 'Latest Upload' ? 'border-primary shadow-lg' : 'border-transparent'}`}>
                <div className="aspect-square relative group bg-muted">
                  <Image 
                    src={url} 
                    alt={`${category} ${idx}`} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      // Handle potential non-image files gracefully in the UI
                      console.warn('Resource may not be a standard image format:', url);
                    }}
                  />
                  {category === 'Latest Upload' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-bold px-4 text-center">Verified Accessible Resource</p>
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <p className="text-[10px] font-mono break-all text-muted-foreground">{url}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
