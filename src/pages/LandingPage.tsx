import React, { useState } from 'react'
import { Link } from 'wasp/client/router'

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#00B04F',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              B
            </div>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937'
              }}>Ki Use-Case Explorer</h1>
            </div>
          </div>
          
          <button 
            style={{
              padding: '8px',
              border: 'none',
              background: 'none',
              color: '#6b7280',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: 'pointer'
            }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                to="/mobile-demo"
                style={{
                  padding: '12px',
                  color: '#00B04F',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 500
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                📱 Mobile Demo
              </Link>
              <Link
                to="/login"
                style={{
                  padding: '12px',
                  backgroundColor: '#00B04F',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 500,
                  textAlign: 'center'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Anmelden
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Content */}
      <main style={{ padding: '16px', maxWidth: '100%' }}>
        {/* Hero Section */}
        <section style={{
          background: 'white',
          padding: '32px 20px',
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: '#f0fdf4',
            color: '#00B04F',
            display: 'inline-block',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 500,
            marginBottom: '20px'
          }}>
            🚀 Neu: Ki Use-Case Bewertungsplattform
          </div>
          
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            Bewerten Sie <span style={{color: '#00B04F'}}>Ki Use-Cases</span> effizient
          </h1>
          
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            Die zentrale Plattform für die strukturierte Bewertung und Priorisierung von 
            Künstliche Intelligenz Use-Cases.
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <Link
              to="/login"
              style={{
                backgroundColor: '#00B04F',
                color: 'white',
                textDecoration: 'none',
                padding: '16px 24px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                display: 'block'
              }}
            >
              Jetzt bewerten →
            </Link>
            <Link
              to="/mobile-demo"
              style={{
                border: '2px solid #004B87',
                color: '#004B87',
                textDecoration: 'none',
                padding: '14px 24px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                display: 'block'
              }}
            >
              📱 Demo ansehen
            </Link>
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
            padding: '20px 12px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00B04F', marginBottom: '4px' }}>200+</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Ki Use-Cases</div>
          </div>
          <div style={{
            background: 'white',
            padding: '20px 12px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#004B87', marginBottom: '4px' }}>50+</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Aktive Bewerter</div>
          </div>
          <div style={{
            background: 'white',
            padding: '20px 12px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>98%</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Zufriedenheit</div>
          </div>
        </section>

        {/* Feature Cards */}
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1f2937' }}>
            Warum Ki Use-Case Explorer?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎯</div>
              <h3 style={{ fontWeight: 600, color: '#1f2937', marginBottom: '8px', fontSize: '16px' }}>
                Strukturierte Bewertung
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.4' }}>
                Systematische Analyse von Ki Use-Cases nach klaren Kriterien und Metriken.
              </p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
              <h3 style={{ fontWeight: 600, color: '#1f2937', marginBottom: '8px', fontSize: '16px' }}>
                Datengetriebene Entscheidungen
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.4' }}>
                Fundierte Prioritätsentscheidungen basierend auf objektiven Bewertungen.
              </p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🤝</div>
              <h3 style={{ fontWeight: 600, color: '#1f2937', marginBottom: '8px', fontSize: '16px' }}>
                Kollaborative Plattform
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.4' }}>
                Teams arbeiten gemeinsam an der Bewertung und Weiterentwicklung von Use-Cases.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Access */}
        <section style={{
          background: 'white',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          marginBottom: '24px'
        }}>
          <h3 style={{
            marginBottom: '16px',
            color: '#1f2937',
            fontSize: '16px',
            fontWeight: 600
          }}>Schnell-Navigation</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            <Link to="/login" style={{
              padding: '16px 12px',
              textDecoration: 'none',
              color: '#00B04F',
              background: '#f0fdf4',
              borderRadius: '12px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 500
            }}>
              🔐 Login
            </Link>
            <Link to="/mobile-demo" style={{
              padding: '16px 12px',
              textDecoration: 'none',
              color: '#004B87',
              background: '#eff6ff',
              borderRadius: '12px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 500
            }}>
              📱 Demo
            </Link>
            <Link to="/dashboard" style={{
              padding: '16px 12px',
              textDecoration: 'none',
              color: '#7c3aed',
              background: '#f3e8ff',
              borderRadius: '12px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 500
            }}>
              📊 Dashboard
            </Link>
            <Link to="/test" style={{
              padding: '16px 12px',
              textDecoration: 'none',
              color: '#dc2626',
              background: '#fef2f2',
              borderRadius: '12px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 500
            }}>
              🧪 Test
            </Link>
          </div>
        </section>
      </main>

      {/* Mobile Footer */}
      <footer style={{
        margin: '16px',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#1f2937',
        color: 'white',
        borderRadius: '16px'
      }}>
        <p style={{ fontSize: '14px', margin: 0 }}>
          © 2025 Bechtle AG • Ki Use-Case Explorer
        </p>
      </footer>
    </div>
  )
}
