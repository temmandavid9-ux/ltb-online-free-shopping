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
import { Sparkles, Trophy, ShieldCheck, Zap, Crown } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const MASTER_ASSETS = [
  { id: '1', title: 'Prestige Collection', desc: 'The definitive standard of luxury verified by Less Talk Business.', url: "https://image2url.com/r2/default/files/1771940966609-b927061a-b8ae-4d96-b236-35a78c784bae.avif", color: 'bg-emerald-950' },
  { id: '2', title: 'Elite Collection', desc: 'Zenith of refinement and verified status.', url: "https://image2url.com/r2/default/files/1771941181225-7311e871-65d3-4eb5-9dad-4790de51d52e.avif", color: 'bg-green-950' },
  { id: '3', title: 'Signature Selection', desc: 'Peak aesthetics for the global elite.', url: "https://image2url.com/r2/default/files/1771941212937-8689c1de-14dc-47b6-a70d-d43cbf98c2e6.avif", color: 'bg-emerald-900' }
];

export default function Home() {
  const heritageProducts = products.filter(p => p.id.includes('exclusive') && parseInt(p.id.split('_').pop() || '0') >= 554).slice(0, 4);

  return (
    <div className="pb-24 hero-gradient">
      <section className="relative overflow-hidden mb-16">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {MASTER_ASSETS.map((asset) => (
              <CarouselItem key={asset.id}>
                <div className={`${asset.color} relative h-[600px] md:h-[800px] flex items-center overflow-hidden`}>
                  <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center gap-16">
                    <div className="z-10 text-white space-y-8 animate-in slide-in-from-left duration-700">
                      <div className="flex items-center gap-3 text-primary">
                        <Trophy className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official Less Talk Registry</span>
                      </div>
                      <h2 className="text-6xl md:text-8xl font-black font-headline tracking-tighter leading-[0.9] luxury-text-gradient brightness-[3]">
                        {asset.title}
                      </h2>
                      <p className="text-xl text-white/50 font-light max-w-lg leading-relaxed">{asset.desc}</p>
                      <div className="flex flex-wrap gap-5 pt-6">
                        <Button size="lg" className="bg-white text-black hover:bg-primary hover:text-white font-black rounded-full px-12 h-16 uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all active:scale-95" asChild>
                          <Link href="/redeem">Explore Collection</Link>
                        </Button>
                        <Button size="lg" className="bg-white text-black hover:bg-white/80 border-none font-black rounded-full px-12 h-16 uppercase tracking-[0.2em] text-[10px] transition-all">
                          View Lookbook
                        </Button>
                      </div>
                    </div>
                    <div className="hidden md:block relative h-[600px] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 group">
                      <Image 
                        src={asset.url} 
                        alt={asset.title} 
                        fill
                        priority={asset.id === '1'}
                        className="object-cover transition-all duration-[3000ms] ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-12 right-12 flex gap-3 z-20">
            <CarouselPrevious className="relative translate-y-0 translate-x-0 h-14 w-14 bg-white/5 hover:bg-white/10 text-white border-white/10 rounded-full" />
            <CarouselNext className="relative translate-y-0 translate-x-0 h-14 w-14 bg-white/5 hover:bg-white/10 text-white border-white/10 rounded-full" />
          </div>
        </Carousel>
      </section>

      <div className="container mx-auto px-4 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16 border-y border-border/10 bg-white/30 backdrop-blur-sm rounded-[3rem] px-8">
          <div className="flex flex-col items-center text-center gap-4">
            <ShieldCheck className="w-12 h-12 text-primary" />
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">Verified Origins</h4>
              <p className="text-[11px] text-muted-foreground/60">100% Authentic Assets</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <Zap className="w-12 h-12 text-primary" />
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">Instant Rewards</h4>
              <p className="text-[11px] text-muted-foreground/60">Claim Balance Today</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <Sparkles className="w-12 h-12 text-primary" />
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">Premium Selection</h4>
              <p className="text-[11px] text-muted-foreground/60">Curated for Excellence</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <Trophy className="w-12 h-12 text-primary" />
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">Elite Membership</h4>
              <p className="text-[11px] text-muted-foreground/60">Exclusive Store Access</p>
            </div>
          </div>
        </div>
      </div>

      {heritageProducts.length > 0 && (
        <section className="container mx-auto px-4 mb-32">
          <div className="flex items-end justify-between mb-12">
            <div className="flex items-center gap-5">
              <div className="p-5 bg-white shadow-xl rounded-[2rem]">
                <Crown className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-4xl font-black font-headline tracking-tighter luxury-text-gradient">Heritage Elite Series</h2>
                <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Latest Verified Masterpieces</p>
              </div>
            </div>
            <Button variant="ghost" className="font-black uppercase tracking-[0.3em] text-[9px] h-12 px-8 rounded-full border border-border/10" asChild>
              <Link href="/redeem">View All Assets</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {heritageProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
      
      <div className="container mx-auto px-4">
        <ProductGrid products={products} />
        <AiRecommendations />
      </div>
    </div>
  );
}