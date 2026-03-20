import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isBefore, startOfDay } from 'date-fns';
import { tr as trLocale, enUS, de as deLocale, type Locale } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useLanguage, type Language } from '../contexts/LanguageContext';

const localeMap: Record<Language, Locale> = {
  tr: trLocale,
  en: enUS,
  de: deLocale,
};

export function CalendarView() {
  const { applications } = useStore();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { t, language } = useLanguage();
  const locale = localeMap[language];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfMonth(monthStart);
  const endDate = endOfMonth(monthEnd);

  // Pad the dates to always show full weeks (Mon-start)
  const startDay = startDate.getDay(); // Sunday = 0, Monday = 1
  const daysToPrepend = startDay === 0 ? 6 : startDay - 1;
  const calendarStart = new Date(startDate);
  calendarStart.setDate(startDate.getDate() - daysToPrepend);

  const daysToAppend = 42 - (Math.floor((endDate.getTime() - calendarStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const calendarEnd = new Date(endDate);
  calendarEnd.setDate(endDate.getDate() + daysToAppend);

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Gather deadlines
  const events = applications.flatMap(app =>
    app.stages
      .filter(s => s.deadline)
      .map(s => ({
        id: s.id,
        appId: app.id,
        title: `${app.companyName}`,
        stageName: s.name,
        date: parseISO(s.deadline!),
        isCompleted: s.status === 'Tamamlandı' || s.status === 'Atlandı',
        priority: app.priority
      }))
  );

  return (
    <div className="space-y-6 flex flex-col h-full bg-background rounded-xl pb-20">
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-3xl font-bold tracking-tight">{t.calendarTitle}</h1>
        <div className="flex items-center gap-4 bg-card rounded-xl border p-1 shadow-sm">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><ChevronLeft className="w-5 h-5"/></button>
          <span className="font-bold min-w-[120px] text-center capitalize">{format(currentDate, 'MMMM yyyy', { locale })}</span>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><ChevronRight className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="flex-1 bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="grid grid-cols-7 border-b bg-muted/30">
          {t.weekDays.map(day => (
            <div key={day} className="py-2 text-center text-sm font-semibold text-muted-foreground border-r last:border-0">{day}</div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 grid-rows-6">
          {calendarDays.map((day) => {
            const dayEvents = events.filter(e => isSameDay(e.date, day));
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <div key={day.toString()} className={cn("p-1 sm:p-2 border-b border-r min-h-[80px] sm:min-h-[100px] flex flex-col gap-1 transition-colors", !isCurrentMonth && "bg-muted/10 opacity-50 text-muted-foreground", isToday && "bg-primary/5")}>
                <div className="flex justify-between items-center">
                  <span className={cn("text-xs sm:text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full", isToday && "bg-primary text-primary-foreground")}>
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-hide">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      onClick={() => navigate(`/app/${event.appId}`)}
                      className={cn(
                        "text-[10px] sm:text-xs p-1 rounded-sm cursor-pointer truncate border-l-2 mb-1",
                        event.isCompleted ? "bg-green-50 text-green-700 border-green-500 opacity-60 line-through dark:bg-green-900/20" :
                        isBefore(event.date, startOfDay(new Date())) ? "bg-red-50 text-red-700 border-red-500 dark:bg-red-900/20" :
                        "bg-blue-50 text-blue-700 border-blue-500 shadow-sm dark:bg-blue-900/20"
                      )}
                      title={`${event.title} - ${event.stageName}`}
                    >
                      <span className="font-semibold block truncate">{event.title}</span>
                      <span className="truncate opacity-80">{event.stageName}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
