'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LotProfile } from '@/components/traceability/lot-profile';
import type { LotPublicProfile } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.armachecafe.com';

export default function TrazabilidadPageClient() {
  const params = useParams<{ code: string }>();
  const [lot, setLot] = useState<LotPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.code || params.code === '_') return;

    async function fetchLot() {
      try {
        const res = await fetch(`${API_URL}/traceability/lots/${encodeURIComponent(params.code)}`);
        if (res.ok) {
          setLot(await res.json());
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchLot();
  }, [params.code]);

  if (!params.code || params.code === '_') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center" data-testid="traceability-page">
        <p className="text-gray-500 text-sm">Redirigiendo...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center" data-testid="traceability-page">
        <p className="text-gray-500 text-sm">Cargando información del lote...</p>
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center" data-testid="traceability-page">
        <h1 className="text-xl font-display font-bold text-gray-900 mb-2">Lote no encontrado</h1>
        <p className="text-gray-500 text-sm">
          El código de lote no existe o no está disponible públicamente.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8" data-testid="traceability-page">
      <LotProfile lot={lot} />
    </div>
  );
}
