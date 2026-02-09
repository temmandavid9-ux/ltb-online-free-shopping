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
import { CreditCard, Lock, Wallet } from 'lucide-react';
import { useUser, useFirestore, setDocumentNonBlocking, updateDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc, arrayUnion } from 'firebase/firestore';
import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userData, isLoading: isUserDocLoading } = useDoc<any>(userDocRef);

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
      toast({ title: "Please login to proceed", variant: "destructive"});
      router.push('/login');
    }
     if (user && !isUserDocLoading && userData) {
      form.setValue('name', userData.username || '');
      form.setValue('email', userData.email || '');
    }
  }, [user, isUserLoading, router, toast, userData, isUserDocLoading, form]);

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    if (!user || !userData) {
        toast({ variant: 'destructive', title: 'You must be logged in to place an order.'});
        return;
    }

    if (userData.walletBalance < basketTotal) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: `Your wallet balance is $${userData.walletBalance.toLocaleString()}, but the order total is $${basketTotal.toLocaleString()}.`,
      });
      return;
    }

    const ordersCollection = collection(firestore, 'orders');
    const userRef = doc(firestore, 'users', user.uid);
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
    
    // Deduct from wallet and update order history
    const newBalance = userData.walletBalance - basketTotal;
    updateDocumentNonBlocking(userRef, {
        orderIds: arrayUnion(...newOrderIds),
        walletBalance: newBalance,
    });
    
    toast({
        title: "Order Placed!",
        description: "Thank you! Your order has been placed and paid for with your wallet balance.",
    });

    clearBasket();
    router.push(`/order-confirmation/${genericOrderId}`);
  };
  
  if (isUserLoading || !user || isUserDocLoading) {
    return <div className="container text-center p-8">Loading...</div>;
  }
  
  if (basket.length === 0 && typeof window !== 'undefined') {
    router.replace('/');
    return null;
  }

  const walletBalance = userData?.walletBalance || 0;
  const canAfford = walletBalance >= basketTotal;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold font-headline mb-8">Checkout</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="name" control={form.control} render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="email" control={form.control} render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Email Address</FormLabel>
                    <FormControl><Input {...field} type="email"/></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="address" control={form.control} render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Street Address</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="city" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="zip" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
          </div>

          <Card className="lg:col-span-1 sticky top-24">
            <CardHeader>
              <CardTitle>Your Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {basket.map(item => (
                <div key={item.product.id} className="flex justify-between items-center text-sm">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span className="font-medium">${(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${basketTotal.toLocaleString()}</span>
              </div>
               <Separator />
               <div className="space-y-2">
                 <div className="flex justify-between">
                    <span>Your Wallet Balance</span>
                    <span>${walletBalance.toLocaleString()}</span>
                 </div>
                 <div className={`flex justify-between font-medium ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                    <span>Remaining Balance</span>
                    <span>${(walletBalance - basketTotal).toLocaleString()}</span>
                 </div>
               </div>

            </CardContent>
            <CardContent>
                {!canAfford && (
                    <Alert variant="destructive" className="mb-4">
                        <Wallet className="h-4 w-4" />
                        <AlertTitle>Insufficient Funds</AlertTitle>
                        <AlertDescription>
                           You do not have enough money in your wallet to complete this purchase.
                        </AlertDescription>
                    </Alert>
                )}
                <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={form.formState.isSubmitting || !canAfford}>
                    {form.formState.isSubmitting ? "Placing Order..." : <><Lock className="w-4 h-4 mr-2" />Place Order with Wallet</>}
                </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
