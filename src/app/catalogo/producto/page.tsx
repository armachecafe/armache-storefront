import { Suspense } from 'react';
import ProductPageClient from './product-client';

// STATIC route (no dynamic segment). The product slug travels as a query param (?slug=...),
// read client-side via useSearchParams. This avoids the static-export limitation where a
// dynamic [slug] route not prerendered by generateStaticParams can't be reconciled by the
// client router, which falls back to '/' → the HOME page renders under the product URL.
export default function ProductoPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center"><p className="text-gray-500">Cargando producto...</p></div>}>
      <ProductPageClient />
    </Suspense>
  );
}
