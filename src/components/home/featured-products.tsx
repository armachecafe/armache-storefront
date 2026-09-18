import Link from 'next/link';
import Image from 'next/image';
import type { ProductSummary } from '@/lib/api';

interface FeaturedProductsProps {
  products: ProductSummary[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: ProductSummary }) {
  const price = ((product.priceCents ?? 0) / 100).toFixed(2);
  const comparePrice = product.compareAtPriceCents ? (product.compareAtPriceCents / 100).toFixed(2) : null;

  return (
    // Static route + query param (?slug=): reliable in static export. A dynamic [slug]
    // route can't be reconciled by the client router for non-prerendered slugs (falls back
    // to '/' → HOME renders under the product URL). Link (soft-nav) is fine to a static route.
    <Link
      href={`/catalogo/producto/?slug=${product.slug}`}
      className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
      data-testid={`product-card-${product.slug}`}
    >
      {/* Image */}
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <span className="text-4xl">☕</span>
          </div>
        )}
        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Agotado</div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        {product.coffeeAttributes && (
          <p className="text-xs text-gray-500 mt-1">
            {product.coffeeAttributes.origin} · {product.coffeeAttributes.process} · {product.coffeeAttributes.roastLevel}
          </p>
        )}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-brand-primary">S/ {price}</span>
          {comparePrice && (
            <span className="text-sm text-gray-400 line-through">S/ {comparePrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
