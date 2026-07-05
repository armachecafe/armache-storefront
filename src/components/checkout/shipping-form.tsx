'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api, type ShippingQuote, type UserAddress } from '@/lib/api';

const DEPARTAMENTOS_PERU = [
  'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
  'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín',
  'La Libertad', 'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios',
  'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna',
  'Tumbes', 'Ucayali',
];

export interface ShippingData {
  address: {
    recipientName: string;
    street: string;
    district: string;
    city: string;
    department: string;
    province: string;
    postalCode: string;
    phoneNumber: string;
  };
  contact: {
    email: string;
    name: string;
    phoneNumber: string;
  };
  shippingMethod: string;
  shippingCostCents: number;
  consentGiven: boolean;
}

interface ShippingFormProps {
  onComplete: (data: ShippingData) => void;
  isLoading?: boolean;
}

export function ShippingForm({ onComplete, isLoading }: ShippingFormProps) {
  const { isAuthenticated, user } = useAuth();
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | ''>('');
  const [useNewAddress, setUseNewAddress] = useState(!isAuthenticated);

  // Form state
  const [recipientName, setRecipientName] = useState('');
  const [street, setStreet] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [department, setDepartment] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [consent, setConsent] = useState(false);

  // Shipping quotes
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [noCobertura, setNoCobertura] = useState(false);

  // Load saved addresses for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      api.getAddresses().then((addrs) => {
        setSavedAddresses(addrs);
        const defaultAddr = addrs.find((a) => a.isDefault) ?? addrs[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.addressId);
          prefillFromAddress(defaultAddr);
        }
      }).catch(() => {});

      // Prefill contact from auth
      if (user) {
        setEmail(user.email || '');
        setContactName(`${user.givenName ?? ''} ${user.familyName ?? ''}`.trim());
      }
    }
  }, [isAuthenticated, user]);

  function prefillFromAddress(addr: UserAddress) {
    setRecipientName(addr.recipientName);
    setStreet(addr.street);
    setDistrict(addr.district ?? '');
    setCity(addr.city);
    setDepartment(addr.department);
    setProvince(addr.province);
    setPostalCode(addr.postalCode ?? '');
    setPhoneNumber(addr.phoneNumber ?? '');
    setUseNewAddress(false);
  }

  // Fetch shipping quotes when department/province change
  useEffect(() => {
    if (!department || !province) {
      setQuotes([]);
      return;
    }
    setLoadingQuotes(true);
    setNoCobertura(false);
    api.calculateShipping(department, province, district || undefined)
      .then((q) => {
        setQuotes(q);
        setNoCobertura(q.length === 0);
        if (q.length > 0 && !selectedMethod) {
          setSelectedMethod(q[0].method);
        }
      })
      .catch(() => {
        setQuotes([]);
        setNoCobertura(true);
      })
      .finally(() => setLoadingQuotes(false));
  }, [department, province, district]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAddressSelect(addrId: string) {
    setSelectedAddressId(addrId);
    const addr = savedAddresses.find((a) => a.addressId === addrId);
    if (addr) prefillFromAddress(addr);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const selectedQuote = quotes.find((q) => q.method === selectedMethod);

    onComplete({
      address: { recipientName, street, district, city, department, province, postalCode, phoneNumber },
      contact: { email, name: contactName, phoneNumber },
      shippingMethod: selectedMethod,
      shippingCostCents: selectedQuote?.costCents ?? 0,
      consentGiven: consent,
    });
  }

  const isValid = recipientName && street && city && department && province && email && contactName && selectedMethod && (isAuthenticated || consent);

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="shipping-form">
      {/* Contact info for guests */}
      {!isAuthenticated && (
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-gray-900">Datos de contacto</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
              <input id="contact-name" type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary" data-testid="shipping-contact-name" />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input id="contact-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary" data-testid="shipping-contact-email" />
            </div>
          </div>
          <div>
            <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input id="contact-phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary" data-testid="shipping-contact-phone" />
          </div>
        </fieldset>
      )}

      {/* Saved addresses for authenticated users */}
      {isAuthenticated && savedAddresses.length > 0 && (
        <fieldset className="space-y-3">
          <legend className="text-lg font-semibold text-gray-900">Dirección de envío</legend>
          <div className="space-y-2">
            {savedAddresses.map((addr) => (
              <label key={addr.addressId} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer ${selectedAddressId === addr.addressId ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200'}`}>
                <input type="radio" name="savedAddress" value={addr.addressId} checked={selectedAddressId === addr.addressId} onChange={() => handleAddressSelect(addr.addressId)} className="mt-1" data-testid={`shipping-saved-addr-${addr.addressId}`} />
                <div>
                  <p className="font-medium text-sm">{addr.recipientName}</p>
                  <p className="text-xs text-gray-500">{addr.street}, {addr.city}, {addr.department}</p>
                </div>
              </label>
            ))}
            <button type="button" onClick={() => { setUseNewAddress(true); setSelectedAddressId(''); }} className="text-sm text-brand-primary hover:underline" data-testid="shipping-new-address-button">
              + Usar otra dirección
            </button>
          </div>
        </fieldset>
      )}

      {/* Address form (new or guest) */}
      {(useNewAddress || !isAuthenticated || savedAddresses.length === 0) && (
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-gray-900">
            {isAuthenticated ? 'Nueva dirección' : 'Dirección de envío'}
          </legend>
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">Destinatario *</label>
            <input id="recipient" type="text" required value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary" data-testid="shipping-recipient" />
          </div>
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
            <input id="street" type="text" required value={street} onChange={(e) => setStreet(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary" data-testid="shipping-street" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
              <select id="department" required value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary" data-testid="shipping-department">
                <option value="">Seleccionar</option>
                {DEPARTAMENTOS_PERU.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
              <input id="province" type="text" required value={province} onChange={(e) => setProvince(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary" data-testid="shipping-province" />
            </div>
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
              <input id="district" type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary" data-testid="shipping-district" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
              <input id="city" type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary" data-testid="shipping-city" />
            </div>
            <div>
              <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
              <input id="postal-code" type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary" data-testid="shipping-postal-code" />
            </div>
          </div>
        </fieldset>
      )}

      {/* Shipping method selection */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold text-gray-900">Método de envío</legend>
        {loadingQuotes && <p className="text-sm text-gray-500 animate-pulse">Calculando opciones de envío...</p>}
        {noCobertura && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium">Sin cobertura directa en esta zona</p>
            <p className="text-xs text-yellow-700 mt-1">Podemos coordinar tu envío por WhatsApp.</p>
            <a href="https://wa.me/51999999999?text=Hola%2C+quiero+coordinar+envío+a+mi+zona" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-4 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700" data-testid="shipping-whatsapp-button">
              Contactar por WhatsApp
            </a>
          </div>
        )}
        {quotes.map((q) => (
          <label key={q.method} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${selectedMethod === q.method ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200'}`}>
            <input type="radio" name="shippingMethod" value={q.method} checked={selectedMethod === q.method} onChange={() => setSelectedMethod(q.method)} data-testid={`shipping-method-${q.method}`} />
            <div className="flex-1">
              <p className="font-medium text-sm">{q.label}</p>
              {q.estimatedDays && <p className="text-xs text-gray-500">{q.estimatedDays} días hábiles</p>}
              {q.pickupAddress && <p className="text-xs text-gray-500">{q.pickupAddress}</p>}
            </div>
            <span className="font-semibold text-sm">{q.costCents === 0 ? 'Gratis' : `S/ ${(q.costCents / 100).toFixed(2)}`}</span>
          </label>
        ))}
      </fieldset>

      {/* Consent for guests */}
      {!isAuthenticated && (
        <div className="flex items-start gap-2">
          <input id="consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" data-testid="shipping-consent-checkbox" />
          <label htmlFor="consent" className="text-xs text-gray-600">
            Acepto la <a href="/politica-privacidad" target="_blank" className="text-brand-primary underline">Política de Privacidad</a> y el tratamiento de mis datos personales conforme a la Ley 29733. *
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full py-3 px-4 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="shipping-continue-button"
      >
        {isLoading ? 'Procesando...' : 'Continuar al pago'}
      </button>
    </form>
  );
}
