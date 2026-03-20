import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import type { Application } from '../types';
import { isBefore, addDays, formatDistanceToNow, parseISO } from 'date-fns';
import { tr as trLocale, enUS, type Locale } from 'date-fns/locale';
import { Search, Plus, List, Grid, MoreVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage, type Language } from '../contexts/LanguageContext';

const localeMap: Record<Language, Locale> = {
  tr: trLocale,
  en: enUS,
};

// Instead of UI library components that might be missing, I'll use standard Tailwind to ensure it works properly, but I will simulate the Shadcn look in case it isn't properly wired.
const Card = ({ children, className }: any) => <div className={cn("rounded-xl border bg-card text-card-foreground shadow", className)}>{children}</div>;
const CardContent = ({ children, className }: any) => <div className={cn("p-6 pt-0", className)}>{children}</div>;
const Button = ({ children, variant = 'default', size = 'default', className, ...props }: any) => {
  const variants: any = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  };
  const sizes: any = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    icon: "h-10 w-10 flex items-center justify-center p-0"
  };
  return (
    <button className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
};
const Badge = ({ children, className, variant = "default" }: any) => {
  const variants: any = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground"
  };
  return <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)}>{children}</div>;
}

function SummaryCards({ apps }: { apps: Application[] }) {
  const { t } = useLanguage();

  const stats = {
    total: apps.length,
    active: apps.filter(a => !['Kabul', 'Red', 'İptal'].includes(a.status)).length,
    accepted: apps.filter(a => a.status === 'Kabul').length,
    rejected: apps.filter(a => a.status === 'Red').length,
    waiting: apps.filter(a => a.status === 'Teklif').length,
    urgent: apps.flatMap(a => a.stages).filter(s => s.deadline && s.status !== 'Tamamlandı' && isBefore(parseISO(s.deadline), addDays(new Date(), 7))).length
  };

  const cards = [
    { label: t.statTotal,    value: stats.total,    color: 'text-gray-500',   bg: 'bg-gray-100 dark:bg-gray-800' },
    { label: t.statActive,   value: stats.active,   color: 'text-blue-500',   bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: t.statAccepted, value: stats.accepted, color: 'text-green-500',  bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: t.statRejected, value: stats.rejected, color: 'text-red-500',    bg: 'bg-red-100 dark:bg-red-900/30' },
    { label: t.statWaiting,  value: stats.waiting,  color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { label: t.statUpcoming, value: stats.urgent,   color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {cards.map((c, i) => (
        <Card key={i} className="min-w-[140px] flex-shrink-0">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">{c.label}</span>
            <span className={cn("text-3xl font-bold rounded-lg px-2 -ml-2 w-fit", c.color, c.bg)}>{c.value}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

function DeadlinePanel({ apps }: { apps: Application[] }) {
  const { t, language } = useLanguage();
  const locale = localeMap[language];

  const allDeadlines = apps.flatMap(app =>
    app.stages
      .filter(s => s.deadline && s.status !== 'Tamamlandı' && s.status !== 'Atlandı')
      .map(s => ({
        app,
        stage: s,
        date: parseISO(s.deadline!)
      }))
  ).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);

  if (allDeadlines.length === 0) return null;

  return (
    <Card className="mb-6 border-orange-200 dark:border-orange-900/50">
      <div className="p-4 border-b bg-orange-50/50 dark:bg-orange-900/10">
        <h3 className="font-semibold text-orange-700 dark:text-orange-400">{t.upcomingDeadlines}</h3>
      </div>
      <CardContent className="p-0">
        <div className="divide-y">
          {allDeadlines.map((item, i) => {
            const isPast = isBefore(item.date, new Date());
            const daysLeft = Math.ceil((item.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const isUrgent = daysLeft <= 3 && !isPast;

            return (
              <div key={i} className="flex justify-between items-center p-4 hover:bg-muted/50 cursor-pointer">
                <div>
                  <div className="font-semibold text-sm">{item.app.companyName}</div>
                  <div className="text-xs text-muted-foreground">{item.stage.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={isPast ? "destructive" : isUrgent ? "default" : "secondary"} className={
                    isUrgent && !isPast ? "bg-orange-500 hover:bg-orange-600 border-none" : ""
                  }>
                    {isPast ? t.badgePast : isUrgent ? t.badgeUrgent : t.daysLeft(daysLeft)}
                  </Badge>
                  <div className="text-xs font-mono">{formatDistanceToNow(item.date, { addSuffix: true, locale })}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to wrap component in navigation context if needed, but ApplicationCard is inside Dashboard which is inside Router.
import { useNavigate } from 'react-router-dom';

function ApplicationCard({ app }: { app: Application }) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const locale = localeMap[language];

  const priorityColor = {
    'Düşük': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Orta': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'Yüksek': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    'Kritik': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }[app.priority] || 'bg-gray-100 text-gray-800';

  const currentStage = app.stages.find(s => s.status !== 'Tamamlandı' && s.status !== 'Atlandı') || app.stages[app.stages.length - 1];
  const progressPercent = app.stages.length > 0 ? Math.round((app.stages.filter(s => s.status === 'Tamamlandı' || s.status === 'Atlandı').length / app.stages.length) * 100) : 0;

  return (
    <div onClick={() => navigate(`/app/${app.id}`)} className="cursor-pointer">
      <Card className="hover:shadow-md transition-shadow relative overflow-hidden group h-full">
        <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <Badge className={cn("rounded-sm border-none pointer-events-none shadow-none text-[10px]", priorityColor)} variant="outline">
            {app.priority === 'Kritik' ? '🔴' : app.priority === 'Yüksek' ? '🟠' : app.priority === 'Düşük' ? '🟢' : '🔵'} {t.priorityMap[app.priority] || app.priority}
          </Badge>
          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 -mr-2 -mt-2">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-bold truncate">{app.companyName}</h3>
          <p className="text-sm font-medium text-muted-foreground truncate">{app.position}</p>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {app.location && `📍 ${app.location}`} {app.location && app.workModel && ' • '} {app.workModel && app.workModel}
          </p>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-muted-foreground">{t.progress}</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mb-4">
            <div className="bg-primary h-full transition-all" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="space-y-1">
            {currentStage && (
              <p className="text-xs truncate"><span className="text-muted-foreground">{t.next}</span> {currentStage.name}</p>
            )}
            <div className="flex justify-between items-center text-xs">
               <span className="font-medium px-2 py-0.5 rounded bg-muted">
                 {t.statusMap[app.status] || app.status}
               </span>
               <span className="text-muted-foreground text-[10px]">
                 {t.updated} {formatDistanceToNow(parseISO(app.updatedAt), { addSuffix: true, locale })}
               </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
    </div>
  );
}

export function Dashboard() {
  const applications = useStore(state => state.applications);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid'|'list'>('grid');
  const { t } = useLanguage();

  const filteredApps = applications.filter(app =>
    app.companyName.toLowerCase().includes(search.toLowerCase()) ||
    app.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20"> {/* pb-20 for FAB space */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <SummaryCards apps={applications} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex gap-2 items-center flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex rounded-md border p-1 bg-muted/50">
              <button
                onClick={() => setView('grid')}
                className={cn("p-1.5 rounded-sm text-muted-foreground", view === 'grid' && "bg-background text-foreground shadow-sm")}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={cn("p-1.5 rounded-sm text-muted-foreground", view === 'list' && "bg-background text-foreground shadow-sm")}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {filteredApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <List className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{t.noAppsTitle}</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">{t.noAppsDesc}</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> {t.addFirstApp}
              </Button>
            </div>
          ) : (
            <div className={cn(
              "grid gap-4",
              view === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
            )}>
              {filteredApps.map(app => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <DeadlinePanel apps={applications} />
        </div>
      </div>
    </div>
  );
}
