import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { ArrowRight, FileText, Search, Zap, Sparkles, TrendingUp, ShieldCheck, Cpu, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage({ categories }) {
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PromptHub",
    "url": "https://prompthub.ai"
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <>
      <SEO schema={schemaOrg} />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto py-12 px-4"
      >
        {/* --- HERO SECTION --- */}
        <section className="relative mb-24 text-center">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-hover text-xs font-bold uppercase tracking-widest mb-8">
            <Zap size={14} className="fill-primary" /> Multi-Model Architecture Powered by Gemini
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-white">
            Master the Art of <br/>
            <span className="gradient-heading">Prompting.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
            Elevate your AI interactions with high-precision ChatGPT templates. Engineered for maximum performance in <span className="text-white font-semibold">Business, SEO, and Design</span>.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/category/business" className="group px-10 py-5 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 active:scale-95">
              Explore Library <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/resume-builder" className="px-10 py-5 glass hover:bg-white/5 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-3 active:scale-95 border border-white/10">
              <FileText size={22} className="text-accent" /> Build Smart Resume
            </Link>
          </motion.div>
        </section>

        {/* --- BENTO FEATURE GRID --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
           <motion.div variants={itemVariants} className="md:col-span-2 glass p-10 rounded-[2.5rem] border border-white/5 flex flex-col justify-end min-h-[350px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 border border-accent/20">
                  <Cpu className="text-accent" size={28} />
                </div>
                <h2 className="text-4xl font-black mb-4 leading-tight">Programmatic <br/> Prompt Engineering</h2>
                <p className="text-text-muted max-w-md">Our library uses structured templates with [placeholders] to ensure consistent, high-quality AI outputs every single time.</p>
              </div>
           </motion.div>

           <motion.div variants={itemVariants} className="glass p-10 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-primary/20 to-transparent flex flex-col justify-center text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                <ShieldCheck className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-black mb-2">Verified Output</h3>
              <p className="text-sm text-text-muted">Every prompt is battle-tested against Gemini 1.5 Pro and GPT-4o for accuracy.</p>
           </motion.div>
        </section>

        {/* --- CATEGORIES BENTO --- */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-black tracking-tighter flex items-center gap-3">
              <TrendingUp className="text-primary" /> Popular Flows
            </h2>
            <Link to="/category/business" className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((cat, idx) => {
              if (cat.id === 'generated') return null;
              return (
                <motion.div key={cat.id} variants={itemVariants}>
                  <Link to={`/category/${cat.id}`} className="glass-card p-8 rounded-[2rem] block h-full">
                    <div className="text-5xl mb-6 grayscale group-hover:grayscale-0 transition-all drop-shadow-lg">{cat.icon}</div>
                    <h3 className="text-xl font-black mb-1 capitalize tracking-tight">{cat.label}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{cat.count} Units</span>
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                        <ArrowRight size={12} className="text-text-muted" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <motion.section variants={itemVariants} className="glass p-16 rounded-[3rem] border border-primary/20 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
          <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tighter">Ready to Build the Future?</h2>
          <p className="text-text-muted mb-10 max-w-xl mx-auto">Join thousands of creators using PromptHub to automate their creative and technical workflows.</p>
          <button 
            onClick={() => window.scrollTo(0,0)} 
            className="px-12 py-4 bg-white text-black hover:bg-primary hover:text-white rounded-2xl font-black transition-all shadow-2xl active:scale-95 flex items-center gap-3 mx-auto"
          >
            Get Started Free <Sparkles size={18} />
          </button>
        </motion.section>

      </motion.div>
    </>
  );
}
