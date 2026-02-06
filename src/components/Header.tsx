"use client";

import Link from 'next/link';
import { ShoppingCart, User, Search, Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/firebase';

export default function Header() {
  const { itemCount } = useCart();
  const { user, isUserLoading } = useUser();

  return (
    <header className="bg-card border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Package2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl font-headline">Eden 0²</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                New Arrivals
              </Link>
              <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Best Sellers
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
             {isUserLoading ? (
              <div className="h-8 w-16 bg-muted rounded-md animate-pulse" />
            ) : user ? (
                <Link href="/account">
                    <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                    </Button>
                </Link>
            ) : (
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
