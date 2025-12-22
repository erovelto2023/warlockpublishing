import { Zap } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" fill="currentColor" />
                            </div>
                            <span className="font-bold text-xl text-white">WARLOCK<span className="text-cyan-400">PUBLISHING</span></span>
                        </div>
                        <p className="text-slate-500 text-sm">Empowering creators with premium digital tools and assets since 2024.</p>
                    </div>



                    <div>
                        <h4 className="font-bold text-white mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><a href="/about" className="hover:text-cyan-400 transition-colors">About</a></li>
                            <li><a href="/blog" className="hover:text-cyan-400 transition-colors">Blog</a></li>
                            <li><a href="/careers" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                            <li><a href="/contact" className="hover:text-cyan-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><a href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</a></li>
                            <li><a href="/terms" className="hover:text-cyan-400 transition-colors">Terms</a></li>
                            <li><a href="/license" className="hover:text-cyan-400 transition-colors">License</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-600 text-sm">&copy; {new Date().getFullYear()} Warlock Publishing. All rights reserved.</p>
                    <div className="flex gap-6">
                        {/* Social placeholders */}
                        <div className="w-5 h-5 bg-slate-700 rounded-full hover:bg-cyan-500 transition-colors cursor-pointer"></div>
                        <div className="w-5 h-5 bg-slate-700 rounded-full hover:bg-cyan-500 transition-colors cursor-pointer"></div>
                        <div className="w-5 h-5 bg-slate-700 rounded-full hover:bg-cyan-500 transition-colors cursor-pointer"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
