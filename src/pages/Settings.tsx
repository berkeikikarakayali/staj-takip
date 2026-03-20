import React, { useRef } from 'react';
import { useStore } from '../store/useStore';
import { Download, Upload, Trash2, ShieldAlert, Palette, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage, type Language } from '../contexts/LanguageContext';

const LANGUAGES: { code: Language; flag: string }[] = [
  { code: 'en', flag: 'EN' },
  { code: 'tr', flag: 'TR' },
];

export function Settings() {
  const { applications, theme, setTheme } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language, setLanguage, t } = useLanguage();

  const langLabels: Record<Language, string> = {
    en: t.langEn,
    tr: t.langTr,
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ applications }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `stajtakip_yedek_${format(new Date(), 'yyyyMMdd_HHmm')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const obj = JSON.parse(event.target?.result as string);
        if (obj && Array.isArray(obj.applications)) {
          if (confirm(t.confirmImport(obj.applications.length))) {
            localStorage.setItem(
              'stajtakip-storage',
              JSON.stringify({ state: { applications: obj.applications }, version: 0 })
            );
            window.location.reload();
          }
        } else {
          alert(t.invalidFile);
        }
      } catch (err) {
        alert(t.fileReadError);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearAll = () => {
    if (confirm(t.confirmClear)) {
      localStorage.removeItem('stajtakip-storage');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.settingsTitle}</h1>
        <p className="text-muted-foreground mt-2">{t.settingsSubtitle}</p>
      </div>

      {/* Language Section */}
      <div className="border rounded-md bg-card">
        <div className="px-4 py-3 border-b flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">{t.languageSection}</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-4">{t.languageSectionDesc}</p>
          <div className="flex flex-wrap gap-3">
            {LANGUAGES.map(({ code, flag }) => (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                  language === code
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <span className="text-xl">{flag}</span>
                <span>{langLabels[code]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Theme Section */}
      <div className="border rounded-md bg-card">
        <div className="px-4 py-3 border-b flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">{t.themeSection}</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button onClick={() => setTheme('light')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
              <div className="w-8 h-8 rounded-full bg-slate-100 border shadow-sm"></div>
              <span className="text-sm font-medium text-center">{t.themeLight}</span>
            </button>
            <button onClick={() => setTheme('dark')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 shadow-sm"></div>
              <span className="text-sm font-medium text-center">{t.themeDark}</span>
            </button>
            <button onClick={() => setTheme('theme-light-blue')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'theme-light-blue' ? 'border-blue-500 bg-blue-500/5' : 'border-border hover:border-blue-500/50'}`}>
              <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 shadow-sm"></div>
              <span className="text-sm font-medium text-center">{t.themeLightBlue}</span>
            </button>
            <button onClick={() => setTheme('theme-dark-blue')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'theme-dark-blue' ? 'border-blue-500 bg-blue-500/5' : 'border-border hover:border-blue-500/50'}`}>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-blue-500/40 shadow-sm"></div>
              <span className="text-sm font-medium text-center">{t.themeDarkBlue}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="border rounded-md bg-card">
        <div className="px-4 py-3 border-b">
          <h2 className="font-semibold">{t.dataSection}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t.dataSectionDesc}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg bg-muted/20">
            <div>
              <h3 className="font-semibold text-base">{t.exportTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.exportDesc}</p>
            </div>
            <button onClick={handleExport} className="flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm inline-flex items-center">
              <Download className="w-4 h-4 mr-2" /> {t.exportBtn}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg bg-muted/20">
            <div>
              <h3 className="font-semibold text-base">{t.importTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.importDesc}</p>
            </div>
            <div>
              <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
              <button onClick={() => fileInputRef.current?.click()} className="flex-shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md font-medium text-sm inline-flex items-center">
                <Upload className="w-4 h-4 mr-2" /> {t.importBtn}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-destructive/30 rounded-md">
        <div className="px-4 py-3 border-b border-destructive/30 flex items-center gap-2">
          <ShieldAlert className="text-destructive w-5 h-5" />
          <h2 className="text-xl font-semibold text-destructive">{t.dangerZone}</h2>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-base">{t.clearAll}</h3>
              <p className="text-sm text-muted-foreground text-destructive/80">{t.clearAllDesc}</p>
            </div>
            <button onClick={handleClearAll} className="flex-shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md font-medium text-sm inline-flex items-center">
              <Trash2 className="w-4 h-4 mr-2" /> {t.clearBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
