import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { X, Loader2, KeyRound, Sparkles, CreditCard, Lock, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function GeneratePromptModal({ isOpen, onClose, onAddPrompt }) {
  const { credits, deductCredit } = useAuth();
  const [apiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (credits <= 0) {
      toast.error("You've run out of credits!");
      setError("Out of credits. Log in for a 10-credit bonus or wait 5 hours!");
      return;
    }

    if (!apiKey || !topic) return;
    
    setLoading(true);
    setError(null);
    const toastId = toast.loading('Engineering your prompt...');

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      const systemInstruction = `You are a prompt engineering expert. The user will provide a topic or category. Generate EXACTLY ONE high-quality AI prompt based on their topic.
The prompt must be structured as JSON matching exactly this format:
{
  "title": "Short action-oriented title",
  "prompt": "The actual prompt text. Must include [PLACEHOLDERS] in brackets. Start with a role (Act as...). End with a specific deliverable. 80-150 words.",
  "tags": ["tag1", "tag2", "tag3"]
}
Do not return markdown formatting blocks (\`\`\`json), return ONLY the raw JSON string.`;

      let result;
      try {
        result = await model.generateContent(`${systemInstruction}\n\nUser Topic: ${topic}`);
      } catch (innerErr) {
        if (innerErr.message?.includes('404')) {
           const backupModel = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
           result = await backupModel.generateContent(`${systemInstruction}\n\nUser Topic: ${topic}`);
        } else {
          throw innerErr;
        }
      }

      const rawText = result.response.text().trim();
      
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const newPrompt = JSON.parse(cleanJson);
      
      if (!newPrompt.title || !newPrompt.prompt || !newPrompt.tags) {
        throw new Error("Invalid format returned by AI.");
      }

      const success = await deductCredit();
      if (!success) throw new Error("Could not deduct credits.");

      onAddPrompt(newPrompt);
      setTopic('');
      toast.success('Prompt generated successfully!', { id: toastId });
      onClose();

    } catch (err) {
      console.error("Gemini Generation Error:", err);
      toast.error(`Generation failed: ${err.message}`, { id: toastId });
      setError(`Error: ${err.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass w-full max-w-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-text-muted hover:text-text-main transition z-10"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row h-[500px]">
          <div className="md:w-1/3 bg-primary/10 p-8 flex flex-col justify-center border-r border-white/5 relative overflow-hidden">
             <div className="absolute top-[-10%] left-[-10%] w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
             <div className="relative z-10">
               <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                 <Sparkles className="text-white" size={24} />
               </div>
               <h3 className="text-xl font-black mb-2 leading-tight">Gemini Pro <span className="text-primary italic">Max</span> Generator</h3>
               <p className="text-xs text-text-muted leading-relaxed">
                 Our proprietary prompt engineering engine leverages Google's latest models.
               </p>
               
               <div className="mt-8 space-y-4">
                 <div className="flex items-center gap-3 text-xs font-bold text-accent uppercase tracking-tighter bg-accent/10 p-3 rounded-xl border border-accent/20">
                   <CreditCard size={14} />
                   <span>{credits} Credits Left</span>
                 </div>
               </div>
             </div>
          </div>

          <div className="md:w-2/3 p-8 relative">

            <div className="h-full flex flex-col">
              <h2 className="text-2xl font-black mb-1">What are we building?</h2>
              <p className="text-sm text-text-muted mb-8 italic">Describe your goal and let Gemini do the hard work.</p>

              <form onSubmit={handleGenerate} className="flex-1 flex flex-col gap-4">
                <div className="flex-1 min-h-0">
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2 ml-1">Topic or Goal</label>
                  <textarea 
                    required
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="e.g., Act as a world-class copywriter and write an ad script for a new sustainable coffee brand..."
                    className="w-full h-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white resize-none shadow-inner"
                  />
                </div>

                {error && (
                  <p className="text-[10px] text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                    {error}
                  </p>
                )}

                <button 
                  type="submit" 
                  disabled={loading || !topic || credits <= 0}
                  className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Engineering Prompt...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate for 1 Credit
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
