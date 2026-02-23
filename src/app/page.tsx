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
              <Card className="bg-indigo-950 text-white overflow-hidden">
                <div className="flex items-center justify-between p-8">
                    <div className="z-10 max-w-md">
                        <h2 className="text-3xl font-bold mb-2">Prestige Master Collection</h2>
                        <p className="mb-4 text-white/80">Our thirteenth and most refined verified asset. The definitive standard of Eden 0² luxury.</p>
                        <Button variant="secondary" asChild><Link href="/redeem">Redeem Prestige</Link></Button>
                    </div>
                    <div className="relative w-[400px] h-[250px] rounded-lg overflow-hidden border-2 border-white/20">
                      <Image 
                        src="https://image2url.com/r2/default/files/1771779927135-5335409b-8cc8-4cc7-b192-905d9c562826.file13" 
                        alt="Thirteenth Master Asset" 
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
              <Card className="bg-black text-white overflow-hidden">
                <div className="flex items-center justify-between p-8">
                    <div className="z-10 max-w-md">
                        <h2 className="text-3xl font-bold mb-2">Elite Master Collection</h2>
                        <p className="mb-4 text-white/80">Our twelfth verified asset. Experience the zenith of Eden 0² luxury and refinement.</p>
                        <Button variant="secondary" asChild><Link href="/redeem">Redeem Elite</Link></Button>
                    </div>
                    <div className="relative w-[400px] h-[250px] rounded-lg overflow-hidden border-2 border-white/20">
                      <Image 
                        src="https://image2url.com/r2/default/files/1771779949744-50aae246-9ea2-4065-a378-a3c2abdd2e78.file12" 
                        alt="Twelfth Master Asset" 
                        fill
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
                        <h2 className="text-3xl font-bold mb-2">Signature Master Collection</h2>
                        <p className="mb-4 text-white/80">Our eleventh verified asset. Setting the peak standard for Eden 0² aesthetics.</p>
                        <Button variant="secondary" asChild><Link href="/redeem">Redeem Signature</Link></Button>
                    </div>
                    <div className="relative w-[400px] h-[250px] rounded-lg overflow-hidden border-2 border-white/20">
                      <Image 
                        src="https://image2url.com/r2/default/files/1771779970633-ef7c63c8-8f00-49f8-8e55-4fa33f91ca5b.file11" 
                        alt="Eleventh Master Asset" 
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