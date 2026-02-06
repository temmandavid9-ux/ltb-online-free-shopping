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
import { useEffect } from "react";
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from "@/firebase";
import { doc, collection, query, where } from 'firebase/firestore';
import { useCollection } from "@/firebase/firestore/use-collection";
import { signOut } from "firebase/auth";
import type { Order } from "@/lib/types";

export default function AccountPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const firestore = useFirestore();
    const auth = useAuth();
    
    const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
    const { data: userData, isLoading: isUserDocLoading } = useDoc<any>(userDocRef);

    const ordersQuery = useMemoFirebase(() => user ? query(collection(firestore, 'orders'), where('userId', '==', user.uid)) : null, [firestore, user]);
    const { data: ordersData, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    const handleLogout = async () => {
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
            <div className="md:col-span-1">
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
                 <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Wallet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">${userData.walletBalance?.toFixed(2) || '0.00'}</p>
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
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ordersData && ordersData.length > 0 ? ordersData.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-sm">{order.id.slice(-6)}</TableCell>
                                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={order.status === 'Completed' || order.status === 'Approved' ? 'default' : 'secondary'} className={
                                                order.status === 'Completed' || order.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                                order.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">${order.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/order-confirmation/${order.id}`}>View</Link>
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
