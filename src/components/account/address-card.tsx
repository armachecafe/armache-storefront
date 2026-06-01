'use client';

import { Trash2 } from 'lucide-react';
import type { UserAddress } from '@/lib/api';

interface AddressCardProps {
  address: UserAddress;
  onDelete?: (addressId: string) => void;
}

export function AddressCard({ address, onDelete }: AddressCardProps) {
  return (
    <div
      className="border border-gray-200 rounded-lg p-4 relative hover:border-brand-primary/30 transition-colors"
      data-testid={`address-card-${address.addressId}`}
    >
      {/* Default Badge */}
      {address.isDefault && (
        <span
          className="absolute top-3 right-3 text-xs font-medium bg-brand-light text-brand-primary px-2 py-0.5 rounded-full"
          data-testid={`address-badge-default-${address.addressId}`}
        >
          Predeterminada
        </span>
      )}

      {/* Label */}
      {address.label && (
        <p className="text-sm font-semibold text-gray-900 mb-1">{address.label}</p>
      )}

      {/* Recipient */}
      <p className="text-sm text-gray-700 font-medium">{address.recipientName}</p>

      {/* Address lines */}
      <p className="text-sm text-gray-600 mt-1">
        {address.street}
        {address.district && `, ${address.district}`}
      </p>
      <p className="text-sm text-gray-600">
        {address.city}, {address.province} — {address.department}
      </p>
      {address.postalCode && (
        <p className="text-sm text-gray-500">CP: {address.postalCode}</p>
      )}
      {address.phoneNumber && (
        <p className="text-sm text-gray-500 mt-1">📞 {address.phoneNumber}</p>
      )}

      {/* Actions */}
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => onDelete?.(address.addressId)}
          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
          aria-label={`Eliminar dirección ${address.label || address.recipientName}`}
          data-testid={`address-delete-${address.addressId}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Eliminar
        </button>
      </div>
    </div>
  );
}
