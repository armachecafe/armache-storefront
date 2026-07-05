'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { api, type CheckoutSession } from '@/lib/api';
import { CheckoutSteps } from '@/components/checkout/checkout-steps';
import { ShippingForm, type ShippingData } from '@/components/checkout/shipping-form';
import { PaymentSelector, type PaymentMethod } from '@/components/checkout/payment-selector';
import { CulqiPayment } from '@/components/checkout/culqi-payment';
import { YapePayment } from '@/components/checkout/yape-payment';
import { OrderSummarySidebar } from '@/components/checkout/order-summary-sidebar';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, isLoading: cartLoading, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // NOTE: All hooks (including useCallback) MUST be declared before any early
  // return to satisfy the Rules of Hooks. Placing them after the cartLoading /
  // empty-cart returns causes "Rendered more hooks than during the previous
  // render" when the cart finishes loading, crashing the page.
  const handleShippingComplete = useCallback(
    async (data: ShippingData) => {
      setProcessing(true);
      setError(null);
      try {
        const checkoutSession = await api.prepareCheckout({
          shippingAddress: data.address,
          contact: data.contact,
          shippingMethod: data.shippingMethod,
        });
        setSession(checkoutSession);
        setShippingData(data);
        setStep(2);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al preparar el checkout');
      } finally {
        setProcessing(false);
      }
    },
    [],
  );

  const handlePaymentSuccess = useCallback(
    async (paymentReference: string) => {
      if (!session) return;
      setProcessing(true);
      setError(null);
      try {
        const result = await api.finalizeCheckout(session.sessionId, paymentReference);
        clearCart();
        const params = new URLSearchParams();
        if (result.orderCode) params.set('code', result.orderCode);
        if (result.orderId) params.set('orderId', result.orderId);
        router.push(`/pedido-confirmado?${params}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al procesar el pago');
        setProcessing(false);
      }
    },
    [session, clearCart, router],
  );

  const handleCulqiToken = useCallback(
    (token: string) => {
      handlePaymentSuccess(token);
    },
    [handlePaymentSuccess],
  );

  const handleYapeCode = useCallback(
    (code: string) => {
      handlePaymentSuccess(`yape:${code}`);
    },
    [handlePaymentSuccess],
  );

  // Wait for cart to load before deciding whether to redirect
  if (cartLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 animate-pulse">Cargando checkout...</p>
      </div>
    );
  }

  // Redirect if cart is empty
  if (!cart || cart.items.length === 0) {
    if (typeof window !== 'undefined' && !session) {
      router.replace('/carrito');
    }
    return null;
  }

  const totalCents = session?.totalCents ?? (cart.subtotalCents + (shippingData?.shippingCostCents ?? 0));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" data-testid="checkout-page">
      {/* Steps indicator */}
      <div className="mb-8">
        <CheckoutSteps currentStep={step} />
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <ShippingForm onComplete={handleShippingComplete} isLoading={processing} />
          )}

          {step === 2 && (
            <div className="space-y-6">
              <PaymentSelector selected={paymentMethod} onSelect={setPaymentMethod} />

              {paymentMethod === 'culqi' && (
                <CulqiPayment
                  amountCents={totalCents}
                  description={`Pedido Armache Café (${cart.itemCount} items)`}
                  onTokenReceived={handleCulqiToken}
                  onError={(msg) => setError(msg)}
                  disabled={processing}
                />
              )}

              {paymentMethod === 'yape' && (
                <YapePayment
                  amountCents={totalCents}
                  onCodeSubmitted={handleYapeCode}
                  onError={(msg) => setError(msg)}
                  disabled={processing}
                />
              )}

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
                data-testid="checkout-back-to-shipping"
              >
                ← Volver a envío
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="order-first lg:order-last">
          <div className="sticky top-24">
            <OrderSummarySidebar
              items={cart.items}
              subtotalCents={cart.subtotalCents}
              shippingCents={shippingData?.shippingCostCents}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
