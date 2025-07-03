import React from 'react';
import { Link } from 'wasp/client/router';

export default function TestPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Mobile Status Bar */}
      <div style={{ height: 'env(safe-area-inset-top)', background: '#f59e0b' }}></div>
      
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
              to="/"
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
              }}>Test Page</h1>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#6b7280'
              }}>System Test & Diagnostik</p>
            </div>
          </div>
          
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#f59e0b',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
          }}>
            🧪
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '16px' }}>
        {/* Success Banner */}
        <section style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '24px 20px',
          borderRadius: '16px',
          marginBottom: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎉</div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            margin: '0 0 8px 0'
          }}>System funktioniert!</h2>
          <p style={{
            fontSize: '14px',
            margin: 0,
            opacity: 0.9
          }}>Alle Services sind online und betriebsbereit</p>
        </section>

        {/* Status Card */}
        <section style={{
          background: 'white',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#1f2937',
            marginBottom: '16px'
          }}>System Status</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              background: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>✅</span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>Server Status</span>
              </div>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 500 }}>Online</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              background: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>⏰</span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>Zeitstempel</span>
              </div>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 500 }}>
                {new Date().toLocaleString('de-DE', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              background: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>🌐</span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>Frontend</span>
              </div>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 500 }}>Verfügbar</span>
            </div>
          </div>
        </section>

        {/* Navigation Card */}
        <section style={{
          background: 'white',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#1f2937',
            marginBottom: '16px'
          }}>Verfügbare Seiten</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: '#f0fdf4',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#00B04F',
                border: '1px solid #bbf7d0'
              }}
            >
              <span style={{ fontSize: '20px' }}>🏠</span>
              <div>
                <div style={{ fontWeight: 500, fontSize: '14px' }}>Startseite</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Landing Page & Login</div>
              </div>
            </Link>

            <Link
              to="/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: '#eff6ff',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#004B87',
                border: '1px solid #bfdbfe'
              }}
            >
              <span style={{ fontSize: '20px' }}>📊</span>
              <div>
                <div style={{ fontWeight: 500, fontSize: '14px' }}>Dashboard</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Nach dem Login verfügbar</div>
              </div>
            </Link>

            <Link
              to="/mobile-demo"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: '#fef3c7',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#92400e',
                border: '1px solid #fde68a'
              }}
            >
              <span style={{ fontSize: '20px' }}>📱</span>
              <div>
                <div style={{ fontWeight: 500, fontSize: '14px' }}>Mobile Demo</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Vollständige Mobile UI</div>
              </div>
            </Link>

            <Link
              to="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: '#f3e8ff',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#7c3aed',
                border: '1px solid #ddd6fe'
              }}
            >
              <span style={{ fontSize: '20px' }}>⚙️</span>
              <div>
                <div style={{ fontWeight: 500, fontSize: '14px' }}>Admin Panel</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Systemverwaltung</div>
              </div>
            </Link>
          </div>
        </section>

        {/* Next Steps Card */}
        <section style={{
          background: 'white',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '20px' }}>🚀</span>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#1f2937',
              margin: 0
            }}>Nächste Schritte</h3>
          </div>
          
          <div style={{
            background: '#f9fafb',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #f3f4f6'
          }}>
            <ol style={{
              margin: 0,
              paddingLeft: '20px',
              color: '#374151',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              <li style={{ marginBottom: '8px' }}>
                Besuchen Sie die <Link to="/" style={{ color: '#00B04F', fontWeight: 500 }}>Startseite</Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                Registrieren oder melden Sie sich an
              </li>
              <li style={{ marginBottom: '8px' }}>
                Entdecken Sie das <Link to="/mobile-demo" style={{ color: '#00B04F', fontWeight: 500 }}>Mobile Dashboard</Link>
              </li>
              <li>
                Beginnen Sie mit der Use-Case Bewertung
              </li>
            </ol>
          </div>
        </section>
      </main>

      {/* Mobile Bottom Padding */}
      <div style={{ height: '16px' }}></div>
    </div>
  );
}
