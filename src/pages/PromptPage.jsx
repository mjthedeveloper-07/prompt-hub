import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { Copy, Check, Tags, ArrowLeft, Sparkles, Share2, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AdBanner from '../components/AdBanner';

export default function PromptPage({ promptsData }) {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);

  let promptObj = null;
  let categoryId = null;

  for (const cat in promptsData) {
    const found = promptsData[cat].find(p => p.slug === slug);
    if (found) {
      promptObj = found;
      categoryId = cat;
      break;
    }
  }

  const relatedPrompts = categoryId
    ? (promptsData[categoryId]
        ?.filter(p => p.slug !== slug)
        .slice(0, 3) || [])
    : [];

  if (!promptObj) return <Navigate to="/" replace />;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(promptObj.prompt);
    setCopied(true);
    toast.success('Template copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `The Best AI Prompt for: ${promptObj.title}`,
    "articleSection": categoryId.replace('_', ' '),
    "keywords": promptObj.tags.join(", ")
  };

  return (
    <>
      <SEO 
        title={`${promptObj.title} - Free ChatGPT Prompt Template | PromptHub`}
        description={`Copy this optimized AI prompt for ${promptObj.title}. Find the best templates for ${categoryId.replace('_', ' ')} inside PromptHub.`}
        keywords={`${promptObj.tags.join(', ')}, chatgpt prompt template, free AI prompt, ${categoryId} AI prompt`}
        url={`https://prompthub.ai/prompt/${slug}`}
        schema={schema}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto py-8"
      >
        <header className="mb-12">
          <Link 
            to={`/category/${categoryId}`} 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all mb-8 bg-white/5 px-4 py-2 rounded-full border border-white/5"
          >
            <ArrowLeft size={14} /> {categoryId.replace('_', ' ')}
          </Link>
          
          <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-[0.9] tracking-tighter">
            {promptObj.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {promptObj.tags.map((tag, i) => (
                <span key={i} className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary-hover border border-primary/20 uppercase tracking-tighter">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-4">
               <button className="text-text-muted hover:text-white transition-colors" title="Save for later"><Bookmark size={18} /></button>
               <button className="text-text-muted hover:text-white transition-colors" title="Share prompt"><Share2 size={18} /></button>
            </div>
          </div>
        </header>

        {/* The Main Template Area - UI Pro Max */}
        <div className="relative mb-20">
           <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl rounded-[2.5rem] -z-10" />
           <div className="glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
              <div className="bg-white/5 px-8 py-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                   </div>
                   <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-2 flex items-center gap-1.5">
                     <Sparkles size={12} className="text-primary" /> pro-engineered-template.json
                   </span>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className={`px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 active:scale-95 shadow-xl ${
                    copied ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-primary hover:bg-primary-hover text-white shadow-primary/30'
                  }`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied Successfully!' : 'Copy Template'}
                </button>
              </div>

              <div className="p-10">
                <div className="bg-black/40 rounded-3xl p-8 border border-white/5 relative group">
                  <p className="text-text-main text-xl leading-relaxed whitespace-pre-wrap font-mono tracking-tight">
                    {promptObj.prompt.split(/(\[.*?\])/g).map((part, i) => {
                      if (part.startsWith('[') && part.endsWith(']')) {
                        return (
                          <motion.span 
                            key={i} 
                            whileHover={{ scale: 1.05 }}
                            className="text-primary font-black bg-primary/10 px-1.5 py-0.5 rounded-md border border-primary/20 cursor-help inline-block mx-0.5"
                            title="Replace this with your context"
                          >
                            {part}
                          </motion.span>
                        );
                      }
                      return part;
                    })}
                  </p>
                </div>
                
                <div className="mt-10 flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/5">
                   <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 border border-accent/20">
                      <Sparkles className="text-accent" size={20} />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold mb-1">Implementation Guidelines</h4>
                      <p className="text-xs text-text-muted leading-relaxed">
                        To get the most out of this prompt, copy it and replace the <span className="text-white font-bold">bracketed placeholders</span> with specific details from your project. This prompt is optimized for context-aware responses in Gemini 1.5 Pro and GPT-4.
                      </p>
                   </div>
                </div>
              </div>
           </div>
        </div>

        <AdBanner slot="prompt_details_bottom" className="mb-20" />

        {/* Related Section Pro Max */}
        {relatedPrompts.length > 0 && (
          <section className="mt-32">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-3xl font-black tracking-tighter">Extend your flow</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPrompts.map(p => (
                <Link key={p.slug} to={`/prompt/${p.slug}`} className="glass-card p-8 rounded-[2rem] group h-full block">
                   <h4 className="text-lg font-black text-text-main mb-3 leading-tight group-hover:text-primary transition-colors">{p.title}</h4>
                   <p className="text-xs text-text-muted line-clamp-3 leading-relaxed mb-6">{p.prompt}</p>
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest mt-auto">
                      View details <ArrowLeft size={12} className="rotate-180" />
                   </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </motion.div>
    </>
  );
}
