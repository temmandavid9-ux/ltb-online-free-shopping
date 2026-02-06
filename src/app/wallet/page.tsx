'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking, setDocumentNonBlocking, useCollection } from "@/firebase";
import { doc, collection, query, where } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, WalletCards, Landmark } from "lucide-react";
import type { Withdrawal } from "@/lib/types";

const MIN_WITHDRAWAL_AMOUNT = 100;

const withdrawalSchema = z.object({
  amount: z.coerce.number().min(1, { message: 'Amount must be greater than 0.' }),
  paymentMethod: z.string().min(3, { message: 'Payment method is required.' }),
  accountDetails: z.string().min(5, { message: 'Account details are required.' }),
});

export default function WalletPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userData, isLoading: isUserDocLoading } = useDoc<any>(userDocRef);

  const withdrawalsQuery = useMemoFirebase(() => user ? query(collection(firestore, 'withdrawals'), where('userId', '==', user.uid)) : null, [firestore, user]);
  const { data: withdrawalsData, isLoading: areWithdrawalsLoading } = useCollection<Withdrawal>(withdrawalsQuery);

  const [clientWithdrawals, setClientWithdrawals] = useState<(Withdrawal & { formattedDate: string })[]>([]);

  useEffect(() => {
    if (withdrawalsData) {
        setClientWithdrawals(
            withdrawalsData.map(w => ({
                ...w,
                formattedDate: new Date(w.date).toLocaleDateString()
            }))
        );
    }
  }, [withdrawalsData]);

  const form = useForm<z.infer<typeof withdrawalSchema>>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: { amount: 0, paymentMethod: 'Bank Transfer', accountDetails: '' },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const onSubmit = (values: z.infer<typeof withdrawalSchema>) => {
    if (!user || !userData) return;
    if (userData.walletBalance < values.amount) {
        toast({ variant: 'destructive', title: 'Insufficient Funds', description: 'You cannot withdraw more than your wallet balance.' });
        return;
    }
    if (values.amount < 1) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Withdrawal amount must be at least ₦1.' });
        return;
    }

    const newBalance = userData.walletBalance - values.amount;
    
    // Create withdrawal request
    const withdrawalId = `wd_${new Date().getTime()}`;
    const withdrawalRef = doc(firestore, 'withdrawals', withdrawalId);
    const newWithdrawal = {
        id: withdrawalId,
        userId: user.uid,
        amount: values.amount,
        paymentMethod: values.paymentMethod,
        accountDetails: values.accountDetails,
        status: 'Pending',
        date: new Date().toISOString(),
    };
    setDocumentNonBlocking(withdrawalRef, newWithdrawal, { merge: false });

    // Update user's balance
    updateDocumentNonBlocking(userDocRef!, { walletBalance: newBalance });

    toast({ title: 'Withdrawal Request Submitted', description: 'Your request is pending approval.' });
    form.reset();
  };

  if (isUserLoading || isUserDocLoading || areWithdrawalsLoading) {
    return <div className="container text-center p-8">Loading...</div>;
  }
  
  if (!user) return null;

  const walletBalance = userData?.walletBalance || 0;
  const canWithdraw = walletBalance >= MIN_WITHDRAWAL_AMOUNT;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">My Wallet</h1>
        <p className="text-muted-foreground">Manage your funds and view your transaction history.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">₦{walletBalance.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Landmark/> Request Withdrawal</CardTitle>
              <CardDescription>Transfer funds to your account.</CardDescription>
            </CardHeader>
            <CardContent>
              {!canWithdraw && (
                <Alert>
                  <WalletCards className="h-4 w-4"/>
                  <AlertTitle>Minimum Balance Required</AlertTitle>
                  <AlertDescription>You need at least ₦{MIN_WITHDRAWAL_AMOUNT.toLocaleString()} in your wallet to make a withdrawal.</AlertDescription>
                </Alert>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4 mt-4 ${!canWithdraw ? 'opacity-50' : ''}`}>
                    <FormField name="amount" control={form.control} render={({ field }) => (
                        <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl><Input type="number" {...field} disabled={!canWithdraw} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="paymentMethod" control={form.control} render={({ field }) => (
                        <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl><Input {...field} placeholder="e.g. Bank Transfer, PayPal" disabled={!canWithdraw} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="accountDetails" control={form.control} render={({ field }) => (
                        <FormItem>
                        <FormLabel>Account Details</FormLabel>
                        <FormControl><Input {...field} placeholder="Account number, email, etc." disabled={!canWithdraw} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" className="w-full" disabled={!canWithdraw || form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Submitting...' : 'Request Withdrawal'}
                    </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientWithdrawals.length > 0 ? clientWithdrawals.map(w => (
                    <TableRow key={w.id}>
                      <TableCell>{w.formattedDate}</TableCell>
                      <TableCell className="font-medium">₦{w.amount.toLocaleString()}</TableCell>
                      <TableCell>{w.paymentMethod}</TableCell>
                      <TableCell>
                         <Badge variant={w.status === 'Approved' ? 'default' : 'secondary'} className={
                            w.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                            w.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }>
                            {w.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No withdrawal history.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
