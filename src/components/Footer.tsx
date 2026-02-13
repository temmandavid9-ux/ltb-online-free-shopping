'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 4.4s-1.4-1.4-2.8-1.2c-1.5-1.1-3.3-1.8-5.2-1.8-3.3 0-6.1 2.7-6.1 6.1 0 2.1 1 4 2.6 5.2-1.4 0-2.6-.5-3.6-1.1v.2c0 3.3 2.3 6.1 5.4 6.7-.6.2-1.2.2-1.8.1.9 2.7 3.4 4.7 6.4 4.7-2.7 2.1-6.1 3.3-9.8 3.3-.6 0-1.2-.1-1.8-.3 3.4 2.2 7.5 3.5 11.8 3.5 14.2 0 22-11.8 22-22v-1z" /></svg>
);
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);


export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-card border-t mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image src="https://image2url.com/r2/default/images/1771007062654-ff8e2521-cbb9-4dab-8222-20cfbdcff6d3.png" alt="Eden 0² Logo" width={30} height={30} />
              <span className="font-bold text-3xl font-headline">Eden 0²</span>
            </Link>
            <p className="text-sm text-muted-foreground">{t('footer.companyLine')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-3 gap-8">
            <div>
              <h4 className="font-semibold mb-3">{t('footer.shop')}</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('footer.newArrivals')}</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('footer.bestSellers')}</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('footer.categories')}</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('footer.onSale')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">{t('footer.support')}</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('footer.contactUs')}</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('footer.faq')}</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('footer.shippingReturns')}</Link></li>
                <li><Link href="/account" className="text-sm text-muted-foreground hover:text-primary">{t('footer.orderTracking')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">{t('footer.company')}</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('footer.aboutUs')}</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('footer.careers')}</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('footer.privacyPolicy')}</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('footer.termsOfService')}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-primary"><TwitterIcon className="h-5 w-5" /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary"><FacebookIcon className="h-5 w-5" /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary"><InstagramIcon className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
