'use client';

import { useState } from 'react';
import type { CreateAddressInput } from '@/lib/api';

/** 25 departamentos del Perú */
const DEPARTAMENTOS_PERU = [
  'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho',
  'Cajamarca', 'Callao', 'Cusco', 'Huancavelica', 'Huánuco',
  'Ica', 'Junín', 'La Libertad', 'Lambayeque', 'Lima',
  'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura',
  'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali',
] as const;

interface AddressFormProps {
  onSubmit: (data: CreateAddressInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function AddressForm({ onSubmit, onCancel, loading = false }: AddressFormProps) {
  const [formData, setFormData] = useState<CreateAddressInput>({
    label: '',
    recipientName: '',
    street: '',
    district: '',
    city: '',
    department: '',
    province: '',
    postalCode: '',
    phoneNumber: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function updateField(field: keyof CreateAddressInput, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!formData.recipientName.trim()) newErrors.recipientName = 'Nombre del destinatario es obligatorio';
    if (!formData.street.trim()) newErrors.street = 'Dirección es obligatoria';
    if (!formData.city.trim()) newErrors.city = 'Ciudad es obligatoria';
    if (!formData.department) newErrors.department = 'Departamento es obligatorio';
    if (!formData.province.trim()) newErrors.province = 'Provincia es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // Clean empty optional fields
    const cleaned: CreateAddressInput = {
      recipientName: formData.recipientName.trim(),
      street: formData.street.trim(),
      city: formData.city.trim(),
      department: formData.department,
      province: formData.province.trim(),
      isDefault: formData.isDefault,
    };
    if (formData.label?.trim()) cleaned.label = formData.label.trim();
    if (formData.district?.trim()) cleaned.district = formData.district.trim();
    if (formData.postalCode?.trim()) cleaned.postalCode = formData.postalCode.trim();
    if (formData.phoneNumber?.trim()) cleaned.phoneNumber = formData.phoneNumber.trim();

    await onSubmit(cleaned);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="address-form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="address-label" className="block text-sm font-medium text-gray-700 mb-1">
            Etiqueta <span className="text-gray-400">(ej. Casa, Oficina)</span>
          </label>
          <input
            id="address-label"
            type="text"
            value={formData.label ?? ''}
            onChange={(e) => updateField('label', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
            data-testid="address-label-input"
          />
        </div>

        <div>
          <label htmlFor="address-recipient" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del destinatario *
          </label>
          <input
            id="address-recipient"
            type="text"
            value={formData.recipientName}
            onChange={(e) => updateField('recipientName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
            required
            data-testid="address-recipient-input"
          />
          {errors.recipientName && <p className="text-xs text-red-600 mt-1">{errors.recipientName}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="address-street" className="block text-sm font-medium text-gray-700 mb-1">
          Dirección (calle, número, referencia) *
        </label>
        <input
          id="address-street"
          type="text"
          value={formData.street}
          onChange={(e) => updateField('street', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
          placeholder="Av. Principal 123, Dpto 4B"
          required
          data-testid="address-street-input"
        />
        {errors.street && <p className="text-xs text-red-600 mt-1">{errors.street}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="address-district" className="block text-sm font-medium text-gray-700 mb-1">
            Distrito
          </label>
          <input
            id="address-district"
            type="text"
            value={formData.district ?? ''}
            onChange={(e) => updateField('district', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
            data-testid="address-district-input"
          />
        </div>

        <div>
          <label htmlFor="address-city" className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad *
          </label>
          <input
            id="address-city"
            type="text"
            value={formData.city}
            onChange={(e) => updateField('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
            required
            data-testid="address-city-input"
          />
          {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="address-department" className="block text-sm font-medium text-gray-700 mb-1">
            Departamento *
          </label>
          <select
            id="address-department"
            value={formData.department}
            onChange={(e) => updateField('department', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary bg-white"
            required
            data-testid="address-department-select"
          >
            <option value="">Seleccionar...</option>
            {DEPARTAMENTOS_PERU.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
          {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
        </div>

        <div>
          <label htmlFor="address-province" className="block text-sm font-medium text-gray-700 mb-1">
            Provincia *
          </label>
          <input
            id="address-province"
            type="text"
            value={formData.province}
            onChange={(e) => updateField('province', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
            required
            data-testid="address-province-input"
          />
          {errors.province && <p className="text-xs text-red-600 mt-1">{errors.province}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="address-postal-code" className="block text-sm font-medium text-gray-700 mb-1">
            Código Postal
          </label>
          <input
            id="address-postal-code"
            type="text"
            value={formData.postalCode ?? ''}
            onChange={(e) => updateField('postalCode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
            data-testid="address-postal-code-input"
          />
        </div>

        <div>
          <label htmlFor="address-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono de contacto
          </label>
          <input
            id="address-phone"
            type="tel"
            value={formData.phoneNumber ?? ''}
            onChange={(e) => updateField('phoneNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
            placeholder="+51 999 999 999"
            data-testid="address-phone-input"
          />
        </div>
      </div>

      {/* Default checkbox */}
      <div className="flex items-center gap-2">
        <input
          id="address-default"
          type="checkbox"
          checked={formData.isDefault ?? false}
          onChange={(e) => updateField('isDefault', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
          data-testid="address-default-checkbox"
        />
        <label htmlFor="address-default" className="text-sm text-gray-700">
          Usar como dirección predeterminada
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="address-form-submit"
        >
          {loading ? 'Guardando...' : 'Guardar Dirección'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          data-testid="address-form-cancel"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
