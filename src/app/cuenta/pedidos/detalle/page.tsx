import { Suspense } from 'react';
import OrderDetailPageClient from './order-detail-client';

// STATIC route (no dynamic segment). The orderId travels as a query param (?id=...),
// read client-side via useSearchParams. Avoids the static-export limitation where a
// dynamic [orderId] route can't be reconciled and the router falls back to '/'.
export default function OrderDetailPage() {
  return (
    <Suspense fallback={null}>
      <OrderDetailPageClient />
    </Suspense>
  );
}
