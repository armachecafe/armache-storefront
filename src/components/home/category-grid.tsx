import Link from 'next/link';
import type { Category } from '@/lib/api';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.categoryId}
          href={`/catalogo?category=${cat.categoryId}`}
          className="group block bg-white rounded-xl p-6 text-center border border-gray-100 hover:border-brand-primary hover:shadow-md transition-all"
          data-testid={`category-card-${cat.slug}`}
        >
          <div className="text-3xl mb-3">
            {getCategoryEmoji(cat.categoryId)}
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-brand-primary">
            {cat.name}
          </h3>
        </Link>
      ))}
    </div>
  );
}

function getCategoryEmoji(categoryId: string): string {
  const map: Record<string, string> = {
    'nuestro-cafe': '☕',
    'derivados': '🍫',
    'otros-productos': '🫖',
    'empresas': '🏢',
  };
  return map[categoryId] ?? '📦';
}
