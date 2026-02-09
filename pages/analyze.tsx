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

  // Partial view of the Analyze component with Tailwind
// ... (Imports and logic remain the same)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">AI Vision Analyzer</h1>
          <UserButton />
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {/* Usage Display */}
        {usage && (
          <div className="bg-white rounded-lg p-4 mb-8 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">
                Plan: {usage.tier === 'premium' ? '⭐ Premium' : '🆓 Free'}
              </span>
              <span className="text-gray-500">
                Usage: {usage.analyses_used} / {usage.limit === 'unlimited' ? '∞' : usage.limit}
              </span>
            </div>
            {usage.tier === 'free' && usage.analyses_used >= 1 && (
              <div className="mt-3 p-3 bg-amber-50 rounded-md text-amber-800 border border-amber-200">
                ⚠️ You've reached your free tier limit. Upgrade to Premium!
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Upload Image</h2>
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer mb-4"
            />

            {previewUrl && (
              <div className="mb-6 border-2 border-dashed border-gray-200 rounded-lg p-4 flex justify-center">
                <img src={previewUrl} alt="Preview" className="max-h-64 rounded-md shadow-sm" />
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || loading}
              className={`w-full py-3 rounded-md font-bold transition ${
                selectedFile && !loading 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? 'Analyzing...' : 'Analyze Image'}
            </button>
          </div>

          {/* Result Section */}
          <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm min-h-[400px]">
             <h2 className="text-xl font-bold mb-6 text-gray-900">Analysis Result</h2>
             {/* Content goes here ... */}
          </div>
        </div>
      </main>
    </div>
  );
}
