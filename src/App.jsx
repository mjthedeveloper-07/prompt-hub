import { useState } from 'react';
import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PromptCard from './components/PromptCard';
import SEO from './components/SEO';
import AdBanner from './components/AdBanner';
import { Toaster } from 'react-hot-toast';
import { Menu, X, Sparkles as SparkleIcon } from 'lucide-react';

import HomePage from './pages/HomePage';
import ResumeBuilder from './pages/ResumeBuilder';
import PromptPage from './pages/PromptPage';
import AuthPage from './pages/AuthPage';
import BioStar from './pages/BioStar';
import AdminDashboard from './pages/AdminDashboard';
import AuthModal from './components/AuthModal';
import GeneratePromptModal from './components/GeneratePromptModal';
import { useAuth } from './context/AuthContext';

function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) return null;
  if (!user || !isAdmin) return <Navigate to="/" replace />;
  
  return children;
}

// Initial Data
import defaultData from './data/prompts.json';

// Category Definitions
const CATEGORY_UI = [
  { 
    id: 'business', 
    label: 'Business', 
    icon: '💼',
    seoTitle: "Best ChatGPT Prompts for Business | PromptHub",
    seoDesc: "Discover high-quality ChatGPT prompts for business strategy and startups.",
    seoKeywords: "chatgpt prompts for business, business AI templates"
  },
  { 
    id: 'productivity', 
    label: 'Productivity', 
    icon: '⏱️',
    seoTitle: "AI Prompts for Productivity | PromptHub",
    seoDesc: "Optimize your workflow with proven ChatGPT productivity prompts.",
    seoKeywords: "chatgpt productivity prompts, time management AI"
  },
  { 
    id: 'education', 
    label: 'Education', 
    icon: '📚',
    seoTitle: "ChatGPT Prompts for Education | PromptHub",
    seoDesc: "Free curriculum and lesson planning AI prompts for teachers.",
    seoKeywords: "chatgpt prompts for teachers, AI lesson plans"
  },
  { 
    id: 'social_media', 
    label: 'Social Media', 
    icon: '📱',
    seoTitle: "Best AI Prompts for Social Media | PromptHub",
    seoDesc: "Viral hooks and content calendars for Social Media Managers.",
    seoKeywords: "social media chatgpt prompts, viral hook generator"
  },
  { 
    id: 'seo', 
    label: 'SEO', 
    icon: '🔍',
    seoTitle: "Advanced SEO ChatGPT Prompts | PromptHub",
    seoDesc: "Programmatic SEO and keyword clustering AI prompts.",
    seoKeywords: "seo chatgpt prompts, technical seo audit prompt"
  },
  { 
    id: 'design', 
    label: 'Design', 
    icon: '🎨',
    seoTitle: "UI/UX & Design Prompts for AI | PromptHub",
    seoDesc: "Creative briefs and design systems prompts for Designers.",
    seoKeywords: "ui design chatgpt prompts, ux writing templates"
  },
  { 
    id: 'generated', 
    label: 'My Prompts', 
    icon: '✨',
    seoTitle: "My Custom AI Prompts | PromptHub",
    seoDesc: "View and manage your custom user-generated AI prompts.",
    seoKeywords: "custom chatgpt prompts, generative AI templates"
  }, 
];

