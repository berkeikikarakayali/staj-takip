import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BarChart3, 
  Settings,
  BriefcaseBusiness,
  Plus,
  LogOut,
  User,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { NewAppModal } from './NewAppModal';
import { GuideModal, checkShouldShowGuide } from './GuideModal';

export function Layout() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(() => checkShouldShowGuide());
  const { t } = useLanguage();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t.dashboard },
    { to: '/calendar', icon: CalendarDays, label: t.calendar },
    { to: '/stats', icon: BarChart3, label: t.stats },
    { to: '/guide', icon: BookOpen, label: t.guideNav },
    { to: '/settings', icon: Settings, label: t.settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Get initials from user email or name
  const getInitials = () => {
    const name = user?.user_metadata?.full_name;
    if (name) {
      return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() ?? '?';
  };

  const UserAvatar = () => (
    <div className="relative">
      <button
        onClick={() => setUserMenuOpen(prev => !prev)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs flex-shrink-0">
          {getInitials()}
        </div>
        <div className="hidden md:block text-left min-w-0">
          <p className="font-medium truncate leading-tight">
            {user?.user_metadata?.full_name ?? user?.email?.split('@')[0]}
          </p>
          <p className="text-[11px] text-muted-foreground truncate leading-tight">{user?.email}</p>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform flex-shrink-0", userMenuOpen && "rotate-180")} />
      </button>

      {userMenuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
          <div className="absolute bottom-full mb-2 left-0 right-0 z-50 bg-popover border rounded-md p-1 min-w-[180px]">
            <button
              onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
            >
              <User className="w-4 h-4 text-muted-foreground" />
              {t.profileAndSettings}
            </button>
            <div className="my-1 border-t" />
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t.signOut}
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex h-[100dvh] bg-muted/20">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-background">
        <div className="px-4 py-3 border-b flex items-center gap-2">
          <BriefcaseBusiness className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl">StajTakip</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        {/* User section at bottom of sidebar */}
        <div className="p-3 border-t">
          <UserAvatar />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="md:hidden flex items-center justify-between h-14 border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="w-5 h-5 text-primary" />
            <span className="font-bold">StajTakip</span>
          </div>
          <UserAvatar />
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8 relative">
          <Outlet />
        </div>

        {/* Bottom Nav - Mobile */}
        <nav className="md:hidden flex items-center justify-around border-t bg-background p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center w-16 p-1 rounded-md text-[10px] font-medium transition-colors",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:bg-muted"
                )
              }
            >
              <item.icon className="w-5 h-5 mb-1" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </main>

      {/* Floating Action Button - Global */}
      <button 
        onClick={useStore.getState().openNewAppModal}
        className="fixed bottom-20 md:bottom-8 right-5 md:right-8 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center z-40"
        title={t.addNew}
      >
        <Plus className="w-6 h-6" />
      </button>

      {showGuide && (
        <GuideModal
          onClose={() => setShowGuide(false)}
          onDontShow={() => setShowGuide(false)}
        />
      )}
      <NewAppModal />
    </div>
  );
}
