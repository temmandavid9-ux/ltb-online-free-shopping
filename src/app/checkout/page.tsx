"use client";

import { useRedeem } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Lock, Wallet } from 'lucide-react';
import { useUser, useFirestore, setDocumentNonBlocking, updateDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc, arrayUnion } from 'firebase/firestore';
import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/context/LanguageContext';
import type { UserProfile } from '@/lib/types';

const shippingSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  address: z.string().min(5, { message: 'Address is required.' }),
  city: z.string().min(2, { message: 'City is required.' }),
  zip: z.string().min(5, { message: 'A valid ZIP code is required.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

const checkoutSchema = shippingSchema;

export default function CheckoutPage() {
  const { basket, basketTotal, clearBasket } = useRedeem();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { t } = useLanguage();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid, 'profile') : null, [firestore, user]);
  const { data: userData, isLoading: isUserDocLoading } = useDoc<UserProfile>(userDocRef);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      zip: '',
      email: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      toast({ title: t('checkout.toast.loginRequired'), variant: "destructive"});
      router.push('/login');
    }
     if (user && !isUserDocLoading && userData) {
      form.setValue('name', userData.username || '');
      form.setValue('email', userData.email || '');
    }
  }, [user, isUserLoading, router, toast, userData, isUserDocLoading, form, t]);

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    if (!user || !userData) {
        toast({ variant: 'destructive', title: t('checkout.toast.loggedInRequired')});
        return;
    }

    if (userData.balance < basketTotal) {
      toast({
        variant: "destructive",
        title: t('checkout.insufficientFundsTitle'),
        description: t('checkout.toast.insufficientFunds', { balance: userData.balance.toLocaleString(), total: basketTotal.toLocaleString() }),
      });
      return;
    }

    const ordersCollection = collection(firestore, 'orders');
    const newOrderIds: string[] = [];
    const genericOrderId = `order_${new Date().getTime()}`;

    basket.forEach((item, index) => {
        const orderId = `${genericOrderId}_${index}`;
        const orderRef = doc(ordersCollection, orderId);
        const newOrder = {
            id: orderId,
            userId: user.uid,
            product: item.product.name,
            price: item.product.price * item.quantity,
            status: 'Pending',
            date: new Date().toISOString(),
            image: item.product.images[0].url,
        };
        setDocumentNonBlocking(orderRef, newOrder, { merge: false });
        newOrderIds.push(orderId);
    });
    
    // Update balance and order history
    if (userDocRef) {
        const newBalance = userData.balance - basketTotal;
        updateDocumentNonBlocking(userDocRef, {
            orderIds: arrayUnion(...newOrderIds),
            balance: newBalance,
        });
    }
    
    toast({
        title: t('checkout.toast.successTitle'),
        description: t('checkout.toast.successDescription'),
    });

    clearBasket();
    router.push(`/order-confirmation/${genericOrderId}`);
  };
  
  if (isUserLoading || !user || isUserDocLoading) {
    return <div className="container text-center p-24">{t('general.loading')}</div>;
  }
  
  if (basket.length === 0 && typeof window !== 'undefined') {
    router.replace('/');
    return null;
  }

  const currentBalance = userData?.balance || 0;
  const canAfford = currentBalance >= basketTotal;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black tracking-tighter mb-12">{t('checkout.title')}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[3rem] shadow-xl">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest">{t('checkout.shippingTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField name="name" control={form.control} render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('checkout.nameLabel')}</FormLabel>
                    <FormControl><Input {...field} className="rounded-2xl h-12 bg-secondary/20 border-none" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="email" control={form.control} render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('checkout.emailLabel')}</FormLabel>
                    <FormControl><Input {...field} type="email" className="rounded-2xl h-12 bg-secondary/20 border-none" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="address" control={form.control} render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('checkout.addressLabel')}</FormLabel>
                    <FormControl><Input {...field} className="rounded-2xl h-12 bg-secondary/20 border-none" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="city" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('checkout.cityLabel')}</FormLabel>
                    <FormControl><Input {...field} className="rounded-2xl h-12 bg-secondary/20 border-none" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="zip" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('checkout.zipLabel')}</FormLabel>
                    <FormControl><Input {...field} className="rounded-2xl h-12 bg-secondary/20 border-none" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
          </div>

          <Card className="lg:col-span-1 sticky top-24 rounded-[3rem] shadow-xl overflow-hidden border-primary/10">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-sm font-black uppercase tracking-widest">{t('checkout.orderSummaryTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {basket.map(item => (
                <div key={item.product.id} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{item.product.name} <span className="text-muted-foreground">x{item.quantity}</span></span>
                  <span className="font-black">${(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <Separator className="bg-border/50" />
              <div className="flex justify-between font-black text-2xl">
                <span>{t('general.total')}</span>
                <span className="luxury-text-gradient">${basketTotal.toLocaleString()}</span>
              </div>
               <Separator className="bg-border/50" />
               <div className="space-y-3">
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span>{t('checkout.walletBalance')}</span>
                    <span>${currentBalance.toLocaleString()}</span>
                 </div>
                 <div className={`flex justify-between text-xs font-black uppercase tracking-widest ${canAfford ? 'text-primary' : 'text-destructive'}`}>
                    <span>{t('checkout.remainingBalance')}</span>
                    <span>${(currentBalance - basketTotal).toLocaleString()}</span>
                 </div>
               </div>

            </CardContent>
            <CardContent>
                {!canAfford && (
                    <Alert variant="destructive" className="mb-6 rounded-2xl border-none bg-destructive/10 text-destructive">
                        <Wallet className="h-4 w-4" />
                        <AlertTitle className="text-[10px] font-black uppercase tracking-widest">{t('checkout.insufficientFundsTitle')}</AlertTitle>
                        <AlertDescription className="text-[10px] font-bold">
                           {t('checkout.insufficientFundsDescription')}
                        </AlertDescription>
                    </Alert>
                )}
                <Button type="submit" size="lg" className="w-full rounded-2xl h-16 font-black uppercase tracking-widest text-[10px] btn-luxury" disabled={form.formState.isSubmitting || !canAfford}>
                    {form.formState.isSubmitting ? t('checkout.buttonLoading') : <><Lock className="w-4 h-4 mr-2 text-primary" />{t('checkout.button')}</>}
                </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}