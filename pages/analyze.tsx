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

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/');
  }, [isSignedIn, isLoaded, router]);

  useEffect(() => {
    if (isSignedIn) fetchUsage();
  }, [isSignedIn]);

  const fetchUsage = async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/usage', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setUsage(await response.json());
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
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return setError('Please select an image first');
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.description);
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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-blue-600 font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">🔍</span> AI Dashboard
          </h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Usage Card */}
        {usage && (
          <div className="bg-white rounded-xl p-5 mb-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${usage.tier === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                {usage.tier} Plan
              </span>
              <p className="text-sm font-medium text-gray-500">
                Used <span className="text-gray-900 font-bold">{usage.analyses_used}</span> of <span className="text-gray-900 font-bold">{usage.limit === 'unlimited' ? '∞' : usage.limit}</span>
              </p>
            </div>
            {usage.tier === 'free' && usage.analyses_used >= 1 && (
              <div className="bg-amber-50 text-amber-800 text-sm px-4 py-2 rounded-lg border border-amber-100 font-medium">
                ⚠️ Limit reached. <button className="underline font-bold">Upgrade to Premium</button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Control Panel */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-6">Step 1: Upload Image</h2>
            
            <label className="block mb-8">
              <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <span className="text-4xl mb-2">☁️</span>
                    <p className="text-sm text-gray-500 font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG or WebP (MAX. 5MB)</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            </label>

            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                selectedFile && !loading 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? 'Processing...' : 'Run AI Analysis'}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                <span>❌</span> {error}
              </div>
            )}
          </div>

          {/* Right: Results Panel */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm min-h-[450px] flex flex-col">
            <h2 className="text-lg font-bold mb-6">Step 2: AI Result</h2>
            
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium animate-pulse">Our AI is looking at your image...</p>
              </div>
            ) : result ? (
              <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 relative">
                  <span className="absolute -top-3 -left-3 bg-white shadow-sm border border-blue-100 rounded-full p-2 text-xl">✨</span>
                  <h3 className="text-sm font-bold text-blue-800 uppercase tracking-widest mb-3">Analysis Completed</h3>
                  <p className="text-blue-900 leading-relaxed whitespace-pre-wrap">{result}</p>
                </div>
                <button 
                   onClick={() => { setResult(null); setSelectedFile(null); setPreviewUrl(null); }}
                   className="mt-6 text-sm text-gray-400 hover:text-blue-600 transition-colors"
                >
                  Clear and start over
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
                <div className="text-6xl mb-4 opacity-20">📸</div>
                <p className="max-w-[200px]">Waiting for you to upload and analyze an image</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}