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
                        priority
                        className="object-cover"
                        data-ai-hint="master asset"
                      />
                    </div>
                </div>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="bg-slate-900 text-white overflow-hidden">
                <div className="flex items-center justify-between p-8">
                    <div className="z-10 max-w-md">
                        <h2 className="text-3xl font-bold mb-2">Elite Master Collection</h2>
                        <p className="mb-4 text-white/80">Discover the peak of Eden 0² craftsmanship with our seventh signature asset.</p>
                        <Button variant="secondary" asChild><Link href="/redeem">Redeem Elite</Link></Button>
                    </div>
                    <div className="relative w-[400px] h-[250px] rounded-lg overflow-hidden border-2 border-white/20">
                      <Image 
                        src="https://image2url.com/r2/default/files/1771780057671-9c884ea6-1428-4a19-8121-f52abbfae0de.file7" 
                        alt="Elite Master Asset" 
                        fill
                        className="object-cover"
                        data-ai-hint="elite asset"
                      />
                    </div>
                </div>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="bg-primary text-primary-foreground overflow-hidden">
                <div className="flex items-center justify-between p-8">
                    <div className="z-10 max-w-md">
                        <h2 className="text-3xl font-bold mb-2">Signature Master Asset</h2>
                        <p className="mb-4 text-primary-foreground/80">Experience the latest CEO-verified addition to our luxury catalog.</p>
                        <Button variant="secondary" asChild><Link href="/redeem">Redeem Now</Link></Button>
                    </div>
                    <div className="relative w-[400px] h-[250px] rounded-lg overflow-hidden border-2 border-white/20">
                      <Image 
                        src="https://image2url.com/r2/default/files/1771780086899-dd21c8bd-c2dc-4b9d-a3de-997f8f64de73.file6" 
                        alt="Latest CEO Asset" 
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