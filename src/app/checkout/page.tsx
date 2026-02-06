"use client";

import { useCart } from '@/context/CartContext';
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
import { CreditCard, Lock } from 'lucide-react';

const shippingSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  address: z.string().min(5, { message: 'Address is required.' }),
  city: z.string().min(2, { message: 'City is required.' }),
  zip: z.string().min(5, { message: 'A valid ZIP code is required.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits.'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry must be in MM/YY format.'),
  cvc: z.string().regex(/^\d{3,4}$/, 'CVC must be 3 or 4 digits.'),
});

const checkoutSchema = shippingSchema.merge(paymentSchema);

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      zip: '',
      email: '',
      cardNumber: '',
      expiry: '',
      cvc: '',
    },
  });

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    console.log('Order submitted:', values);
    const orderId = `order_${new Date().getTime()}`;
    // In a real app, you would save the order to a database.
    
    toast({
        title: "Order Placed!",
        description: "Thank you for your purchase.",
    });

    clearCart();
    router.push(`/order-confirmation/${orderId}`);
  };
  
  if (cart.length === 0 && typeof window !== 'undefined') {
    router.push('/cart');
    return null;
  }

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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5"/>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField name="cardNumber" control={form.control} render={({ field }) => (
                  <FormItem className="md:col-span-4">
                    <FormLabel>Card Number</FormLabel>
                    <FormControl><Input {...field} placeholder="0000 0000 0000 0000" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField name="expiry" control={form.control} render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl><Input {...field} placeholder="MM/YY" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField name="cvc" control={form.control} render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>CVC</FormLabel>
                    <FormControl><Input {...field} placeholder="123" /></FormControl>
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
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between items-center text-sm">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardContent>
                <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Lock className="w-4 h-4 mr-2" />Place Order
                </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
