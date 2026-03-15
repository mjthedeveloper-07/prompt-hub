import { MessageSquarePlus, Library, Sparkles, Home, FileText, User, LogOut, CreditCard, Instagram, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Sidebar({ categories, activeCategory, setIsModalOpen, setIsAuthModalOpen }) {
  const { user, credits, logout, isAdmin, isPro, isGuest } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass border-r border-border flex flex-col z-10 overflow-y-auto">
      <div className="p-6 flex flex-col h-full">
        <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight mb-8 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent hover:opacity-90">
          <Library className="text-primary" />
          Prompt<span className="text-text-main">Hub</span>
        </Link>
        
        <nav className="space-y-1 mb-6 border-b border-border pb-6">
           <Link
              to={`/`}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center gap-3 ${
                activeCategory === 'home'
                  ? 'bg-primary/20 text-primary-hover font-medium' 
                  : 'text-text-muted hover:text-text-main hover:bg-white/5'
              }`}
            >
              <Home size={18} />
              <span>Home</span>
           </Link>
           <Link
              to={`/resume-builder`}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center gap-3 ${
                activeCategory === 'resume'
                  ? 'bg-primary/20 text-primary-hover font-medium' 
                  : 'text-text-muted hover:text-text-main hover:bg-white/5'
              }`}
            >
              <FileText size={18} />
              <span>Resume Builder</span>
              <span className="ml-auto text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Free
              </span>
           </Link>
           <Link
              to={`/biostar`}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center gap-3 ${
                activeCategory === 'biostar'
                  ? 'bg-primary/20 text-primary-hover font-medium' 
                  : 'text-text-muted hover:text-text-main hover:bg-white/5'
              }`}
            >
              <Instagram size={18} />
              <span>BioStar AI</span>
              <span className="ml-auto text-[10px] font-bold bg-accent/20 text-accent px-2 py-0.5 rounded-full uppercase tracking-wider">
                Pro
              </span>
           </Link>
            {isAdmin && (
               <Link
                  to={`/admin`}
                  className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center gap-3 ${
                    activeCategory === 'admin'
                      ? 'bg-primary/20 text-primary-hover font-medium' 
                      : 'text-text-muted hover:text-text-main hover:bg-white/5'
                  }`}
                >
                  <ShieldCheck size={18} />
                  <span>Admin Console</span>
                  <span className="ml-auto text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Root
                  </span>
               </Link>
            )}
         </nav>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="group relative w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 mb-8 shadow-xl shadow-primary/30 active:scale-95"
        >
          <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
          Generate New
          {user && (
            <div className="absolute -top-2 -right-2 bg-accent text-[10px] text-black px-2 py-0.5 rounded-full font-black shadow-lg">
              1✨
            </div>
          )}
        </button>

        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 pl-1">
          Categories
        </h4>
        
        <nav className="space-y-1 overflow-y-auto max-h-[30vh] pr-1 mb-6">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center gap-3 ${
                  isActive
                    ? 'bg-primary/20 text-primary-hover font-medium border-l-2 border-primary' 
                    : 'text-text-muted hover:text-text-main hover:bg-white/5'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="capitalize">{cat.label}</span>
                <span className="ml-auto text-[10px] font-bold bg-black/40 px-2 py-0.5 rounded-md border border-white/5">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
          <div className="px-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 blur-xl rounded-full -mr-8 -mt-8" />
              
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                    <CreditCard size={14} className="text-primary" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Credits</span>
                </div>
                <span className="text-xl font-black tracking-tighter text-white">
                  {credits}
                </span>
              </div>

              <div className="space-y-2 relative z-10">
                {isAdmin && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-lg border border-primary/20">
                    <Sparkles size={10} className="text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Master Admin</span>
                  </div>
                )}
                {isPro && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-accent/10 rounded-lg border border-accent/20">
                    <Sparkles size={10} className="text-accent" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-accent">Pro Member</span>
                  </div>
                )}
                {!user && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                    <User size={10} className="text-text-muted" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Guest (10 Free)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-4">
            <button 
              onClick={user ? logout : () => navigate('/auth')}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all">
                  {user ? <LogOut size={20} /> : <User size={20} />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-black tracking-tight">{user ? 'Sign Out' : 'Sign In'}</p>
                  <p className="text-[10px] text-text-muted font-medium truncate w-32">
                    {user ? user.email : 'Cloud Sync Off'}
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>
          </div>
          <div className="text-[8px] text-text-muted/30 text-center font-bold tracking-widest uppercase">
            PromptHub Engine v4.0.2
          </div>
        </div>
      </div>
    </aside>
  );
}
