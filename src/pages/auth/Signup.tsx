import React from 'react'
import { SignupForm } from 'wasp/client/auth'
import { Link } from 'wasp/client/router'

export function SignupPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #eff6ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Mobile Status Bar */}
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'env(safe-area-inset-top)', 
        background: '#00B04F' 
      }}></div>
      
      <div style={{ 
        maxWidth: '400px', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px',
        marginTop: 'env(safe-area-inset-top)'
      }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center' }}>
          {/* Bechtle Logo */}
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#00B04F',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 10px 25px rgba(0, 176, 79, 0.3)'
          }}>
            <span style={{ 
              color: 'white', 
              fontWeight: 'bold', 
              fontSize: '24px' 
            }}>B</span>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              Ki Use-Case Explorer
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#004B87',
              margin: 0,
              opacity: 0.8
            }}>
              Powered by Bechtle
            </p>
          </div>
          
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 8px 0'
          }}>
            Konto erstellen
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: '0 0 32px 0'
          }}>
            Registrieren Sie sich für die Ki Use-Case Bewertung
          </p>
        </div>
        
        {/* Signup Form Container */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: '32px 24px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Security Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: 'rgba(0, 176, 79, 0.1)',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <svg style={{ width: '20px', height: '20px', color: '#00B04F' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span style={{
              color: '#00B04F',
              fontWeight: 500,
              fontSize: '14px'
            }}>
              Sichere Registrierung
            </span>
          </div>
          
          {/* Signup Form */}
          <div>
            <SignupForm />
          </div>
          
          {/* Footer */}
          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #f3f4f6'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 16px 0'
              }}>
                Bereits ein Konto vorhanden?
              </p>
              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: '#00B04F',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '14px',
                  gap: '8px',
                  transition: 'color 150ms ease',
                  marginRight: '16px'
                }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 0a4 4 0 01-4 4H6a4 4 0 01-4-4V7a4 4 0 014-4h5a4 4 0 014 4v1" />
                </svg>
                Zur Anmeldung
              </Link>
              <Link
                to="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: '#6b7280',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '14px',
                  gap: '8px',
                  transition: 'color 150ms ease'
                }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Zur Startseite
              </Link>
            </div>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg style={{ width: '16px', height: '16px', color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.268.732a9 9 0 11-2.732-2.732" />
              </svg>
              SSL-verschlüsselt
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg style={{ width: '16px', height: '16px', color: '#004B87' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Azure Cloud
            </div>
          </div>
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            margin: 0
          }}>
            © 2025 Bechtle AG • Alle Rechte vorbehalten
          </p>
        </div>
      </div>
      
      {/* Mobile Bottom Padding */}
      <div style={{ height: 'env(safe-area-inset-bottom)' }}></div>
    </div>
  )
}
