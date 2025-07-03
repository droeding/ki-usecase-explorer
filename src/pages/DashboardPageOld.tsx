import React, { useState, useEffect } from 'react';
import { useAuth } from 'wasp/client/auth';
import { logout } from 'wasp/client/auth';
import { getUseCases } from 'wasp/client/operations';
import { useQuery } from 'wasp/client/operations';

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
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);
};

export function DashboardPage() {
  const { data: user } = useAuth();
  const { data: useCases, isLoading, error } = useQuery(getUseCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');
  const isMobile = useMobileDetection();
  
  // Use viewport height hook for mobile optimization
  useViewportHeight();

  const handleLogout = () => {
    logout();
  };

  // Filter use cases based on search and area
  const filteredUseCases = useCases?.filter((useCase: any) => {
    const matchesSearch = useCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         useCase.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = filterArea === 'all' || useCase.businessArea === filterArea;
    return matchesSearch && matchesArea;
  });

  // Get unique business areas for filter
  const businessAreas = [...new Set(useCases?.map((uc: any) => uc.businessArea).filter(Boolean))] as string[];

  // Mobile Loading State
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #00B04F',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Use Cases werden geladen...</p>
        </div>
      </div>
    );
  }
  
  // Mobile Error State
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: '#fef2f2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <span style={{ color: '#dc2626', fontSize: '24px' }}>⚠️</span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            Fehler beim Laden
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              background: '#00B04F',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  // Main Dashboard Content
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
              background: '#dc2626',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Abmelden
          </button>
        </div>
      </header>

      {/* Mobile Search */}
      <div style={{ padding: '16px' }}>
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '18px',
            color: '#9ca3af'
          }}>🔍</div>
          <input 
            type="search" 
            placeholder="Use Cases durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 44px',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              background: 'white',
              fontSize: 'max(16px, 1rem)',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        {/* Business Area Filter */}
        <select
          value={filterArea}
          onChange={(e) => setFilterArea(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            background: 'white',
            fontSize: 'max(16px, 1rem)',
            boxSizing: 'border-box'
          }}
        >
          <option value="all">Alle Bereiche</option>
          {businessAreas?.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>

      {/* Dashboard Stats */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'white',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00B04F' }}>
              {useCases?.length || 0}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Use Cases</div>
          </div>
          <div style={{
            background: 'white',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#004B87' }}>
              {businessAreas?.length || 0}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Bereiche</div>
          </div>
        </div>
        
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#1f2937',
            margin: 0
          }}>
            Use Cases ({filteredUseCases?.length || 0})
          </h2>
        </div>

        {/* Use Cases List */}
        {filteredUseCases && filteredUseCases.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {filteredUseCases.map((useCase: any) => (
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
              }}
              onClick={() => window.location.href = `/usecase/${useCase.id}`}>
                
                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontWeight: 600, 
                      color: '#1f2937', 
                      marginBottom: '8px',
                      fontSize: '16px',
                      margin: '0 0 8px 0'
                    }}>{useCase.title}</h3>
                    {useCase.businessArea && (
                      <span style={{
                        background: '#dbeafe',
                        color: '#1e40af',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 500
                      }}>
                        {useCase.businessArea}
                      </span>
                    )}
                  </div>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '4px'
                  }}>♡</button>
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
        ) : (
          <div style={{
            background: 'white',
            padding: '40px 20px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>📋</div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              {searchTerm || filterArea !== 'all' ? 'Keine passenden Use-Cases gefunden' : 'Noch keine Use-Cases vorhanden'}
            </h3>
            <p style={{
              color: '#6b7280',
              marginBottom: '20px',
              margin: '0 0 20px 0'
            }}>
              {searchTerm || filterArea !== 'all' ? 
                'Versuchen Sie andere Suchbegriffe oder Filter.' : 
                'Es wurden noch keine Ki Use-Cases erfasst.'
              }
            </p>
            {(searchTerm || filterArea !== 'all') && (
              <button
                onClick={() => {setSearchTerm(''); setFilterArea('all');}}
                style={{
                  background: '#00B04F',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Filter zurücksetzen
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
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
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0
          }}>
            {[
              { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
              { id: 'search', icon: '🔍', label: 'Suchen' },
              { id: 'favorites', icon: '❤️', label: 'Favoriten' },
              { id: 'profile', icon: '👤', label: 'Profil' }
            ].map((item) => (
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
      )}
    </div>
  );
}
