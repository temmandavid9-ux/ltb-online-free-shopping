"use client";

import Link from 'next/link';
import { Search, ListChecks, Wallet, User as UserIcon, Globe, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRedeem } from '@/context/CartContext';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { Input } from '@/components/ui/input';
import { doc } from 'firebase/firestore';
import { useLanguage } from '@/context/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { itemCount } = useRedeem();
  const { user, isUserLoading } = useUser();
  const { isAdmin } = useAdminStatus();
  const firestore = useFirestore();
  const { t, setLocale, locale } = useLanguage();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userData } = useDoc<any>(userDocRef);

  return (
    <header className="glass-header">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-4">
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                <Image src="https://image2url.com/r2/default/images/1771070780543-14ed69a5-dd31-45fd-b42b-250e069cc2c5.png" alt="Eden 0² Logo" fill className="object-contain" />
              </div>
              <span className="font-black text-2xl font-headline tracking-tighter uppercase hidden sm:block">Eden 0²</span>
            </Link>
          </div>
          
          <div className="flex-1 max-w-xl mx-auto hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder={t('header.searchPlaceholder')} 
                className="pl-10 h-10 bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary/30" 
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Globe className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => setLocale('en')} className="justify-between">
                        English {locale === 'en' && <span className="w-2 h-2 rounded-full bg-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocale('es')} className="justify-between">
                        Español {locale === 'es' && <span className="w-2 h-2 rounded-full bg-primary" />}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 w-px bg-border mx-1" />

            {isUserLoading ? (
              <div className="h-10 w-32 bg-muted rounded-full animate-pulse" />
            ) : user && userData ? (
              <div className="flex items-center gap-3">
                 <Link href="/wallet" className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors">
                    <Wallet className="h-4 w-4" />
                    <span className="text-sm font-bold">${userData.walletBalance?.toLocaleString() || '0.00'}</span>
                 </Link>
                <Link href="/account">
                  <Button variant="outline" size="sm" className="rounded-full gap-2 px-4 border-primary/20 hover:bg-primary/5">
                    <UserIcon className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">{userData.username}</span>
                  </Button>
                </Link>
              </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Link href="/login" className="hidden sm:block">
                      <Button variant="ghost" size="sm">Login</Button>
                    </Link>
                    <Link href="/signup">
                      <Button size="sm" className="rounded-full px-6">Sign Up</Button>
                    </Link>
                </div>
            )}
          </div>
        </div>
      </div>
       <nav className="border-t">
         <div className="container mx-auto px-4">
            <div className="flex justify-center items-center gap-8 h-12">
              <Link href="/" className="text-[13px] font-semibold uppercase tracking-widest hover:text-primary transition-colors">
                {t('header.home')}
              </Link>
              <Link href="/tasks" className="text-[13px] font-semibold uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary"/> {t('header.dailyTasks')}
              </Link>
              <Link href="/redeem" className="text-[13px] font-semibold uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> {t('header.redeemBasket')} 
                {itemCount > 0 && <span className="bg-accent text-accent-foreground text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{itemCount}</span>}
              </Link>
            </div>
         </div>
       </nav>
    </header>
  );
}