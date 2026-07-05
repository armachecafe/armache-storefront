'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { api, type OrderSummary } from '@/lib/api';
import { OrderCard } from '@/components/orders/order-card';

export default function PedidosPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Protect route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/cuenta');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch orders
  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    api.getMyOrders(20)
      .then((result) => {
        setOrders(result.items);
        setNextCursor(result.nextCursor);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  async function loadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const result = await api.getMyOrders(20, nextCursor);
      setOrders((prev) => [...prev, ...result.items]);
      setNextCursor(result.nextCursor);
    } finally {
      setLoadingMore(false);
    }
  }

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-4" data-testid="orders-page">
        <h1 className="text-xl font-display font-bold text-gray-900">Mis Pedidos</h1>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12" data-testid="orders-page">
        <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <h1 className="text-xl font-display font-bold text-gray-900 mb-2">Aún no tienes pedidos</h1>
        <p className="text-gray-500 text-sm">Cuando hagas tu primera compra, aparecerá aquí.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="orders-page">
      <h1 className="text-xl font-display font-bold text-gray-900">Mis Pedidos</h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <OrderCard key={order.orderId} order={order} />
        ))}
      </div>

      {nextCursor && (
        <div className="text-center pt-4">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            data-testid="orders-load-more"
          >
            {loadingMore ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      )}
    </div>
  );
}
