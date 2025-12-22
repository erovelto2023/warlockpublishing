import React from 'react';

export function CourseNavbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        <div className="text-2xl font-bold text-teal-700 flex items-center gap-2">
                            <i className="fa-solid fa-layer-group"></i>
                            <span>SkillMastery</span>
                        </div>
                    </div>
                    <div className="hidden md:flex space-x-8 items-center">
                        <a href="#curriculum" className="text-gray-600 hover:text-teal-600 font-medium transition">Curriculum</a>
                        <a href="#instructor" className="text-gray-600 hover:text-teal-600 font-medium transition">Instructor</a>
                        <a href="#testimonials" className="text-gray-600 hover:text-teal-600 font-medium transition">Reviews</a>
                        <a href="#faq" className="text-gray-600 hover:text-teal-600 font-medium transition">FAQ</a>
                        <a href="#pricing" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-full font-semibold transition shadow-lg hover:shadow-glow transform hover:-translate-y-0.5">Enroll Now</a>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export function CourseFooter() {
    return (
        <footer className="bg-white border-t border-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-2xl font-bold text-teal-700 flex items-center gap-2">
                    <i className="fa-solid fa-layer-group"></i>
                    <span>SkillMastery</span>
                </div>
                <div className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} SkillMastery Inc. All rights reserved.
                </div>
                <div className="flex gap-6">
                    <a href="#" className="text-gray-400 hover:text-teal-600"><i className="fa-brands fa-twitter text-xl"></i></a>
                    <a href="#" className="text-gray-400 hover:text-teal-600"><i className="fa-brands fa-instagram text-xl"></i></a>
                    <a href="#" className="text-gray-400 hover:text-teal-600"><i className="fa-brands fa-youtube text-xl"></i></a>
                </div>
            </div>
        </footer>
    );
}
