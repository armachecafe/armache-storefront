'use client';

import { useState } from 'react';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';

export default function DatosPersonalesPage() {
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleExport() {
    setExporting(true);
    setError('');
    setMessage('');
    try {
      const data = await api.exportMyData();
      // Download as JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mis-datos-armache-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('Datos descargados exitosamente.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al exportar datos');
    } finally {
      setExporting(false);
    }
  }

  async function handleDeleteRequest() {
    setDeleting(true);
    setError('');
    setMessage('');
    try {
      await api.requestAccountDeletion();
      setMessage('Solicitud de eliminación recibida. Nuestro equipo de soporte la revisará en un plazo de 72 horas. Recibirás un correo con la confirmación.');
      setShowDeleteConfirm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al solicitar eliminación');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6" data-testid="datos-personales-page">
      <h1 className="text-xl font-display font-bold text-gray-900">Mis Datos Personales</h1>
      <p className="text-sm text-gray-500">
        Conforme a la Ley 29733 de Protección de Datos Personales, puedes ejercer tus derechos de acceso, rectificación y eliminación.
      </p>

      {message && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700" data-testid="datos-message">{message}</div>}
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      {/* Export data */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Download className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">Descargar mis datos</h2>
            <p className="text-sm text-gray-500 mt-1">
              Descarga una copia de tu información personal: perfil, direcciones y historial de pedidos en formato JSON.
            </p>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
              data-testid="datos-export-button"
            >
              {exporting ? 'Preparando...' : 'Descargar mis datos'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete account */}
      <div className="bg-white border border-red-200 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">Eliminar mi cuenta</h2>
            <p className="text-sm text-gray-500 mt-1">
              Tu información personal será anonimizada. Los pedidos anteriores se conservan para fines contables sin datos de identidad.
              Esta acción es irreversible.
            </p>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="mt-3 px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50"
                data-testid="datos-delete-button"
              >
                Solicitar eliminación
              </button>
            ) : (
              <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800">
                    ¿Estás seguro? Se anonimizarán todos tus datos personales y no podrás acceder a tu cuenta.
                    Si tienes pedidos abiertos, el equipo de soporte te contactará antes de proceder.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteRequest}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
                    data-testid="datos-delete-confirm"
                  >
                    {deleting ? 'Procesando...' : 'Confirmar eliminación'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
                    data-testid="datos-delete-cancel"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
