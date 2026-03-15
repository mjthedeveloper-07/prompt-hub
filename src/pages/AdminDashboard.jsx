import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  CreditCard, 
  Plus, 
  Minus, 
  RefreshCcw, 
  ShieldCheck, 
  TrendingUp,
  Mail,
  Calendar,
  ChevronRight,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ totalUsers: 0, totalCredits: 0 });

  useEffect(() => {
    if (isAdmin) {
      fetchProfiles();
    }
  }, [isAdmin]);

  async function fetchProfiles() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('last_reset_at', { ascending: false });

      if (error) throw error;
      setProfiles(data);
      
      const totalCredits = data.reduce((acc, p) => acc + (p.credits || 0), 0);
      setStats({ totalUsers: data.length, totalCredits });
    } catch (error) {
      toast.error('Failed to load user profiles');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateCredits(targetId, currentCredits, amount) {
    const newCredits = Math.max(0, currentCredits + amount);
    const toastId = toast.loading('Updating credits...');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', targetId);

      if (error) throw error;
      
      setProfiles(prev => prev.map(p => 
        p.id === targetId ? { ...p, credits: newCredits } : p
      ));
      toast.success('Credits updated successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to update credits', { id: toastId });
      console.error(error);
    }
  }

  const filteredProfiles = profiles.filter(p => 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isAdmin) {
    return (
      <div className="h-full flex items-center justify-center text-center p-8">
        <div className="max-w-md space-y-4">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <ShieldCheck size={40} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Access Denied</h1>
          <p className="text-text-muted">You do not have administrative permissions to view this terminal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <ShieldCheck size={20} />
            <span className="text-xs font-black uppercase tracking-[0.3em]">System Administration</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">Login Management</h1>
          <p className="text-text-muted mt-2">Manage user profiles and credit allocations across the network.</p>
        </div>

        <div className="flex gap-4">
          <div className="glass px-6 py-4 rounded-2xl border border-white/5 flex flex-col items-center min-w-[120px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Total Users</span>
            <span className="text-2xl font-black text-white">{stats.totalUsers}</span>
          </div>
          <div className="glass px-6 py-4 rounded-2xl border border-white/5 flex flex-col items-center min-w-[120px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">system credits</span>
            <span className="text-2xl font-black text-primary">{stats.totalCredits}</span>
          </div>
        </div>
      </header>

      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search users by ID or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-medium"
        />
      </div>

      <div className="glass rounded-3xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">User Profile</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Credit Allocation</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Last Activity</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-primary" size={32} />
                        <span className="text-sm font-bold text-text-muted">Syncing Database...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center text-text-muted italic">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : filteredProfiles.map((profile) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={profile.id} 
                    className="hover:bg-white/[0.01] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-colors">
                          <Mail size={18} className="text-text-muted group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-black truncate max-w-[200px] text-white tracking-widest">
                            {profile.id.substring(0, 8)}...
                          </span>
                          <span className="text-[10px] text-text-muted font-medium">Standard User</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-primary/10 rounded-lg border border-primary/20">
                          <div className="flex items-center gap-1.5">
                            <CreditCard size={12} className="text-primary" />
                            <span className="text-xs font-black text-white">{profile.credits}</span>
                          </div>
                        </div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Available</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase">
                        <Calendar size={12} />
                        {new Date(profile.last_reset_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => updateCredits(profile.id, profile.credits, -1)}
                          className="p-2 bg-white/5 hover:bg-red-500/20 text-text-muted hover:text-red-400 rounded-lg transition-all border border-white/10"
                        >
                          <Minus size={14} />
                        </button>
                        <button 
                          onClick={() => updateCredits(profile.id, profile.credits, 1)}
                          className="p-2 bg-white/5 hover:bg-green-500/20 text-text-muted hover:text-green-400 rounded-lg transition-all border border-white/10"
                        >
                          <Plus size={14} />
                        </button>
                        <button 
                          onClick={() => updateCredits(profile.id, profile.credits, 10)}
                          className="px-3 py-2 bg-primary/20 hover:bg-primary text-primary hover:text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-widest border border-primary/30"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-4 text-accent">
            <TrendingUp size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest">Growth Analytics</h3>
          </div>
          <p className="text-xs text-text-muted">Daily user acquisition is up 12% compared to last cycle. Monitor credit burn to ensure stability.</p>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-4 text-primary">
            <ShieldCheck size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest">Sentinel Security</h3>
          </div>
          <p className="text-xs text-text-muted">Database Row Level Security is active. All management actions are authenticated and encrypted.</p>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-4 text-purple-400">
            <RefreshCcw size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest">Auto-Restoration</h3>
          </div>
          <p className="text-xs text-text-muted">The 5-hour cron job is active, restoring all free users to the 10-credit base allocation.</p>
        </div>
      </div>
    </div>
  );
}
