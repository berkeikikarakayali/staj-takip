import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import type { Application } from '../types';
import { isBefore, addDays, formatDistanceToNow, parseISO } from 'date-fns';
import { tr as trLocale, enUS, type Locale } from 'date-fns/locale';
import { Search, Plus, List, Grid } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage, type Language } from '../contexts/LanguageContext';

const localeMap: Record<Language, Locale> = {
  tr: trLocale,
  en: enUS,
};

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
    { label: t.statTotal,    value: stats.total,    color: 'text-gray-600'   },
    { label: t.statActive,   value: stats.active,   color: 'text-blue-500'   },
    { label: t.statAccepted, value: stats.accepted, color: 'text-green-600'  },
    { label: t.statRejected, value: stats.rejected, color: 'text-red-500'    },
    { label: t.statWaiting,  value: stats.waiting,  color: 'text-yellow-600' },
    { label: t.statUpcoming, value: stats.urgent,   color: 'text-orange-500' },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {cards.map((c, i) => (
        <div key={i} className="min-w-[120px] flex-shrink-0 border rounded-md p-3 bg-card">
          <p className="text-xs text-muted-foreground">{c.label}</p>
          <p className={cn('text-2xl font-bold', c.color)}>{c.value}</p>
        </div>
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
      .map(s => ({ app, stage: s, date: parseISO(s.deadline!) }))
  ).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);

  if (allDeadlines.length === 0) return null;

  return (
    <div className="border rounded-md bg-card">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm text-orange-600">{t.upcomingDeadlines}</h3>
      </div>
      <div className="divide-y">
        {allDeadlines.map((item, i) => {
          const isPast = isBefore(item.date, new Date());
          const daysLeft = Math.ceil((item.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          const isUrgent = daysLeft <= 3 && !isPast;

          return (
            <div key={i} className="flex justify-between items-center px-3 py-2">
              <div>
                <p className="text-sm font-medium">{item.app.companyName}</p>
                <p className="text-xs text-muted-foreground">{item.stage.name}</p>
              </div>
              <div className="text-right">
                <p className={cn('text-xs font-medium', isPast ? 'text-red-500' : isUrgent ? 'text-orange-500' : 'text-muted-foreground')}>
                  {isPast ? t.badgePast : isUrgent ? t.badgeUrgent : t.daysLeft(daysLeft)}
                </p>
                <p className="text-[10px] text-muted-foreground">{formatDistanceToNow(item.date, { addSuffix: true, locale })}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';

function ApplicationCard({ app }: { app: Application }) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const locale = localeMap[language];

  const priorityColor: Record<string, string> = {
    'Kritik': 'text-red-600',
    'Yüksek': 'text-orange-500',
    'Orta': 'text-blue-500',
    'Düşük': 'text-green-600',
  };

  const currentStage = app.stages.find(s => s.status !== 'Tamamlandı' && s.status !== 'Atlandı') || app.stages[app.stages.length - 1];
  const progressPercent = app.stages.length > 0
    ? Math.round((app.stages.filter(s => s.status === 'Tamamlandı' || s.status === 'Atlandı').length / app.stages.length) * 100)
    : 0;

  return (
    <div
      onClick={() => navigate(`/app/${app.id}`)}
      className="border rounded-md p-4 bg-card cursor-pointer hover:border-primary transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{app.companyName}</h3>
          <p className="text-sm text-muted-foreground truncate">{app.position}</p>
        </div>
        <span className={cn('text-xs font-medium ml-2 flex-shrink-0', priorityColor[app.priority] || 'text-muted-foreground')}>
          {t.priorityMap[app.priority] || app.priority}
        </span>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">{t.progress}</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-muted h-1.5 rounded-full">
          <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="flex justify-between items-center text-xs">
        <span className="bg-muted px-2 py-0.5 rounded text-muted-foreground">
          {t.statusMap[app.status] || app.status}
        </span>
        <span className="text-muted-foreground">
          {t.updated} {formatDistanceToNow(parseISO(app.updatedAt), { addSuffix: true, locale })}
        </span>
      </div>

      {currentStage && (
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {t.next} {currentStage.name}
        </p>
      )}
    </div>
  );
}

export function Dashboard() {
  const applications = useStore(state => state.applications);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { t } = useLanguage();

  const filteredApps = applications.filter(app =>
    app.companyName.toLowerCase().includes(search.toLowerCase()) ||
    app.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-20">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <SummaryCards apps={applications} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="w-full h-9 pl-9 pr-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={cn('p-2', view === 'grid' ? 'bg-muted' : 'hover:bg-muted/50')}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={cn('p-2 border-l', view === 'list' ? 'bg-muted' : 'hover:bg-muted/50')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {filteredApps.length === 0 ? (
            <div className="border border-dashed rounded-md p-10 text-center">
              <p className="font-medium mb-1">{t.noAppsTitle}</p>
              <p className="text-sm text-muted-foreground mb-4">{t.noAppsDesc}</p>
              <button className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md inline-flex items-center gap-1 hover:bg-primary/90">
                <Plus className="w-4 h-4" /> {t.addFirstApp}
              </button>
            </div>
          ) : (
            <div className={cn('gap-3', view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'flex flex-col')}>
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
