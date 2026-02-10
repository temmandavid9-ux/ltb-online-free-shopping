"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRedeem } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function RedeemPage() {
  const { basket, updateQuantity, removeFromBasket, basketTotal, itemCount } = useRedeem();
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold font-headline mb-8">{t('redeem.title')}</h1>
      
      {basket.length === 0 ? (
        <Card className="text-center py-20">
            <CardContent className="flex flex-col items-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">{t('redeem.emptyTitle')}</h2>
                <p className="text-muted-foreground mb-6">{t('redeem.emptyDescription')}</p>
                <Button asChild>
                    <Link href="/">{t('redeem.startShopping')}</Link>
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {basket.map(item => (
              <Card key={item.product.id} className="flex items-center p-4">
                <div className="w-24 h-24 aspect-square rounded-md overflow-hidden mr-4">
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    data-ai-hint={item.product.images[0].hint}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-grow">
                  <Link href={`/product/${item.product.slug}`} className="font-semibold hover:text-primary">{item.product.name}</Link>
                  <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                  <p className="text-lg font-bold text-primary mt-1">${item.product.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-md">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromBasket(item.product.id)}>
                    <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Card className="lg:col-span-1 sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline">{t('redeem.summaryTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{t('redeem.subtotal', { itemCount })}</span>
                <span>${basketTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('redeem.shipping')}</span>
                <span>{t('redeem.shippingFree')}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>{t('redeem.total')}</span>
                <span>${basketTotal.toLocaleString()}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                <Link href="/checkout">{t('redeem.checkoutButton')}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
