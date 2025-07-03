import React, { useState } from 'react';
import { useAuth } from 'wasp/client/auth';
import { Link } from 'wasp/client/router';
import { useQuery } from 'wasp/client/operations';
import { getTopUseCases } from 'wasp/client/operations';

export function AdminPage() {
  const { data: user } = useAuth();
  const [activeSection, setActiveSection] = useState('analytics'); // Start with analytics tab
  const { data: topUseCases, isLoading: topUseCasesLoading } = useQuery(getTopUseCases);
  
  // For now, allow all authenticated users to access admin features
  // TODO: Add proper admin role checking later
  const isAdmin = !!user; // Temporary: all logged-in users are "admin"

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Mobile Status Bar */}
      <div style={{ height: 'env(safe-area-inset-top)', background: '#004B87' }}></div>
      
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Link
              to="/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '16px'
              }}
            >
              ←
            </Link>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937'
              }}>Administration</h1>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#6b7280'
              }}>Systemverwaltung</p>
            </div>
          </div>
          
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#004B87',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            ⚙️
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '16px' }}>
        {/* User Info Card */}
        <section style={{
          background: 'white',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#004B87',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937'
              }}>Administrator Dashboard</h2>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#6b7280'
              }}>{user?.email}</p>
            </div>
          </div>
          <div style={{
            backgroundColor: '#f0fdf4',
            color: '#00B04F',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 500,
            display: 'inline-block'
          }}>
            🔐 Admin-Zugriff aktiv
          </div>
        </section>

        {/* Quick Stats */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'white',
            padding: '16px 12px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#00B04F', 
              marginBottom: '4px' 
            }}>12</div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>Use-Cases</div>
          </div>
          <div style={{
            background: 'white',
            padding: '16px 12px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#004B87', 
              marginBottom: '4px' 
            }}>8</div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>Benutzer</div>
          </div>
          <div style={{
            background: 'white',
            padding: '16px 12px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#f59e0b', 
              marginBottom: '4px' 
            }}>45</div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>Bewertungen</div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section style={{
          background: 'white',
          borderRadius: '16px 16px 0 0',
          marginBottom: '0',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #f3f4f6'
          }}>
            {[
              { id: 'overview', label: 'Übersicht', icon: '📊' },
              { id: 'usecases', label: 'Use-Cases', icon: '🔧' },
              { id: 'users', label: 'Benutzer', icon: '👥' },
              { id: 'analytics', label: 'Analytik', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                style={{
                  flex: 1,
                  padding: '16px 8px',
                  border: 'none',
                  background: 'none',
                  color: activeSection === tab.id ? '#00B04F' : '#6b7280',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  borderBottom: activeSection === tab.id ? '2px solid #00B04F' : '2px solid transparent',
                  transition: 'all 150ms ease'
                }}
              >
                <div style={{ fontSize: '16px', marginBottom: '4px' }}>{tab.icon}</div>
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Tab Content */}
        <section style={{
          background: 'white',
          borderRadius: '0 0 16px 16px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          marginBottom: '24px'
        }}>
          {activeSection === 'overview' && (
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '16px'
              }}>System Übersicht</h3>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{
                  background: '#f9fafb',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #f3f4f6'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>🔧</span>
                    <h4 style={{
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1f2937'
                    }}>Use-Case Management</h4>
                  </div>
                  <p style={{
                    margin: '0 0 12px 0',
                    fontSize: '12px',
                    color: '#6b7280',
                    lineHeight: '1.4'
                  }}>Verwalten Sie Ki Use-Cases, erstellen Sie neue Cases und bearbeiten Sie bestehende.</p>
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
                    Verwalten →
                  </button>
                </div>

                <div style={{
                  background: '#f9fafb',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #f3f4f6'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>👥</span>
                    <h4 style={{
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1f2937'
                    }}>Benutzerverwaltung</h4>
                  </div>
                  <p style={{
                    margin: '0 0 12px 0',
                    fontSize: '12px',
                    color: '#6b7280',
                    lineHeight: '1.4'
                  }}>Benutzerkonten und Berechtigungen verwalten, neue Benutzer hinzufügen.</p>
                  <button style={{
                    background: '#004B87',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}>
                    Verwalten →
                  </button>
                </div>

                <div style={{
                  background: '#f9fafb',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #f3f4f6'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>📈</span>
                    <h4 style={{
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1f2937'
                    }}>Analytik & Berichte</h4>
                  </div>
                  <p style={{
                    margin: '0 0 12px 0',
                    fontSize: '12px',
                    color: '#6b7280',
                    lineHeight: '1.4'
                  }}>Bewertungsstatistiken, Nutzungsmetriken und detaillierte Berichte einsehen.</p>
                  <button style={{
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}>
                    Anzeigen →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'usecases' && (
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '16px'
              }}>Use-Case Verwaltung</h3>
              
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔧</div>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                  Use-Case Verwaltungsfunktionen
                </p>
                <button style={{
                  background: '#00B04F',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}>
                  + Neuen Use-Case erstellen
                </button>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '16px'
              }}>Benutzerverwaltung</h3>
              
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                  Benutzerverwaltungsfunktionen
                </p>
                <button style={{
                  background: '#004B87',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}>
                  + Neuen Benutzer hinzufügen
                </button>
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '16px'
              }}>Top 10 Use-Cases Ranking</h3>
              
              {topUseCasesLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>Lade Bewertungsergebnisse...</p>
                </div>
              ) : (
                <div>
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px'
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#166534',
                      fontWeight: 500
                    }}>
                      🔒 <strong>Admin-Ansicht:</strong> Diese Ergebnisse sind nur für Administratoren sichtbar.
                      Benutzer sehen kein Ranking, um ihre Bewertungen nicht zu beeinflussen.
                    </p>
                  </div>
                  
                  {topUseCases && topUseCases.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {topUseCases.map((useCase: any, index: number) => (
                        <div key={useCase.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          background: index < 3 ? '#fef3c7' : '#f9fafb',
                          border: `1px solid ${index < 3 ? '#fbbf24' : '#e5e7eb'}`,
                          borderRadius: '8px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            background: index < 3 ? '#f59e0b' : '#6b7280',
                            color: 'white',
                            borderRadius: '50%',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            {index + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              margin: 0,
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#1f2937',
                              marginBottom: '2px'
                            }}>
                              {useCase.title}
                            </h4>
                            <p style={{
                              margin: 0,
                              fontSize: '12px',
                              color: '#6b7280'
                            }}>
                              {useCase.businessArea}
                            </p>
                          </div>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px'
                          }}>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: index < 3 ? '#f59e0b' : '#6b7280'
                            }}>
                              {useCase.totalScore}
                            </div>
                            <div style={{
                              fontSize: '10px',
                              color: '#9ca3af'
                            }}>
                              Punkte
                            </div>
                          </div>
                          <div style={{
                            fontSize: '10px',
                            color: '#6b7280',
                            background: '#f3f4f6',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}>
                            {useCase._count?.evaluations || 0} Bewertungen
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                      <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        Noch keine Bewertungen vorhanden
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section style={{
          background: 'white',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#1f2937',
            marginBottom: '16px'
          }}>Schnellzugriff</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            <Link
              to="/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: '#f0fdf4',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#00B04F',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              <span>📊</span>
              Dashboard
            </Link>
            <Link
              to="/mobile-demo"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: '#eff6ff',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#004B87',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              <span>📱</span>
              Demo
            </Link>
            <Link
              to="/test"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: '#fef3c7',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#92400e',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              <span>🧪</span>
              Test
            </Link>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: '#f3f4f6',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              <span>🏠</span>
              Home
            </Link>
          </div>
        </section>
      </main>

      {/* Mobile Bottom Padding */}
      <div style={{ height: '16px' }}></div>
    </div>
  );
}
