'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { OrderSummary } from '@/lib/api';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';

interface OrderCardProps {
  order: OrderSummary;
}

export function OrderCard({ order }: OrderCardProps) {
  const date = new Date(order.createdAt).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link
      href={`/cuenta/pedidos/detalle/?id=${order.orderId}`}
      className="block border border-gray-200 rounded-lg p-4 hover:border-brand-primary/40 hover:shadow-sm transition-all"
      data-testid={`order-card-${order.orderId}`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-gray-900">{order.orderCode}</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-gray-500">{date} · {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">
            S/ {(order.totalCents / 100).toFixed(2)}
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </Link>
  );
}
