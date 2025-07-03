// ================================================
// MOBILE LAYOUT TEMPLATES
// Ki Use-Case Explorer - Bechtle Edition
// Praktische Implementierungsbeispiele
// ================================================

import React, { useState, useEffect } from 'react';

// ===========================================
// 1. MOBILE DASHBOARD TEMPLATE
// ===========================================

export const MobileDashboardTemplate = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in production replace with API calls
  const mockUseCases = [
    {
      id: 1,
      title: "Automatisierte Rechnungsverarbeitung mit KI",
      businessArea: "Finanzen",
      description: "Reduzierung der manuellen Rechnungsbearbeitung um 80% durch intelligente Dokumentenerkennung und automatische Freigabeprozesse.",
      roi: "245%",
      effort: "Mittel",
      status: "implementiert",
      isFavorite: true
    },
    {
      id: 2,
      title: "Predictive Maintenance für IT-Infrastruktur",
      businessArea: "IT-Operations",
      description: "Frühzeitige Erkennung von Hardware-Ausfällen durch Machine Learning Algorithmen zur Minimierung von Downtime.",
      roi: "180%",
      effort: "Hoch",
      status: "pilotphase",
      isFavorite: false
    },
    {
      id: 3,
      title: "Chatbot für ersten IT-Support Level",
      businessArea: "Kundenservice",
      description: "24/7 automatisierte Beantwortung von Standard-IT-Anfragen mit 95% Erfolgsquote bei häufigen Problemen.",
      roi: "320%",
      effort: "Niedrig",
      status: "entwicklung",
      isFavorite: true
    }
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setUseCases(mockUseCases);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // In production: trigger API search
  };

  const handleFavorite = (useCaseId, isFavorite) => {
    setUseCases(prev => prev.map(uc => 
      uc.id === useCaseId ? { ...uc, isFavorite } : uc
    ));
  };

  const handleUseCaseDetails = (useCaseId) => {
    // Navigation to detail page
    console.log('Navigate to use case:', useCaseId);
  };

  const quickActions = [
    { 
      icon: "➕", 
      label: "Neuer Use Case", 
      color: "bg-bechtle-primary",
      onClick: () => console.log('New use case') 
    },
    { 
      icon: "🔍", 
      label: "Use Cases finden", 
      color: "bg-bechtle-secondary",
      onClick: () => console.log('Search use cases') 
    },
    { 
      icon: "📊", 
      label: "Analytics", 
      color: "bg-green-500",
      onClick: () => console.log('Analytics') 
    },
    { 
      icon: "👥", 
      label: "Team Dashboard", 
      color: "bg-purple-500",
      onClick: () => console.log('Team dashboard') 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20"> {/* Space for bottom navigation */}
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Ki Use-Cases</h1>
              <p className="text-sm text-gray-600">Bechtle Innovation Hub</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg bg-gray-100">
                <span className="text-lg">🔔</span>
              </button>
              <button className="p-2 rounded-lg bg-gray-100">
                <span className="text-lg">⚙️</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview - Horizontal Scroll */}
      <section className="p-4 bg-white border-b border-gray-100">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <StatCard 
            metric="Aktive Use Cases" 
            value="156" 
            trend="+12%"
            trendUp={true}
            icon="📈"
          />
          <StatCard 
            metric="Implementiert" 
            value="89" 
            trend="+8%"
            trendUp={true}
            icon="✅"
          />
          <StatCard 
            metric="ROI Total" 
            value="€2.4M" 
            trend="+15%"
            trendUp={true}
            icon="💰"
          />
          <StatCard 
            metric="Potenzial" 
            value="€5.8M" 
            trend="+22%"
            trendUp={true}
            icon="🚀"
          />
        </div>
      </section>

      {/* Search Section */}
      <section className="p-4 bg-white border-b border-gray-100">
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
            🔍
          </span>
          <input
            type="text"
            placeholder="Use Cases suchen..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-base focus:border-bechtle-primary focus:ring-1 focus:ring-bechtle-primary"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Schnellzugriff</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`p-4 rounded-lg text-white text-left transition-transform active:scale-95 ${action.color}`}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-sm font-medium">{action.label}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Use Cases */}
      <section className="px-4 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Zuletzt bearbeitet</h2>
          <button className="text-bechtle-primary text-sm font-medium">
            Alle anzeigen
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <UseCaseCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {useCases.map(useCase => (
              <MobileUseCaseCard
                key={useCase.id}
                useCase={useCase}
                onFavorite={handleFavorite}
                onDetails={handleUseCaseDetails}
              />
            ))}
          </div>
        )}
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          {[
            { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
            { id: 'search', icon: '🔍', label: 'Suchen' },
            { id: 'favorites', icon: '❤️', label: 'Favoriten' },
            { id: 'profile', icon: '👤', label: 'Profil' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-2 px-3 min-w-[48px] min-h-[48px] transition-colors ${
                activeTab === item.id 
                  ? 'text-bechtle-primary' 
                  : 'text-gray-500'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

// ===========================================
// 2. USE CASE DETAIL TEMPLATE
// ===========================================

export const MobileUseCaseDetailTemplate = ({ useCaseId }) => {
  const [useCase, setUseCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock use case data
  const mockUseCase = {
    id: 1,
    title: "Automatisierte Rechnungsverarbeitung mit KI",
    businessArea: "Finanzen",
    description: "Reduzierung der manuellen Rechnungsbearbeitung um 80% durch intelligente Dokumentenerkennung und automatische Freigabeprozesse.",
    roi: "245%",
    effort: "Mittel",
    complexity: "Hoch",
    timeSaving: "32h/Woche",
    status: "implementiert",
    isFavorite: true,
    technology: ["TensorFlow", "Python", "Docker", "Azure Cognitive Services"],
    requirements: [
      "Digitale Rechnungen (PDF/Bild)",
      "Bestehende ERP-Integration",
      "Freigabe-Workflow definiert"
    ],
    benefits: [
      "80% weniger manuelle Arbeit",
      "95% Erkennungsgenauigkeit",
      "24/7 automatische Verarbeitung",
      "Reduzierte Fehlerquote"
    ],
    risks: [
      "Einmalige Setup-Komplexität",
      "Training der Mitarbeiter erforderlich",
      "Abhängigkeit von Dokumentenqualität"
    ],
    implementation: {
      duration: "3-4 Monate",
      team: "2 Entwickler, 1 Business Analyst",
      budget: "€75.000 - €90.000",
      phases: [
        "Anforderungsanalyse (2 Wochen)",
        "Prototyp-Entwicklung (4 Wochen)",
        "Integration & Testing (6 Wochen)",
        "Rollout & Training (2 Wochen)"
      ]
    },
    metrics: {
      beforeAfter: [
        { metric: "Bearbeitungszeit pro Rechnung", before: "15 min", after: "2 min" },
        { metric: "Fehlerquote", before: "3%", after: "0.5%" },
        { metric: "Durchlaufzeit", before: "3-5 Tage", after: "4-6 Stunden" }
      ]
    }
  };

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setUseCase(mockUseCase);
      setLoading(false);
    }, 800);
  }, [useCaseId]);

  if (loading) {
    return <UseCaseDetailSkeleton />;
  }

  const tabs = [
    { id: 'overview', label: 'Übersicht', icon: '📋' },
    { id: 'implementation', label: 'Umsetzung', icon: '🔧' },
    { id: 'metrics', label: 'Kennzahlen', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => window.history.back()}
            className="p-2 -ml-2"
          >
            <span className="text-lg">←</span>
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900 flex-1 text-center px-4 truncate">
            {useCase.title}
          </h1>
          
          <div className="flex space-x-2">
            <button className="p-2">
              <span className="text-lg">📤</span>
            </button>
            <button className="p-2">
              <span className={`text-lg ${useCase.isFavorite ? '❤️' : '🤍'}`}>
                {useCase.isFavorite ? '❤️' : '🤍'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-bechtle-secondary/10 text-bechtle-secondary">
            {useCase.businessArea}
          </span>
          <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
            Implementiert
          </span>
        </div>
        
        <h1 className="text-xl font-bold text-gray-900 mb-3">
          {useCase.title}
        </h1>
        
        <p className="text-gray-600 text-base leading-relaxed">
          {useCase.description}
        </p>
      </section>

      {/* Tab Navigation */}
      <section className="border-b border-gray-200 bg-white sticky top-[73px] z-30">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-0 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-bechtle-primary text-bechtle-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tab Content */}
      <div className="p-4 pb-20">
        {activeTab === 'overview' && (
          <OverviewTab useCase={useCase} />
        )}
        {activeTab === 'implementation' && (
          <ImplementationTab useCase={useCase} />
        )}
        {activeTab === 'metrics' && (
          <MetricsTab useCase={useCase} />
        )}
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-3">
          <button className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium">
            Zu Favoriten
          </button>
          <button className="flex-1 py-3 px-4 bg-bechtle-primary text-white rounded-lg font-medium">
            Implementierung starten
          </button>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// 3. HELPER COMPONENTS
// ===========================================

const StatCard = ({ metric, value, trend, trendUp, icon }) => (
  <div className="flex-shrink-0 w-36 p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-2xl">{icon}</span>
      <span className={`text-xs font-medium px-2 py-1 rounded ${
        trendUp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {trend}
      </span>
    </div>
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-xs text-gray-600">{metric}</div>
  </div>
);

const MobileUseCaseCard = ({ useCase, onFavorite, onDetails }) => (
  <div 
    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm active:bg-gray-50 transition-colors"
    onClick={() => onDetails(useCase.id)}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
          {useCase.title}
        </h3>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {useCase.businessArea}
        </span>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onFavorite(useCase.id, !useCase.isFavorite);
        }}
        className="p-2 -mr-2"
      >
        <span className={`text-lg ${useCase.isFavorite ? '❤️' : '🤍'}`}>
          {useCase.isFavorite ? '❤️' : '🤍'}
        </span>
      </button>
    </div>
    
    <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed">
      {useCase.description}
    </p>
    
    <div className="flex justify-between items-center mb-4">
      <div className="flex space-x-3">
        <div className="text-center">
          <div className="text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-800">
            {useCase.roi}
          </div>
          <div className="text-xs text-gray-500 mt-1">ROI</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-medium px-2 py-1 rounded bg-yellow-100 text-yellow-800">
            {useCase.effort}
          </div>
          <div className="text-xs text-gray-500 mt-1">Aufwand</div>
        </div>
      </div>
      <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
        {useCase.status === 'implementiert' ? 'Implementiert' : 'In Entwicklung'}
      </span>
    </div>
    
    <div className="flex space-x-2">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDetails(useCase.id);
        }}
        className="flex-1 bg-bechtle-primary text-white py-2.5 px-4 rounded-md text-sm font-medium"
      >
        Details ansehen
      </button>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          console.log('Share use case');
        }}
        className="p-2.5 border border-gray-300 rounded-md"
      >
        <span className="text-sm">📤</span>
      </button>
    </div>
  </div>
);

const UseCaseCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm animate-pulse">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded mb-2 w-4/5"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div className="flex justify-between items-center mb-4">
      <div className="flex space-x-3">
        <div className="h-6 w-12 bg-gray-200 rounded"></div>
        <div className="h-6 w-12 bg-gray-200 rounded"></div>
      </div>
      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
    </div>
    <div className="flex space-x-2">
      <div className="flex-1 h-10 bg-gray-200 rounded"></div>
      <div className="w-10 h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const UseCaseDetailSkeleton = () => (
  <div className="min-h-screen bg-white animate-pulse">
    <div className="p-4 border-b border-gray-200">
      <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>
    </div>
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-20 bg-gray-200 rounded"></div>
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

// Tab Content Components
const OverviewTab = ({ useCase }) => (
  <div className="space-y-6">
    {/* Key Metrics */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Kennzahlen</h3>
      <div className="grid grid-cols-2 gap-4">
        <MetricCard label="ROI" value={useCase.roi} />
        <MetricCard label="Aufwand" value={useCase.effort} />
        <MetricCard label="Zeitersparnis" value={useCase.timeSaving} />
        <MetricCard label="Komplexität" value={useCase.complexity} />
      </div>
    </div>

    {/* Benefits */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Vorteile</h3>
      <div className="space-y-2">
        {useCase.benefits.map((benefit, index) => (
          <div key={index} className="flex items-start">
            <span className="text-green-500 mr-2 mt-0.5">✓</span>
            <span className="text-gray-700">{benefit}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Technology Stack */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Technologie-Stack</h3>
      <div className="flex flex-wrap gap-2">
        {useCase.technology.map((tech, index) => (
          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {tech}
          </span>
        ))}
      </div>
    </div>

    {/* Requirements */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Voraussetzungen</h3>
      <div className="space-y-2">
        {useCase.requirements.map((req, index) => (
          <div key={index} className="flex items-start">
            <span className="text-blue-500 mr-2 mt-0.5">•</span>
            <span className="text-gray-700">{req}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Risks */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Risiken & Herausforderungen</h3>
      <div className="space-y-2">
        {useCase.risks.map((risk, index) => (
          <div key={index} className="flex items-start">
            <span className="text-yellow-500 mr-2 mt-0.5">⚠</span>
            <span className="text-gray-700">{risk}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ImplementationTab = ({ useCase }) => (
  <div className="space-y-6">
    {/* Implementation Overview */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Projekt-Übersicht</h3>
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Dauer:</span>
          <span className="font-medium">{useCase.implementation.duration}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Team:</span>
          <span className="font-medium">{useCase.implementation.team}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Budget:</span>
          <span className="font-medium">{useCase.implementation.budget}</span>
        </div>
      </div>
    </div>

    {/* Implementation Phases */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Implementierungsphasen</h3>
      <div className="space-y-3">
        {useCase.implementation.phases.map((phase, index) => (
          <div key={index} className="flex items-center">
            <div className="w-8 h-8 bg-bechtle-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              {index + 1}
            </div>
            <span className="text-gray-700">{phase}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Next Steps */}
    <div className="bg-bechtle-primary/5 rounded-lg p-4">
      <h4 className="font-semibold text-bechtle-primary mb-2">Nächste Schritte</h4>
      <p className="text-gray-700 text-sm">
        Für die Implementierung dieses Use Cases wenden Sie sich an das Innovation Team 
        oder starten Sie direkt mit einer Machbarkeitsstudie.
      </p>
    </div>
  </div>
);

const MetricsTab = ({ useCase }) => (
  <div className="space-y-6">
    {/* Before/After Comparison */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Vorher/Nachher Vergleich</h3>
      <div className="space-y-4">
        {useCase.metrics.beforeAfter.map((metric, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-900 mb-3">
              {metric.metric}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{metric.before}</div>
                <div className="text-xs text-gray-500">Vorher</div>
              </div>
              <div className="text-2xl">→</div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{metric.after}</div>
                <div className="text-xs text-gray-500">Nachher</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* ROI Calculation */}
    <div className="bg-green-50 rounded-lg p-4">
      <h4 className="font-semibold text-green-800 mb-2">ROI-Berechnung</h4>
      <div className="text-2xl font-bold text-green-800 mb-1">{useCase.roi}</div>
      <p className="text-sm text-green-700">
        Return on Investment basierend auf Zeitersparnis und Qualitätsverbesserung
      </p>
    </div>
  </div>
);

const MetricCard = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-4 text-center">
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

export default {
  MobileDashboardTemplate,
  MobileUseCaseDetailTemplate
};
