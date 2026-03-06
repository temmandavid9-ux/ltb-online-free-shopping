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
import type { Withdrawal, UserProfile } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";

const MIN_WITHDRAWAL_AMOUNT = 80;

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
  const { t } = useLanguage();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userData, isLoading: isUserDocLoading } = useDoc<UserProfile>(userDocRef);

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
    if (userData.balance < values.amount) {
        toast({ variant: 'destructive', title: t('wallet.toast.insufficientFundsTitle'), description: t('wallet.toast.insufficientFundsDescription') });
        return;
    }
    if (values.amount < MIN_WITHDRAWAL_AMOUNT) {
        toast({ variant: 'destructive', title: t('wallet.toast.invalidAmountTitle'), description: t('wallet.toast.invalidAmountDescription', { amount: MIN_WITHDRAWAL_AMOUNT.toLocaleString() }) });
        return;
    }

    const newBalance = userData.balance - values.amount;
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

    if(userDocRef) {
        updateDocumentNonBlocking(userDocRef, { balance: newBalance });
    }

    toast({ title: t('wallet.toast.successTitle'), description: t('wallet.toast.successDescription') });
    form.reset();
  };

  if (isUserLoading || isUserDocLoading || areWithdrawalsLoading) {
    return <div className="container text-center p-24 font-black uppercase tracking-widest">{t('general.loading')}</div>;
  }
  
  if (!user) return null;

  const currentBalance = userData?.balance || 0;
  const canWithdraw = currentBalance >= MIN_WITHDRAWAL_AMOUNT;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-black luxury-text-gradient tracking-tighter">Wallet</h1>
        <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] mt-2">Manage your secured funds and audit withdrawal history.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-10">
          <Card className="rounded-[3rem] shadow-xl border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-widest">Account Balance</CardTitle>
                <DollarSign className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-5xl font-black">${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </CardContent>
          </Card>
          <Card className="rounded-[3rem] shadow-xl overflow-hidden border-black/5">
            <CardHeader className="bg-secondary/30">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><Landmark className="w-4 h-4 text-primary" /> Withdrawal</CardTitle>
              <CardDescription className="text-[10px] font-black text-muted-foreground/60">Transfer secured funds to your primary accounts.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              {!canWithdraw && (
                <Alert className="rounded-2xl border-none bg-primary/5 text-primary mb-6">
                  <WalletCards className="h-4 w-4"/>
                  <AlertTitle className="text-[10px] font-black uppercase tracking-widest">Minimum Threshold</AlertTitle>
                  <AlertDescription className="text-[10px] font-black">Withdrawal requires a minimum threshold of ${MIN_WITHDRAWAL_AMOUNT.toLocaleString()}.</AlertDescription>
                </Alert>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-6 ${!canWithdraw ? 'opacity-50' : ''}`}>
                    <FormField name="amount" control={form.control} render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Withdrawal Amount</FormLabel>
                        <FormControl><Input type="number" {...field} disabled={!canWithdraw} className="rounded-2xl h-12 bg-secondary/20 border-none font-black" /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="paymentMethod" control={form.control} render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Channel</FormLabel>
                        <FormControl><Input {...field} placeholder="e.g. Bank Transfer, PayPal" disabled={!canWithdraw} className="rounded-2xl h-12 bg-secondary/20 border-none font-black" /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="accountDetails" control={form.control} render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Account Logistics</FormLabel>
                        <FormControl><Input {...field} placeholder="Account number or verification ID" disabled={!canWithdraw} className="rounded-2xl h-12 bg-secondary/20 border-none font-black" /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" className="w-full rounded-2xl h-16 font-black uppercase tracking-widest text-[10px] btn-luxury" disabled={!canWithdraw || form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Processing...' : 'Withdrawal'}
                    </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="rounded-[3rem] shadow-xl overflow-hidden border-black/5">
            <CardHeader className="p-10 border-b border-border/50">
              <CardTitle className="text-2xl font-black luxury-text-gradient">Withdrawal History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-none bg-secondary/30">
                    <TableHead className="pl-10 h-14 text-[10px] font-black uppercase tracking-widest">Date</TableHead>
                    <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest">Amount</TableHead>
                    <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest">Method</TableHead>
                    <TableHead className="h-14 text-right pr-10 text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientWithdrawals.length > 0 ? clientWithdrawals.map(w => (
                    <TableRow key={w.id} className="border-border/5">
                      <TableCell className="pl-10 py-6 text-sm font-black">{w.formattedDate}</TableCell>
                      <TableCell className="font-black text-sm">${w.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-sm font-black text-foreground">{w.paymentMethod}</TableCell>
                      <TableCell className="text-right pr-10 font-black">
                         <Badge variant="outline" className={`rounded-full px-4 py-1 border-none text-[9px] font-black uppercase tracking-widest ${
                            w.status === 'Approved' ? 'bg-primary/10 text-primary' : 
                            w.status === 'Rejected' ? 'bg-destructive/10 text-destructive' :
                            'bg-accent/10 text-accent'
                        }`}>
                            {w.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-24 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">No transactions found in current log.</TableCell>
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
