import { useState } from 'react';
import SEO from '../components/SEO';
import { Copy, Check, ChevronRight, FileText, User, Briefcase, Award, Sparkles, ArrowLeft, TrendingUp, CreditCard, Zap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default function ResumeBuilder() {
  const { credits, deductCredit, isAdmin } = useAuth();
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    experience: '',
    skills: ''
  });
  const [optimizedResume, setOptimizedResume] = useState('');

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PromptHub AI Resume Builder",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  const generatedResume = `
# ${formData.name || '[Your Name]'}
**${formData.role || '[Target Role]'}**

## Professional Experience
${formData.experience || 'Enter your experience details to see them formatted here.'}

## Technical & Soft Skills
${formData.skills || 'Enter your skills to see them formatted here.'}

*This is an AI-optimized markdown format designed to parse cleanly in ATS systems.*
  `.trim();

  const handleOptimize = async () => {
    if (!isAdmin && credits <= 0) {
      toast.error('Out of credits! Sign in or wait 5 hours.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('AI is optimizing your resume...');

    const prompt = `Optimize the following resume details for ATS (Applicant Tracking Systems) and professional impact. 
      Target Role: ${formData.role}
      Experience: ${formData.experience}
      Skills: ${formData.skills}
      
      Return the optimized version in clean Markdown format. Include a strong professional summary, and bullet points with action verbs for experience.
      Format:
      # ${formData.name}
      **${formData.role}**
      
      ## Professional Summary
      [Write a 2-3 sentence high-impact summary here]
      
      ## Technical Skills
      [Formatted skills list]
      
      ## Professional Experience
      [Formatted experience with action verbs]`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      if (!text) throw new Error("Empty response from AI");

      setOptimizedResume(text);
      
      const success = await deductCredit();
      if (success) {
        toast.success('Resume optimized! 1 credit used.', { id: toastId });
        setStep(3);
      } else {
        toast.dismiss(toastId);
      }
    } catch (error) {
      console.error("Gemini Error:", error);
      // Fallback model if flash fails
      if (error.message?.includes('404')) {
        try {
           const backupModel = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
           const result = await backupModel.generateContent(prompt);
           setOptimizedResume(result.response.text());
           setStep(3);
           return;
        } catch (inner) {
           console.error("Pro Fallback Failed:", inner);
        }
      }
      toast.error('Optimization failed. Using basic format instead.', { id: toastId });
      setOptimizedResume(generatedResume);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedResume || generatedResume);
    setCopied(true);
    toast.success('Resume copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { title: "Personal Info", icon: <User size={18} /> },
    { title: "Experience & Skills", icon: <Briefcase size={18} /> },
    { title: "Preview & Export", icon: <Award size={18} /> }
  ];

  return (
    <>
      <SEO 
        title="Free AI Resume Builder (No Signup) | PromptHub"
        description="Build an ATS-friendly resume in seconds using our free online AI Resume Builder. Enter your details and copy the markdown format instantly."
        keywords="free resume builder, AI resume maker, chatgpt resume, ats friendly resume builder, no signup resume tool"
        url="https://prompthub.ai/resume-builder"
        schema={schema}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto py-8 px-4"
      >
        <header className="mb-16 text-center">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 mx-auto rounded-3xl bg-primary/20 flex items-center justify-center text-primary mb-8 border border-primary/20 shadow-2xl shadow-primary/20"
          >
            <FileText size={40} />
          </motion.div>
          <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tighter gradient-heading leading-[0.9]">
            AI Resume Builder
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto font-medium">
            Create a perfectly formatted, ATS-friendly markdown resume in 3 simple steps. <span className="text-white">Absolutely free, forever.</span>
          </p>
        </header>

        <div className="glass rounded-[3rem] p-1 shadow-2xl border border-white/10 mb-24 overflow-hidden">
          <div className="bg-surface/50 rounded-[2.8rem] overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
            
            {/* Sidebar / Progress */}
            <div className="lg:w-1/3 p-10 bg-primary/5 border-b lg:border-b-0 lg:border-r border-white/5 relative flex flex-col">
              <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
              
              <div className="relative z-10 space-y-8 flex-1">
                {steps.map((s, i) => {
                  const num = i + 1;
                  const isActive = step === num;
                  const isDone = step > num;
                  return (
                    <div key={i} className={`flex items-center gap-4 transition-all duration-500 ${isActive ? 'scale-105 origin-left' : 'opacity-50'}`}>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                        isActive ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 
                        isDone ? 'bg-accent/20 border-accent/20 text-accent' : 'bg-transparent border-white/10 text-white'
                      }`}>
                        {isDone ? <Check size={20} /> : s.icon}
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Step {num}</span>
                        <h4 className="font-black text-lg tracking-tight">{s.title}</h4>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="relative z-10 p-6 bg-white/5 rounded-2xl border border-white/5 mt-auto">
                 <div className="flex items-center gap-2 text-accent mb-2">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">ATS Optimizer v2.0</span>
                 </div>
                 <p className="text-[10px] text-text-muted leading-relaxed font-medium">Your data is processed locally. We never store personal info on our servers.</p>
              </div>
            </div>

            {/* Main Section */}
            <div className="lg:w-2/3 flex flex-col relative">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-10 flex-1 flex flex-col"
                >
                  {/* Credit Display */}
                  <div className="absolute top-6 right-10 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{credits} Credits</span>
                  </div>

                  {step === 1 && (
                    <div className="space-y-8 max-w-lg">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Full Name</label>
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
                            placeholder="Jane Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Target Job Title</label>
                          <input 
                            type="text" 
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
                            placeholder="Senior AI Engineer"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => setStep(2)}
                        disabled={!formData.name || !formData.role}
                        className="w-full py-5 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:grayscale text-white rounded-2xl font-black shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest"
                      >
                        Next Chapter <ChevronRight size={18} />
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-8 flex-1 flex flex-col">
                      <div className="space-y-6 flex-1 flex flex-col">
                        <div className="space-y-2 flex-1 flex flex-col">
                          <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Work Experience Highlights</label>
                          <textarea 
                            value={formData.experience}
                            onChange={e => setFormData({...formData, experience: e.target.value})}
                            className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner resize-none min-h-[150px]"
                            placeholder={"- Scaled production systems to 10M+ users\n- Led a cross-functional team of 15 engineers"}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Core Technical Stack</label>
                          <input 
                            type="text" 
                            value={formData.skills}
                            onChange={e => setFormData({...formData, skills: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
                            placeholder="Next.js, Tailwind, TypeScript, AWS, Figma"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setStep(1)}
                          className="px-8 py-5 border border-white/10 hover:bg-white/5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                        >
                          Back
                        </button>
                        <button 
                          onClick={handleOptimize}
                          disabled={loading || !formData.experience}
                          className="flex-1 py-5 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
                        >
                          {loading ? (
                            <>Optimizing... <Loader2 className="animate-spin" size={18} /></>
                          ) : (
                            <>Optimize with AI <Zap size={18} className="text-accent" /></>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-8 flex-1 flex flex-col">
                      <div className="flex-1 bg-black/40 rounded-[2rem] p-8 border border-white/5 shadow-inner overflow-y-auto max-h-[400px]">
                         <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6 border-b border-white/5 pb-2">Optimized Draft Preview</h5>
                         <pre className="text-sm text-text-main/90 whitespace-pre-wrap font-mono leading-relaxed">
                           {optimizedResume || generatedResume}
                         </pre>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={() => setStep(2)}
                          className="px-10 py-5 border border-white/10 hover:bg-white/5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                          <ArrowLeft size={16} /> Edit Data
                        </button>
                        <button 
                          onClick={handleCopy}
                          className={`flex-1 py-5 rounded-2xl font-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs ${
                            copied ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-white text-black hover:bg-primary hover:text-white shadow-white/10'
                          }`}
                        >
                          {copied ? <Check size={18} /> : <Copy size={18} />}
                          {copied ? 'Resume Copied' : 'Copy Optimized Markdown'}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* SEO / Explainer Pro Max */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pb-24 border-t border-white/5 pt-24">
          <div>
            <h2 className="text-4xl font-black mb-8 tracking-tighter leading-tight">Why Markdown for <br/> <span className="text-primary italic">Resume Parsing?</span></h2>
            <div className="space-y-6 text-text-muted font-medium">
               <p>Standard PDF builders often include hidden formatting, columns, and graphical elements that break modern <strong>Applicant Tracking Systems (ATS)</strong>. recruiters use these systems to filter candidates before even looking at a file.</p>
               <p>By using <span className="text-white">Markdown</span>, you ensure your data remains linearly structured, readable by any parser, and easily portable to platforms like Notion, GitHub, or any AI tool for further refinement.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { t: "ATS Compatibility", d: "Zero complex objects or columns that confuse bots.", i: <TrendingUp className="text-accent" /> },
              { t: "AI Optimization", d: "Clean structure ideal for feeding into LLMs for job tailoring.", i: <Sparkles className="text-primary" /> },
              { t: "Universal Format", d: "Paste anywhere from Notion to LinkedIn easily.", i: <FileText className="text-purple-400" /> }
            ].map((f, i) => (
              <div key={i} className="glass-card p-6 rounded-[2rem] flex items-start gap-4 hover:border-primary/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  {f.i}
                </div>
                <div>
                  <h4 className="font-black text-lg tracking-tight mb-1">{f.t}</h4>
                  <p className="text-xs text-text-muted leading-relaxed">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </motion.div>
    </>
  );
}
