'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { api, type OrderDetail as OrderDetailType } from '@/lib/api';
import { OrderDetail } from '@/components/orders/order-detail';

export default function OrderDetailPageClient() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  // orderId comes from the query string (?id=...), read at runtime — reliable in static export.
  const orderId = searchParams.get('id') ?? '';
  const [order, setOrder] = useState<OrderDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Protect route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/cuenta');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch order
  useEffect(() => {
    if (!isAuthenticated || !orderId) return;
    setLoading(true);
    api.getOrderById(orderId)
      .then((data) => setOrder(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [isAuthenticated, orderId]);

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="h-40 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-60 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Pedido no encontrado</p>
        <Link href="/cuenta/pedidos" className="text-brand-primary hover:underline text-sm">
          Volver a mis pedidos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/cuenta/pedidos"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        data-testid="order-detail-back"
      >
        <ArrowLeft className="w-4 h-4" />
        Mis Pedidos
      </Link>

      <OrderDetail order={order} />
    </div>
  );
}
