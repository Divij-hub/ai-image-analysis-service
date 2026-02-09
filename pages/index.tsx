import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header/Navigation */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
            AI Vision Analyzer
          </h1>
          <div>
            {isSignedIn ? (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link href="/analyze">
                  <button style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}>
                    Go to Analyzer
                  </button>
                </Link>
                <UserButton />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1rem'
        }}>
          Analyze Images with AI
        </h2>
        <p style={{
          fontSize: '1.25rem',
          color: '#6b7280',
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}>
          Upload any image and get detailed AI-powered descriptions including objects, colors, mood, and notable features.
        </p>
        {isSignedIn ? (
          <Link href="/analyze">
            <button style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              Start Analyzing
            </button>
          </Link>
        ) : (
          <SignInButton mode="modal">
            <button style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              Get Started Free
            </button>
          </SignInButton>
        )}
      </section>

      {/* Features Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem'
      }}>
        <h3 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#1f2937'
        }}>
          Key Features
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>🤖</div>
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              AI-Powered Analysis
            </h4>
            <p style={{ color: '#6b7280' }}>
              Leverages OpenAI's GPT-4 Vision to provide detailed, accurate image descriptions
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>⚡</div>
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              Fast & Secure
            </h4>
            <p style={{ color: '#6b7280' }}>
              Instant results with enterprise-grade security and authentication via Clerk
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>📸</div>
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              Multiple Formats
            </h4>
            <p style={{ color: '#6b7280' }}>
              Supports JPG, PNG, WEBP formats up to 5MB for maximum flexibility
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '4rem auto',
        padding: '0 2rem'
      }}>
        <h3 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#1f2937'
        }}>
          Simple Pricing
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Free Tier */}
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h4 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              Free
            </h4>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#3b82f6',
              marginBottom: '1rem'
            }}>
              $0<span style={{ fontSize: '1rem', color: '#6b7280' }}>/month</span>
            </div>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '1.5rem',
              textAlign: 'left'
            }}>
              <li style={{ padding: '0.5rem 0', color: '#4b5563' }}>✓ 1 image analysis</li>
              <li style={{ padding: '0.5rem 0', color: '#4b5563' }}>✓ Basic AI analysis</li>
              <li style={{ padding: '0.5rem 0', color: '#4b5563' }}>✓ Standard support</li>
            </ul>
            <SignInButton mode="modal">
              <button style={{
                width: '100%',
                backgroundColor: '#f3f4f6',
                color: '#1f2937',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
                Get Started
              </button>
            </SignInButton>
          </div>

          {/* Premium Tier */}
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #3b82f6',
            borderRadius: '0.5rem',
            padding: '2rem',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.25rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              POPULAR
            </div>
            <h4 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              Premium
            </h4>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#3b82f6',
              marginBottom: '1rem'
            }}>
              $5<span style={{ fontSize: '1rem', color: '#6b7280' }}>/month</span>
            </div>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '1.5rem',
              textAlign: 'left'
            }}>
              <li style={{ padding: '0.5rem 0', color: '#4b5563' }}>✓ Unlimited analyses</li>
              <li style={{ padding: '0.5rem 0', color: '#4b5563' }}>✓ Advanced descriptions</li>
              <li style={{ padding: '0.5rem 0', color: '#4b5563' }}>✓ Priority support</li>
            </ul>
            <button style={{
              width: '100%',
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Upgrade to Premium
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
        padding: '2rem',
        textAlign: 'center',
        marginTop: '4rem'
      }}>
        <p style={{ color: '#6b7280' }}>
          © 2026 AI Vision Analyzer. Powered by OpenAI and Clerk.
        </p>
      </footer>
    </div>
  );
}
