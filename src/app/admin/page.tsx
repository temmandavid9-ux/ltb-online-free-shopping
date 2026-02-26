'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, AlertCircle, Users } from 'lucide-react';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Order, Withdrawal } from '@/lib/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const { isAdmin, isAdminLoading } = useAdminStatus();
  const router = useRouter();
  const { t } = useLanguage();
  const firestore = useFirestore();

  // ONLY execute collection queries if user is confirmed as admin to avoid permission errors
  const ordersQuery = useMemoFirebase(() => isAdmin ? query(collection(firestore, 'orders'), orderBy('date', 'desc')) : null, [firestore, isAdmin]);
  const { data: ordersData, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

  const withdrawalsQuery = useMemoFirebase(() => isAdmin ? query(collection(firestore, 'withdrawals'), orderBy('date', 'desc')) : null, [firestore, isAdmin]);
  const { data: withdrawalsData, isLoading: areWithdrawalsLoading } = useCollection<Withdrawal>(withdrawalsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);
  
  useEffect(() => {
      if (!isAdminLoading && !isAdmin && !isUserLoading) {
          router.push('/');
      }
  }, [isAdmin, isAdminLoading, isUserLoading, router]);

  if (isUserLoading || isAdminLoading || areOrdersLoading || areWithdrawalsLoading) {
    return <div className="container text-center p-24">{t('general.loading')}</div>;
  }

  if (!isAdmin) {
    return null;
  }
    
  const pendingOrders = ordersData?.filter(o => o.status === 'Pending').length || 0;
  const pendingWithdrawals = withdrawalsData?.filter(w => w.status === 'Pending').length || 0;
  const totalRevenue = ordersData?.filter(o => o.status === 'Completed' || o.status === 'Approved').reduce((sum, o) => sum + o.price, 0) || 0;
    
  const recentOrders = ordersData?.slice(0, 5) || [];
  const recentWithdrawals = withdrawalsData?.slice(0, 5) || [];

  // Total users count is restricted due to security rules (cannot list /users)
  const totalUsers = 'Verified Restricted';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl font-black luxury-text-gradient tracking-tighter mb-12">Admin Console</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <Card className="rounded-[2.5rem] shadow-xl border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="rounded-[2.5rem] shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card className="rounded-[2.5rem] shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card className="rounded-[2.5rem] shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending Withdrawals</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{pendingWithdrawals}</div>
          </CardContent>
        </Card>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Card className="rounded-[3rem] overflow-hidden shadow-xl">
                <CardHeader className="bg-secondary/30 p-8">
                    <CardTitle className="text-xl font-black tracking-tight">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-none">
                            <TableHead className="pl-8 text-[10px] font-black uppercase tracking-widest">Product</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                            <TableHead className="text-right pr-8 text-[10px] font-black uppercase tracking-widest">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentOrders.map(order => (
                            <TableRow key={order.id} className="border-border/5">
                                <TableCell className="pl-8 py-5">
                                    <div className="font-bold text-sm">{order.product}</div>
                                    <div className="text-[9px] font-medium text-muted-foreground uppercase">{order.userId.substring(0,8)}...</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={order.status === 'Pending' ? 'secondary' : 'default'} className="rounded-full text-[9px] uppercase font-black tracking-widest">
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-8 font-black text-sm">${order.price.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
            <Card className="rounded-[3rem] overflow-hidden shadow-xl">
                <CardHeader className="bg-secondary/30 p-8">
                    <CardTitle className="text-xl font-black tracking-tight">Recent Withdrawals</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-none">
                                <TableHead className="pl-8 text-[10px] font-black uppercase tracking-widest">Method</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                                <TableHead className="text-right pr-8 text-[10px] font-black uppercase tracking-widest">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentWithdrawals.map(w => (
                                <TableRow key={w.id} className="border-border/5">
                                    <TableCell className="pl-8 py-5">
                                        <div className="font-bold text-sm">{w.paymentMethod}</div>
                                        <div className="text-[9px] font-medium text-muted-foreground uppercase">{w.userId.substring(0, 8)}...</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={w.status === 'Pending' ? 'secondary' : 'default'} className="rounded-full text-[9px] uppercase font-black tracking-widest">
                                            {w.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8 font-black text-sm">${w.amount.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}