'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { getUniqueVerifiedUrls } from '@/lib/data/find-image';
import masterLinks from '@/lib/image-assets/all-links.json';

export default function ImageViewerPage() {
  const [mounted, setMounted] = useState(false);
  const [uniqueUrls, setUniqueUrls] = useState<string[]>([]);

  useEffect(() => {
    setUniqueUrls(getUniqueVerifiedUrls());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 bg-black text-white p-10 rounded-[3rem] shadow-2xl">
        <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter mb-4">Registry Audit</h1>
        <div className="flex items-center gap-4">
          <div className="bg-primary px-6 py-2 rounded-full text-black font-black text-sm uppercase tracking-widest">
            {uniqueUrls.length} Unique Assets Verified
          </div>
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Deduplication Engine Active</p>
        </div>
      </div>

      {Object.entries(masterLinks.folders).map(([category, urls]) => {
        // Only show unique URLs for this category to avoid confusion in the audit
        const categoryUniques = urls.filter((url, index) => urls.indexOf(url) === index);
        
        return (
          <section key={category} className="mb-16">
            <div className="flex items-center justify-between mb-6 border-b border-border/10 pb-4">
              <h2 className="text-2xl font-black luxury-text-gradient uppercase tracking-tighter">
                {category} ({categoryUniques.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categoryUniques.map((url, idx) => (
                <Card key={idx} className="overflow-hidden rounded-[2rem] border-border/5 bg-secondary/5 group">
                  <div className="aspect-[4/5] relative bg-muted overflow-hidden">
                    <Image 
                      src={url} 
                      alt={`${category} ${idx}`} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized // Bypassing optimization for large external registry lists
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <p className="text-[8px] text-white font-mono break-all text-center">{url}</p>
                    </div>
                  </div>
                  <CardContent className="p-4 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asset #{uniqueUrls.indexOf(url) + 1}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
