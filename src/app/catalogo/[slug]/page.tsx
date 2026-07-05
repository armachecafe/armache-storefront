import ProductPageClient from './product-client';

// Pre-render a placeholder at build time; all other slugs resolved client-side via fallback
export function generateStaticParams() {
  return [{ slug: '_' }];
}

export const dynamicParams = true;

export default function ProductPage() {
  return <ProductPageClient />;
}
