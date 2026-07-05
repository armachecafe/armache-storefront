import TrazabilidadPageClient from './traceability-client';

// Pre-render a placeholder at build time; all other codes resolved client-side via fallback
export function generateStaticParams() {
  return [{ code: '_' }];
}

export const dynamicParams = true;

export default function TrazabilidadPage() {
  return <TrazabilidadPageClient />;
}
