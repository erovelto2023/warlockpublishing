import { Zap } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-24 pb-12 overflow-hidden relative">
            {/* Ambient Background Glow */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 translate-x-1/2 translate-y-1/2"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                                <Zap className="w-6 h-6 text-white" fill="currentColor" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-xl tracking-tighter text-slate-900 leading-none">WARLOCK</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-0.5">Publishing</span>
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed max-w-xs font-medium">
                            Architecting the future of digital asset publishing. Premium tools for creators, visionaries, and worldbuilders.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-[0.2em] mb-8">Ecosystem</h4>
                        <ul className="space-y-4 text-sm text-slate-500 font-semibold">
                            <li><a href="/products" className="hover:text-primary transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></span>Marketplace</a></li>
                            <li><a href="/blog" className="hover:text-primary transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></span>Insights</a></li>
                            <li><a href="/dashboard" className="hover:text-primary transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></span>Studio</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-[0.2em] mb-8">Company</h4>
                        <ul className="space-y-4 text-sm text-slate-500 font-semibold">
                            <li><a href="/about" className="hover:text-primary transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></span>Our Story</a></li>
                            <li><a href="/careers" className="hover:text-primary transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></span>Join Us</a></li>
                            <li><a href="/contact" className="hover:text-primary transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></span>Support</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-[0.2em] mb-8">Legal & Privacy</h4>
                        <ul className="space-y-4 text-sm text-slate-500 font-semibold">
                            <li><a href="/privacy" className="hover:text-primary transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></span>Privacy Policy</a></li>
                            <li><a href="/terms" className="hover:text-primary transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></span>Terms of Service</a></li>
                            <li><a href="/license" className="hover:text-primary transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></span>Licensing</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase">
                        &copy; {new Date().getFullYear()} Warlock Publishing. <span className="text-slate-200 mx-2">|</span> Built for the Digital Frontier.
                    </p>
                    <div className="flex gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-center group shadow-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary transition-colors"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

