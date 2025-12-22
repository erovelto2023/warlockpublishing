import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 font-sans selection:bg-cyan-500 selection:text-white pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                        Careers at <span className="text-purple-400">Warlock</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Join a team of passionate creators building the future of digital publishing.
                    </p>
                </div>

                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-12 text-center mb-12">
                    <Briefcase className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-4">No Open Positions Currently</h2>
                    <p className="text-lg text-slate-400 mb-8 max-w-lg mx-auto">
                        We don't have any active job openings at the moment, but we are always looking for talented individuals to join our network.
                    </p>
                    <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-slate-900 rounded-full font-bold hover:bg-cyan-400 transition-colors">
                        Contact Us <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">Remote First</h3>
                        <p className="text-sm text-slate-400">Work from anywhere in the world. We value output over hours.</p>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">Creative Freedom</h3>
                        <p className="text-sm text-slate-400">We encourage experimentation and new ideas.</p>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">Competitive Pay</h3>
                        <p className="text-sm text-slate-400">We believe in fair compensation for top talent.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
