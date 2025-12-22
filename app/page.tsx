import Link from "next/link";
import { ShoppingBag, Star, Zap, Globe, Shield, ArrowRight, Play, Download, Layers, Cpu, BookOpen, PenTool, Puzzle, GraduationCap, Sparkles, Palette, Briefcase, FileText, Monitor, Book } from 'lucide-react';
import { HeroAuthButtons } from "@/components/hero-auth-buttons";

export default function Home() {
  const categories = [
    { name: "Fiction Books", icon: <BookOpen className="w-8 h-8 text-cyan-400" /> },
    { name: "Non-Fiction Books", icon: <Book className="w-8 h-8 text-purple-400" /> },
    { name: "Coloring Books", icon: <Palette className="w-8 h-8 text-pink-400" /> },
    { name: "Children’s Books", icon: <Sparkles className="w-8 h-8 text-yellow-400" /> },
    { name: "Activity & Puzzle Books", icon: <Puzzle className="w-8 h-8 text-green-400" /> },
    { name: "Journals, Planners & Workbooks", icon: <PenTool className="w-8 h-8 text-orange-400" /> },
    { name: "Educational & Academic Books", icon: <GraduationCap className="w-8 h-8 text-blue-400" /> },
    { name: "Spiritual & Mindfulness Books", icon: <Zap className="w-8 h-8 text-indigo-400" /> },
    { name: "Creative & Artistic Books", icon: <Layers className="w-8 h-8 text-red-400" /> },
    { name: "Lifestyle & Hobby Books", icon: <ShoppingBag className="w-8 h-8 text-teal-400" /> },
    { name: "Professional & Career Books", icon: <Briefcase className="w-8 h-8 text-slate-400" /> },
    { name: "Short-Form & Specialty Books", icon: <FileText className="w-8 h-8 text-cyan-400" /> },
    { name: "Software & Digital Tools", icon: <Monitor className="w-8 h-8 text-purple-400" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
          <div className="absolute top-1/2 -left-1/4 w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-3xl mix-blend-screen"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                New Collections Added
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                Worldbuilders and Readers <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                  Linking Originality, Creativity & Knowledge
                </span>
              </h1>
              <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0">
                Discover premium digital assets created by top creators. From fiction to software, accelerate your workflow with our curated marketplace.
              </p>



              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-8">
                <HeroAuthButtons />
                <Link href="/products" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-cyan-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Explore Library <ArrowRight size={20} />
                </Link>
                <form action="/search" className="w-full sm:w-auto">
                  <div className="relative">
                    <input
                      type="text"
                      name="q"
                      placeholder="Search the library..."
                      className="w-full sm:w-64 px-6 py-4 bg-slate-800 text-white rounded-full border border-slate-700 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </form>
              </div>

              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-slate-500">
                <div className="flex items-center gap-2">
                  <Globe size={18} /> <span>Global Community</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={18} /> <span>Verified Content</span>
                </div>
              </div>
            </div>

            {/* Right Content - Image Placeholder */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative aspect-square md:aspect-[4/3] rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shadow-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-slate-900 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-slate-700 shadow-inner">
                    <BookOpen className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Warlock Library</h3>
                  <p className="text-slate-400">Your Gateway to Digital Excellence</p>
                </div>

                {/* Floating Card Element */}
                <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 flex items-center justify-between shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Featured</p>
                    <p className="text-sm font-semibold text-white">Digital Tools & Software</p>
                  </div>
                  <div className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-lg text-sm font-bold">
                    New
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories" className="py-24 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Explore Our Collection</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Dive into our extensive library of digital products, ranging from literary works to powerful software tools.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link href={`/products?category=${encodeURIComponent(category.name)}`} key={index} className="group bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-cyan-500/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-slate-700 group-hover:border-cyan-500/30">
                  {category.icon}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{category.name}</h3>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center flex flex-wrap justify-center gap-4">
            <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-700 transition-all border border-slate-700">
              View All Products <ArrowRight size={18} />
            </Link>
            <Link href="/blog" className="inline-flex items-center gap-2 px-8 py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-700 transition-all border border-slate-700">
              Read Our Blog <BookOpen size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature / Why Us */}
      <section className="py-24 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="p-8 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700/50 transition-colors">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Delivery</h3>
              <p className="text-slate-400">Get direct access to your files immediately after purchase. No waiting times.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700/50 transition-colors">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure Licensing</h3>
              <p className="text-slate-400">Clear, commercial-friendly licenses for all assets. Use with confidence.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700/50 transition-colors">
              <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Curated Quality</h3>
              <p className="text-slate-400">Every product is manually reviewed by our team to ensure high standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Newsletter */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-purple-900/20"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to create your next masterpiece?</h2>
          <p className="text-slate-300 mb-10 text-lg">Join 50,000+ creators getting the best digital assets delivered to their inbox weekly.</p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-slate-800 border border-slate-700 text-white px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder-slate-500"
            />
            <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
              Get Started
            </button>
          </div>
          <p className="text-slate-500 text-sm mt-6">No spam, unsubscribe at any time.</p>
        </div>
      </section>
    </div>
  );
}
