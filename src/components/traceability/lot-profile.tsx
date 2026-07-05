import { Coffee, MapPin, Mountain, Flame, Calendar, Clock } from 'lucide-react';
import type { LotPublicProfile } from '@/lib/api';

interface LotProfileProps {
  lot: LotPublicProfile;
}

export function LotProfile({ lot }: LotProfileProps) {
  const roastDate = new Date(lot.roastDate).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const expiryDate = new Date(lot.expiryDate).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-md mx-auto" data-testid="lot-profile">
      {/* Header with branding */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-primary/10 flex items-center justify-center">
          <Coffee className="w-8 h-8 text-brand-primary" />
        </div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Armache Café</h1>
        <p className="text-sm text-brand-accent font-medium">Trazabilidad de Lote</p>
      </div>

      {/* Lot code */}
      <div className="text-center mb-6">
        <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary font-mono font-semibold text-sm rounded-full" data-testid="lot-code">
          {lot.lotCode}
        </span>
      </div>

      {/* Product name */}
      {lot.productName && (
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">{lot.productName}</h2>
      )}

      {/* Info cards */}
      <div className="space-y-3">
        {lot.variety && (
          <InfoRow icon={<Coffee className="w-4 h-4" />} label="Variedad" value={lot.variety} />
        )}
        {lot.origin && (
          <InfoRow icon={<MapPin className="w-4 h-4" />} label="Origen" value={lot.origin} />
        )}
        {lot.altitude && (
          <InfoRow icon={<Mountain className="w-4 h-4" />} label="Altitud" value={lot.altitude} />
        )}
        <InfoRow icon={<Flame className="w-4 h-4" />} label="Proceso" value={lot.processType} />
        {lot.roastProfile && (
          <InfoRow icon={<Flame className="w-4 h-4" />} label="Perfil de tueste" value={lot.roastProfile} />
        )}
        <InfoRow icon={<Calendar className="w-4 h-4" />} label="Fecha de tueste" value={roastDate} />
        <InfoRow icon={<Clock className="w-4 h-4" />} label="Mejor antes de" value={expiryDate} />
        {lot.producedBy && (
          <InfoRow icon={<Coffee className="w-4 h-4" />} label="Producido por" value={lot.producedBy} />
        )}
      </div>

      {/* Sensor notes */}
      {lot.sensorNotes && (
        <div className="mt-6 p-4 bg-brand-accent/10 border border-brand-accent/20 rounded-xl">
          <p className="text-xs font-semibold text-brand-accent uppercase tracking-wide mb-1">Notas sensoriales</p>
          <p className="text-sm text-gray-800">{lot.sensorNotes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
          Café de especialidad · San Ignacio, Cajamarca
        </p>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg">
      <div className="text-brand-primary flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
