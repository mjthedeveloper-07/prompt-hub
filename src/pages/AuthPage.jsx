import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { X, Mail, Lock, User, LogIn, ChevronRight, Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login, signup, googleSignIn } = useAuth();
  
  // Determine mode from query param or state
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error: authError } = isLogin 
        ? await login(email, password)
        : await signup(email, password);
      
      if (authError) throw authError;
      
      if (!isLogin && data?.user && data?.session === null) {
        toast.success('Confirmation email sent!');
        setError('Check your email for the confirmation link.');
      } else {
        toast.success(isLogin ? 'Welcome back!' : 'Account created!');
        navigate('/');
      }
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const { error: authError } = await googleSignIn();
      if (authError) throw authError;
      toast.success('Redirecting to Google...');
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title={isLogin ? "Sign In | PromptHub" : "Join PromptHub | 10 Free Credits"}
        description="Access the ultimate AI prompt engineering library and build your custom prompts with Gemini Pro Max."
      />
      
      <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
        {/* Pro Max Background Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/5 blur-[100px] rounded-full" />
        
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-all bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <ArrowLeft size={14} /> Back to Library
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass w-full max-w-[450px] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative"
        >
          <div className="p-10">
            <div className="text-center mb-10">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20"
              >
                <Sparkles className="text-primary" size={32} />
              </motion.div>
              <h2 className="text-4xl font-black gradient-heading mb-3 tracking-tighter">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </h2>
              <p className="text-text-muted font-medium">
                {isLogin ? 'Continue your prompt engineering flow' : 'Join and get 10 free credits instantly'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="name@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white shadow-inner"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Secure Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white shadow-inner"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`text-xs p-4 rounded-xl border ${error.includes('confirmation') ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'} font-medium`}
                >
                  {error}
                </motion.p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In Now' : 'Create My Account')}
                {!loading && <ChevronRight size={18} />}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-background px-4 text-text-muted">Or Secure Connect</span></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogle}
              className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign In with Google
            </button>

            <p className="mt-10 text-center text-sm font-medium text-text-muted">
              {isLogin ? "New to PromptHub?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary-hover font-black border-b border-primary/20 hover:border-primary transition-all"
              >
                {isLogin ? 'Join Now' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
