import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from 'wasp/client/auth';
import { getUseCaseById, getUserEvaluations } from 'wasp/client/operations';
import { useQuery } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { submitEvaluation } from 'wasp/client/operations';
import { useAction } from 'wasp/client/operations';
import { toggleFavorite } from 'wasp/client/operations';

export function UseCaseDetailPage() {
  const { id } = useParams();
  const { data: user } = useAuth();
  const { data: useCase, isLoading, error, refetch: refetchUseCase } = useQuery(getUseCaseById, { id });
  const { data: userEvaluations, refetch: refetchUserEvaluations } = useQuery(getUserEvaluations, { useCaseId: id }, { enabled: !!user });

  const [activeTab, setActiveTab] = useState('details');
  const [userEvaluation, setUserEvaluation] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const evaluationTabRef = useRef<HTMLDivElement>(null);

  const submitEvaluationAction = useAction(submitEvaluation);
  const toggleFavoriteAction = useAction(toggleFavorite);

  useEffect(() => {
    if (userEvaluations) {
      if (userEvaluations.length > 0) {
        setUserEvaluation(userEvaluations[0].value);
      } else {
        setUserEvaluation(null);
      }
    }
  }, [userEvaluations]);

  const handleEvaluation = async (value: string) => {
    if (!id) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      await submitEvaluationAction({ useCaseId: id, value });
      // Wasp will automatically refetch the queries after the action succeeds.
      // The useEffect hook watching `userEvaluations` will then update the state.
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err: any) {
      setSubmitError(err.message || 'Ein Fehler ist aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!id) return;
    try {
      await toggleFavoriteAction({ useCaseId: id });
      refetchUseCase();
    } catch (err: any) {
      console.error("Failed to toggle favorite", err);
    }
  };

  const handleRateClick = () => {
    setActiveTab('evaluation');
    setTimeout(() => {
      evaluationTabRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // Short delay to ensure the tab content is rendered
  };

  const handleShare = async () => {
    const shareData = {
      title: `Bechtle KI Use-Case: ${useCase?.title}`,
      text: `Schau dir diesen KI Use-Case an: ${useCase?.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareMessage("Link in die Zwischenablage kopiert!");
        setTimeout(() => setShareMessage(null), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
        setShareMessage("Kopieren fehlgeschlagen");
        setTimeout(() => setShareMessage(null), 2000);
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#f9fafb',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          background: 'white',
          padding: '32px',
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
          <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>Lade Use-Case...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#f9fafb',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <p style={{ color: '#dc2626', fontSize: '16px', margin: 0 }}>
            Fehler: {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!useCase) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#f9fafb',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
            Use-Case nicht gefunden
          </p>
        </div>
      </div>
    );
  }

  const getMaturityColor = (level: string) => {
    switch (level) {
      case 'Production': return '#10b981';
      case 'Pilot': return '#f59e0b';
      case 'Draft': return '#6b7280';
      default: return '#9ca3af';
    }
  };

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
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>{useCase.title}</h1>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#6b7280'
              }}>Use-Case Details</p>
            </div>
          </div>
          
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: getMaturityColor(useCase.maturityLevel),
            borderRadius: '50%'
          }}></div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '16px' }}>
        {/* Status Banner */}
        <section style={{
          background: `linear-gradient(135deg, ${getMaturityColor(useCase.maturityLevel)} 0%, ${getMaturityColor(useCase.maturityLevel)}dd 100%)`,
          color: 'white',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            display: 'inline-block',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 500,
            marginBottom: '12px'
          }}>
            Status: {useCase.maturityLevel || 'Unbewertet'}
          </div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            lineHeight: '1.2'
          }}>{useCase.title}</h2>
          <p style={{
            fontSize: '14px',
            margin: 0,
            opacity: 0.9
          }}>{useCase.businessArea || 'Geschäftsbereich nicht angegeben'}</p>
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
              { id: 'details', label: 'Details', icon: '📋' },
              { id: 'solution', label: 'Lösung', icon: '💡' },
              { id: 'evaluation', label: 'Bewertung', icon: '⭐' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '16px 8px',
                  border: 'none',
                  background: 'none',
                  color: activeTab === tab.id ? '#00B04F' : '#6b7280',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '2px solid #00B04F' : '2px solid transparent',
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
        <section 
          ref={evaluationTabRef}
          style={{
          background: 'white',
          borderRadius: '0 0 16px 16px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          marginBottom: '24px'
        }}>
          {activeTab === 'details' && (
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '16px'
              }}>Grundlegende Informationen</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #f3f4f6'
                }}>
                  <h4 style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1f2937'
                  }}>Beschreibung</h4>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    {useCase.description || 'Keine Beschreibung verfügbar'}
                  </p>
                </div>

                <div style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #f3f4f6'
                }}>
                  <h4 style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1f2937'
                  }}>Geschäftsbereich</h4>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    {useCase.businessArea || 'Nicht angegeben'}
                  </p>
                </div>

                <div style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #f3f4f6'
                }}>
                  <h4 style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1f2937'
                  }}>Reifegrad</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: getMaturityColor(useCase.maturityLevel),
                      borderRadius: '50%'
                    }}></div>
                    <span style={{
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      {useCase.maturityLevel || 'Nicht bewertet'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'solution' && (
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '16px'
              }}>Lösungsansatz</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #f3f4f6'
                }}>
                  <h4 style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1f2937'
                  }}>Problemstellung</h4>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    {useCase.problemStatement || 'Nicht angegeben'}
                  </p>
                </div>

                <div style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #f3f4f6'
                }}>
                  <h4 style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1f2937'
                  }}>Lösungsbeschreibung</h4>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    {useCase.solutionDescription || 'Nicht angegeben'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evaluation' && (
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '16px'
              }}>Ihre Bewertung abgeben</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                <p style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  color: '#6b7280',
                  textAlign: 'center',
                  lineHeight: '1.5'
                }}>
                  Wie schätzen Sie das Potenzial dieses Use Cases ein? Ihre Bewertung hilft uns bei der Priorisierung.
                </p>
                
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                  {['HIGH', 'MEDIUM', 'LOW'].map((value) => {
                    const isSelected = userEvaluation === value;
                    const isDefaultAndSelected = userEvaluation === null && value === 'MEDIUM';

                    const getButtonStyles = () => {
                      let border = '2px solid #e5e7eb';
                      let background = 'white';
                      let color = '#1f2937';

                      if (isSelected) {
                        if (value === 'HIGH') {
                          border = '2px solid #10b981';
                          background = '#f0fdf4';
                          color = '#059669';
                        } else if (value === 'LOW') {
                          border = '2px solid #ef4444';
                          background = '#fef2f2';
                          color = '#dc2626';
                        } else { // MEDIUM is selected
                          border = '2px solid #f59e0b';
                          background = '#fefce8';
                          color = '#b45309';
                        }
                      } else if (isDefaultAndSelected) {
                        // Default state for un-evaluated use cases
                        border = '2px solid #f59e0b';
                        background = '#fefce8';
                        color = '#b45309';
                      }

                      return {
                        flex: 1,
                        padding: '16px',
                        borderRadius: '12px',
                        border,
                        background,
                        color,
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                        opacity: isSubmitting ? 0.7 : 1,
                      };
                    };

                    return (
                      <button
                        key={value}
                        onClick={() => handleEvaluation(value)}
                        disabled={isSubmitting}
                        style={getButtonStyles()}
                      >
                        {value === 'HIGH' && '🚀 Hoch'}
                        {value === 'MEDIUM' && '🤔 Mittel'}
                        {value === 'LOW' && '📉 Niedrig'}
                      </button>
                    );
                  })}
                </div>

                {isSubmitting && (
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: '8px 0 0 0' }}>
                    Bewerte...
                  </p>
                )}

                {submitSuccess && (
                  <p style={{ color: '#10b981', fontSize: '14px', margin: '8px 0 0 0' }}>
                    Vielen Dank für Ihre Bewertung!
                  </p>
                )}

                {submitError && (
                  <p style={{ color: '#dc2626', fontSize: '14px', margin: '8px 0 0 0' }}>
                    Fehler: {submitError}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section style={{
          background: 'white',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#1f2937',
            marginBottom: '16px'
          }}>Aktionen</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            <button 
              onClick={handleRateClick}
              style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              background: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #bbf7d0',
              color: '#00B04F',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}>
              <span>⭐</span>
              Bewerten
            </button>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              background: '#eff6ff',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              color: '#004B87',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}>
              <span>💬</span>
              Kommentar
            </button>
            <button 
              onClick={handleShare}
              style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              background: '#fef3c7',
              borderRadius: '8px',
              border: '1px solid #fde68a',
              color: '#92400e',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}>
              <span>📤</span>
              Teilen
            </button>
            <button
              onClick={handleToggleFavorite}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: '#f3f4f6',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer'
              }}>
              <span>{useCase.isFavorite ? '❤️' : '♡'}</span>
              Favorit
            </button>
          </div>
          {shareMessage && (
            <p style={{ textAlign: 'center', color: '#00B04F', fontSize: '14px', marginTop: '12px' }}>
              {shareMessage}
            </p>
          )}
        </section>
      </main>

      {/* Mobile Bottom Padding */}
      <div style={{ height: '16px' }}></div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
