import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 selection:bg-blue-100">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
            <h1 className="text-xl font-bold tracking-tight">AI Vision</h1>
          </div>

          <div className="flex items-center gap-6">
            {isSignedIn ? (
              <>
                <Link href="/analyze" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">Dashboard</Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition shadow-sm">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6">
        <section className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-blue-600 uppercase bg-blue-50 rounded-full">
            Next-Gen Image Intelligence
          </span>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Understand your images with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI clarity</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload any image and let our advanced neural networks extract objects, 
            detect moods, and analyze colors in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isSignedIn ? (
              <Link href="/analyze">
                <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                  Launch Analyzer
                </button>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                  Get Started Free
                </button>
              </SignInButton>
            )}
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition">
              View Examples
            </button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto mt-32 grid md:grid-cols-3 gap-8">
          {[
            { icon: "🤖", title: "GPT-4 Vision", desc: "Industry-leading multimodal AI for deep visual comprehension." },
            { icon: "⚡", title: "Instant Analysis", desc: "Results delivered in under 2 seconds via edge computing." },
            { icon: "📸", title: "HD Support", desc: "Full compatibility with RAW, WebP, and high-res photography." }
          ].map((feature, i) => (
            <div key={i} className="group p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform origin-left">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </section>

        {/* Pricing */}
        <section className="max-w-5xl mx-auto mt-32">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Simple, transparent pricing</h3>
            <p className="text-slate-500">Choose the plan that fits your needs.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="p-10 bg-white border border-slate-200 rounded-[2rem] flex flex-col">
              <h4 className="text-lg font-bold text-slate-400 mb-2">Free</h4>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black">$0</span>
                <span className="text-slate-400">/forever</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {["1 analysis per day", "Standard AI model", "Community support"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-600">
                    <span className="text-blue-500">✓</span> {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl bg-slate-50 text-slate-900 font-bold hover:bg-slate-100 transition">
                Current Plan
              </button>
            </div>

            {/* Premium Plan */}
            <div className="p-10 bg-slate-900 text-white rounded-[2rem] shadow-2xl relative overflow-hidden border border-slate-800">
              <div className="absolute top-6 right-6 bg-blue-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h4 className="text-lg font-bold text-slate-400 mb-2">Premium</h4>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black">$5</span>
                <span className="text-slate-400">/month</span>
              </div>
              <ul className="space-y-4 mb-10">
                {["Unlimited analyses", "Priority GPT-4o access", "API access", "24/7 Support"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <span className="text-blue-400">✓</span> {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-900/20">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm">
        © 2026 AI Vision Analyzer. Built with Next.js & Tailwind.
      </footer>
    </div>
  );
}