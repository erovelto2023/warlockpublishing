import React from 'react';

interface CourseHeroProps {
    headline?: string;
    subheadline?: string;
    ctaText?: string;
}

export function CourseHero({
    headline = "Master UI/UX Design in 30 Days",
    subheadline = "Stop guessing and start designing. Go from beginner to job-ready professional with our comprehensive, project-based curriculum. No prior experience needed.",
    ctaText = "Start Learning Today"
}: CourseHeroProps) {
    return (
        <section className="relative pt-16 pb-24 overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="animate-in slide-in-from-bottom-10 fade-in duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 font-semibold text-sm mb-6 border border-teal-100">
                            <i className="fa-solid fa-star text-yellow-400"></i> Best Seller in Design
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                            {headline}
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            {subheadline}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="#pricing" className="bg-teal-600 hover:bg-teal-700 text-white text-lg px-8 py-4 rounded-lg font-bold text-center transition shadow-lg hover:shadow-glow transform hover:-translate-y-1">
                                {ctaText}
                            </a>
                            <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-lg border-2 border-gray-200 text-gray-700 font-bold hover:border-teal-500 hover:text-teal-600 transition bg-white">
                                <i className="fa-solid fa-play-circle text-xl"></i> Watch Trailer
                            </button>
                        </div>
                        <div className="mt-8 flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                                <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
                                <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white"></div>
                            </div>
                            <p>Joined by 10,000+ students</p>
                        </div>
                    </div>

                    {/* Hero Image/Video Placeholder */}
                    <div className="relative animate-in slide-in-from-bottom-10 fade-in duration-700 delay-200">
                        <div className="absolute -inset-4 bg-teal-200 rounded-2xl blur-2xl opacity-40"></div>
                        <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl aspect-video group cursor-pointer border border-gray-800">
                            {/* Mock Video UI */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition duration-300">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 shadow-lg">
                                    <i className="fa-solid fa-play text-white text-3xl ml-1"></i>
                                </div>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <p className="font-bold text-lg">Course Preview: Introduction to Design Systems</p>
                                <div className="h-1 w-full bg-gray-700 rounded mt-3 overflow-hidden">
                                    <div className="h-full w-1/3 bg-teal-500"></div>
                                </div>
                            </div>
                            {/* Abstract shapes for placeholder */}
                            <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                                <i className="fa-solid fa-laptop-code text-9xl text-gray-700"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
