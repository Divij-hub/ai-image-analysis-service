import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">AI Vision Analyzer</h1>
          <div>
            {isSignedIn ? (
              <div className="flex gap-4 items-center">
                <Link href="/analyze">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition">
                    Go to Analyzer
                  </button>
                </Link>
                <UserButton />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-16 px-8 text-center">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-4">Analyze Images with AI</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload any image and get detailed AI-powered descriptions including objects, colors, and notable features.
        </p>
        <div className="flex justify-center">
          {isSignedIn ? (
            <Link href="/analyze">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition">
                Start Analyzing
              </button>
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition">
                Get Started Free
              </button>
            </SignInButton>
          )}
        </div>
      </section>
      
      {/* ... Rest of components follow same pattern ... */}
    </div>
  );
}