'use client';

import { motion } from 'framer-motion';
import { BookOpen, PenTool, Sparkles, GraduationCap, Briefcase, Globe, Sword, ArrowRight, Zap, Users } from 'lucide-react';

const values = [
  { letter: 'W', word: 'Writing', icon: <PenTool className="w-5 h-5" />, desc: 'Turn scattered ideas into clear, compelling content that captures attention, establishes authority, and drives measurable engagement.' },
  { letter: 'A', word: 'Affiliate', icon: <Users className="w-5 h-5" />, desc: 'Turn your influence into scalable income by strategically selecting, promoting, and optimizing high-value assets and partnerships.' },
  { letter: 'R', word: 'Research', icon: <BookOpen className="w-5 h-5" />, desc: 'Validate demand, decode audience behavior, and ground every campaign in data that builds trust and eliminates guesswork.' },
  { letter: 'L', word: 'Learning', icon: <GraduationCap className="w-5 h-5" />, desc: 'Continuously adapt to platform shifts, emerging tools, and real-time feedback so your strategies stay sharp and scalable.' },
  { letter: 'O', word: 'Original', icon: <Sparkles className="w-5 h-5" />, desc: 'Differentiate your brand by developing a unique voice, fresh angles, and distinctive assets that cut through digital noise.' },
  { letter: 'C', word: 'Creativity', icon: <Zap className="w-5 h-5" />, desc: 'Transform insights into high-converting formats—courses, templates, funnels, and media—that resonate, sell, and scale.' },
  { letter: 'K', word: 'Knowledge', icon: <Globe className="w-5 h-5" />, desc: 'Structure your expertise into monetizable digital products and repeatable systems that deliver real results while building long-term equity.' },
];

export default function BrandValues() {
  return (
    <section className="py-24 relative overflow-hidden bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-secondary uppercase tracking-[0.4em] mb-4">Our Vision</h2>
          <h3 className="text-4xl lg:text-6xl font-serif text-white">The W.A.R.L.O.C.K. <span className="text-secondary italic">Standard</span></h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.letter}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-secondary/30 transition-all cursor-default"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-black transition-all duration-500">
                  <span className="text-2xl font-serif font-bold">{v.letter}</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-secondary transition-colors">{v.word}</h4>
                </div>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed group-hover:text-neutral-300 transition-colors">
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
