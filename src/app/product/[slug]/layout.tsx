import { products } from '@/lib/data';

export async function generateStaticParams() {
  // This tells the builder which paths to create
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}