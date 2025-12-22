import React from 'react';
import { Zap, Users, Globe, Shield } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 font-sans selection:bg-cyan-500 selection:text-white pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                        About <span className="text-cyan-400">Warlock Publishing</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        We are a digital-first publishing house dedicated to empowering creators, worldbuilders, and storytellers with the tools they need to succeed.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                        <p className="text-lg leading-relaxed mb-6">
                            At Warlock Publishing, we believe that creativity should be boundless. Our mission is to provide high-quality digital assets, educational resources, and software tools that bridge the gap between imagination and reality.
                        </p>
                        <p className="text-lg leading-relaxed">
                            Whether you are an author, a game designer, or a digital artist, we strive to be the catalyst for your next masterpiece.
                        </p>
                    </div>
                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                        <h2 className="text-2xl font-bold text-white mb-4">Our Values</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Zap className="w-6 h-6 text-cyan-400 mt-1 shrink-0" />
                                <div>
                                    <strong className="text-white block">Innovation</strong>
                                    <span className="text-sm">Constantly pushing the boundaries of what digital products can be.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Users className="w-6 h-6 text-purple-400 mt-1 shrink-0" />
                                <div>
                                    <strong className="text-white block">Community</strong>
                                    <span className="text-sm">Building a supportive network of creators and dreamers.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Shield className="w-6 h-6 text-pink-400 mt-1 shrink-0" />
                                <div>
                                    <strong className="text-white block">Integrity</strong>
                                    <span className="text-sm">Delivering quality, verified content you can trust.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-8">Join Our Journey</h2>
                    <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                        We are just getting started. Explore our library and see what Warlock Publishing can do for you.
                    </p>
                </div>
            </div>
        </div>
    );
}
