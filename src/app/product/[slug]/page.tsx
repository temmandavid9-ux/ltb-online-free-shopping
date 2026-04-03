import { Suspense } from 'react';
import ProductClient from './ProductClient';

// This is the required "Hall Pass" for static exports
export function generateStaticParams() {
  return []; 
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  return (
    <Suspense fallback={<div className="p-20 text-center font-black uppercase">Loading Asset...</div>}>
      <ProductClient slug={slug} />
    </Suspense>
  );
}
