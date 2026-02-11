"use client";

import Link from 'next/link';
import { Search, Gem, ListChecks, Wallet, User as UserIcon, Globe } from 'lucide-react';
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
    <header className="bg-card border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Gem className="h-7 w-7 text-primary" />
              <span className="font-bold text-2xl font-headline text-primary">Eden 0²</span>
            </Link>
          </div>
          
          <div className="flex-1 flex justify-center px-8">
            <div className="w-full max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder={t('header.searchPlaceholder')} className="pl-10 h-11" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Globe className="h-5 w-5" />
                        <span className="sr-only">Change language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setLocale('en')} disabled={locale === 'en'}>
                        English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocale('es')} disabled={locale === 'es'}>
                        Español
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {isUserLoading ? (
              <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
            ) : user && userData ? (
              <>
                <div className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{t('header.greeting', { username: userData.username })}</span>
                </div>
                 <div className="h-8 w-px bg-border" />
                 <Link href="/wallet" className="flex items-center space-x-2 hover:text-primary transition-colors">
                    <Wallet className="h-5 w-5" />
                    <span className="text-sm font-bold">${userData.walletBalance?.toLocaleString() || '0.00'}</span>
                 </Link>
                <Link href="/account"><Button variant="outline" size="sm">{t('header.account')}</Button></Link>
              </>
            ) : (
                <>
                    <Link href="/login">
                    <Button variant="ghost">{t('header.login')}</Button>
                    </Link>
                    <Link href="/signup">
                    <Button>{t('header.signUp')}</Button>
                    </Link>
                </>
            )}
          </div>
        </div>
      </div>
       <div className="border-t bg-card">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex justify-center items-center space-x-8 h-12">
              <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                {t('header.home')}
              </Link>
              <Link href="/tasks" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center">
                <ListChecks className="mr-1 h-4 w-4"/> {t('header.dailyTasks')}
              </Link>
              <Link href="/redeem" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                {t('header.redeemBasket')} ({itemCount})
              </Link>
            </nav>
         </div>
       </div>
    </header>
  );
}
