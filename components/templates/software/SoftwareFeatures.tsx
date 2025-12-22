import React from 'react';

export function SoftwareFeatures() {
    return (
        <section id="features" className="py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase mb-2">Features</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to ship faster.</h3>
                    <p className="text-lg text-slate-500">Powerful features tailored for modern agile teams. Stop wrestling with spreadsheets and start shipping.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    <div className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition duration-300">
                        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-2xl mb-6 group-hover:scale-110 transition duration-300">
                            <i className="fa-solid fa-bolt"></i>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-3">Real-time Sync</h4>
                        <p className="text-slate-500 leading-relaxed">
                            Updates happen instantly across all devices. No refreshing required. Collaborate with your team as if you're in the same room.
                        </p>
                    </div>

                    <div className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition duration-300">
                        <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 text-2xl mb-6 group-hover:scale-110 transition duration-300">
                            <i className="fa-solid fa-chart-pie"></i>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-3">Advanced Analytics</h4>
                        <p className="text-slate-500 leading-relaxed">
                            Gain insights into team velocity and project health with our beautiful, pre-built dashboards and custom reports.
                        </p>
                    </div>

                    <div className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition duration-300">
                        <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 text-2xl mb-6 group-hover:scale-110 transition duration-300">
                            <i className="fa-solid fa-puzzle-piece"></i>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-3">100+ Integrations</h4>
                        <p className="text-slate-500 leading-relaxed">
                            Connect with your favorite tools like Slack, GitHub, Jira, and Figma. Keep your workflow connected and efficient.
                        </p>
                    </div>
                </div>

                <div className="mt-24 flex flex-col lg:flex-row items-center gap-16">
                    <div className="w-full lg:w-1/2 order-2 lg:order-1">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <img src="https://placehold.co/800x600/f8fafc/cbd5e1?text=Kanban+Board+Interface" alt="Kanban Interface" className="relative rounded-2xl shadow-2xl border border-slate-100 w-full transform transition duration-500 hover:scale-[1.01]" />
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-4 border border-blue-100">
                            <i className="fa-solid fa-layer-group"></i> WORKFLOWS
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-4">Visualize workflows your way</h3>
                        <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                            Switch between List, Board, and Calendar views instantly. Customize every stage of your project to match your team's unique process without writing a single line of code.
                        </p>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                                    <i className="fa-solid fa-check text-green-600 text-sm"></i>
                                </div>
                                <div>
                                    <h5 className="text-slate-900 font-bold text-base">Drag-and-drop Kanban</h5>
                                    <p className="text-slate-500 text-sm mt-1">Move tasks through stages effortlessly with a fluid, responsive interface.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                                    <i className="fa-solid fa-bolt text-blue-600 text-sm"></i>
                                </div>
                                <div>
                                    <h5 className="text-slate-900 font-bold text-base">Automated Triggers</h5>
                                    <p className="text-slate-500 text-sm mt-1">Automatically assign users or send notifications when status changes.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                                    <i className="fa-solid fa-filter text-purple-600 text-sm"></i>
                                </div>
                                <div>
                                    <h5 className="text-slate-900 font-bold text-base">Smart Filtering</h5>
                                    <p className="text-slate-500 text-sm mt-1">Instantly drill down by assignee, priority, due date, or custom tags.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-32">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Product Tour</span>
                        <h2 className="text-3xl font-bold text-slate-900 mt-2">A complete suite in one package</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[800px]">

                        <div className="md:col-span-2 md:row-span-2 rounded-3xl bg-slate-50 border border-slate-200 p-8 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/50 to-transparent z-0"></div>
                            <div className="relative z-10 mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 mb-4 shadow-sm">
                                    <i className="fa-solid fa-list-check text-blue-500"></i> TIMELINE VIEW
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Master the big picture</h3>
                                <p className="text-slate-500 max-w-md">Plan long-term initiatives with a drag-and-drop gantt chart that keeps everyone aligned on deadlines.</p>
                            </div>
                            <div className="relative z-10 rounded-tl-xl shadow-2xl border border-slate-200 overflow-hidden bg-white h-full transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:translate-y-2 origin-top-left">
                                <div className="h-6 bg-slate-100 border-b border-slate-200 flex items-center px-2 gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                </div>
                                <img src="https://placehold.co/800x600/ffffff/e2e8f0?text=Gantt+Chart+Timeline" className="w-full h-full object-cover object-left-top" alt="Timeline UI" />
                            </div>
                        </div>

                        <div className="rounded-3xl bg-blue-600 text-white p-8 overflow-hidden relative group">
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500 border border-blue-400 text-xs font-bold text-white mb-4 shadow-sm">
                                    <i className="fa-solid fa-mobile-screen"></i> MOBILE
                                </div>
                                <h3 className="text-xl font-bold mb-2">Work from anywhere</h3>
                                <p className="text-blue-100 text-sm mb-4">Native iOS & Android apps included.</p>
                            </div>
                            <div className="absolute bottom-[-40px] right-[-20px] w-48 rounded-[2rem] shadow-2xl border-[6px] border-slate-900 bg-slate-800 overflow-hidden transform rotate-[-10deg] transition-transform duration-300 group-hover:rotate-0 group-hover:bottom-[-20px]">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 rounded-b-xl z-20"></div>
                                <img src="https://placehold.co/300x600/1e293b/ffffff?text=Mobile+UI" alt="Mobile App" className="w-full h-auto opacity-90" />
                            </div>
                        </div>

                        <div className="rounded-3xl bg-slate-900 text-white p-8 overflow-hidden relative group border border-slate-800">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition"><i className="fa-solid fa-chart-line text-8xl"></i></div>
                            <h3 className="text-xl font-bold mb-2 relative z-10">Deep Insights</h3>
                            <p className="text-slate-400 text-sm relative z-10 mb-6">Real-time velocity tracking & reporting.</p>
                            <div className="mt-auto bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm border border-slate-700 relative z-10 shadow-lg">
                                <div className="flex justify-between items-end h-24 gap-2">
                                    <div className="w-full bg-blue-500/30 rounded-t h-[40%] group-hover:h-[50%] transition-all duration-500"></div>
                                    <div className="w-full bg-blue-500/50 rounded-t h-[70%] group-hover:h-[60%] transition-all duration-500 delay-75"></div>
                                    <div className="w-full bg-blue-500 rounded-t h-[50%] group-hover:h-[80%] transition-all duration-500 delay-100"></div>
                                    <div className="w-full bg-blue-400 rounded-t h-[85%] group-hover:h-[75%] transition-all duration-500 delay-150"></div>
                                    <div className="w-full bg-blue-600 rounded-t h-[60%] group-hover:h-[90%] transition-all duration-500 delay-200"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

export function SoftwareTechSpecs() {
    return (
        <section className="py-20 bg-slate-50 border-y border-slate-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                    <div className="w-full md:w-1/3">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg mb-6 transform rotate-[-2deg] hover:rotate-0 transition duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                    <i className="fa-solid fa-box-open"></i>
                                </div>
                                <div className="font-bold text-slate-900 leading-tight">
                                    TaskFlow<br /><span className="text-xs text-slate-500 font-normal">Enterprise Edition</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-slate-100 rounded"></div>
                                <div className="h-2 w-2/3 bg-slate-100 rounded"></div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Technical Specifications</h3>
                        <p className="text-slate-500 mb-6">Built for scale and security. TaskFlow meets the rigorous demands of modern enterprise environments.</p>
                        <a href="#" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2 group">
                            Download Whitepaper <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition"></i>
                        </a>
                    </div>
                    <div className="w-full md:w-2/3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                            <div>
                                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><i className="fa-brands fa-apple text-slate-400"></i> Platforms</h4>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> macOS 12.0+ (Universal Binary)</li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> Windows 10/11 (64-bit)</li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> iOS 15+ & iPadOS</li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> Android 12+</li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> Web (Chrome, Safari, Firefox, Edge)</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><i className="fa-solid fa-shield-halved text-slate-400"></i> Security</h4>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> SOC 2 Type II Certified</li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> AES-256 Encryption at rest</li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> TLS 1.3 in transit</li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> SAML 2.0 / SSO Support</li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> Role-Based Access Control (RBAC)</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><i className="fa-solid fa-code text-slate-400"></i> API & Data</h4>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> REST API with 99.9% uptime</li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> GraphQL endpoint available</li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> Real-time Webhooks</li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> Daily automated backups</li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> Data export in JSON/CSV</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><i className="fa-solid fa-globe text-slate-400"></i> Localization</h4>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> English (US/UK)</li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> Spanish, French, German</li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> Japanese, Korean</li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> RTL Support (Arabic/Hebrew)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
