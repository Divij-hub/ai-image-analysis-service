import { useAuth, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Analyze() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const router = useRouter();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<any>(null);

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn, isLoaded, router]);

  // Fetch usage on mount
  useEffect(() => {
    if (isSignedIn) {
      fetchUsage();
    }
  }, [isSignedIn]);

  const fetchUsage = async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/usage', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (err) {
      console.error('Error fetching usage:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setResult(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.description);
        // Refresh usage
        await fetchUsage();
      } else {
        setError(data.detail || 'Analysis failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
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
          <UserButton />
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Usage Display */}
        {usage && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '2rem',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: '600', color: '#1f2937' }}>
                  Plan: {usage.tier === 'premium' ? '⭐ Premium' : '🆓 Free'}
                </span>
              </div>
              <div>
                <span style={{ color: '#6b7280' }}>
                  Usage: {usage.analyses_used} / {usage.limit === 'unlimited' ? '∞' : usage.limit}
                </span>
              </div>
            </div>
            {usage.tier === 'free' && usage.analyses_used >= 1 && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.75rem',
                backgroundColor: '#fef3c7',
                borderRadius: '0.375rem',
                color: '#92400e'
              }}>
                ⚠️ You've reached your free tier limit. Upgrade to Premium for unlimited analyses!
              </div>
            )}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem'
        }}>
          {/* Upload Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '2rem',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              color: '#1f2937'
            }}>
              Upload Image
            </h2>

            {/* File Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              />
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginTop: '0.5rem'
              }}>
                Supported: JPG, PNG, WEBP (max 5MB)
              </p>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div style={{
                marginBottom: '1.5rem',
                border: '2px dashed #d1d5db',
                borderRadius: '0.375rem',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '0.375rem'
                  }}
                />
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || loading}
              style={{
                width: '100%',
                backgroundColor: selectedFile && !loading ? '#3b82f6' : '#d1d5db',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: selectedFile && !loading ? 'pointer' : 'not-allowed',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              {loading ? 'Analyzing...' : 'Analyze Image'}
            </button>

            {/* Error Display */}
            {error && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '0.375rem',
                color: '#991b1b'
              }}>
                ❌ {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '2rem',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              color: '#1f2937'
            }}>
              Analysis Result
            </h2>

            {loading && (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#6b7280'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>🔍</div>
                <p>Analyzing your image...</p>
              </div>
            )}

            {!loading && !result && !error && (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#9ca3af'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>📸</div>
                <p>Upload an image and click "Analyze" to see AI-generated description</p>
              </div>
            )}

            {result && (
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '0.375rem',
                padding: '1.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: '0.75rem'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>✨</span>
                  <div>
                    <h3 style={{
                      fontWeight: '600',
                      color: '#075985',
                      marginBottom: '0.5rem'
                    }}>
                      AI Description:
                    </h3>
                    <p style={{
                      color: '#0c4a6e',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {result}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
