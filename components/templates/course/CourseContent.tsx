"use client";

import React, { useState } from 'react';

export function CourseCurriculum() {
    const [openModule, setOpenModule] = useState<string | null>(null);

    const toggleModule = (id: string) => {
        setOpenModule(openModule === id ? null : id);
    };

    const modules = [
        {
            id: 'mod1',
            num: '01',
            title: 'Foundations of Design',
            lessons: [
                'Intro to Typography & Color Theory',
                'Layouts, Grids, and Spacing',
                'Visual Hierarchy Masterclass'
            ]
        },
        {
            id: 'mod2',
            num: '02',
            title: 'Mastering Figma',
            lessons: [
                'Figma Interface & Tools',
                'Auto-Layout & Components',
                'Prototyping & Micro-interactions'
            ]
        },
        {
            id: 'mod3',
            num: '03',
            title: 'UX Research & Strategy',
            lessons: [
                'User Personas & Journey Maps',
                'Information Architecture',
                'Usability Testing Methods'
            ]
        }
    ];

    return (
        <section id="curriculum" className="py-24 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <span className="text-teal-600 font-bold tracking-wider uppercase text-sm">Course Content</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">What you'll learn in 8 weeks</h2>
                </div>

                <div className="space-y-4">
                    {modules.map((mod) => (
                        <div key={mod.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <button
                                className="w-full px-6 py-5 flex justify-between items-center bg-white hover:bg-gray-50 transition text-left"
                                onClick={() => toggleModule(mod.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">{mod.num}</span>
                                    <span className="font-bold text-gray-800 text-lg">{mod.title}</span>
                                </div>
                                <i className={`fa-solid fa-chevron-down text-gray-400 transition-transform ${openModule === mod.id ? 'rotate-180' : ''}`}></i>
                            </button>
                            <div
                                className={`bg-gray-50 transition-all duration-300 overflow-hidden ${openModule === mod.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <ul className="px-6 py-4 space-y-3 text-gray-600 border-t border-gray-100">
                                    {mod.lessons.map((lesson, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <i className="fa-regular fa-circle-play text-teal-500"></i> {lesson}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <a href="#" className="text-teal-600 font-semibold hover:text-teal-700 flex items-center justify-center gap-2">
                        View full curriculum <i className="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </section>
    );
}

export function CoursePricing() {
    return (
        <section id="pricing" className="py-24 bg-teal-900 text-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
                    <p className="text-teal-100">Invest in your career today. 30-day money-back guarantee.</p>
                </div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                    {/* Basic Plan */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition">
                        <h3 className="text-2xl font-bold mb-2">Self-Paced</h3>
                        <p className="text-gray-300 mb-6">For the independent learner.</p>
                        <div className="text-4xl font-bold mb-6">$197</div>
                        <a href="#" className="block w-full py-3 rounded-lg border border-white text-center font-bold hover:bg-white hover:text-teal-900 transition mb-8">Select Plan</a>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex gap-3"><i className="fa-solid fa-check text-teal-400"></i> Full Course Access</li>
                            <li className="flex gap-3"><i className="fa-solid fa-check text-teal-400"></i> 40+ Hours of Video</li>
                            <li className="flex gap-3"><i className="fa-solid fa-check text-teal-400"></i> Project Files Included</li>
                            <li className="flex gap-3"><i className="fa-solid fa-xmark text-gray-500"></i> No Mentorship</li>
                        </ul>
                    </div>

                    {/* Pro Plan (Highlight) */}
                    <div className="bg-white text-gray-900 rounded-2xl p-8 transform md:scale-105 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">MOST POPULAR</div>
                        <h3 className="text-2xl font-bold mb-2">Mentorship</h3>
                        <p className="text-gray-500 mb-6">Feedback to help you grow faster.</p>
                        <div className="flex items-end gap-2 mb-6">
                            <span className="text-5xl font-extrabold text-teal-900">$297</span>
                            <span className="text-gray-400 line-through mb-1 text-lg">$597</span>
                        </div>
                        <a href="#" className="block w-full py-4 rounded-lg bg-teal-600 text-white text-center font-bold hover:bg-teal-700 shadow-lg hover:shadow-teal-500/30 transition mb-8">
                            Enroll Now
                        </a>
                        <p className="text-xs text-center text-gray-500 mb-6">Only 5 spots left at this price!</p>
                        <ul className="space-y-4 text-sm font-medium">
                            <li className="flex gap-3"><i className="fa-solid fa-check text-teal-600"></i> <strong>Everything in Basic</strong></li>
                            <li className="flex gap-3"><i className="fa-solid fa-check text-teal-600"></i> Weekly Group Coaching Calls</li>
                            <li className="flex gap-3"><i className="fa-solid fa-check text-teal-600"></i> Personal Portfolio Review</li>
                            <li className="flex gap-3"><i className="fa-solid fa-check text-teal-600"></i> Certificate of Completion</li>
                            <li className="flex gap-3"><i className="fa-solid fa-check text-teal-600"></i> Private Discord Community</li>
                        </ul>
                    </div>
                </div>

                {/* Guarantee */}
                <div className="mt-16 text-center max-w-2xl mx-auto bg-white/5 rounded-xl p-6 border border-white/10">
                    <i className="fa-solid fa-shield-halved text-3xl text-teal-300 mb-4"></i>
                    <h4 className="text-xl font-bold mb-2">30-Day Money-Back Guarantee</h4>
                    <p className="text-gray-300 text-sm">If you're not satisfied with the course for any reason, email us within 30 days and we'll refund every penny. No questions asked.</p>
                </div>
            </div>
        </section>
    );
}
