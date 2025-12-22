import React from 'react';

export function SoftwareNavbar() {
    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300" id="navbar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <i className="fa-solid fa-layer-group"></i>
                        </div>
                        <span className="font-bold text-xl text-slate-900 tracking-tight">TaskFlow</span>
                    </div>

                    <div className="hidden md:flex space-x-8 items-center">
                        <a href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition">Features</a>
                        <a href="#testimonials" className="text-slate-600 hover:text-blue-600 font-medium transition">Testimonials</a>
                        <a href="#pricing" className="text-slate-600 hover:text-blue-600 font-medium transition">Pricing</a>
                        <a href="#faq" className="text-slate-600 hover:text-blue-600 font-medium transition">FAQ</a>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <a href="#" className="text-slate-600 hover:text-blue-600 font-medium">Log in</a>
                        <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition shadow-lg shadow-blue-500/30">
                            Get Started
                        </a>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button id="mobile-menu-btn" className="text-slate-600 hover:text-slate-900 focus:outline-none">
                            <i className="fa-solid fa-bars text-2xl"></i>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export function SoftwareFooter() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    <div className="col-span-2 lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4 text-white">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-layer-group"></i>
                            </div>
                            <span className="font-bold text-xl">TaskFlow</span>
                        </div>
                        <p className="text-sm max-w-xs mb-6">Making project management seamless, intuitive, and efficient for teams of all sizes.</p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white transition"><i className="fa-brands fa-twitter text-xl"></i></a>
                            <a href="#" className="hover:text-white transition"><i className="fa-brands fa-github text-xl"></i></a>
                            <a href="#" className="hover:text-white transition"><i className="fa-brands fa-linkedin text-xl"></i></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition">Features</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Integrations</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Pricing</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Changelog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition">About Us</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Careers</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Blog</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Security</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p>&copy; {new Date().getFullYear()} TaskFlow Inc. All rights reserved.</p>
                    <div className="mt-4 md:mt-0 flex gap-6">
                        <span className="flex items-center gap-2"><i className="fa-solid fa-globe"></i> English (US)</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export function SoftwareCTA() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-blue-600 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500 opacity-50 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-700 opacity-50 blur-3xl"></div>

                    <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to boost your productivity?</h2>
                    <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">Join thousands of teams who are shipping projects faster and happier. Get started today for free.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                        <button className="bg-white text-blue-600 hover:bg-slate-50 px-8 py-4 rounded-full font-bold text-lg transition shadow-lg transform hover:-translate-y-1">Get Started Free</button>
                        <button className="bg-blue-700/50 border border-blue-400/30 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition backdrop-blur-sm">Talk to Sales</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function SoftwareFAQ() {
    return (
        <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer open:ring-2 open:ring-blue-100 open:border-blue-200 transition-all duration-300">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-900 text-lg">
                            <span>Can I cancel my subscription anytime?</span>
                            <span className="transition transform group-open:rotate-180 text-blue-500">
                                <i className="fa-solid fa-chevron-down"></i>
                            </span>
                        </summary>
                        <p className="text-slate-600 mt-4 leading-relaxed animate-fadeIn">
                            Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.
                        </p>
                    </details>

                    <details className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer open:ring-2 open:ring-blue-100 open:border-blue-200 transition-all duration-300">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-900 text-lg">
                            <span>Do you offer a free trial?</span>
                            <span className="transition transform group-open:rotate-180 text-blue-500">
                                <i className="fa-solid fa-chevron-down"></i>
                            </span>
                        </summary>
                        <p className="text-slate-600 mt-4 leading-relaxed animate-fadeIn">
                            Absolutely! We offer a 14-day free trial on our Pro plan. No credit card required to start.
                        </p>
                    </details>

                    <details className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer open:ring-2 open:ring-blue-100 open:border-blue-200 transition-all duration-300">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-900 text-lg">
                            <span>Is my data secure?</span>
                            <span className="transition transform group-open:rotate-180 text-blue-500">
                                <i className="fa-solid fa-chevron-down"></i>
                            </span>
                        </summary>
                        <p className="text-slate-600 mt-4 leading-relaxed animate-fadeIn">
                            We take security seriously. All data is encrypted at rest and in transit using industry-standard AES-256 encryption.
                        </p>
                    </details>

                    <details className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer open:ring-2 open:ring-blue-100 open:border-blue-200 transition-all duration-300">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-900 text-lg">
                            <span>Do you offer discounts for non-profits?</span>
                            <span className="transition transform group-open:rotate-180 text-blue-500">
                                <i className="fa-solid fa-chevron-down"></i>
                            </span>
                        </summary>
                        <p className="text-slate-600 mt-4 leading-relaxed animate-fadeIn">
                            Yes! We love supporting organizations that do good. Contact our sales team with proof of your non-profit status for a 50% discount.
                        </p>
                    </details>
                </div>
            </div>
        </section>
    );
}

export function SoftwareStats() {
    return (
        <section className="bg-blue-900 py-20 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
                        <div className="text-blue-200">Uptime SLA</div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
                        <div className="text-blue-200">Support</div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-5xl font-bold mb-2">100k+</div>
                        <div className="text-blue-200">Active Users</div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-5xl font-bold mb-2">4.9/5</div>
                        <div className="text-blue-200">User Rating</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function SoftwareLogoCloud() {
    return (
        <section className="py-10 border-y border-slate-100 bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">Trusted by innovative teams at</p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
                    <div className="flex items-center gap-2 text-2xl font-bold text-slate-600"><i className="fa-brands fa-aws"></i> Amazon</div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-slate-600"><i className="fa-brands fa-google"></i> Google</div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-slate-600"><i className="fa-brands fa-meta"></i> Meta</div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-slate-600"><i className="fa-brands fa-spotify"></i> Spotify</div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-slate-600"><i className="fa-brands fa-stripe"></i> Stripe</div>
                </div>
            </div>
        </section>
    );
}

export function SoftwareVideo() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="mb-10">
                    <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Demo</span>
                    <h2 className="text-3xl font-bold text-slate-900 mt-2">See TaskFlow in Action</h2>
                    <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto">Watch how teams use TaskFlow to organize, track, and manage their work to ship 2x faster.</p>
                </div>

                <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 group cursor-pointer">
                    <img src="https://placehold.co/1920x1080/1e293b/ffffff?text=Video+Thumbnail" alt="Video Thumbnail" className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition duration-500" />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative flex items-center justify-center">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full animate-pulse absolute"></div>
                            <div className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 shadow-lg group-hover:scale-110 transition duration-300 relative z-10">
                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-blue-600 pl-1 shadow-sm">
                                    <i className="fa-solid fa-play text-2xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
                        <div className="h-1 bg-white/30 rounded-full overflow-hidden mb-2">
                            <div className="h-full w-1/3 bg-blue-500"></div>
                        </div>
                        <div className="flex justify-between text-white text-xs font-medium px-1">
                            <div className="flex gap-3">
                                <i className="fa-solid fa-play"></i>
                                <i className="fa-solid fa-volume-high"></i>
                                <span>01:23 / 03:45</span>
                            </div>
                            <div className="flex gap-3">
                                <i className="fa-solid fa-gear"></i>
                                <i className="fa-solid fa-expand"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
