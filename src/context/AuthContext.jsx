import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const ADMIN_EMAILS = ['jagathratchagan2023@gmail.com'];
const PRO_EMAILS = []; // Add pro user emails here if needed
const RESET_INTERVAL_MS = 5 * 60 * 60 * 1000; // 5 hours
const GUEST_CREDITS_KEY = 'prompt_hub_guest_credits';
const GUEST_RESET_KEY = 'prompt_hub_guest_reset';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper for guest credits
  const getGuestCredits = () => {
    const stored = localStorage.getItem(GUEST_CREDITS_KEY);
    const lastReset = localStorage.getItem(GUEST_RESET_KEY);
    const now = Date.now();

    if (!stored || !lastReset || (now - parseInt(lastReset)) >= RESET_INTERVAL_MS) {
      localStorage.setItem(GUEST_CREDITS_KEY, '10');
      localStorage.setItem(GUEST_RESET_KEY, now.toString());
      return 10;
    }
    return parseInt(stored);
  };

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAdmin(currentUser ? ADMIN_EMAILS.includes(currentUser.email) : false);
      setIsPro(currentUser ? PRO_EMAILS.includes(currentUser.email) : false);
      
      if (currentUser) {
        fetchCredits(currentUser.id);
      } else {
        setCredits(getGuestCredits());
      }
      setLoading(false);
    });

    // 2. Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAdmin(currentUser ? ADMIN_EMAILS.includes(currentUser.email) : false);
      setIsPro(currentUser ? PRO_EMAILS.includes(currentUser.email) : false);
      
      if (currentUser) {
        await fetchCredits(currentUser.id);
      } else {
        setCredits(getGuestCredits());
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCredits = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('credits, last_reset_at')
      .eq('id', userId)
      .single();

    const now = new Date();
    // Standardizing to 10 credits for everyone (Guest/Logged-in)
    const isProUser = user && PRO_EMAILS.includes(user.email);
    const baseCredits = isProUser ? 300 : 10; 

    if (error && error.code === 'PGRST116') {
      // New User: Provision with 10 credits (or 300 for pro)
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{ 
          id: userId, 
          credits: baseCredits, 
          last_reset_at: now.toISOString() 
        }])
        .select()
        .single();
      
      if (!createError) setCredits(newProfile.credits);
    } else if (data) {
      const lastReset = data.last_reset_at ? new Date(data.last_reset_at) : new Date(0);
      const timeSinceReset = now.getTime() - lastReset.getTime();

      if (timeSinceReset >= RESET_INTERVAL_MS) {
        const { error: resetError } = await supabase
          .from('profiles')
          .update({ 
            credits: baseCredits, 
            last_reset_at: now.toISOString() 
          })
          .eq('id', userId);
        
        if (!resetError) setCredits(baseCredits);
      } else {
        setCredits(data.credits);
      }
    }

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`profile:${userId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` }, 
      (payload) => setCredits(payload.new.credits))
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const signup = (email, password) => supabase.auth.signUp({ email, password });
  const login = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const logout = () => supabase.auth.signOut();
  const googleSignIn = () => supabase.auth.signInWithOAuth({ provider: 'google' });

  const deductCredit = async () => {
    if (isAdmin) return true;

    if (!user) {
      const currentGuest = getGuestCredits();
      if (currentGuest <= 0) return false;
      const newVal = currentGuest - 1;
      localStorage.setItem(GUEST_CREDITS_KEY, newVal.toString());
      setCredits(newVal);
      return true;
    }

    // Refresh credits to ensure we have latest (including reset check)
    await fetchCredits(user.id);
    if (credits <= 0) return false;

    const { error } = await supabase
      .from('profiles')
      .update({ credits: credits - 1 })
      .eq('id', user.id);

    if (error) return false;
    return true;
  };

  const value = {
    user,
    credits: isAdmin ? '∞' : (credits || 0),
    isGuest: !user,
    isAdmin,
    isPro,
    loading,
    signup,
    login,
    logout,
    googleSignIn,
    deductCredit
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
