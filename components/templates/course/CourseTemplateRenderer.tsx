import React from 'react';
import {
    CourseNavbar,
    CourseHero,
    CourseCurriculum,
    CoursePricing,
    CourseFooter
} from './index';

interface CourseTemplateRendererProps {
    contentData: any;
}

export function CourseTemplateRenderer({ contentData }: CourseTemplateRendererProps) {
    const blocks = contentData?.blocks || [];

    // Helper to get block data
    const getBlockData = (id: string) => {
        const block = blocks.find((b: any) => b.id === id);
        return block?.enabled ? block.data : null;
    };

    // Helper to check if block is enabled
    const isEnabled = (id: string) => {
        // Default to true if no blocks defined (legacy/fallback)
        if (!blocks.length) return true;

        const block = blocks.find((b: any) => b.id === id);
        return block?.enabled;
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-700 antialiased selection:bg-teal-100 selection:text-teal-700">
            {/* Font Awesome CDN */}
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />

            {isEnabled('navbar') && <CourseNavbar />}

            {isEnabled('hero') && (
                <CourseHero {...getBlockData('hero')} />
            )}

            {/* Hardcoded sections for now, can be made dynamic later */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Does this sound like you?</h2>
                        <p className="text-lg text-gray-600">Many aspiring designers hit the same walls. We built this course to break them down.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-red-50 p-8 rounded-2xl border border-red-100 text-center">
                            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 text-2xl">
                                <i className="fa-solid fa-ban"></i>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Feeling Stuck</h3>
                            <p className="text-gray-600 text-sm">You watch endless YouTube tutorials but struggle to start a real project from scratch.</p>
                        </div>
                        <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100 text-center">
                            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500 text-2xl">
                                <i className="fa-solid fa-puzzle-piece"></i>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Imposter Syndrome</h3>
                            <p className="text-gray-600 text-sm">You know the tools (Figma, Sketch) but lack the confidence in design principles.</p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center">
                            <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600 text-2xl">
                                <i className="fa-solid fa-briefcase"></i>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">No Portfolio</h3>
                            <p className="text-gray-600 text-sm">You need a job, but you don't have the case studies or portfolio to prove your skills.</p>
                        </div>
                    </div>
                </div>
            </section>

            {isEnabled('curriculum') && <CourseCurriculum />}

            {isEnabled('pricing') && <CoursePricing />}

            {isEnabled('footer') && <CourseFooter />}
        </div>
    );
}
