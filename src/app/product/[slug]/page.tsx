import { Suspense } from 'react';
import ProductClient from './ProductClient';

export function generateStaticParams() {
  return []; 
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  return (
    <Suspense fallback={<div className="p-20 text-center font-black">LOADING...</div>}>
      <ProductClient slug={slug} />
    </Suspense>
  );
}
