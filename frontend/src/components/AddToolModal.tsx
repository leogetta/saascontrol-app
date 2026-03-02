import { useState } from 'react';
import { toolService } from '../services/toolService';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddToolModal({ isOpen, onClose, onSuccess }: AddToolModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'productivity',
    monthly_cost: '',
    licenses_total: '',
    licenses_used: '',
    renewal_date: '',
    contract_type: 'annual',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await toolService.create({
        ...formData,
        monthly_cost: parseFloat(formData.monthly_cost),
        licenses_total: parseInt(formData.licenses_total),
        licenses_used: parseInt(formData.licenses_used),
        currency: 'EUR',
      } as any);

      onSuccess();
      onClose();
      setFormData({
        name: '',
        category: 'productivity',
        monthly_cost: '',
        licenses_total: '',
        licenses_used: '',
        renewal_date: '',
        contract_type: 'annual',
        status: 'active',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold text-text-primary">Ajouter un outil SaaS</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Nom de l'outil *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Google Workspace"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Catégorie *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
              required
            >
              <option value="productivity">Productivité</option>
              <option value="communication">Communication</option>
              <option value="crm">CRM / Ventes</option>
              <option value="marketing">Marketing</option>
              <option value="design">Design</option>
              <option value="dev">Développement</option>
              <option value="hr">RH</option>
              <option value="finance">Finance</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Coût mensuel (€) *
              </label>
              <input
                type="number"
                name="monthly_cost"
                value={formData.monthly_cost}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="270"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Type de contrat
              </label>
              <select
                name="contract_type"
                value={formData.contract_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="monthly">Mensuel</option>
                <option value="annual">Annuel</option>
                <option value="biennial">Biannuel</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Licences totales *
              </label>
              <input
                type="number"
                name="licenses_total"
                value={formData.licenses_total}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Licences utilisées *
              </label>
              <input
                type="number"
                name="licenses_used"
                value={formData.licenses_used}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="9"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Date de renouvellement *
            </label>
            <input
              type="date"
              name="renewal_date"
              value={formData.renewal_date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium text-text-primary hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-accent text-white rounded-xl font-medium hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Ajout...' : 'Ajouter l\'outil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}