import React, { useRef } from 'react';
import { useStore } from '../store/useStore';
import { Download, Upload, Trash2, ShieldAlert, Palette } from 'lucide-react';
import { format } from 'date-fns';

export function Settings() {
  const { applications, theme, setTheme } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          // Simply replace state directly via localstorage or store functions
          if (confirm(`Uyarı: Bu işlem mevcut tüm verilerinizi silecek ve yüklediğiniz dosyadaki verileri ekleyecektir (${obj.applications.length} başvuru). Devam etmek istiyor musunuz?`)) {
            // we rely on zustand setting all. To do that simply, we can set localStorage and reload
            localStorage.setItem('stajtakip-storage', JSON.stringify({ state: { applications: obj.applications }, version: 0 }));
            window.location.reload();
          }
        } else {
          alert('Geçersiz dosya formatı. Lütfen StajTakip tarafından oluşturulmuş bir yedek dosyası seçin.');
        }
      } catch (err) {
        alert('Dosya okunurken bir hata oluştu.');
      }
    };
    reader.readAsText(file);
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearAll = () => {
    if (confirm('DİKKAT! Tüm başvuru verileriniz kalıcı olarak silinecektir. Bu işlem geri alınamaz. Emin misiniz?')) {
      localStorage.removeItem('stajtakip-storage');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ayarlar</h1>
        <p className="text-muted-foreground mt-2">Verilerinizi yedekleyin, içe aktarın ve uygulamanızı yönetin.</p>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
        <div className="p-6 border-b flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Görünüm & Tema</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button onClick={() => setTheme('light')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
              <div className="w-8 h-8 rounded-full bg-slate-100 border shadow-sm"></div>
              <span className="text-sm font-medium text-center">Açık (Light)</span>
            </button>
            <button onClick={() => setTheme('dark')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 shadow-sm"></div>
              <span className="text-sm font-medium text-center">Koyu (Siyah/Gri)</span>
            </button>
            <button onClick={() => setTheme('theme-light-blue')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'theme-light-blue' ? 'border-blue-500 bg-blue-500/5' : 'border-border hover:border-blue-500/50'}`}>
              <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 shadow-sm"></div>
              <span className="text-sm font-medium text-center">Açık Mavi</span>
            </button>
            <button onClick={() => setTheme('theme-dark-blue')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'theme-dark-blue' ? 'border-blue-500 bg-blue-500/5' : 'border-border hover:border-blue-500/50'}`}>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-blue-500/40 shadow-sm"></div>
              <span className="text-sm font-medium text-center">Koyu Mavi</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Veri Yönetimi (Yedekleme)</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Uygulama arka ucu (backend) olmadığı için tüm verileriniz yalnızca tarayıcınızın içinde saklanmaktadır. Veri kaybı yaşamamak için düzenli olarak dışa aktarmanızı öneririz.
          </p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg bg-muted/20">
            <div>
              <h3 className="font-semibold text-base">Verileri Dışa Aktar (Export)</h3>
              <p className="text-sm text-muted-foreground">Tüm başvurularınızı bir JSON dosyası olarak indirir.</p>
            </div>
            <button onClick={handleExport} className="flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm inline-flex items-center">
              <Download className="w-4 h-4 mr-2" /> Dışa Aktar
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg bg-muted/20">
            <div>
              <h3 className="font-semibold text-base">Verileri İçe Aktar (Import)</h3>
              <p className="text-sm text-muted-foreground">Daha önce indirdiğiniz ".json" uzantılı yedek dosyasını yükler.</p>
            </div>
            <div>
              <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
              <button onClick={() => fileInputRef.current?.click()} className="flex-shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md font-medium text-sm inline-flex items-center">
                <Upload className="w-4 h-4 mr-2" /> İçe Aktar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-destructive/10 border-destructive/20 rounded-xl border overflow-hidden">
        <div className="p-6 border-b border-destructive/20 flex items-center gap-2">
          <ShieldAlert className="text-destructive w-5 h-5" />
          <h2 className="text-xl font-semibold text-destructive">Tehlikeli Bölge</h2>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-base">Tüm Verileri Sil</h3>
              <p className="text-sm text-muted-foreground text-destructive/80">
                Tarayıcıdaki tüm staj başvuru verilerinizi temizler.
              </p>
            </div>
            <button onClick={handleClearAll} className="flex-shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md font-medium text-sm inline-flex items-center">
              <Trash2 className="w-4 h-4 mr-2" /> Verileri Temizle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
