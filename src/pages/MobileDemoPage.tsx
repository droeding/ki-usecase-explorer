import React, { useState } from 'react';
import { Link } from 'wasp/client/router';

const MobileDemoPage = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const demoUseCases = [
    {
      id: 1,
      title: "Chatbot für Kundenservice",
      category: "Kundenservice",
      complexity: "Einfach",
      impact: "Hoch",
      description: "Automatisierte Antworten auf häufige Kundenanfragen",
      tags: ["NLP", "Automatisierung", "24/7 Service"]
    },
    {
      id: 2,
      title: "Predictive Maintenance",
      category: "Wartung",
      complexity: "Komplex",
      impact: "Sehr Hoch", 
      description: "Vorhersage von Wartungsbedarfen durch IoT-Sensoren",
      tags: ["IoT", "Machine Learning", "Kosteneinsparung"]
    },
    {
      id: 3,
      title: "Dokumentenklassifizierung",
      category: "Verwaltung",
      complexity: "Mittel",
      impact: "Mittel",
      description: "Automatische Kategorisierung eingehender Dokumente",
      tags: ["Computer Vision", "OCR", "Workflow"]
    }
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'explore', label: 'Entdecken', icon: '🔍' },
    { id: 'favorites', label: 'Favoriten', icon: '❤️' },
    { id: 'profile', label: 'Profil', icon: '👤' },
    { id: 'settings', label: 'Einstellungen', icon: '⚙️' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      paddingBottom: '80px',
      background: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Mobile Status Bar */}
      <div style={{ height: 'env(safe-area-inset-top)', background: '#00B04F' }}></div>
      
      {/* Mobile Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: 'env(safe-area-inset-top) 16px 0 16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '56px'
        }}>
          <Link to="/" style={{
            padding: '8px',
            border: 'none',
            background: 'none',
            color: '#00B04F',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 500
          }}>
            ← Zurück
          </Link>
          <h1 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#1f2937',
            margin: 0
          }}>Mobile Demo</h1>
          <button 
            style={{
              padding: '8px',
              border: 'none',
              background: 'none',
              color: '#6b7280',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
            onClick={() => setIsSheetOpen(true)}
          >
            ⋯
          </button>
        </div>
      </header>

      {/* Mobile Search */}
      <div style={{ position: 'relative', margin: '16px' }}>
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '20px',
          color: '#9ca3af'
        }}>🔍</div>
        <input 
          type="search" 
          placeholder="Use Cases durchsuchen..."
          style={{
            width: '100%',
            padding: '12px 16px 12px 44px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            background: '#f9fafb',
            fontSize: 'max(16px, 1rem)',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Mobile Content */}
      <main style={{ padding: '16px', maxWidth: '100%' }}>
        {/* Quick Stats */}
        <section style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '8px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'white',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00B04F' }}>47</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Use Cases</div>
          </div>
          <div style={{
            background: 'white',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#004B87' }}>12</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Kategorien</div>
          </div>
          <div style={{
            background: 'white',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>89%</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Erfolgsrate</div>
          </div>
        </section>

        {/* Use Cases Grid */}
        <section>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1f2937' }}>
            Empfohlene Use Cases
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {demoUseCases.map((useCase) => (
              <div key={useCase.id} style={{
                background: 'white',
                padding: '20px',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                border: '1px solid #f3f4f6',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    background: '#dbeafe',
                    color: '#1e40af',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 500
                  }}>
                    {useCase.category}
                  </span>
                  <span style={{
                    background: useCase.impact === 'Sehr Hoch' ? '#dcfce7' : useCase.impact === 'Hoch' ? '#fef3c7' : '#f3f4f6',
                    color: useCase.impact === 'Sehr Hoch' ? '#166534' : useCase.impact === 'Hoch' ? '#92400e' : '#1f2937',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 500
                  }}>
                    {useCase.impact} Impact
                  </span>
                </div>
                
                <h3 style={{ 
                  fontWeight: 600, 
                  color: '#1f2937', 
                  marginBottom: '8px',
                  fontSize: '16px'
                }}>{useCase.title}</h3>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '14px', 
                  marginBottom: '12px',
                  lineHeight: '1.4'
                }}>{useCase.description}</p>
                
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '6px', 
                  marginBottom: '12px' 
                }}>
                  {useCase.tags.map((tag, index) => (
                    <span key={index} style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 500
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>
                    Komplexität: {useCase.complexity}
                  </span>
                  <button style={{
                    background: '#00B04F',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}>
                    Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mobile Action Cards */}
        <section style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1f2937' }}>
            Schnellaktionen
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '12px' 
          }}>
            <button style={{
              background: 'white',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #f3f4f6',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💡</div>
              <div style={{ fontWeight: 500, color: '#1f2937', marginBottom: '4px' }}>Neuer Use Case</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Idee einreichen</div>
            </button>
            <button style={{
              background: 'white',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #f3f4f6',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
              <div style={{ fontWeight: 500, color: '#1f2937', marginBottom: '4px' }}>Analytics</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Erfolg messen</div>
            </button>
            <button style={{
              background: 'white',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #f3f4f6',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
              <div style={{ fontWeight: 500, color: '#1f2937', marginBottom: '4px' }}>ROI Rechner</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Nutzen berechnen</div>
            </button>
            <button style={{
              background: 'white',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #f3f4f6',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📚</div>
              <div style={{ fontWeight: 500, color: '#1f2937', marginBottom: '4px' }}>Ressourcen</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Mehr erfahren</div>
            </button>
          </div>
        </section>
      </main>

      {/* Mobile FAB */}
      <button style={{
        position: 'fixed',
        bottom: '96px',
        right: '16px',
        zIndex: 40,
        width: '56px',
        height: '56px',
        borderRadius: '28px',
        background: '#00B04F',
        border: 'none',
        color: 'white',
        boxShadow: '0 8px 25px rgba(0, 176, 79, 0.4)',
        cursor: 'pointer',
        fontSize: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 176, 79, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 176, 79, 0.4)';
      }}>
        <span>+</span>
      </button>

      {/* Mobile Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'white',
        borderTop: '1px solid #e5e7eb',
        padding: 'env(safe-area-inset-bottom) 0 0 0'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 0
        }}>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 4px',
                textDecoration: 'none',
                color: activeTab === item.id ? '#00B04F' : '#6b7280',
                transition: 'color 150ms ease',
                minHeight: '60px',
                border: 'none',
                background: 'none',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab(item.id)}
            >
              <div style={{
                fontSize: '20px',
                marginBottom: '4px'
              }}>{item.icon}</div>
              <div style={{
                fontSize: '10px',
                fontWeight: 500,
                lineHeight: 1.2,
                textAlign: 'center'
              }}>{item.label}</div>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Action Sheet */}
      {isSheetOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
          onClick={() => setIsSheetOpen(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '20px 20px 0 0',
              width: '100%',
              maxHeight: '90vh',
              padding: '24px 16px calc(24px + env(safe-area-inset-bottom)) 16px',
              transform: isSheetOpen ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 300ms ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: '40px',
              height: '4px',
              background: '#d1d5db',
              borderRadius: '2px',
              margin: '0 auto 20px'
            }}></div>
            <h3 style={{ fontWeight: 600, fontSize: '18px', marginBottom: '16px' }}>Aktionen</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button style={{
                width: '100%',
                textAlign: 'left',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                📤 Use Case teilen
              </button>
              <button style={{
                width: '100%',
                textAlign: 'left',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                📋 In Zwischenablage kopieren
              </button>
              <button style={{
                width: '100%',
                textAlign: 'left',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                ⭐ Zu Favoriten hinzufügen
              </button>
              <button style={{
                width: '100%',
                textAlign: 'left',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                📊 Fortschritt verfolgen
              </button>
              <button 
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: '#dc2626',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => setIsSheetOpen(false)}
              >
                ✕ Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileDemoPage;
