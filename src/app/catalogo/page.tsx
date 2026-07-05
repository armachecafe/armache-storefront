'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { FeaturedProducts } from '@/components/home/featured-products';
import type { ProductSummary, Category } from '@/lib/api';

function CatalogoContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') ?? undefined;
  const cursor = searchParams.get('cursor') ?? undefined;

  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [categoryName, setCategoryName] = useState('Todos los Productos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [productsData, cats] = await Promise.all([
          api.getProducts({ category, limit: 12, cursor }),
          api.getCategories(),
        ]);
        setProducts(productsData.items);
        setNextCursor(productsData.nextCursor);
        setCategories(cats.level1);

        if (category) {
          const found = cats.level1.find((c) => c.categoryId === category);
          setCategoryName(found?.name ?? 'Catálogo');
        } else {
          setCategoryName('Todos los Productos');
        }
      } catch {
        // API error
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category, cursor]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-brand-primary">Inicio</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{categoryName}</span>
      </nav>

      <h1 className="font-display text-3xl text-brand-primary mb-8">{categoryName}</h1>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8" data-testid="category-filters">
        <a
          href="/catalogo/"
          className={`px-4 py-2 rounded-full text-sm border transition-colors ${!category ? 'bg-brand-primary text-white border-brand-primary' : 'border-gray-200 hover:border-brand-primary'}`}
        >
          Todos
        </a>
        {categories.map((cat) => (
          <a
            key={cat.categoryId}
            href={`/catalogo/?category=${cat.categoryId}`}
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${category === cat.categoryId ? 'bg-brand-primary text-white border-brand-primary' : 'border-gray-200 hover:border-brand-primary'}`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {/* Products grid */}
      {loading ? (
        <p className="text-center text-gray-500 py-12">Cargando productos...</p>
      ) : products.length > 0 ? (
        <FeaturedProducts products={products} />
      ) : (
        <p className="text-center text-gray-500 py-12">No hay productos en esta categoría.</p>
      )}

      {/* Pagination */}
      {nextCursor && (
        <div className="mt-8 text-center">
          <a
            href={`/catalogo/?${category ? `category=${category}&` : ''}cursor=${nextCursor}`}
            className="inline-block bg-brand-primary text-white px-6 py-3 rounded-lg hover:bg-brand-secondary transition-colors"
            data-testid="load-more-button"
          >
            Ver más productos
          </a>
        </div>
      )}
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><p className="text-center text-gray-500 py-12">Cargando...</p></div>}>
      <CatalogoContent />
    </Suspense>
  );
}
