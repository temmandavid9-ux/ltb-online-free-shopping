'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, AlertCircle, Users, Database, Image as ImageIcon } from 'lucide-react';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Order, Withdrawal } from '@/lib/types';
import { getUniqueAssetCount } from '@/lib/data/find-image';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const { isAdmin, isAdminLoading } = useAdminStatus();
  const router = useRouter();
  const { t } = useLanguage();
  const firestore = useFirestore();
  const [assetCount, setAssetCount] = useState(0);

  useEffect(() => {
    setAssetCount(getUniqueAssetCount());
  }, []);

  // 1. FETCH ORDERS & WITHDRAWALS
  const ordersQuery = useMemoFirebase(() => isAdmin ? query(collection(firestore, 'orders'), orderBy('date', 'desc')) : null, [firestore, isAdmin]);
  const { data: ordersData, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

  const withdrawalsQuery = useMemoFirebase(() => isAdmin ? query(collection(firestore, 'withdrawals'), orderBy('date', 'desc')) : null, [firestore, isAdmin]);
  const { data: withdrawalsData, isLoading: areWithdrawalsLoading } = useCollection<Withdrawal>(withdrawalsQuery);

  // 2. FETCH USERS REGISTRY
  const usersQuery = useMemoFirebase(() => isAdmin ? query(collection(firestore, 'users')) : null, [firestore, isAdmin]);
  const { data: usersData, isLoading: areUsersLoading } = useCollection<any>(usersQuery);

  // 3. UPDATED HELPER: Deep search for the user by ID and name fields
  const getUserName = (idToFind: string) => {
    if (!usersData || usersData.length === 0) return idToFind.substring(0, 5);

    // This looks at the Document ID AND internal fields to find a match
    const foundUser = usersData.find(u => 
        u.id === idToFind || 
        u.uid === idToFind || 
        u.userId === idToFind ||
        (u as any).docId === idToFind
    );

    if (foundUser) {
        // Returns username, or displayName, or email. Fallback to "Name Not Set"
        return foundUser.username || foundUser.displayName || foundUser.email || "Name Not Set";
    }

    return `ID: ${idToFind.substring(0, 5)}`;
  };

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

  // Combined Loading State
  if (isUserLoading || isAdminLoading || areOrdersLoading || areWithdrawalsLoading || areUsersLoading) {
    return <div className="container text-center p-24 font-black uppercase tracking-widest text-foreground">{t('general.loading')}</div>;
  }

  if (!isAdmin) return null;
    
  const pendingOrders = ordersData?.filter(o => o.status === 'Pending').length || 0;
  const pendingWithdrawals = withdrawalsData?.filter(w => w.status === 'Pending').length || 0;
  const totalRevenue = ordersData?.filter(o => o.status === 'Completed' || o.status === 'Approved').reduce((sum, o) => sum + o.price, 0) || 0;
    
  const recentOrders = ordersData?.slice(0, 10) || [];
  const recentWithdrawals = withdrawalsData?.slice(0, 10) || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
            <h1 className="text-5xl font-black luxury-text-gradient tracking-tighter">Admin Console</h1>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mt-2">Less Talk Business Master Registry</p>
        </div>
        <Link href="/admin/image-viewer" className="bg-primary/10 text-primary px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
            Open Registry Audit
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <Card className="rounded-[2.5rem] shadow-xl border-primary/10 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary">Master Registered Assets</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">{assetCount} Unique Items</div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] shadow-xl border-border/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">{pendingOrders + pendingWithdrawals} Actions</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="rounded-[3rem] overflow-hidden shadow-xl border-black/5">
          <CardHeader className="bg-secondary/30 p-8">
            <CardTitle className="text-xl font-black tracking-tight text-foreground">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-none">
                  <TableHead className="pl-8 h-14 text-[10px] font-black uppercase tracking-widest text-foreground">Product</TableHead>
                  <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-foreground">Status</TableHead>
                  <TableHead className="h-14 text-right pr-8 text-[10px] font-black uppercase tracking-widest text-foreground">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map(order => (
                  <TableRow key={order.id} className="border-border/5">
                    <TableCell className="pl-8 py-5">
                      <div className="font-black text-sm text-foreground">{order.product}</div>
                      <div className="text-[10px] font-black text-primary uppercase tracking-widest">
                        REGISTRY: {getUserName(order.userId || order.id)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'Pending' ? 'secondary' : 'default'} className="rounded-full text-[9px] uppercase font-black tracking-widest">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8 font-black text-sm text-foreground">${order.price.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-[3rem] overflow-hidden shadow-xl border-black/5">
          <CardHeader className="bg-secondary/30 p-8">
            <CardTitle className="text-xl font-black tracking-tight text-foreground">Recent Withdrawals</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-none">
                  <TableHead className="pl-8 h-14 text-[10px] font-black uppercase tracking-widest text-foreground">Method</TableHead>
                  <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-foreground">Status</TableHead>
                  <TableHead className="h-14 text-right pr-8 text-[10px] font-black uppercase tracking-widest text-foreground">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentWithdrawals.map(w => (
                  <TableRow key={w.id} className="border-border/5">
                    <TableCell className="pl-8 py-5">
                      <div className="font-black text-sm text-foreground">{w.paymentMethod}</div>
                      <div className="text-[9px] font-black text-primary uppercase tracking-widest">
                        SENDER: {getUserName(w.userId || w.id)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={w.status === 'Pending' ? 'secondary' : 'default'} className="rounded-full text-[9px] uppercase font-black tracking-widest">
                        {w.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8 font-black text-sm text-foreground">${w.amount.toLocaleString()}</TableCell>
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
