
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

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-12">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            <CarouselItem>
              <Card className="bg-black text-white overflow-hidden">
                <div className="flex items-center justify-between p-8">
                    <div className="z-10 max-w-md">
                        <h2 className="text-3xl font-bold mb-2">Ultimate Master Collection</h2>
                        <p className="mb-4 text-white/80">Our tenth and most exclusive signature asset. Redefining the standard of Eden 0² excellence.</p>
                        <Button variant="secondary" asChild><Link href="/redeem">Redeem Ultimate</Link></Button>
                    </div>
                    <div className="relative w-[400px] h-[250px] rounded-lg overflow-hidden border-2 border-white/20">
                      <Image 
                        src="https://image2url.com/r2/default/files/1771779993129-edea962d-f137-45fa-81b4-02ea6440f590.file10" 
                        alt="Tenth Master Asset" 
                        fill
                        priority
                        className="object-cover"
                        data-ai-hint="master asset"
                      />
                    </div>
                </div>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="bg-neutral-950 text-white overflow-hidden">
                <div className="flex items-center justify-between p-8">
                    <div className="z-10 max-w-md">
                        <h2 className="text-3xl font-bold mb-2">Legendary Master Collection</h2>
                        <p className="mb-4 text-white/80">Our ninth and most profound asset. A definitive statement in luxury and design.</p>
                        <Button variant="secondary" asChild><Link href="/redeem">Explore Legacy</Link></Button>
                    </div>
                    <div className="relative w-[400px] h-[250px] rounded-lg overflow-hidden border-2 border-white/20">
                      <Image 
                        src="https://image2url.com/r2/default/files/1771780013735-89a69de6-f40c-4f14-b30b-a2b8df72d243.file9" 
                        alt="Ninth Master Asset" 
                        fill
                        className="object-cover"
                        data-ai-hint="master asset"
                      />
                    </div>
                </div>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="bg-neutral-900 text-white overflow-hidden">
                <div className="flex items-center justify-between p-8">
                    <div className="z-10 max-w-md">
                        <h2 className="text-3xl font-bold mb-2">Heritage Master Collection</h2>
                        <p className="mb-4 text-white/80">Our eighth and most exclusive asset. Explore the definitive Eden 0² aesthetic.</p>
                        <Button variant="secondary" asChild><Link href="/redeem">Redeem Now</Link></Button>
                    </div>
                    <div className="relative w-[400px] h-[250px] rounded-lg overflow-hidden border-2 border-white/20">
                      <Image 
                        src="https://image2url.com/r2/default/files/1771780034680-2d3cac44-dc0e-413e-8a8a-12742fde11ab.file8" 
                        alt="Eighth Master Asset" 
                        fill
                        className="object-cover"
                        data-ai-hint="master asset"
                      />
                    </div>
                </div>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-4"/>
          <CarouselNext className="right-4"/>
        </Carousel>
      </section>
      
      <ProductGrid products={products} />
      
      <AiRecommendations />
    </div>
  );
}
