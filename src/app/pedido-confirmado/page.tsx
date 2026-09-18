'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, Mail } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';

function PedidoConfirmadoContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('code') ?? '';
  const orderId = searchParams.get('orderId') ?? '';
  const { isAuthenticated } = useAuth();
  const [showCreateAccount] = useState(!isAuthenticated);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center" data-testid="confirmation-page">
      {/* Success icon */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
        ¡Pedido confirmado!
      </h1>

      {/* Order code */}
      {orderCode && (
        <p className="text-lg text-gray-600 mb-2">
          Código de pedido: <span className="font-mono font-semibold text-brand-primary" data-testid="confirmation-order-code">{orderCode}</span>
        </p>
      )}

      {/* Email notice */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
        <Mail className="w-4 h-4" />
        <span>Recibirás un correo con los detalles de tu pedido</span>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {isAuthenticated && orderId && (
          <Link
            href={`/cuenta/pedidos/detalle/?id=${orderId}`}
            className="block w-full py-3 px-4 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary/90 transition-colors"
            data-testid="confirmation-view-order"
          >
            Ver mi pedido
          </Link>
        )}

        {isAuthenticated && (
          <Link
            href="/cuenta/pedidos"
            className="block w-full py-3 px-4 border border-brand-primary text-brand-primary font-medium rounded-lg hover:bg-brand-primary/5 transition-colors"
            data-testid="confirmation-view-orders"
          >
            Ver mis pedidos
          </Link>
        )}

        <Link
          href="/catalogo"
          className="block w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          data-testid="confirmation-back-to-store"
        >
          Volver a la tienda
        </Link>
      </div>

      {/* Create account for guests (ACCT-04) */}
      {showCreateAccount && (
        <div className="mt-8 p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl">
          <p className="text-sm font-medium text-gray-900 mb-1">¿Quieres guardar tu historial?</p>
          <p className="text-xs text-gray-600 mb-3">Crea una cuenta para ver tus pedidos y hacer checkout más rápido.</p>
          <Link
            href="/cuenta"
            className="inline-block px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-brand-primary/90 transition-colors"
            data-testid="confirmation-create-account"
          >
            Crear cuenta con un click
          </Link>
        </div>
      )}
    </div>
  );
}

export default function PedidoConfirmadoPage() {
  return (
    <Suspense fallback={<div className="max-w-lg mx-auto px-4 py-16 text-center"><p className="text-gray-500">Cargando...</p></div>}>
      <PedidoConfirmadoContent />
    </Suspense>
  );
}
