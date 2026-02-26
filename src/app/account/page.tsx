
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
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth, useCollection, updateDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase";
import { doc, collection, query, where } from 'firebase/firestore';
import { signOut } from "firebase/auth";
import type { Order, UserProfile, RewardRedemption } from "@/lib/types";
import { ArrowRight, DollarSign, ListChecks, Crown, Gift, Trophy } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";

export default function AccountPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const firestore = useFirestore();
    const auth = useAuth();
    const { t } = useLanguage();
    const { toast } = useToast();
    
    // Corrected 2-segment path for profile document
    const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
    const { data: userData, isLoading: isUserDocLoading } = useDoc<UserProfile>(userDocRef);

    const ordersQuery = useMemoFirebase(() => user ? query(collection(firestore, 'orders'), where('userId', '==', user.uid)) : null, [firestore, user]);
    const { data: ordersData, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

    const redemptionsQuery = useMemoFirebase(() => user ? query(collection(firestore, 'users', user.uid, 'rewardRedemptions')) : null, [firestore, user]);
    const { data: redemptionsData } = useCollection<RewardRedemption>(redemptionsQuery);

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

    const handleRedeemGiftCard = () => {
        if (!user || !userData || !userDocRef) return;
        if (userData.eliteRewardsAvailable <= 0) return;

        const redemptionId = `gc_${Date.now()}`;
        const codeId = `EDEN-GC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        
        const redemptionRef = doc(firestore, 'users', user.uid, 'rewardRedemptions', redemptionId);
        const newRedemption: RewardRedemption = {
            id: redemptionId,
            userId: user.uid,
            giftCardCodeId: codeId,
            redemptionDate: new Date().toISOString(),
            rewardType: '$25 Elite Monthly Gift Card',
            value: 25,
        };

        setDocumentNonBlocking(redemptionRef, newRedemption, { merge: false });
        
        updateDocumentNonBlocking(userDocRef, {
            eliteRewardsAvailable: userData.eliteRewardsAvailable - 1,
            redeemedRewardIds: [...(userData.redeemedRewardIds || []), redemptionId]
        });

        toast({
            title: "Gift Card Redeemed!",
            description: `Your unique code is: ${codeId}. Check your reward history below.`,
        });
    };

    if (isUserLoading || isUserDocLoading || areOrdersLoading) {
        return <div className="container text-center p-24">{t('general.loading')}</div>;
    }

    if (!user || !userData) {
        return null;
    }

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-12">
            <div>
                <h1 className="text-5xl font-black luxury-text-gradient tracking-tighter mb-2">{t('account.title')}</h1>
                <p className="text-muted-foreground font-medium uppercase tracking-[0.3em] text-[10px]">{userData.username} • {userData.email}</p>
            </div>
            <Button onClick={handleLogout} variant="ghost" className="rounded-full font-black uppercase tracking-widest text-[10px] h-12 px-8 border border-border/10">
                {t('account.logout')}
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 space-y-10">
                <Card className="rounded-[3rem] border-primary/20 bg-primary/5 overflow-hidden shadow-xl">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between mb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-widest">{t('account.eliteStatus')}</CardTitle>
                            {userData.eliteUnlocked ? <Crown className="w-6 h-6 text-primary" /> : <Trophy className="w-6 h-6 text-muted-foreground/30" />}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black luxury-text-gradient mb-2">
                            {userData.eliteUnlocked ? t('account.eliteUnlocked') : t('account.eliteStandard')}
                        </div>
                        <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-6">
                            {t('account.eliteStreak', { streak: userData.streakCount || 0 })}
                        </p>
                        <Button size="sm" variant="outline" className="w-full rounded-2xl h-12 font-black uppercase tracking-widest text-[10px]" asChild>
                            <Link href="/tasks">{t('account.viewTasks')} <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="rounded-[3rem] border-black/5 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle className="text-sm font-black uppercase tracking-widest">{t('account.walletTitle')}</CardTitle>
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <DollarSign className="w-5 h-5 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black mb-6">${userData.balance?.toFixed(2) || '0.00'}</div>
                         <Button className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] btn-luxury" asChild>
                            <Link href="/wallet">{t('account.manageWallet')} <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardContent>
                </Card>

                {userData.eliteUnlocked && (
                    <Card className="rounded-[3rem] border-accent/20 bg-accent/5 overflow-hidden shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Gift className="w-5 h-5 text-accent" /> {t('account.rewardsTitle')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center p-6 bg-white rounded-[2rem] border border-accent/10">
                                <div className="text-3xl font-black text-accent mb-1">{userData.eliteRewardsAvailable || 0}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('account.rewardsAvailable', { count: userData.eliteRewardsAvailable })}</div>
                            </div>
                            <Button 
                                onClick={handleRedeemGiftCard} 
                                disabled={userData.eliteRewardsAvailable <= 0}
                                className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] bg-accent hover:bg-accent/90"
                            >
                                {t('account.redeemReward')}
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="lg:col-span-2 space-y-10">
                <Card className="rounded-[3rem] border-black/5 shadow-xl overflow-hidden">
                    <CardHeader className="p-10 pb-6 border-b border-border/50">
                        <CardTitle className="text-2xl font-black luxury-text-gradient">{t('account.orderHistoryTitle')}</CardTitle>
                        <CardDescription className="font-medium text-[10px] uppercase tracking-widest text-muted-foreground/60">{t('account.orderHistoryDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-none bg-secondary/30">
                                    <TableHead className="pl-10 h-14 text-[10px] font-black uppercase tracking-widest">{t('general.product')}</TableHead>
                                    <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest">{t('general.status')}</TableHead>
                                    <TableHead className="h-14 text-right pr-10 text-[10px] font-black uppercase tracking-widest">{t('general.total')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clientOrders.length > 0 ? clientOrders.map(order => (
                                    <TableRow key={order.id} className="border-border/5 group">
                                        <TableCell className="pl-10 py-6">
                                            <div className="font-bold text-sm group-hover:text-primary transition-colors">{order.product}</div>
                                            <div className="text-[10px] font-black text-muted-foreground/40 mt-1">{order.formattedDate}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="rounded-full px-4 py-1 border-none bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-10">
                                            <div className="font-black text-sm">${order.price.toLocaleString()}</div>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-20 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{t('account.noOrders')}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {redemptionsData && redemptionsData.length > 0 && (
                    <Card className="rounded-[3rem] border-black/5 shadow-xl overflow-hidden">
                        <CardHeader className="p-10 pb-6 border-b border-border/50">
                            <CardTitle className="text-2xl font-black luxury-text-gradient">Reward History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-none bg-secondary/30">
                                        <TableHead className="pl-10 h-14 text-[10px] font-black uppercase tracking-widest">Reward</TableHead>
                                        <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest">Code</TableHead>
                                        <TableHead className="h-14 text-right pr-10 text-[10px] font-black uppercase tracking-widest">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {redemptionsData.map(red => (
                                        <TableRow key={red.id} className="border-border/5">
                                            <TableCell className="pl-10 py-6">
                                                <div className="font-bold text-sm">{red.rewardType}</div>
                                            </TableCell>
                                            <TableCell>
                                                <code className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-black tracking-widest">
                                                    {red.giftCardCodeId}
                                                </code>
                                            </TableCell>
                                            <TableCell className="text-right pr-10">
                                                <div className="text-[10px] font-black text-muted-foreground/40">{new Date(red.redemptionDate).toLocaleDateString()}</div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
      </div>
    )
}
