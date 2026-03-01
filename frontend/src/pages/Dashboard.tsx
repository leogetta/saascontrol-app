import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, company, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = {
    totalCost: 3245,
    toolsCount: 10,
    savings: 8940,
    costPerEmployee: 130,
  };

  const tools = [
    { name: 'Google Workspace', category: 'Productivité', cost: 270, usage: 96, status: 'active' },
    { name: 'Slack Pro', category: 'Communication', cost: 165, usage: 88, status: 'active' },
    { name: 'HubSpot CRM', category: 'CRM / Ventes', cost: 450, usage: 82, status: 'warning' },
    { name: 'Notion Plus', category: 'Productivité', cost: 200, usage: 65, status: 'active' },
    { name: 'Zoom Pro', category: 'Communication', cost: 140, usage: 45, status: 'danger' },
  ];

  const alerts = [
    { title: 'Licences inutilisées', tool: 'Zoom Pro', savings: 672, severity: 'warning' },
    { title: 'Renouvellement proche', tool: 'HubSpot', savings: 540, severity: 'info' },
  ];

  return (
    <div className="min-h-screen bg-primary">
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-text-secondary mb-2">Dépenses mensuelles</p>
            <p className="text-3xl font-bold text-text-primary">{stats.totalCost}€</p>
            <p className="text-xs text-success mt-2">-12% vs mois dernier</p>
          </div>

          <div className="bg-card rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-text-secondary mb-2">Outils actifs</p>
            <p className="text-3xl font-bold text-text-primary">{stats.toolsCount}</p>
            <p className="text-xs text-text-tertiary mt-2">Sur 12 licenciés</p>
          </div>

          <div className="bg-card rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-text-secondary mb-2">Économies annuelles</p>
            <p className="text-3xl font-bold text-success">{stats.savings}€</p>
            <p className="text-xs text-text-tertiary mt-2">Optimisations réalisées</p>
          </div>

          <div className="bg-card rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-text-secondary mb-2">Coût / employé</p>
            <p className="text-3xl font-bold text-text-primary">{stats.costPerEmployee}€</p>
            <p className="text-xs text-text-tertiary mt-2">vs 165€ benchmark</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Outils SaaS actifs</h2>
                <button className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-opacity-90 transition">
                  Ajouter un outil
                </button>
              </div>

              <div className="space-y-4">
                {tools.map((tool, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-accent transition cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-2xl">
                        {tool.name[0]}
                      </div>
                      <div>
                        <h3 className="font-medium text-text-primary">{tool.name}</h3>
                        <p className="text-sm text-text-secondary">{tool.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold text-text-primary">{tool.cost}€/mois</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                tool.usage > 80 ? 'bg-success' : tool.usage > 50 ? 'bg-warning' : 'bg-danger'
                              }`}
                              style={{ width: `${tool.usage}%` }}
                            />
                          </div>
                          <span className="text-xs text-text-tertiary">{tool.usage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">Alertes</h2>

              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border bg-orange-50 border-orange-200 cursor-pointer hover:shadow-sm transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-text-primary text-sm">{alert.title}</h3>
                      <span className="text-xs px-2 py-1 bg-white rounded-full text-text-secondary">
                        {alert.tool}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mb-3">
                      Économie : <span className="font-semibold text-success">{alert.savings}€/an</span>
                    </p>
                    <button className="text-xs font-medium text-accent hover:underline">
                      Voir détails
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}