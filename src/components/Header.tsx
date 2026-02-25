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
  const firestore = useFirestore();
  const { t, setLocale, locale } = useLanguage();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userData } = useDoc<any>(userDocRef);

  return (
    <header className="glass-header">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24 gap-8">
          <div className="shrink-0">
            <Link href="/" className="flex items-center gap-4">
              <div className="relative w-12 h-12 overflow-hidden rounded-2xl bg-black flex items-center justify-center shadow-xl shadow-black/10">
                <Image src="https://image2url.com/r2/default/images/1771070780543-14ed69a5-dd31-45fd-b42b-250e069cc2c5.png" alt="Eden 0² Logo" fill className="object-contain p-2" />
              </div>
              <span className="font-black text-3xl font-headline tracking-tighter uppercase hidden lg:block luxury-text-gradient">Eden 0²</span>
            </Link>
          </div>
          
          <div className="flex-1 max-w-xl mx-auto hidden md:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder={t('header.searchPlaceholder')} 
                className="pl-12 h-14 bg-secondary/30 border-transparent focus-visible:ring-1 focus-visible:ring-primary/20 rounded-2xl text-sm transition-all" 
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/50 h-12 w-12">
                            <Globe className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
                        <DropdownMenuItem onClick={() => setLocale('en')} className="justify-between rounded-lg">
                            English {locale === 'en' && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLocale('es')} className="justify-between rounded-lg">
                            Español {locale === 'es' && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="h-8 w-px bg-border/60 mx-2 hidden sm:block" />

            {isUserLoading ? (
              <div className="h-12 w-36 bg-muted rounded-full animate-pulse" />
            ) : user && userData ? (
              <div className="flex items-center gap-4">
                 <Link href="/wallet" className="hidden sm:flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:shadow-2xl hover:shadow-primary/20 transition-all transform active:scale-95">
                    <Wallet className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-widest">${userData.walletBalance?.toLocaleString() || '0.00'}</span>
                 </Link>
                <Link href="/account">
                  <Button variant="outline" className="rounded-full h-12 gap-3 px-6 border-foreground/5 hover:bg-secondary/50 transition-all">
                    <UserIcon className="h-4 w-4" />
                    <span className="max-w-[120px] truncate text-[11px] font-black uppercase tracking-[0.1em]">{userData.username}</span>
                  </Button>
                </Link>
              </div>
            ) : (
                <div className="flex items-center gap-3">
                    <Link href="/login" className="hidden sm:block">
                      <Button variant="ghost" className="font-black uppercase tracking-[0.2em] text-[10px] h-12 px-6">Login</Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="rounded-full px-8 h-12 font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/10">Sign Up</Button>
                    </Link>
                </div>
            )}
          </div>
        </div>
      </div>
       <nav className="border-t border-border/40 bg-background/30">
         <div className="container mx-auto px-4">
            <div className="flex justify-center items-center gap-12 h-16">
              <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-all relative group">
                {t('header.home')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
              <Link href="/tasks" className="text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-all flex items-center gap-2.5 group">
                <ListChecks className="h-4 w-4 text-primary transition-transform group-hover:scale-110"/> {t('header.dailyTasks')}
              </Link>
              <Link href="/redeem" className="text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-all flex items-center gap-2.5 group">
                <div className="relative">
                  <ShoppingBag className="h-4 w-4 transition-transform group-hover:scale-110" />
                  {itemCount > 0 && (
                      <span className="absolute -top-2.5 -right-2.5 bg-accent text-accent-foreground text-[9px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-black shadow-lg animate-in zoom-in">
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