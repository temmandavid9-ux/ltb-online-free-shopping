
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
  { id: '13', title: 'Prestige Collection', desc: 'The definitive standard of luxury.', url: 'https://image2url.com/r2/default/files/1771779927135-5335409b-8cc8-4cc7-b192-905d9c562826.file13', color: 'bg-indigo-950' },
  { id: '12', title: 'Elite Collection', desc: 'Zenith of refinement and class.', url: 'https://image2url.com/r2/default/files/1771779949744-50aae246-9ea2-4065-a378-a3c2abdd2e78.file12', color: 'bg-black' },
  { id: '11', title: 'Signature Collection', desc: 'Peak standard for Eden 0² aesthetics.', url: 'https://image2url.com/r2/default/files/1771779970633-ef7c63c8-8f00-49f8-8e55-4fa33f91ca5b.file11', color: 'bg-neutral-900' },
  { id: '10', title: 'Ultimate Collection', desc: 'Unmatched quality and presence.', url: 'https://image2url.com/r2/default/files/1771779993129-edea962d-f137-45fa-81b4-02ea6440f590.file10', color: 'bg-slate-950' },
  { id: '09', title: 'Legacy Collection', desc: 'Inherit the style of masters.', url: 'https://image2url.com/r2/default/files/1771780013735-89a69de6-f40c-4f14-b30b-a2b8df72d243.file9', color: 'bg-stone-950' },
  { id: '08', title: 'Heritage Collection', desc: 'Timed-honored perfection.', url: 'https://image2url.com/r2/default/files/1771780034680-2d3cac44-dc0e-413e-8a8a-12742fde11ab.file8', color: 'bg-zinc-950' },
  { id: '07', title: 'Prime Collection', desc: 'The core of modern elegance.', url: 'https://image2url.com/r2/default/files/1771780057671-9c884ea6-1428-4a19-8121-f52abbfae0de.file7', color: 'bg-blue-950' },
  { id: '06', title: 'Royal Collection', desc: 'Fit for the elite echelon.', url: 'https://image2url.com/r2/default/files/1771780086899-dd21c8bd-c2dc-4b9d-a3de-997f8f64de73.file6', color: 'bg-gray-950' },
  { id: '05', title: 'Vertex Collection', desc: 'At the top of the design curve.', url: 'https://image2url.com/r2/default/files/1771780108038-e509d998-3e3b-4ac1-a902-b087aee619cc.file5', color: 'bg-emerald-950' },
  { id: '04', title: 'Apex Collection', desc: 'Reaching the highest heights.', url: 'https://image2url.com/r2/default/files/1771780128053-57d5e252-e064-40b0-abf2-2d3da79ee618.file4', color: 'bg-rose-950' },
  { id: '03', title: 'Core Collection', desc: 'The fundamental Eden experience.', url: 'https://image2url.com/r2/default/files/1771780145929-e1e471cf-e471-40fb-b086-8a32e8c3819a.file3', color: 'bg-amber-950' },
  { id: '02', title: 'Founder Collection', desc: 'The vision that started it all.', url: 'https://image2url.com/r2/default/files/1771780166049-41b3600f-b3f2-4dc0-b480-ad2ed8ea0b5b.file2', color: 'bg-teal-950' }
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
                          <Button size="lg" variant="secondary" className="font-bold px-8" asChild>
                            <Link href="/redeem">Explore Collection</Link>
                          </Button>
                      </div>
                      <div className="relative w-full md:w-[500px] h-[300px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        <Image 
                          src={asset.url} 
                          alt={asset.title} 
                          fill
                          priority={asset.id === '13'}
                          className="object-cover transition-transform duration-700 hover:scale-110"
                          data-ai-hint="master asset"
                        />
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
