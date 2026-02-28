"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Search, ListChecks, Wallet, User as UserIcon, Globe, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRedeem } from '@/context/CartContext';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Input } from '@/components/ui/input';
import { doc } from 'firebase/firestore';
import { useLanguage } from '@/context/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserProfile } from '@/lib/types';

const MASTER_LOGO = "https://image2url.com/r2/default/images/1772178137302-2b78055d-a492-42f2-ab5c-2f9d1cb163cc.png";

export default function Header() {
  const { itemCount } = useRedeem();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { t, setLocale, locale } = useLanguage();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userData } = useDoc<UserProfile>(userDocRef);

  const balance = userData?.balance ?? 0;

  return (
    <header className="glass-header">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-24 gap-4 md:gap-8">
          <div className="shrink-0">
            <Link href="/" className="flex items-center gap-3 md:gap-4 group">
              <div className="relative w-12 h-12 md:w-14 md:h-14 overflow-hidden rounded-2xl bg-black flex items-center justify-center shadow-xl shadow-black/20 group-hover:scale-105 transition-transform p-1">
                <Image 
                  src={MASTER_LOGO} 
                  alt="Less Talk Business Logo" 
                  width={100} 
                  height={100}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl md:text-2xl font-headline tracking-tighter uppercase leading-none luxury-text-gradient">Less Talk</span>
                <span className="font-black text-xs md:text-sm tracking-[0.3em] uppercase text-primary leading-none">Business</span>
              </div>
            </Link>
          </div>
          
          <div className="flex-1 max-w-xl mx-auto hidden md:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder={t('header.searchPlaceholder')} 
                className="pl-12 h-12 md:h-14 bg-secondary/20 border-transparent focus-visible:ring-1 focus-visible:ring-primary/20 rounded-2xl text-sm transition-all shadow-inner" 
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/50 h-10 w-10 md:h-12 md:w-12">
                        <Globe className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-2xl border-border/50">
                    <DropdownMenuItem onClick={() => setLocale('en')} className="justify-between rounded-xl px-4 py-3">
                        English {locale === 'en' && <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocale('es')} className="justify-between rounded-xl px-4 py-3">
                        Español {locale === 'es' && <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-8 w-px bg-border/40 mx-1 hidden sm:block" />

            {isUserLoading ? (
              <div className="h-10 w-32 md:h-12 md:w-36 bg-muted rounded-full animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2 md:gap-4">
                 <Link href="/wallet" className="flex items-center gap-2 px-3 sm:px-5 py-2 md:py-2.5 bg-black text-white rounded-full hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] transition-all transform active:scale-95 btn-luxury">
                    <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    <span className="text-[9px] sm:text-xs font-black uppercase tracking-widest">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                 </Link>
                <Link href="/account">
                  <Button variant="outline" className="rounded-full h-10 md:h-12 gap-3 px-3 md:px-6 border-foreground/5 hover:bg-secondary/50 transition-all shadow-sm">
                    <UserIcon className="h-4 w-4" />
                    <span className="max-w-[100px] sm:max-w-[150px] truncate text-[9px] md:text-[11px] font-black uppercase tracking-[0.1em]">
                        {userData?.username ? t('header.greeting', { username: userData.username }) : 'Profile'}
                    </span>
                  </Button>
                </Link>
              </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Link href="/login" className="hidden sm:block">
                      <Button variant="ghost" className="font-black uppercase tracking-[0.2em] text-[10px] h-10 md:h-12 px-4 md:px-6">Login</Button>
                    </Link>
                    <Link href="/signup" className>
                      <Button className="rounded-full px-6 md:px-8 h-10 md:h-12 font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/10 btn-luxury">Sign Up</Button>
                    </Link>
                </div>
            )}
          </div>
        </div>
      </div>
       <nav className="border-t border-border/40 bg-white/30">
         <div className="container mx-auto px-4">
            <div className="flex justify-center items-center gap-8 md:gap-12 h-14 md:h-16">
              <Link href="/" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-all relative group py-2">
                {t('header.home')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
              <Link href="/tasks" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-all flex items-center gap-2.5 group py-2">
                <ListChecks className="h-4 w-4 text-primary transition-transform group-hover:scale-110"/> {t('header.dailyTasks')}
              </Link>
              <Link href="/redeem" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-all flex items-center gap-2.5 group py-2">
                <div className="relative">
                  <ShoppingBag className="h-4 w-4 transition-transform group-hover:scale-110" />
                  {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2.5 bg-accent text-accent-foreground text-[8px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full font-black shadow-lg animate-in zoom-in">
                          {itemCount}
                      </span>
                  )}
                </div>
                {t('header.redeemBasket')}
              </Link>
            </div>
         </div>
       </nav>
    </header>
  );
}
