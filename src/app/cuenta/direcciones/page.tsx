'use client';

import { useEffect, useState, useCallback } from 'react';
import { api, type UserAddress } from '@/lib/api';
import { AddressList } from '@/components/account/address-list';

export default function DireccionesPage() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAddresses = useCallback(async () => {
    try {
      const data = await api.getAddresses();
      setAddresses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar direcciones.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse" data-testid="addresses-skeleton">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-4 bg-gray-100 rounded w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="h-32 bg-gray-100 rounded-lg" />
          <div className="h-32 bg-gray-100 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4" data-testid="addresses-load-error">{error}</p>
        <button
          onClick={() => { setLoading(true); loadAddresses(); }}
          className="text-brand-primary hover:underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div data-testid="addresses-page">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Mis Direcciones</h2>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona tus direcciones de envío. Puedes tener hasta 5 direcciones.
        </p>
      </div>

      <AddressList addresses={addresses} onChanged={loadAddresses} />
    </div>
  );
}
