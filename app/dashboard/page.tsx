import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Member Dashboard — Coming Soon | Warlock Publishing",
  description: "The Warlock Publishing member portal is under construction. Check back soon.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center overflow-hidden relative px-6 pt-20">

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-secondary/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.35em] mb-10">
          <Sparkles className="w-3.5 h-3.5 fill-secondary" />
          Member Portal
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl font-serif text-white tracking-tighter leading-[0.9] mb-6">
          Coming <span className="text-secondary italic">Soon</span>
        </h1>

        <p className="text-neutral-400 text-lg leading-relaxed mb-12 max-w-xl mx-auto">
          The Warlock Publishing member dashboard is currently being forged in the
          dark. When it arrives, it will be worth the wait.
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600">In the meantime</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* CTA links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="group flex items-center gap-2 px-8 py-4 bg-secondary text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-secondary/20"
          >
            Explore the Vault <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 font-bold text-xs uppercase tracking-widest transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
