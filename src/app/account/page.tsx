'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from "@/firebase";
import { doc, collection, query, where } from 'firebase/firestore';
import { useCollection } from "@/firebase/firestore/use-collection";
import { signOut } from "firebase/auth";
import type { Order } from "@/lib/types";
import { ArrowRight, DollarSign, ListChecks } from "lucide-react";

export default function AccountPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const firestore = useFirestore();
    const auth = useAuth();
    
    const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
    const { data: userData, isLoading: isUserDocLoading } = useDoc<any>(userDocRef);

    const ordersQuery = useMemoFirebase(() => user ? query(collection(firestore, 'orders'), where('userId', '==', user.uid)) : null, [firestore, user]);
    const { data: ordersData, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

    const [clientOrders, setClientOrders] = useState<(Order & { formattedDate: string })[]>([]);

    useEffect(() => {
        if (ordersData) {
            setClientOrders(
                ordersData.map(order => ({
                    ...order,
                    formattedDate: new Date(order.date).toLocaleDateString()
                }))
            );
        }
    }, [ordersData]);


    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    const handleLogout = async () => {
        if (!auth) return;
        await signOut(auth);
        router.push('/login');
    };

    if (isUserLoading || isUserDocLoading || areOrdersLoading) {
        return <div className="container text-center p-8">Loading...</div>; // Or a skeleton loader
    }

    if (!user || !userData) {
        return null; // Or a message
    }

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-headline">My Account</h1>
            <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Manage your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="font-semibold">{userData.username}</p>
                        <p className="text-sm text-muted-foreground">{userData.email}</p>
                        <Button variant="outline" size="sm" className="mt-2" disabled>Edit Profile</Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${userData.walletBalance?.toLocaleString() || '0.00'}</div>
                        <p className="text-xs text-muted-foreground">Your current earnings</p>
                         <Button size="sm" className="mt-4 w-full" asChild>
                            <Link href="/wallet">Manage Wallet <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Daily Tasks</CardTitle>
                        <ListChecks className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userData.taskProgress || 0}% Complete</div>
                        <p className="text-xs text-muted-foreground">Your progress on today's tasks</p>
                        <Button size="sm" variant="outline" className="mt-4 w-full" asChild>
                            <Link href="/tasks">View Tasks <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Order History</CardTitle>
                        <CardDescription>View your past orders and their status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clientOrders.length > 0 ? clientOrders.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.product}</TableCell>
                                        <TableCell>{order.formattedDate}</TableCell>
                                        <TableCell>
                                            <Badge variant={order.status === 'Completed' || order.status === 'Approved' ? 'default' : 'secondary'} className={
                                                order.status === 'Completed' || order.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                                order.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">${order.price.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/order-confirmation/${order.id.split('_')[0]}`}>View</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">You have no orders yet.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    )
}
