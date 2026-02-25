"use client";

import Link from 'next/link';
import { Search, ListChecks, Wallet, User as UserIcon, Globe, ShoppingBag, Menu } from 'lucide-react';
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
              <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-black flex items-center justify-center">
                <Image src="https://image2url.com/r2/default/images/1771070780543-14ed69a5-dd31-45fd-b42b-250e069cc2c5.png" alt="Eden 0² Logo" fill className="object-contain p-1.5" />
              </div>
              <span className="font-black text-2xl font-headline tracking-tighter uppercase hidden lg:block">Eden 0²</span>
            </Link>
          </div>
          
          <div className="flex-1 max-w-lg mx-auto hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder={t('header.searchPlaceholder')} 
                className="pl-10 h-11 bg-secondary/40 border-transparent focus-visible:ring-1 focus-visible:ring-primary/20 rounded-full text-sm" 
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
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
            </div>

            <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

            {isUserLoading ? (
              <div className="h-10 w-32 bg-muted rounded-full animate-pulse" />
            ) : user && userData ? (
              <div className="flex items-center gap-3">
                 <Link href="/wallet" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:shadow-lg transition-all">
                    <Wallet className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-widest">${userData.walletBalance?.toLocaleString() || '0.00'}</span>
                 </Link>
                <Link href="/account">
                  <Button variant="outline" size="sm" className="rounded-full h-10 gap-2 px-4 border-foreground/10 hover:bg-secondary transition-colors">
                    <UserIcon className="h-4 w-4" />
                    <span className="max-w-[100px] truncate text-xs font-bold uppercase tracking-widest">{userData.username}</span>
                  </Button>
                </Link>
              </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Link href="/login" className="hidden sm:block">
                      <Button variant="ghost" size="sm" className="font-bold uppercase tracking-widest text-[11px]">Login</Button>
                    </Link>
                    <Link href="/signup">
                      <Button size="sm" className="rounded-full px-6 font-bold uppercase tracking-widest text-[11px]">Sign Up</Button>
                    </Link>
                </div>
            )}
          </div>
        </div>
      </div>
       <nav className="border-t bg-background/50">
         <div className="container mx-auto px-4">
            <div className="flex justify-center items-center gap-10 h-14">
              <Link href="/" className="text-[11px] font-black uppercase tracking-[0.2em] hover:text-primary transition-colors">
                {t('header.home')}
              </Link>
              <Link href="/tasks" className="text-[11px] font-black uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary"/> {t('header.dailyTasks')}
              </Link>
              <Link href="/redeem" className="text-[11px] font-black uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center gap-2 group">
                <ShoppingBag className="h-4 w-4" /> {t('header.redeemBasket')} 
                {itemCount > 0 && (
                    <span className="bg-accent text-accent-foreground text-[10px] px-2 py-0.5 rounded-full font-black shadow-sm group-hover:scale-110 transition-transform">
                        {itemCount}
                    </span>
                )}
              </Link>
            </div>
         </div>
       </nav>
    </header>
  );
}