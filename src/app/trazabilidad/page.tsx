import { Suspense } from 'react';
import TrazabilidadPageClient from './traceability-client';

// STATIC route (no dynamic segment). Traceability codes are printed on packaging as QR
// URLs (/trazabilidad/<code>/), so we preserve that path shape via a CloudFront rewrite that
// serves THIS static page for any /trazabilidad/<code>. The client reads the code from the
// query string (?code=...) OR from the pathname — both work at runtime in static export.
export default function TrazabilidadPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-16 text-center"><p className="text-gray-500 text-sm">Cargando...</p></div>}>
      <TrazabilidadPageClient />
    </Suspense>
  );
}
