import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Instagram, Copy, Check, Loader2, ArrowLeft, Send, Zap, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default function BioStar() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedBios, setGeneratedBios] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { user, credits, deductCredit, isAdmin } = useAuth();

  const handleGenerate = async () => {
    if (!isAdmin && credits <= 0) {
      toast.error('Out of credits! Sign in for bonus or wait 5 hours.');
      return;
    }

    if (text.length < 5) {
      toast.error('Please enter at least 5 characters.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Brewing viral bios...');

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      const prompt = `Generate 5 viral, creative, and professional Instagram bios based on this personality/description: "${text}". 
      Each bio should:
      1. Be under 150 characters.
      2. Include 2-3 relevant emojis.
      3. Use modern, engaging language.
      4. Focus on different vibes (Professional, Creative, Minimalist, Witty, Aesthetic).
      
      Return ONLY the bios separated by double newlines. No numbers, no extra text.`;

      let result;
      try {
        result = await model.generateContent(prompt);
      } catch (innerErr) {
        if (innerErr.message?.includes('404')) {
           const backupModel = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
           result = await backupModel.generateContent(prompt);
        } else {
          throw innerErr;
        }
      }

      const output = result.response.text().trim();
      
      if (!output) throw new Error("Empty response from AI");

      const bios = output.split('\n\n').filter(b => b.trim().length > 0).slice(0, 5);
      
      if (bios.length === 0) throw new Error("No bios were parsed");

      setGeneratedBios(bios);
      
      const success = await deductCredit();
      if (success) {
        toast.success('Bio generated! 1 credit used.', { id: toastId });
      } else {
        toast.dismiss(toastId);
      }
    } catch (error) {
      console.error("BioStar Error:", error);
      toast.error('Generation failed. Please check your connection or API key.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (bio, index) => {
    navigator.clipboard.writeText(bio);
    setCopiedIndex(index);
    toast.success('Bio copied!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      <SEO 
        title="BioStar | Viral Instagram Bio Generator"
        description="Generate high-converting, viral Instagram bios in seconds using AI. Perfect for influencers, businesses, and creators."
      />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto py-8"
      >
        <header className="mb-16 text-center relative">
          <Link to="/" className="absolute top-0 left-0 hover:text-primary transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted">
            <ArrowLeft size={16} /> Library
          </Link>
          
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 mx-auto rounded-3xl bg-primary/20 flex items-center justify-center text-primary mb-8 border border-primary/20 shadow-2xl shadow-primary/20"
          >
            <Instagram size={40} />
          </motion.div>
          <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tighter gradient-heading">
            BioStar <span className="text-white italic">AI</span>
          </h1>
          <p className="text-text-muted text-lg max-w-xl mx-auto font-medium">
            Turn your description into viral <strong>Instagram</strong> bios. Optimized for engagement and aesthetics.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Panel */}
          <div className="lg:col-span-5 glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isAdmin ? 'bg-accent/20 border-accent/20 text-accent' : 'bg-primary/20 border-primary/20 text-primary'}`}>
                  {isAdmin ? 'Admin: ∞ Credits' : `${credits} Credits`}
                </div>
             </div>

             <div className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 flex items-center gap-2">
                      <Zap size={14} className="text-accent" /> Who are you? (Max 100 chars)
                   </label>
                   <textarea 
                      value={text}
                      onChange={(e) => setText(e.target.value.slice(0, 100))}
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner resize-none font-medium"
                      placeholder="e.g. Travel photographer based in Bali. Creative, minimalist, loves coffee."
                   />
                   <div className="flex justify-end pr-2">
                      <span className={`text-[10px] font-bold ${text.length > 90 ? 'text-red-400' : 'text-text-muted'}`}>
                        {text.length}/100
                      </span>
                   </div>
                </div>

                <button 
                   onClick={handleGenerate}
                   disabled={loading || text.length < 5}
                   className="w-full py-5 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:grayscale text-white rounded-2xl font-black shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                >
                   {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                   {loading ? 'Generating...' : 'Generate Bios'}
                </button>

                <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
                   <div className="flex items-center gap-3 text-text-muted text-[10px] font-medium leading-relaxed">
                      <Shield size={12} className="text-accent shrink-0" />
                      <span>1 generation uses 1 session credit. Admins have unlimited access.</span>
                   </div>
                   {!user && (
                     <p className="text-[10px] text-primary/60 font-bold flex items-center gap-1">
                       <Zap size={10} /> Sign in to get 20 credits and infinite reset bonus!
                     </p>
                   )}
                </div>
             </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 space-y-4">
             <AnimatePresence mode="popLayout">
                {generatedBios.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-[400px] border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12"
                  >
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                       <Zap className="text-text-muted/20" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-text-muted/40 italic">Generated bios will appear here...</h3>
                  </motion.div>
                ) : (
                  generatedBios.map((bio, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card p-6 rounded-[2rem] border border-white/5 group relative hover:border-primary/20 transition-all flex items-center gap-6"
                    >
                      <div className="flex-1">
                        <p className="text-lg font-medium leading-relaxed mb-1 pr-12">{bio}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Option {i + 1}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleCopy(bio, i)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
                          copiedIndex === i ? 'bg-green-500 text-white' : 'bg-white/5 text-text-muted hover:bg-primary hover:text-white'
                        }`}
                      >
                        {copiedIndex === i ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                    </motion.div>
                  ))
                )}
             </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
}
