import { api } from '@/lib/api';
import { FeaturedProducts } from '@/components/home/featured-products';

interface CatalogoPageProps {
  searchParams: { category?: string; cursor?: string };
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const { category, cursor } = searchParams;
  const [productsData, categories] = await Promise.all([
    api.getProducts({ category, limit: 12, cursor }),
    api.getCategories(),
  ]);

  const categoryName = category
    ? categories.level1.find((c) => c.categoryId === category)?.name ?? 'Catálogo'
    : 'Todos los Productos';

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
          href="/catalogo"
          className={`px-4 py-2 rounded-full text-sm border transition-colors ${!category ? 'bg-brand-primary text-white border-brand-primary' : 'border-gray-200 hover:border-brand-primary'}`}
        >
          Todos
        </a>
        {categories.level1.map((cat) => (
          <a
            key={cat.categoryId}
            href={`/catalogo?category=${cat.categoryId}`}
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${category === cat.categoryId ? 'bg-brand-primary text-white border-brand-primary' : 'border-gray-200 hover:border-brand-primary'}`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {/* Products grid */}
      {productsData.items.length > 0 ? (
        <FeaturedProducts products={productsData.items} />
      ) : (
        <p className="text-center text-gray-500 py-12">No hay productos en esta categoría.</p>
      )}

      {/* Pagination */}
      {productsData.nextCursor && (
        <div className="mt-8 text-center">
          <a
            href={`/catalogo?${category ? `category=${category}&` : ''}cursor=${productsData.nextCursor}`}
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
