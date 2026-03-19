import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BarChart3, 
  Settings,
  BriefcaseBusiness,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { NewAppModal } from './NewAppModal';

export function Layout() {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/calendar', icon: CalendarDays, label: 'Takvim' },
    { to: '/stats', icon: BarChart3, label: 'İstatistikler' },
    { to: '/settings', icon: Settings, label: 'Ayarlar' },
  ];

  return (
    <div className="flex h-[100dvh] bg-muted/20">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-background">
        <div className="p-6 border-b flex items-center gap-2">
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="md:hidden flex items-center h-14 border-b bg-background px-4">
          <BriefcaseBusiness className="w-5 h-5 text-primary mr-2" />
          <span className="font-bold">StajTakip</span>
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
        className="fixed bottom-20 md:bottom-10 right-6 md:right-10 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center z-40 focus:outline-none focus:ring-4 focus:ring-primary/30"
        title="Yeni Başvuru Ekle"
      >
        <Plus className="w-6 h-6" />
      </button>

      <NewAppModal />
    </div>
  );
}