function CategoryPage({ promptsData, generatedPrompts, setIsModalOpen }) {
  const { categoryId } = useParams();
  const activeCategory = CATEGORY_UI.find(c => c.id === categoryId) ? categoryId : 'business';
  
  if (!CATEGORY_UI.find(c => c.id === categoryId)) {
    return <Navigate to="/category/business" replace />;
  }

  const categoryMetadata = CATEGORY_UI.find(c => c.id === activeCategory);
  const activePrompts = activeCategory === 'generated' ? generatedPrompts : (promptsData[activeCategory] || []);

  return (
    <>
      <SEO 
        title={categoryMetadata.seoTitle}
        description={categoryMetadata.seoDesc}
        keywords={categoryMetadata.seoKeywords}
        url={`https://prompthub.ai/category/${activeCategory}`}
      />
      
      <div className="max-w-6xl mx-auto py-8">
        <AdBanner slot="category_top" className="mb-10" />
        <header className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-black mb-4 capitalize">
            {activeCategory === 'generated' ? 'My Generated Prompts' : activeCategory.replace('_', ' ')}
          </h1>
          <p className="text-text-muted text-lg">
            {activeCategory === 'generated' 
              ? 'Prompts you have custom built using AI.' 
              : 'Curated, high-quality AI prompts ready to copy and use.'}
          </p>
        </header>

        {activePrompts.length === 0 ? (
          <div className="glass p-12 text-center rounded-2xl border-dashed border-2 border-border">
            <span className="text-4xl mb-4 block">✨</span>
            <h3 className="text-xl font-bold mb-2">No custom prompts yet</h3>
            <p className="text-text-muted mb-6">Click Generate New to create your first custom prompt using Gemini!</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition"
            >
              Generate Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {activePrompts.map((promptObj, idx) => (
              <PromptCard 
                key={idx}
                slug={promptObj.slug}
                title={promptObj.title}
                prompt={promptObj.prompt}
                tags={promptObj.tags}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function SidebarRouterWrapper({ categoriesWithCounts, setIsModalOpen, isSidebarOpen, setIsSidebarOpen }) {
  const path = window.location.pathname;
  let activeCategory = null;
  
  if (path.startsWith('/category/')) {
    const match = path.match(/\/category\/([^/]+)/);
    activeCategory = match ? match[1] : null;
  } else if (path === '/resume-builder') {
    activeCategory = 'resume';
  } else if (path === '/biostar') {
    activeCategory = 'biostar';
  } else if (path === '/admin') {
    activeCategory = 'admin';
  } else if (path === '/') {
    activeCategory = 'home';
  }

  return (
    <Sidebar 
      categories={categoriesWithCounts} 
      activeCategory={activeCategory} 
      setIsModalOpen={setIsModalOpen}
      isOpen={isSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
    />
  );
}

export default function App() {
  const [promptsData] = useState(defaultData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState([]);
  
  const navigate = useNavigate();

  const categoriesWithCounts = CATEGORY_UI.map(cat => ({
    ...cat,
    count: cat.id === 'generated' ? generatedPrompts.length : (promptsData[cat.id]?.length || 0)
  }));

  const handleAddGeneratedPrompt = (newPrompt) => {
    const sluggedPrompt = {
      ...newPrompt,
      slug: newPrompt.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now()
    };
    setGeneratedPrompts(prev => [sluggedPrompt, ...prev]);
    navigate('/category/generated');
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 17, 22, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '600',
            fontFamily: 'Outfit, sans-serif',
          },
        }}
      />

      <Routes>
        {/* Standalone Auth Page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Main Application Layout */}
        <Route path="/*" element={
          <div className="min-h-screen bg-[#050608] text-text-main flex relative overflow-hidden selection:bg-primary/30 selection:text-white">
            {/* UI/UX Pro Max Background Decorators */}
            <div className="fixed top-[-10%] left-[-5%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
            <div className="fixed bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 glass border-b border-border z-40 flex items-center justify-between px-6">
              <div className="flex items-center gap-2 text-xl font-black bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                PromptHub
              </div>
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-text-muted hover:text-white"
              >
                <Menu size={24} />
              </button>
            </header>

            {/* Sidebar Wrapper */}
            <div className="lg:w-64 shrink-0 transition-all">
              <SidebarRouterWrapper 
                 categoriesWithCounts={categoriesWithCounts}
                 setIsModalOpen={setIsModalOpen}
                 isSidebarOpen={isSidebarOpen}
                 setIsSidebarOpen={setIsSidebarOpen}
              />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto h-screen p-6 lg:p-12 pt-24 lg:pt-12 z-0 relative">
              <Routes>
                <Route path="/" element={<HomePage categories={categoriesWithCounts} />} />
                <Route path="/resume-builder" element={<ResumeBuilder />} />
                <Route path="/biostar" element={<BioStar />} />
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="/prompt/:slug" element={<PromptPage promptsData={promptsData} />} />
                <Route path="/category/:categoryId" element={
                  <CategoryPage 
                    promptsData={promptsData} 
                    generatedPrompts={generatedPrompts} 
                    setIsModalOpen={setIsModalOpen} 
                  />
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <GeneratePromptModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              onAddPrompt={handleAddGeneratedPrompt}
            />

            <AuthModal 
              isOpen={isAuthModalOpen} 
              onClose={() => setIsAuthModalOpen(false)} 
            />
          </div>
        } />
      </Routes>
    </>
  );
}
