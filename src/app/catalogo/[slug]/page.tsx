import { api } from '@/lib/api';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  let data;
  try {
    data = await api.getProductBySlug(params.slug);
  } catch {
    notFound();
  }

  const { product, variants } = data;
  const defaultVariant = variants.find((v) => v.variantId) ?? variants[0];
  const price = defaultVariant ? (defaultVariant.priceCents / 100).toFixed(2) : '0.00';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-brand-primary">Inicio</a>
        <span className="mx-2">/</span>
        <a href="/catalogo" className="hover:text-brand-primary">Catálogo</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          {product.images.length > 0 ? (
            <div className="aspect-square relative rounded-xl overflow-hidden bg-gray-50">
              <Image
                src={product.images.find((i) => i.isPrimary)?.url ?? product.images[0].url}
                alt={product.name}
                fill
                className="object-cover"
                priority
                data-testid="product-main-image"
              />
            </div>
          ) : (
            <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center text-6xl">☕</div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="font-display text-3xl text-brand-primary mb-2" data-testid="product-title">
            {product.name}
          </h1>

          {/* Coffee Attributes */}
          {product.coffeeAttributes && (
            <div className="bg-brand-light rounded-lg p-4 mb-6" data-testid="coffee-attributes">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Origen:</span> <span className="font-medium">{product.coffeeAttributes.origin}</span></div>
                <div><span className="text-gray-500">Altitud:</span> <span className="font-medium">{product.coffeeAttributes.altitude} m.s.n.m.</span></div>
                <div><span className="text-gray-500">Proceso:</span> <span className="font-medium">{product.coffeeAttributes.process}</span></div>
                <div><span className="text-gray-500">Variedad:</span> <span className="font-medium">{product.coffeeAttributes.variety}</span></div>
                <div><span className="text-gray-500">Tostado:</span> <span className="font-medium">{product.coffeeAttributes.roastLevel}</span></div>
                <div><span className="text-gray-500">Especie:</span> <span className="font-medium">{product.coffeeAttributes.species}</span></div>
              </div>
              {product.coffeeAttributes.flavorNotes.length > 0 && (
                <div className="mt-3 pt-3 border-t border-brand-primary/10">
                  <span className="text-gray-500 text-sm">Notas de sabor: </span>
                  <span className="text-sm font-medium">{product.coffeeAttributes.flavorNotes.join(', ')}</span>
                </div>
              )}
            </div>
          )}

          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl font-bold text-brand-primary" data-testid="product-price">S/ {price}</span>
          </div>

          {/* Variants */}
          {variants.length > 1 && (
            <div className="mb-6" data-testid="product-variants">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Presentación:</label>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.variantId}
                    className="px-4 py-2 border rounded-lg text-sm hover:border-brand-primary transition-colors"
                  >
                    {v.name} — S/ {(v.priceCents / 100).toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart (placeholder for Hito 2) */}
          <button
            className="w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!product.images.length}
            data-testid="add-to-cart-button"
          >
            Agregar al Carrito
          </button>

          {/* Description */}
          <div className="mt-8 prose prose-sm max-w-none" data-testid="product-description">
            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {product.registroSanitario && (
            <p className="mt-4 text-xs text-gray-400">R.S. {product.registroSanitario}</p>
          )}
        </div>
      </div>
    </div>
  );
}
