'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { LotProfile } from '@/components/traceability/lot-profile';
import type { LotPublicProfile } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.armachecafe.com';

/**
 * Resolve the lot code from either the ?code= query param (new in-app links) or the
 * pathname (/trazabilidad/<code>/ — QR-printed URLs, served here via CloudFront rewrite).
 */
function resolveCode(searchParamCode: string | null): string {
  if (searchParamCode) return searchParamCode;
  if (typeof window === 'undefined') return '';
  const segments = window.location.pathname.split('/').filter(Boolean); // ['trazabilidad', '<code>']
  if (segments.length >= 2 && segments[0] === 'trazabilidad') {
    return decodeURIComponent(segments[1]);
  }
  return '';
}

export default function TrazabilidadPageClient() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [lot, setLot] = useState<LotPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolved = resolveCode(searchParams.get('code'));
    setCode(resolved);
    if (!resolved) {
      setLoading(false);
      return;
    }

    async function fetchLot(lotCode: string) {
      try {
        const res = await fetch(`${API_URL}/traceability/lots/${encodeURIComponent(lotCode)}`);
        if (res.ok) {
          setLot(await res.json());
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchLot(resolved);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center" data-testid="traceability-page">
        <p className="text-gray-500 text-sm">Cargando información del lote...</p>
      </div>
    );
  }

  if (!code || !lot) {
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
