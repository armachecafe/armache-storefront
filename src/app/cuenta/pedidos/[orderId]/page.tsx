import OrderDetailPageClient from './order-detail-client';

export function generateStaticParams() {
  return [{ orderId: '_' }];
}

export const dynamicParams = true;

export default function OrderDetailPage() {
  return <OrderDetailPageClient />;
}
