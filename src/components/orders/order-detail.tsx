'use client';

import { Package, Truck, MapPin } from 'lucide-react';
import type { OrderDetail as OrderDetailType, OrderTimeline, OrderItem } from '@/lib/api';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';

interface OrderDetailProps {
  order: OrderDetailType;
}

export function OrderDetail({ order }: OrderDetailProps) {
  const createdDate = new Date(order.createdAt).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6" data-testid="order-detail">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-900">
            Pedido {order.orderCode}
          </h2>
          <p className="text-sm text-gray-500">{createdDate}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Timeline */}
      {order.timeline.length > 0 && (
        <div className="border border-gray-100 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Estado del pedido</h3>
          <ol className="space-y-3">
            {order.timeline.map((event: OrderTimeline, idx: number) => (
              <li key={idx} className="flex items-start gap-3">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${idx === 0 ? 'bg-brand-primary' : 'bg-gray-300'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.status}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleDateString('es-PE', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Tracking */}
      {order.trackingNumber && (
        <div className="border border-gray-100 rounded-lg p-4 flex items-center gap-3">
          <Truck className="w-5 h-5 text-brand-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {order.courierName ?? 'Courier'}: <span className="font-mono">{order.trackingNumber}</span>
            </p>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="border border-gray-100 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" /> Productos
        </h3>
        <div className="space-y-3">
          {order.items.map((item: OrderItem, idx: number) => (
            <div key={idx} className="flex justify-between text-sm">
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">×{item.quantity} · S/ {(item.priceCents / 100).toFixed(2)} c/u</p>
              </div>
              <p className="font-medium text-gray-900">S/ {(item.subtotalCents / 100).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <hr className="my-3 border-gray-100" />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Envío</span>
            <span>{order.shippingCents === 0 ? 'Gratis' : `S/ ${(order.shippingCents / 100).toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span>S/ {(order.totalCents / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      {order.shippingAddress && (
        <div className="border border-gray-100 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Dirección de envío
          </h3>
          <p className="text-sm text-gray-600">
            {order.shippingAddress.recipientName}<br />
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.department}
            {order.shippingAddress.province && `, ${order.shippingAddress.province}`}
          </p>
        </div>
      )}

      {/* Payment method */}
      {order.paymentMethod && (
        <div className="text-sm text-gray-500">
          Pagado con: {order.paymentMethod}
        </div>
      )}
    </div>
  );
}
