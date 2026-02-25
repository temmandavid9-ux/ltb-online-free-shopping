import { products } from '@/lib/data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import { AiRecommendations } from '@/components/AiRecommendations';
import { Sparkles, Trophy, ShieldCheck, Zap } from 'lucide-react';

const MASTER_ASSETS = [
  { id: '13', title: 'Prestige Collection', desc: 'The definitive standard of luxury.', url: "https://image2url.com/r2/default/files/1771940966609-b927061a-b8ae-4d96-b236-35a78c784bae.avif", color: 'bg-indigo-950' },
  { id: '12', title: 'Elite Collection', desc: 'Zenith of refinement and class.', url: "https://image2url.com/r2/default/files/1771941181225-7311e871-65d3-4eb5-9dad-4790de51d52e.avif", color: 'bg-black' },
  { id: '11', title: 'Signature Collection', desc: 'Peak standard for Eden 0² aesthetics.', url: "https://image2url.com/r2/default/files/1771941212937-8689c1de-14dc-47b6-a70d-d43cbf98c2e6.avif", color: 'bg-neutral-900' },
  { id: '10', title: 'Ultimate Collection', desc: 'Unmatched quality and presence.', url: "https://image2url.com/r2/default/files/1771941258775-5021bb4f-770c-46af-b3d1-1b01cb850d75.jpg", color: 'bg-slate-950' },
  { id: '09', title: 'Legacy Collection', desc: 'Inherit the style of masters.', url: "https://image2url.com/r2/default/files/1771941278184-8a6ca1b1-f5b7-4d91-a8cd-349a7ef6e269.avif", color: 'bg-stone-950' },
  { id: '08', title: 'Heritage Collection', desc: 'Timed-honored perfection.', url: "https://image2url.com/r2/default/files/1771941298482-8e2ce328-4edd-440a-9e23-0b5d4eb82db8.avif", color: 'bg-zinc-950' },
  { id: '07', title: 'Prime Collection', desc: 'The core of modern elegance.', url: "https://image2url.com/r2/default/files/1771941318401-fbd12e9f-8573-40fb-ad56-8aa364a680b3.avif", color: 'bg-blue-950' },
  { id: '06', title: 'Royal Collection', desc: 'Fit for the elite echelon.', url: "https://image2url.com/r2/default/files/1771941338460-b8a00990-b788-42d5-a67c-e2a02680ec89.avif", color: 'bg-gray-950' },
  { id: '05', title: 'Vertex Collection', desc: 'At the top of the design curve.', url: "https://image2url.com/r2/default/files/1771941354343-d919508e-5eea-4c78-a755-00f841f3d9e6.avif", color: 'bg-emerald-950' },
  { id: '04', title: 'Apex Collection', desc: 'Reaching the highest heights.', url: "https://image2url.com/r2/default/files/1771941376024-3bd3ad10-aba0-4228-b2ed-79c332df8445.avif", color: 'bg-rose-950' },
  { id: '03', title: 'Core Collection', desc: 'The fundamental Eden experience.', url: "https://image2url.com/r2/default/files/1771941397993-b3b4382c-c7ea-478c-be29-2fca176d1e2d.avif", color: 'bg-amber-950' },
  { id: '02', title: 'Founder Collection', desc: 'The vision that started it all.', url: "https://image2url.com/r2/default/files/1771941426060-2e2decb9-ea7a-4e64-b35e-2b5484fe5f76.avif", color: 'bg-teal-950' },
  { id: '01', title: 'Origin Collection', desc: 'Where Eden begins.', url: "https://image2url.com/r2/default/files/1771941447081-ad4689a9-354a-47b8-9caf-f33939555eff.avif", color: 'bg-cyan-950' }
];

export default function Home() {
  return (
    <div className="pb-20">
      <section className="relative overflow-hidden mb-12">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {MASTER_ASSETS.map((asset) => (
              <CarouselItem key={asset.id}>
                <div className={`${asset.color} relative h-[500px] md:h-[650px] flex items-center`}>
                  <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
                    <div className="z-10 text-white space-y-6">
                      <div className="flex items-center gap-2 text-primary">
                        <Trophy className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">Official Eden Selection</span>
                      </div>
                      <h2 className="text-5xl md:text-7xl font-black font-headline tracking-tighter leading-none">{asset.title}</h2>
                      <p className="text-xl text-white/60 font-light max-w-md">{asset.desc}</p>
                      <div className="flex flex-wrap gap-4 pt-4">
                        <Button size="lg" className="bg-white text-black hover:bg-primary hover:text-white font-black rounded-full px-10 h-14 uppercase tracking-widest text-xs" asChild>
                          <Link href="/redeem">Explore Collection</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-black rounded-full px-10 h-14 uppercase tracking-widest text-xs">
                          View Lookbook
                        </Button>
                      </div>
                    </div>
                    <div className="hidden md:block relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                      <Image 
                        src={asset.url} 
                        alt={asset.title} 
                        fill
                        priority={asset.id === '13'}
                        className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-10 right-10 flex gap-2 z-20">
            <CarouselPrevious className="relative translate-y-0 translate-x-0 h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20" />
            <CarouselNext className="relative translate-y-0 translate-x-0 h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20" />
          </div>
        </Carousel>
      </section>

      <div className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-border/40">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-10 h-10 text-primary" />
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest">Verified Origins</h4>
              <p className="text-[11px] text-muted-foreground">100% Authentic Assets</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Zap className="w-10 h-10 text-primary" />
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest">Instant Rewards</h4>
              <p className="text-[11px] text-muted-foreground">Claim Balance Today</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Sparkles className="w-10 h-10 text-primary" />
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest">Premium Selection</h4>
              <p className="text-[11px] text-muted-foreground">Curated for Excellence</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Trophy className="w-10 h-10 text-primary" />
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest">Elite Membership</h4>
              <p className="text-[11px] text-muted-foreground">Exclusive Store Access</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <ProductGrid products={products} />
        <AiRecommendations />
      </div>
    </div>
  );
}