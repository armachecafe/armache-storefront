'use client';

import { useEffect, useState } from 'react';
import { HeroBanner } from '@/components/home/hero-banner';
import { FeaturedProducts } from '@/components/home/featured-products';
import { CategoryGrid } from '@/components/home/category-grid';
import { api } from '@/lib/api';
import type { Theme, ProductSummary, Category } from '@/lib/api';

export default function HomePage() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [featured, setFeatured] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [t, f, c] = await Promise.all([
          api.getTheme(),
          api.getFeaturedProducts(6),
          api.getCategories(),
        ]);
        setTheme(t);
        setFeatured(f);
        setCategories(c.level1);
      } catch {
        // API unavailable — show empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div>
      {theme && <HeroBanner theme={theme} />}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl text-brand-primary mb-8">Productos Destacados</h2>
        <FeaturedProducts products={featured} />
      </section>
      {categories.length > 0 && (
        <section className="bg-brand-light py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-display text-3xl text-brand-primary mb-8">Nuestras Categorías</h2>
            <CategoryGrid categories={categories} />
          </div>
        </section>
      )}
    </div>
  );
}
