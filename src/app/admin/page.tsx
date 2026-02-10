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
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const { isAdmin, isAdminLoading } = useAdminStatus();
  const router = useRouter();
  const { t } = useLanguage();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => query(collection(firestore, 'orders'), orderBy('date', 'desc')), [firestore]);
  const { data: ordersData, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

  const withdrawalsQuery = useMemoFirebase(() => query(collection(firestore, 'withdrawals'), orderBy('date', 'desc')), [firestore]);
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
    return <div className="container text-center p-8">{t('general.loading')}</div>;
  }

  if (!isAdmin) {
    return null;
  }
    
  const pendingOrders = ordersData?.filter(o => o.status === 'Pending').length || 0;
  const pendingWithdrawals = withdrawalsData?.filter(w => w.status === 'Pending').length || 0;
  const totalRevenue = ordersData?.filter(o => o.status === 'Completed' || o.status === 'Approved').reduce((sum, o) => sum + o.price, 0) || 0;
    
  const recentOrders = ordersData?.slice(0, 5) || [];
  const recentWithdrawals = withdrawalsData?.slice(0, 5) || [];

  // This is a placeholder as we cannot list all users due to security rules.
  const totalUsers = 'N/A';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold font-headline mb-8">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">List operation restricted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingWithdrawals}</div>
          </CardContent>
        </Card>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>User ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentOrders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.product}</TableCell>
                                <TableCell className="text-muted-foreground">{order.userId.substring(0,8)}...</TableCell>
                                <TableCell>
                                    <Badge variant={order.status === 'Pending' ? 'secondary' : 'default'}>{order.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">${order.price.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Withdrawals</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User ID</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentWithdrawals.map(w => (
                                <TableRow key={w.id}>
                                    <TableCell className="text-muted-foreground">{w.userId.substring(0, 8)}...</TableCell>
                                    <TableCell>{w.paymentMethod}</TableCell>
                                    <TableCell>
                                        <Badge variant={w.status === 'Pending' ? 'secondary' : 'default'}>{w.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">${w.amount.toLocaleString()}</TableCell>
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
