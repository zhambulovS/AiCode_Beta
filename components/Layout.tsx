import React, { useState, useEffect } from 'react';
import { Code2, Trophy, UserCircle, Globe, Menu, X, Home, BookOpen, BarChart2, Bot, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language, translations } from '../translations';

interface LayoutProps {
  children: React.ReactNode;
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateLeaderboard: () => void;
  onNavigateAITutor: () => void;
  solvedCount: number;
  language: Language;
  setLanguage: (lang: Language) => void;
  viewMode: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onNavigateHome, 
  onNavigateProfile,
  onNavigateLeaderboard,
  onNavigateAITutor,
  solvedCount,
  language,
  setLanguage,
  viewMode
}) => {
  const t = translations[language];
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile toggle
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop collapse

  // Handle window resize to auto-reset specific states if needed
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false); // Ensure mobile overlay doesn't stick
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebarMobile = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleSidebarDesktop = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const NavItem = ({ icon: Icon, label, onClick, isActive }: any) => (
    <button
      onClick={() => {
        onClick();
        setIsSidebarOpen(false);
      }}
      title={isSidebarCollapsed ? label : ''}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium relative z-20 group whitespace-nowrap overflow-hidden ${
        isActive 
          ? 'bg-white text-kazakh-sky shadow-sm' 
          : 'text-white/80 hover:bg-white/10 hover:text-white'
      } ${isSidebarCollapsed ? 'justify-center w-full px-0' : 'w-full'}`}
    >
      <Icon className={`flex-shrink-0 ${isSidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
      <span className={`transition-opacity duration-300 ${isSidebarCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
        {label}
      </span>
      
      {/* Tooltip for collapsed mode */}
      {isSidebarCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
          {label}
        </div>
      )}
    </button>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen sidebar-ornament z-50 transition-all duration-300 shadow-2xl flex flex-col ${
          isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}`}
      >
        <div className="h-full flex flex-col p-4 text-white relative z-10">
          
          {/* Logo Section */}
          <div className={`flex items-center gap-3 mb-8 transition-all duration-300 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="bg-white p-2 rounded-lg shadow-md flex-shrink-0">
              <Code2 className="w-6 h-6 text-kazakh-sky" />
            </div>
            {!isSidebarCollapsed && (
               <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight">AiCode</span>
                  <span className="text-[10px] text-white/70 uppercase tracking-widest">Kazakhstan</span>
               </div>
            )}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="ml-auto lg:hidden p-1 hover:bg-white/20 rounded-md"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <NavItem 
              icon={Home} 
              label={t.home} 
              onClick={onNavigateHome} 
              isActive={viewMode === 'list' && !isSidebarOpen} 
            />
             <NavItem 
              icon={Bot} 
              label={t.aiTutor} 
              onClick={onNavigateAITutor} 
              isActive={viewMode === 'ai-tutor'} 
            />
            <NavItem 
              icon={BarChart2} 
              label={t.leaderboard} 
              onClick={onNavigateLeaderboard} 
              isActive={viewMode === 'leaderboard'} 
            />
            <NavItem 
              icon={UserCircle} 
              label={t.profile} 
              onClick={onNavigateProfile} 
              isActive={viewMode === 'profile'} 
            />
          </nav>

          {/* Bottom Actions */}
          <div className="mt-auto space-y-4 pt-6 border-t border-white/20">
             {/* Solved Counter */}
            <div className={`flex items-center gap-3 px-3 py-2 bg-white/10 rounded-lg overflow-hidden ${isSidebarCollapsed ? 'justify-center' : ''}`}>
               <Trophy className="w-5 h-5 text-kazakh-gold flex-shrink-0" />
               {!isSidebarCollapsed && (
                 <span className="text-sm whitespace-nowrap">{t.solved}: <span className="font-bold">{solvedCount}</span></span>
               )}
            </div>

            {/* Language Toggle */}
            <button 
              onClick={() => setLanguage(language === 'en' ? 'kk' : 'en')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10 ${isSidebarCollapsed ? 'justify-center' : ''}`}
              title={language === 'en' ? 'Switch to Kazakh' : 'Switch to English'}
            >
              <Globe className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <span className="whitespace-nowrap">{language === 'en' ? 'English' : 'Қазақша'}</span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Collapse Toggle Button */}
        <button 
          onClick={toggleSidebarDesktop}
          className="hidden lg:flex absolute -right-3 top-10 bg-white text-kazakh-sky shadow-md rounded-full p-1 border border-slate-100 hover:bg-slate-50 transition-transform hover:scale-110 z-50"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 lg:hidden px-4 py-3 flex items-center justify-between shadow-sm">
           <button onClick={toggleSidebarMobile} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
             <Menu className="w-6 h-6" />
           </button>
           <div className="flex items-center gap-2">
               <Code2 className="w-5 h-5 text-kazakh-sky" />
               <span className="text-xl font-bold text-kazakh-sky">AiCode</span>
           </div>
           <div className="w-10"></div> {/* Spacer */}
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;