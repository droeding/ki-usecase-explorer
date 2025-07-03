import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from 'wasp/client/auth';
import { logout } from 'wasp/client/auth';
import { getUseCases, getUserEvaluations } from 'wasp/client/operations';
import { useQuery } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { routes } from 'wasp/client/router';

// Custom Hook für Mobile Detection
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// Custom Hook für Viewport Height
const useViewportHeight = () => {
  const [vh, setVh] = useState(0);
  
  useEffect(() => {
    const updateVh = () => {
      const newVh = window.innerHeight * 0.01;
      setVh(newVh);
      document.documentElement.style.setProperty('--vh', `${newVh}px`);
    };
    
    updateVh();
    
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateVh, 100);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', updateVh);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', updateVh);
    };
  }, []);
  
  return vh;
};

export default function DashboardPage() {
  const { data: user } = useAuth();
  const { data: useCases, isLoading: isLoadingUseCases } = useQuery(getUseCases);
  const { data: userEvaluations, isLoading: isLoadingEvaluations } = useQuery(getUserEvaluations, undefined, { enabled: !!user });

  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyUnevaluated, setShowOnlyUnevaluated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const isMobile = useMobileDetection();
  const vh = useViewportHeight();

  const evaluatedUseCaseIds = useMemo(() => {
    if (!userEvaluations) return new Set();
    return new Set(userEvaluations.map((e: any) => e.useCaseId));
  }, [userEvaluations]);

  // Filter use cases based on search
  const filteredUseCases = useCases
    ?.filter((useCase: any) => {
      const searchTermMatch =
        useCase.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        useCase.description?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!searchTermMatch) return false;

      if (showOnlyUnevaluated) {
        return !evaluatedUseCaseIds.has(useCase.id);
      }
      return true;
    }) || [];

  // Calculate stats
  const totalUseCases = useCases?.length || 0;
  const draftUseCases = useCases?.filter((uc: any) => uc.maturityLevel === 'Draft').length || 0;
  const pilotUseCases = useCases?.filter((uc: any) => uc.maturityLevel === 'Pilot').length || 0;
  const productionUseCases = useCases?.filter((uc: any) => uc.maturityLevel === 'Production').length || 0;

  const handleLogout = () => {
    logout();
  };

  if (isLoadingUseCases || isLoadingEvaluations) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#f9fafb'
      }}>
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #00B04F',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      paddingBottom: isMobile ? '80px' : '0',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #00B04F 0%, #004B87 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>B</span>
            </div>
            <div>
              <h1 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937',
                margin: 0
              }}>Dashboard</h1>
              <div style={{
                fontSize: '12px',
                color: '#6b7280'
              }}>{user?.email}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              background: 'none',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '16px' }}>
        {/* Search Bar */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Use Cases durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 40px 12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                background: '#f9fafb',
                boxSizing: 'border-box'
              }}
            />
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              fontSize: '18px'
            }}>🔍</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #00B04F 0%, #00C851 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
              {totalUseCases}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Use Cases</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #004B87 0%, #0056A0 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
              {productionUseCases}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>In Produktion</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
              {pilotUseCases}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Pilot Phase</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
              {draftUseCases}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Entwürfe</div>
          </div>
        </div>

        {/* Use Cases List */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1f2937',
              margin: 0
            }}>
              Use Cases ({filteredUseCases.length})
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="filter-unevaluated"
                checked={showOnlyUnevaluated}
                onChange={(e) => setShowOnlyUnevaluated(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="filter-unevaluated" style={{ fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
                Nur unbewertete
              </label>
            </div>
          </div>

          {filteredUseCases.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredUseCases.map((useCase: any) => {
                const isEvaluated = evaluatedUseCaseIds.has(useCase.id);
                return (
                  <Link
                    key={useCase.id}
                    to={routes.UseCaseDetailRoute.build({ params: { id: useCase.id } }) as any}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div
                      style={{
                        background: '#f9fafb',
                        border: isEvaluated ? '1px solid #00B04F' : '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '16px',
                        transition: 'all 150ms ease',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#00B04F';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = isEvaluated ? '#00B04F' : '#e5e7eb';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: '12px'
                      }}>
                        <div style={{ flex: 1, paddingRight: '40px' }}>
                          <h3 style={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#1f2937',
                            margin: '0 0 4px 0',
                            lineHeight: '1.4'
                          }}>
                            {useCase.title || 'Unbenannter Use Case'}
                          </h3>
                          {useCase.maturityLevel && (
                            <span style={{
                              display: 'inline-block',
                              background: useCase.maturityLevel === 'Production' ? '#00B04F' :
                                        useCase.maturityLevel === 'Pilot' ? '#f59e0b' : '#6b7280',
                              color: 'white',
                              fontSize: '11px',
                              fontWeight: 500,
                              padding: '2px 8px',
                              borderRadius: '12px'
                            }}>
                              {useCase.maturityLevel}
                            </span>
                          )}
                        </div>
                        {isEvaluated && (
                          <div style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#e8f5e9',
                            color: '#388e3c',
                            padding: '4px 10px',
                            borderRadius: '16px',
                            fontSize: '12px',
                            fontWeight: 500
                          }}>
                            <span>✔</span>
                            <span>Bewertet</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Description */}
                      <p style={{ 
                        color: '#6b7280', 
                        fontSize: '14px', 
                        marginBottom: '16px',
                        lineHeight: '1.4',
                        margin: '0 0 16px 0'
                      }}>{useCase.description || 'Keine Beschreibung verfügbar'}</p>
                      
                      {/* Footer */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>
                          {useCase.maturityLevel && `Status: ${useCase.maturityLevel}`}
                        </div>
                        <div style={{
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
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={{
              background: '#f9fafb',
              borderRadius: '8px',
              padding: '40px 20px',
              textAlign: 'center',
              border: '2px dashed #e5e7eb'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '8px' }}>
                Keine Use Cases gefunden
              </p>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                Versuchen Sie andere Suchbegriffe
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderTop: '1px solid #e5e7eb',
          paddingBottom: 'env(safe-area-inset-bottom)',
          zIndex: 50
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            padding: '8px 0'
          }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'usecases', label: 'Use Cases', icon: '🔧' },
              { id: 'favorites', label: 'Favoriten', icon: '♡' },
              { id: 'profile', label: 'Profil', icon: '👤' }
            ].map((item: any) => (
              <button
                key={item.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
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
      )}
    </div>
  );
}

export { DashboardPage };
