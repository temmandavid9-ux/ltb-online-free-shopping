
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

const MASTER_LOGO = "https://image2url.com/r2/default/images/1772178137302-2b78055d-a492-42f2-ab5c-2f9d1cb163cc.png";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-card border-t mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-4 mb-4 group">
              <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden p-1 shadow-sm">
                <Image 
                  src={MASTER_LOGO} 
                  alt="Less Talk Business Logo" 
                  width={80} 
                  height={80}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl font-headline luxury-text-gradient">Less Talk</span>
                <span className="font-black text-[10px] uppercase tracking-[0.3em] text-primary -mt-1">Business</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">{t('footer.companyLine')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-3 gap-8">
            <div>
              <h4 className="font-black uppercase tracking-widest text-[10px] mb-4">{t('footer.shop')}</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm font-bold text-muted-foreground hover:text-primary">{t('footer.newArrivals')}</Link></li>
                <li><Link href="#" className="text-sm font-bold text-muted-foreground hover:text-primary">{t('footer.bestSellers')}</Link></li>
                <li><Link href="#" className="text-sm font-bold text-muted-foreground hover:text-primary">{t('footer.categories')}</Link></li>
                <li><Link href="#" className="text-sm font-bold text-muted-foreground hover:text-primary">{t('footer.onSale')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-[10px] mb-4">{t('footer.support')}</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm font-bold text-muted-foreground hover:text-primary">{t('footer.contactUs')}</Link></li>
                <li><Link href="#" className="text-sm font-bold text-muted-foreground hover:text-primary">{t('footer.faq')}</Link></li>
                <li><Link href="#" className="text-sm font-bold text-muted-foreground hover:text-primary">{t('footer.shippingReturns')}</Link></li>
                <li><Link href="/account" className="text-sm font-bold text-muted-foreground hover:text-primary">{t('footer.orderTracking')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-[10px] mb-4">{t('footer.company')}</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm font-bold text-muted-foreground hover:text-primary">{t('footer.aboutUs')}</Link></li>
                <li><Link href="#" className="text-sm font-bold text-muted-foreground hover:text-primary">{t('footer.careers')}</Link></li>
                <li><Link href="#" className="text-sm font-bold text-muted-foreground hover:text-primary">{t('footer.privacyPolicy')}</Link></li>
                <li><Link href="#" className="text-sm font-bold text-muted-foreground hover:text-primary">{t('footer.termsOfService')}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
