import React from 'react';

export function SoftwarePricing() {
    return (
        <section id="pricing" className="py-20 md:py-32 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase mb-2">Pricing</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing.</h3>
                    <p className="text-lg text-slate-500">No hidden fees. Cancel anytime. Start with a 14-day free trial.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 transition shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-2">Starter</h4>
                        <p className="text-slate-500 text-sm mb-6">Perfect for freelancers & small teams.</p>
                        <div className="flex items-baseline mb-6">
                            <span className="text-4xl font-extrabold text-slate-900">$0</span>
                            <span className="text-slate-500 ml-2">/month</span>
                        </div>
                        <a href="#" className="block w-full py-3 px-4 bg-blue-50 text-blue-700 font-bold text-center rounded-lg hover:bg-blue-100 transition">Get Started</a>
                        <ul className="mt-8 space-y-4 text-sm text-slate-600">
                            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-blue-600"></i> Up to 3 projects</li>
                            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-blue-600"></i> Basic Analytics</li>
                            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-blue-600"></i> 1 Team Member</li>
                            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-blue-600"></i> Community Support</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border-2 border-blue-600 relative shadow-xl scale-105 z-10">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">Pro</h4>
                        <p className="text-slate-500 text-sm mb-6">For growing teams that need more.</p>
                        <div className="flex items-baseline mb-6">
                            <span className="text-4xl font-extrabold text-slate-900">$29</span>
                            <span className="text-slate-500 ml-2">/month</span>
                        </div>
                        <a href="#" className="block w-full py-3 px-4 bg-blue-600 text-white font-bold text-center rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">Start Free Trial</a>
                        <ul className="mt-8 space-y-4 text-sm text-slate-600">
                            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-blue-600"></i> Unlimited Projects</li>
                            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-blue-600"></i> Advanced Analytics</li>
                            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-blue-600"></i> Up to 10 Team Members</li>
                            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-blue-600"></i> Priority Support</li>
                            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-blue-600"></i> Slack Integration</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 transition shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h4>
                        <p className="text-slate-500 text-sm mb-6">For large scale organizations.</p>
                        <div className="flex items-baseline mb-6">
                            <span className="text-4xl font-extrabold text-slate-900">$99</span>
                            <span className="text-slate-500 ml-2">/month</span>
                        </div>
                        <a href="#" className="block w-full py-3 px-4 bg-white border border-slate-300 text-slate-700 font-bold text-center rounded-lg hover:bg-slate-50 transition">Contact Sales</a>
                        <ul className="mt-8 space-y-4 text-sm text-slate-600">
                            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-blue-600"></i> Unlimited Everything</li>
                            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-blue-600"></i> Custom Reporting</li>
                            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-blue-600"></i> Dedicated Account Manager</li>
                            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-blue-600"></i> SSO & Advanced Security</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function SoftwareTestimonials() {
    return (
        <section id="testimonials" className="py-20 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">Loved by developers and managers</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition duration-300">
                        <div className="flex items-center gap-1 text-yellow-400 mb-6">
                            <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                        </div>
                        <p className="text-slate-700 mb-6 italic text-lg">"TaskFlow has completely transformed how our engineering team operates. The integration with GitHub is a game-changer."</p>
                        <div className="flex items-center gap-4">
                            <img src="https://placehold.co/48/334155/ffffff?text=SJ" className="rounded-full w-12 h-12 border-2 border-white shadow-sm" alt="Sarah J." />
                            <div>
                                <div className="font-bold text-slate-900">Sarah Jenkins</div>
                                <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">CTO at TechStart</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition duration-300">
                        <div className="flex items-center gap-1 text-yellow-400 mb-6">
                            <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                        </div>
                        <p className="text-slate-700 mb-6 italic text-lg">"Simple enough for our marketing team, powerful enough for our devs. The perfect balance of usability and functionality."</p>
                        <div className="flex items-center gap-4">
                            <img src="https://placehold.co/48/334155/ffffff?text=MR" className="rounded-full w-12 h-12 border-2 border-white shadow-sm" alt="Mike R." />
                            <div>
                                <div className="font-bold text-slate-900">Mike Ross</div>
                                <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Product Manager</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition duration-300">
                        <div className="flex items-center gap-1 text-yellow-400 mb-6">
                            <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star-half-stroke"></i>
                        </div>
                        <p className="text-slate-700 mb-6 italic text-lg">"The support team is incredible. They helped us migrate our data from Trello in less than an hour. Highly recommended!"</p>
                        <div className="flex items-center gap-4">
                            <img src="https://placehold.co/48/334155/ffffff?text=EL" className="rounded-full w-12 h-12 border-2 border-white shadow-sm" alt="Emily L." />
                            <div>
                                <div className="font-bold text-slate-900">Emily Liu</div>
                                <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Operations Lead</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
