
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  Bell, 
  Search,
  MessageCircle,
  BarChart2, 
  LogOut,
  FolderOpen,
  ShieldAlert,
  Loader2,
  Briefcase,
  Plus,
  ArrowDownRight
} from 'lucide-react';
import { ViewState, UserRole, Material } from './types';
import Dashboard from './components/Dashboard';
import CourseManager from './components/CourseManager';
import ClientManager from './components/ClientManager';
import LibraryManager from './components/LibraryManager';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import MessagingSystem from './components/MessagingSystem';
import RedFlagMonitoring from './components/RedFlagMonitoring';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SettingsManager from './components/SettingsManager';
import { AuthFlow } from './components/AuthFlow';
import { authService } from './services/authService';
import { materialService } from './services/materialService';

type AppSection = 'HOME' | 'MANAGE' | 'CREATE';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.PRACTITIONER);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Navigation State
  const [appSection, setAppSection] = useState<AppSection>('HOME');
  const [activeView, setActiveView] = useState<ViewState>(ViewState.HOME);
  
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  
  // Shared State
  const [materials, setMaterials] = useState<Material[]>([]);

  // Helpers for Data Mapping
  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const capitalize = (s: string | null) => {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const loadMaterials = async (userId: string) => {
    try {
      const data = await materialService.getMaterials(userId);
      const mappedMaterials: Material[] = (data as any[]).map(m => ({
        id: m.id,
        title: m.title,
        description: m.description || '',
        type: (capitalize(m.material_type) || 'Text') as any, // Map 'audio' -> 'Audio'
        category: m.category || [],
        duration: formatDuration(m.duration_seconds),
        source: m.practitioner_id === userId ? 'My Files' : 'Global',
        usageCount: m.used_in_count || 0,
        dateAdded: new Date(m.created_at).toLocaleDateString(),
        url: m.url || '',
        tags: m.tags || []
      }));
      setMaterials(mappedMaterials);
    } catch (error) {
      console.error("Failed to load materials:", error);
    }
  };

  // Initialize Session
  useEffect(() => {
    const initSession = async () => {
      try {
        const session = await authService.getSession();
        if (session?.user) {
          // 1. Lazy Init: Ensure profile exists (recovers from email verification flow)
          await authService.ensureProfileInitialized(session.user);

          // 2. Fetch Profile
          const profile = await authService.getUserProfile(session.user.id);
          
          if (profile) {
            setUserProfile(profile);
            // Determine role from profile
            if (profile.role === 'super_admin') {
              setUserRole(UserRole.SUPER_ADMIN);
              setIsAuthenticated(true);
            } else {
              setUserRole(UserRole.PRACTITIONER);
              setIsAuthenticated(true);
              // Load Materials
              loadMaterials(profile.id);
            }
          } else {
            console.error('Profile creation failed or pending.');
          }
        }
      } catch (error) {
        console.error('Session check failed', error);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);
  
  // Handle Logout
  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsAuthenticated(false);
      setUserRole(UserRole.PRACTITIONER); // Reset to default
      setUserProfile(null);
      setMaterials([]); // Clear data
      setActiveView(ViewState.HOME);
      setAppSection('HOME');
      setNeedsOnboarding(false);
    }
  };

  // Navigation Handlers
  const handleEnterManage = () => {
    setAppSection('MANAGE');
    setActiveView(ViewState.DASHBOARD);
  };

  const handleEnterCreate = () => {
    setAppSection('CREATE');
    setActiveView(ViewState.COURSE_LIST); // Default to list view in create mode, or create flow
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="animate-spin text-gray-900" size={32} />
      </div>
    );
  }

  // Handle Onboarding Interruption
  if (needsOnboarding) {
    return (
      <AuthFlow 
        initialStep="PROFILE"
        onComplete={(role) => {
          setNeedsOnboarding(false);
          setUserRole(role);
          // Fetch profile before setting authenticated to ensure UI has data
          authService.getSession().then(async s => {
             if(s?.user) {
                const p = await authService.getUserProfile(s.user.id);
                setUserProfile(p);
                if (p) loadMaterials(p.id);
             }
             setIsAuthenticated(true);
          });
        }} 
      />
    );
  }

  // Handle Authentication Flow
  if (!isAuthenticated) {
    return (
      <AuthFlow 
        onComplete={(role) => {
          setUserRole(role);
          // Fetch profile before setting authenticated to ensure UI has data
          authService.getSession().then(async s => {
             if(s?.user) {
                const p = await authService.getUserProfile(s.user.id);
                setUserProfile(p);
                if (p) loadMaterials(p.id);
             }
             setIsAuthenticated(true);
          });
        }} 
      />
    );
  }

  // --- RENDER SUPER ADMIN DASHBOARD ---
  if (userRole === UserRole.SUPER_ADMIN) {
    return <SuperAdminDashboard onLogout={handleLogout} />;
  }

  // --- RENDER PRACTITIONER APP ---

  const renderContent = () => {
    // Landing Page View
    if (activeView === ViewState.HOME) {
       return (
          <div className="max-w-4xl mx-auto py-20 animate-fade-in">
             <div className="text-center mb-16">
                 <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome back, {userProfile?.full_name?.split(' ')[0] || 'Practitioner'}</h1>
                 <p className="text-xl text-gray-500">What would you like to focus on today?</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Manage Card */}
                 <div 
                   onClick={handleEnterManage}
                   className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
                 >
                     <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                         <LayoutDashboard size={40} className="text-gray-900"/>
                     </div>
                     <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage</h2>
                     <p className="text-gray-500 font-medium leading-relaxed">
                        Access your dashboard, monitor student progress, handle alerts, and view analytics.
                     </p>
                     <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white">
                           <ArrowDownRight size={24} className="-rotate-45"/>
                        </div>
                     </div>
                 </div>

                 {/* Create Card */}
                 <div 
                   onClick={handleEnterCreate}
                   className="bg-gray-900 p-10 rounded-[40px] shadow-xl hover:shadow-2xl hover:bg-black transition-all cursor-pointer group relative overflow-hidden"
                 >
                     <div className="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                         <BookOpen size={40} className="text-yellow-400"/>
                     </div>
                     <h2 className="text-3xl font-bold text-white mb-2">Create</h2>
                     <p className="text-gray-400 font-medium leading-relaxed">
                        Build new courses with AI, manage your content library, and design curriculum.
                     </p>
                     <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900">
                           <Plus size={24} />
                        </div>
                     </div>
                 </div>
             </div>
          </div>
       );
    }

    // Standard Views
    switch (activeView) {
      case ViewState.DASHBOARD:
        return <Dashboard userName={userProfile?.full_name} />;
      
      // Manage Mode Views
      case ViewState.CLIENTS:
        return <ClientManager />;
      case ViewState.MESSAGING:
        return <MessagingSystem />;
      case ViewState.RED_FLAGS:
        return <RedFlagMonitoring />;
      case ViewState.ANALYTICS:
        return <AnalyticsDashboard />;
      case ViewState.SETTINGS:
        return <SettingsManager />;

      // Create Mode Views
      case ViewState.LIBRARY:
        return (
          <LibraryManager 
            materials={materials} 
            setMaterials={setMaterials} 
          />
        );
      case ViewState.COURSE_CREATE:
        return (
          <CourseManager 
            onBack={() => {}} 
            availableMaterials={materials}
            onNavigateToLibrary={() => setActiveView(ViewState.LIBRARY)}
            initialMode="CREATE_FLOW"
            key="create-flow" // Force remount
          />
        );
      case ViewState.COURSE_LIST:
        return (
            <CourseManager 
            onBack={() => {}} 
            availableMaterials={materials}
            onNavigateToLibrary={() => setActiveView(ViewState.LIBRARY)}
            initialMode="LIST"
            key="list-flow" // Force remount
          />
        );
      
      // Fallback
      case ViewState.COURSES:
         return (
            <CourseManager 
               onBack={() => {}} 
               availableMaterials={materials}
               onNavigateToLibrary={() => setActiveView(ViewState.LIBRARY)}
               initialMode="LIST"
            />
         );
      default:
        return <Dashboard userName={userProfile?.full_name} />;
    }
  };

  const NavItem = ({ view, icon, label, badge, active }: { view: ViewState; icon: React.ReactNode; label: string; badge?: number | string; active?: boolean }) => {
    const isActive = active || activeView === view;
    return (
        <button
        onClick={() => setActiveView(view)}
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
            isActive
            ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' 
            : 'text-gray-500 hover:bg-white hover:text-gray-900'
        }`}
        >
        <div className={`${isActive ? 'text-yellow-400' : 'text-gray-400 group-hover:text-gray-900'}`}>
            {icon}
        </div>
        <span className="font-medium text-sm flex-1 text-left">{label}</span>
        {badge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-red-500 text-white' : 'bg-red-500 text-white'}`}>
                {badge}
            </span>
        )}
        </button>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream font-sans text-primary overflow-hidden selection:bg-yellow-200 animate-fade-in">
      
      {/* Sidebar - Conditional based on App Section */}
      {activeView !== ViewState.HOME && (
        <aside className="w-72 hidden lg:flex flex-col p-6 h-screen sticky top-0 bg-cream border-r border-gray-100/50">
            <div className="mb-10 px-4 flex items-center gap-2 cursor-pointer" onClick={() => { setAppSection('HOME'); setActiveView(ViewState.HOME); }}>
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-lg">C</div>
                <h1 className="text-2xl font-bold tracking-tight">Crextio</h1>
            </div>
            
            {/* --- MANAGE MODE SIDEBAR --- */}
            {appSection === 'MANAGE' && (
                <nav className="flex-1 space-y-2">
                    <div className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Manage</div>
                    <NavItem view={ViewState.DASHBOARD} icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem view={ViewState.RED_FLAGS} icon={<ShieldAlert size={20} />} label="Alerts" badge={3} />
                    <NavItem view={ViewState.CLIENTS} icon={<Users size={20} />} label="People" />
                    <NavItem view={ViewState.ANALYTICS} icon={<BarChart2 size={20} />} label="Stats" />
                    <NavItem view={ViewState.MESSAGING} icon={<MessageCircle size={20} />} label="Messages" badge={2} />
                </nav>
            )}

            {/* --- CREATE MODE SIDEBAR --- */}
            {appSection === 'CREATE' && (
                <nav className="flex-1 space-y-2">
                    <div className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Create</div>
                    <NavItem view={ViewState.LIBRARY} icon={<FolderOpen size={20} />} label="Materials" />
                    <NavItem view={ViewState.COURSE_CREATE} icon={<Plus size={20} />} label="Create a Course" />
                    <NavItem view={ViewState.COURSE_LIST} icon={<BookOpen size={20} />} label="Manage Courses" />
                </nav>
            )}

            <div className="mt-auto pt-6 border-t border-gray-200/50">
                <button 
                    onClick={() => { setAppSection('HOME'); setActiveView(ViewState.HOME); }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-gray-500 hover:bg-white hover:text-gray-900 mb-2`}
                >
                    <Briefcase size={20} className="text-gray-400" />
                    <span className="font-medium text-sm">Switch View</span>
                </button>

                <button 
                    onClick={() => setActiveView(ViewState.SETTINGS)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                    activeView === ViewState.SETTINGS
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'text-gray-500 hover:bg-white hover:text-gray-900'
                    }`}
                >
                    <Settings size={20} className={activeView === ViewState.SETTINGS ? 'text-yellow-400' : 'text-gray-400'} />
                    <span className="font-medium text-sm">Settings</span>
                </button>
            
                <div className="mt-6 bg-white p-4 rounded-3xl border border-white shadow-sm flex items-center gap-3 relative group">
                    <img 
                        src={userProfile?.avatar_url || "https://i.pravatar.cc/150?u=default"} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full object-cover" 
                    />
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 truncate">{userProfile?.full_name || 'Practitioner'}</p>
                        <p className="text-xs text-gray-500 truncate">{userProfile?.business_name || 'Coaching'}</p>
                    </div>
                    
                    {/* Logout Button (Appears on Hover) */}
                    <button 
                        onClick={handleLogout}
                        className="absolute inset-0 bg-gray-900/90 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium gap-2 backdrop-blur-sm"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>
        </aside>
      )}

      {/* Main Content */}
      <main className={`flex-1 h-screen overflow-y-auto overflow-x-hidden relative scroll-smooth no-scrollbar ${activeView === ViewState.HOME ? 'bg-cream-dark' : ''}`}>
        {/* Header (Mobile/Desktop Hybrid) - Hide on Home */}
        {activeView !== ViewState.HOME && (
            <header className="sticky top-0 z-20 px-6 py-4 bg-cream/80 backdrop-blur-md flex justify-between items-center lg:justify-end">
                <div className="lg:hidden font-bold text-xl">Crextio</div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm focus-within:ring-2 focus-within:ring-yellow-400/50 transition-all">
                        <Search size={16} className="text-gray-400 mr-2" />
                        <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-48" />
                    </div>
                    <button className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 relative">
                        <Bell size={20} />
                        <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                </div>
            </header>
        )}

        <div className={`px-6 pb-12 pt-2 max-w-[1600px] mx-auto ${activeView === ViewState.HOME ? 'h-full flex flex-col justify-center' : ''}`}>
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
