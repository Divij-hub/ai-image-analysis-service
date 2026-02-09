import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header/Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-blue-600">
            AI Vision Analyzer
          </h1>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <Link href="/analyze">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm">
                    Go to Analyzer
                  </button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto pt-20 pb-16 px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
          Analyze Images with <span className="text-blue-600">AI Intelligence</span>
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload any image and get detailed AI-powered descriptions including objects, colors, mood, and notable features in seconds.
        </p>
        <div>
          {isSignedIn ? (
            <Link href="/analyze">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-xl transition-all hover:-translate-y-1">
                Start Analyzing Now
              </button>
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-xl transition-all hover:-translate-y-1">
                Get Started Free
              </button>
            </SignInButton>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-16">Why Choose Our AI?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: "🤖", title: "GPT-4 Vision", desc: "Powered by the world's most advanced visual recognition model." },
              { icon: "⚡", title: "Real-time Processing", desc: "Get detailed descriptions and labels in under 5 seconds." },
              { icon: "📸", title: "Universal Formats", desc: "Supports high-resolution JPG, PNG, and WebP uploads." }
            ].map((feature, i) => (
              <div key={i} className="text-center group">
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-5xl mx-auto py-24 px-6">
        <h3 className="text-3xl font-bold text-center mb-16">Flexible Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-xl font-bold mb-2">Free</h4>
            <div className="text-4xl font-black text-blue-600 mb-6">$0<span className="text-sm text-gray-400 font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8 text-gray-600">
              <li className="flex items-center gap-2">✅ 1 free analysis</li>
              <li className="flex items-center gap-2">✅ Standard AI model</li>
              <li className="flex items-center gap-2">✅ Web access</li>
            </ul>
            <SignInButton mode="modal">
              <button className="w-full py-3 rounded-lg bg-gray-100 font-bold hover:bg-gray-200 transition-colors">Sign Up</button>
            </SignInButton>
          </div>

          {/* Premium Tier */}
          <div className="bg-white border-2 border-blue-600 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-4 right-[-35px] bg-blue-600 text-white text-xs font-bold py-1 px-10 rotate-45">BEST</div>
            <h4 className="text-xl font-bold mb-2">Premium</h4>
            <div className="text-4xl font-black text-blue-600 mb-6">$5<span className="text-sm text-gray-400 font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8 text-gray-600">
              <li className="flex items-center gap-2 font-medium">✅ Unlimited analyses</li>
              <li className="flex items-center gap-2 font-medium">✅ Advanced detail level</li>
              <li className="flex items-center gap-2 font-medium">✅ Priority processing</li>
            </ul>
            <button className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              Upgrade Now
            </button>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
        © 2026 AI Vision Analyzer. Built with Next.js, Tailwind, and Clerk.
      </footer>
    </div>
  );
}