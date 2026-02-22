
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
              <Card className="bg-primary text-primary-foreground overflow-hidden">
                <div className="flex items-center justify-between p-8">
                    <div className="z-10 max-w-md">
                        <h2 className="text-3xl font-bold mb-2">Exclusive New Arrival</h2>
                        <p className="mb-4 text-primary-foreground/80">Experience the latest in premium design. Available now for redemption.</p>
                        <Button variant="secondary" asChild><Link href="/redeem">Redeem Now</Link></Button>
                    </div>
                    <div className="relative w-[400px] h-[250px] rounded-lg overflow-hidden border-2 border-white/20">
                      <Image 
                        src="https://image2url.com/r2/default/files/1771780145929-e1e471cf-e471-40fb-b086-8a32e8c3819a.file3" 
                        alt="Featured Master Asset" 
                        fill
                        className="object-cover"
                        data-ai-hint="master asset"
                      />
                    </div>
                </div>
              </Card>
            </CarouselItem>
             <CarouselItem>
              <Card className="bg-accent text-accent-foreground overflow-hidden">
                <div className="flex items-center justify-between p-8">
                    <div className="z-10 max-w-md">
                        <h2 className="text-3xl font-bold mb-2">Luxury Watches</h2>
                        <p className="mb-4 text-accent-foreground/80">Discover our collection of stylish and elegant watches.</p>
                        <Button variant="secondary" asChild><Link href="#">Shop Watches</Link></Button>
                    </div>
                    <Image src="https://image2url.com/r2/default/files/1770462568985-dc2a3b81-4ca1-4b45-b94d-901d677f1aae.avif" data-ai-hint="gold watch" alt="Watches" width={400} height={250} className="rounded-lg z-10" />
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
