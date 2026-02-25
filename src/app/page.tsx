
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-12">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {MASTER_ASSETS.map((asset) => (
              <CarouselItem key={asset.id}>
                <Card className={`${asset.color} text-white overflow-hidden border-none shadow-2xl`}>
                  <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 min-h-[400px]">
                      <div className="z-10 max-w-lg mb-8 md:mb-0">
                          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-headline tracking-tight">{asset.title}</h2>
                          <p className="text-xl mb-8 text-white/70 font-light">{asset.desc}</p>
                          <div className="flex gap-4">
                            <Button size="lg" variant="secondary" className="font-bold px-8" asChild>
                              <Link href="/redeem">Explore Collection</Link>
                            </Button>
                          </div>
                      </div>
                      <div className="relative w-full md:w-[500px] h-[350px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 flex items-center justify-center">
                        {asset.url ? (
                          <Image 
                            src={asset.url} 
                            alt={asset.title} 
                            fill
                            priority={asset.id === '13'}
                            unoptimized={true}
                            className="object-cover transition-transform duration-700 hover:scale-110"
                            data-ai-hint="lifestyle collection"
                          />
                        ) : (
                          <div className="text-white/20 text-sm font-medium italic">Eden 0² Asset Pending</div>
                        )}
                      </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 text-white border-none"/>
          <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 text-white border-none"/>
        </Carousel>
      </section>
      
      <ProductGrid products={products} />
      
      <AiRecommendations />
    </div>
  );
}
