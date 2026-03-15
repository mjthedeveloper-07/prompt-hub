import { useState } from 'react';
import { Copy, Check, Tags, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function PromptCard({ title, prompt, tags, slug }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success('Prompt copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="glass-card group p-6 rounded-3xl flex flex-col h-full bg-surface/40 hover:bg-surface-hover/60 border border-white/5 hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold text-text-main line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <button
          onClick={copyToClipboard}
          className={`p-2.5 rounded-xl transition-all duration-300 ${
            copied 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-white/5 text-text-muted hover:text-white hover:bg-primary/20 hover:scale-110'
          }`}
          title="Copy to clipboard"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
      
      <p className="text-text-muted text-sm line-clamp-4 mb-6 leading-relaxed flex-grow italic">
        "{prompt}"
      </p>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag) => (
            <span 
              key={tag} 
              className="px-3 py-1 bg-white/5 text-[10px] font-bold text-text-muted rounded-full uppercase tracking-widest border border-white/5"
            >
              #{tag}
            </span>
          ))}
        </div>

        <Link 
          to={`/prompt/${slug}`}
          className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest group/link hover:gap-3 transition-all mt-4"
        >
          View Full Prompt 
          <ExternalLink size={14} className="opacity-50 group-hover/link:opacity-100" />
        </Link>
      </div>
      
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
