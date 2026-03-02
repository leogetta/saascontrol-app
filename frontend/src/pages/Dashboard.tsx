import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toolService, Tool } from '../services/toolService';
import AddToolModal from '../components/AddToolModal';

export default function Dashboard() {
  const { user, company, logout } = useAuth();
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');

  const loadTools = async () => {
    try {
      setLoading(true);
      const data = await toolService.getAll();
      setTools(data.tools || []);
      setError('');
    } catch (err: any) {
      setError('Erreur lors du chargement des outils');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer ${name} ?`)) return;

    try {
      await toolService.delete(id);
      await loadTools();
    } catch (err: any) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Calculs automatiques
  const stats = {
    totalCost: tools.reduce((sum, tool) => sum + (Number(tool.monthly_cost) || 0), 0),
    toolsCount: tools.length,
    totalLicenses: tools.reduce((sum, tool) => sum + (Number(tool.licenses_total) || 0), 0),
    usedLicenses: tools.reduce((sum, tool) => sum + (Number(tool.licenses_used) || 0), 0),
    avgUsageRate: tools.length > 0
      ? tools.reduce((sum, tool) => {
          const total = Number(tool.licenses_total) || 1;
          const used = Number(tool.licenses_used) || 0;
          return sum + (used / total) * 100;
        }, 0) / tools.length
      : 0,
  };

  const unusedLicenses = stats.totalLicenses - stats.usedLicenses;
  const potentialSavings = tools
  .filter(t => {
    const total = Number(t.licenses_total) || 1;
    const used = Number(t.licenses_used) || 0;
    return (used / total) < 0.7;
  })
  .reduce((sum, t) => {
    const total = Number(t.licenses_total) || 1;
    const used = Number(t.licenses_used) || 0;
    const cost = Number(t.monthly_cost) || 0;
    const unused = total - used;
    return sum + (unused * cost / total) * 12;
  }, 0);

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-card border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">SaaSControl</h1>
            <p className="text-sm text-text-secondary">{company?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-text-primary">{user?.name}</p>
              <p className="text-xs text-text-tertiary">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-gray-300 rounded-lg hover:bg-secondary transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-text-secondary mb-2">Dépenses mensuelles</p>
            <p className="text-3xl font-bold text-text-primary">{stats.totalCost.toFixed(0)}€</p>
            <p className="text-xs text-text-tertiary mt-2">{(stats.totalCost * 12).toFixed(0)}€/an</p>
          </div>

          <div className="bg-card rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-text-secondary mb-2">Outils actifs</p>
            <p className="text-3xl font-bold text-text-primary">{stats.toolsCount}</p>
            <p className="text-xs text-text-tertiary mt-2">{stats.totalLicenses} licences totales</p>
          </div>

          <div className="bg-card rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-text-secondary mb-2">Économies potentielles</p>
            <p className="text-3xl font-bold text-success">{potentialSavings.toFixed(0)}€</p>
            <p className="text-xs text-text-tertiary mt-2">Par an</p>
          </div>

          <div className="bg-card rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-text-secondary mb-2">Taux d'utilisation</p>
            <p className="text-3xl font-bold text-text-primary">{stats.avgUsageRate.toFixed(0)}%</p>
            <p className="text-xs text-text-tertiary mt-2">{unusedLicenses} licences inutilisées</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        {/* Tools List */}
        <div className="bg-card rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Outils SaaS actifs</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-opacity-90 transition"
            >
              Ajouter un outil
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-text-secondary">Chargement...</div>
          ) : tools.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary mb-4">Aucun outil SaaS enregistré</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition"
              >
                Ajouter votre premier outil
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tools.map((tool) => {
                const usageRate = (tool.licenses_used / tool.licenses_total) * 100;
                return (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-accent transition"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-2xl font-bold text-text-primary">
                        {tool.name[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-text-primary">{tool.name}</h3>
                        <p className="text-sm text-text-secondary">{tool.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold text-text-primary">{tool.monthly_cost}€/mois</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                usageRate > 80 ? 'bg-success' : usageRate > 50 ? 'bg-warning' : 'bg-danger'
                              }`}
                              style={{ width: `${usageRate}%` }}
                            />
                          </div>
                          <span className="text-xs text-text-tertiary">
                            {tool.licenses_used}/{tool.licenses_total}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(tool.id, tool.name)}
                        className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Add Tool Modal */}
      <AddToolModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadTools}
      />
    </div>
  );
}