'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { api, type UserAddress, type CreateAddressInput } from '@/lib/api';
import { AddressCard } from './address-card';
import { AddressForm } from './address-form';

const MAX_ADDRESSES = 5;

interface AddressListProps {
  addresses: UserAddress[];
  onChanged: () => void;
}

export function AddressList({ addresses, onChanged }: AddressListProps) {
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const canAdd = addresses.length < MAX_ADDRESSES;

  async function handleCreate(data: CreateAddressInput) {
    setFormLoading(true);
    setError(null);
    try {
      await api.createAddress(data);
      setShowForm(false);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear dirección.');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(addressId: string) {
    if (deleteConfirm !== addressId) {
      setDeleteConfirm(addressId);
      return;
    }

    setError(null);
    try {
      await api.deleteAddress(addressId);
      setDeleteConfirm(null);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar dirección.');
    }
  }

  return (
    <div className="space-y-4" data-testid="address-list">
      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg" role="alert" data-testid="address-list-error">
          {error}
        </div>
      )}

      {/* Address Cards */}
      {addresses.length === 0 && !showForm && (
        <div className="text-center py-8 text-gray-500" data-testid="address-list-empty">
          <p>No tienes direcciones guardadas.</p>
          <p className="text-sm mt-1">Agrega una dirección para agilizar tus compras.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.addressId} className="relative">
            <AddressCard address={address} onDelete={handleDelete} />
            {deleteConfirm === address.addressId && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center" data-testid={`address-confirm-delete-${address.addressId}`}>
                <div className="text-center p-4">
                  <p className="text-sm text-gray-700 mb-3">¿Eliminar esta dirección?</p>
                  <div className="flex items-center gap-2 justify-center">
                    <button
                      onClick={() => handleDelete(address.addressId)}
                      className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700"
                      data-testid={`address-confirm-yes-${address.addressId}`}
                    >
                      Sí, eliminar
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50"
                      data-testid={`address-confirm-no-${address.addressId}`}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Button or Form */}
      {showForm ? (
        <div className="border border-brand-primary/20 rounded-xl p-5 bg-brand-light/30">
          <h3 className="font-medium text-gray-900 mb-4">Nueva Dirección</h3>
          <AddressForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            loading={formLoading}
          />
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          disabled={!canAdd}
          className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-brand-primary hover:text-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
          data-testid="address-add-button"
        >
          <Plus className="w-4 h-4" />
          {canAdd
            ? `Agregar dirección (${addresses.length}/${MAX_ADDRESSES})`
            : `Máximo ${MAX_ADDRESSES} direcciones alcanzado`}
        </button>
      )}
    </div>
  );
}
