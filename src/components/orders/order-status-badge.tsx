'use client';

import type { OrderStatus } from '@/lib/api';

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  CREATED: { label: 'Creado', className: 'bg-gray-100 text-gray-800' },
  CONFIRMED: { label: 'Confirmado', className: 'bg-blue-100 text-blue-800' },
  PREPARING: { label: 'En preparación', className: 'bg-yellow-100 text-yellow-800' },
  DISPATCHED: { label: 'Despachado', className: 'bg-orange-100 text-orange-800' },
  DELIVERED: { label: 'Entregado', className: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelado', className: 'bg-red-100 text-red-800' },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: 'bg-gray-100 text-gray-800' };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
      data-testid={`order-status-badge-${status}`}
    >
      {config.label}
    </span>
  );
}
