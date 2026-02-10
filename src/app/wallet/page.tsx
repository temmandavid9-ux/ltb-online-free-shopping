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
        toast({ variant: 'destructive', title: t('wallet.toast.insufficientFundsTitle'), description: t('wallet.toast.insufficientFundsDescription') });
        return;
    }
    if (values.amount < MIN_WITHDRAWAL_AMOUNT) {
        toast({ variant: 'destructive', title: t('wallet.toast.invalidAmountTitle'), description: t('wallet.toast.invalidAmountDescription', { amount: MIN_WITHDRAWAL_AMOUNT.toLocaleString() }) });
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
    if(userDocRef) {
        updateDocumentNonBlocking(userDocRef, { walletBalance: newBalance });
    }

    toast({ title: t('wallet.toast.successTitle'), description: t('wallet.toast.successDescription') });
    form.reset();
  };

  if (isUserLoading || isUserDocLoading || areWithdrawalsLoading) {
    return <div className="container text-center p-8">{t('general.loading')}</div>;
  }
  
  if (!user) return null;

  const walletBalance = userData?.walletBalance || 0;
  const canWithdraw = walletBalance >= MIN_WITHDRAWAL_AMOUNT;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">{t('wallet.title')}</h1>
        <p className="text-muted-foreground">{t('wallet.description')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t('wallet.balanceTitle')}</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">${walletBalance.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Landmark/> {t('wallet.withdrawalTitle')}</CardTitle>
              <CardDescription>{t('wallet.withdrawalDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {!canWithdraw && (
                <Alert>
                  <WalletCards className="h-4 w-4"/>
                  <AlertTitle>{t('wallet.minBalanceTitle')}</AlertTitle>
                  <AlertDescription>{t('wallet.minBalanceDescription', { amount: MIN_WITHDRAWAL_AMOUNT.toLocaleString() })}</AlertDescription>
                </Alert>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4 mt-4 ${!canWithdraw ? 'opacity-50' : ''}`}>
                    <FormField name="amount" control={form.control} render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('wallet.amountLabel')}</FormLabel>
                        <FormControl><Input type="number" {...field} disabled={!canWithdraw} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="paymentMethod" control={form.control} render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('wallet.methodLabel')}</FormLabel>
                        <FormControl><Input {...field} placeholder={t('wallet.methodPlaceholder')} disabled={!canWithdraw} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="accountDetails" control={form.control} render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('wallet.detailsLabel')}</FormLabel>
                        <FormControl><Input {...field} placeholder={t('wallet.detailsPlaceholder')} disabled={!canWithdraw} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" className="w-full" disabled={!canWithdraw || form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? t('wallet.buttonLoading') : t('wallet.button')}
                    </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('wallet.historyTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('general.date')}</TableHead>
                    <TableHead>{t('general.amount')}</TableHead>
                    <TableHead>{t('wallet.methodLabel')}</TableHead>
                    <TableHead>{t('general.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientWithdrawals.length > 0 ? clientWithdrawals.map(w => (
                    <TableRow key={w.id}>
                      <TableCell>{w.formattedDate}</TableCell>
                      <TableCell className="font-medium">${w.amount.toLocaleString()}</TableCell>
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
                      <TableCell colSpan={4} className="text-center">{t('wallet.noHistory')}</TableCell>
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
