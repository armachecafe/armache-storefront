import { HeroBanner } from '@/components/home/hero-banner';
import { FeaturedProducts } from '@/components/home/featured-products';
import { CategoryGrid } from '@/components/home/category-grid';
import { api } from '@/lib/api';

export default async function HomePage() {
  const [theme, featured, categories] = await Promise.all([
    api.getTheme(),
    api.getFeaturedProducts(6),
    api.getCategories(),
  ]);

  return (
    <div>
      <HeroBanner theme={theme} />
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl text-brand-primary mb-8">Productos Destacados</h2>
        <FeaturedProducts products={featured} />
      </section>
      <section className="bg-brand-light py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl text-brand-primary mb-8">Nuestras Categorías</h2>
          <CategoryGrid categories={categories.level1} />
        </div>
      </section>
    </div>
  );
}
