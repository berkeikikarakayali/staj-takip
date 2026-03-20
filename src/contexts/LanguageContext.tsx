import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'tr' | 'de';

export interface Translations {
  // Layout / Nav
  dashboard: string;
  calendar: string;
  stats: string;
  settings: string;
  profileAndSettings: string;
  signOut: string;
  addNew: string;

  // Settings page
  settingsTitle: string;
  settingsSubtitle: string;

  // Language section
  languageSection: string;
  languageSectionDesc: string;
  langEn: string;
  langTr: string;
  langDe: string;

  // Theme section
  themeSection: string;
  themeLight: string;
  themeDark: string;
  themeLightBlue: string;
  themeDarkBlue: string;

  // Data section
  dataSection: string;
  dataSectionDesc: string;
  exportTitle: string;
  exportDesc: string;
  exportBtn: string;
  importTitle: string;
  importDesc: string;
  importBtn: string;

  // Danger zone
  dangerZone: string;
  clearAll: string;
  clearAllDesc: string;
  clearBtn: string;

  // Confirm dialogs
  confirmImport: (count: number) => string;
  invalidFile: string;
  fileReadError: string;
  confirmClear: string;

  // Dashboard summary cards
  statTotal: string;
  statActive: string;
  statAccepted: string;
  statRejected: string;
  statWaiting: string;
  statUpcoming: string;

  // Dashboard deadline panel
  upcomingDeadlines: string;
  badgePast: string;
  badgeUrgent: string;
  daysLeft: (n: number) => string;

  // Dashboard application card
  progress: string;
  next: string;
  updated: string;

  // Dashboard empty state
  noAppsTitle: string;
  noAppsDesc: string;
  addFirstApp: string;

  // Dashboard search
  searchPlaceholder: string;

  // Calendar page
  calendarTitle: string;
  weekDays: string[];

  // Stats page
  statsTitle: string;
  statsSubtitle: string;
  statsNoData: string;
  statsNoDataDesc: string;
  statsStatusDist: string;
  statsPriorityDist: string;
  statsMonthlyTrend: (year: number) => string;
  monthNames: string[];
  statusAccepted: string;
  statusRejected: string;
  statusOngoing: string;
  priorityCritical: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityLow: string;
}

const translations: Record<Language, Translations> = {
  en: {
    dashboard: 'Dashboard',
    calendar: 'Calendar',
    stats: 'Statistics',
    settings: 'Settings',
    profileAndSettings: 'Profile & Settings',
    signOut: 'Sign Out',
    addNew: 'Add New Application',

    settingsTitle: 'Settings',
    settingsSubtitle: 'Back up, import your data, and manage your application.',

    languageSection: 'Language',
    languageSectionDesc: 'Choose the display language for the application.',
    langEn: 'English',
    langTr: 'Turkish',
    langDe: 'German',

    themeSection: 'Appearance & Theme',
    themeLight: 'Light',
    themeDark: 'Dark (Black/Grey)',
    themeLightBlue: 'Light Blue',
    themeDarkBlue: 'Dark Blue',

    dataSection: 'Data Management (Backup)',
    dataSectionDesc:
      'Since there is no backend, all your data is stored only in your browser. We recommend exporting regularly to avoid data loss.',
    exportTitle: 'Export Data',
    exportDesc: 'Downloads all your applications as a JSON file.',
    exportBtn: 'Export',
    importTitle: 'Import Data',
    importDesc: 'Loads a previously downloaded ".json" backup file.',
    importBtn: 'Import',

    dangerZone: 'Danger Zone',
    clearAll: 'Delete All Data',
    clearAllDesc: 'Clears all internship application data from the browser.',
    clearBtn: 'Clear Data',

    confirmImport: (count) =>
      `Warning: This action will delete all your current data and add the data from the uploaded file (${count} applications). Do you want to continue?`,
    invalidFile: 'Invalid file format. Please select a backup file created by StajTakip.',
    fileReadError: 'An error occurred while reading the file.',
    confirmClear:
      'WARNING! All your application data will be permanently deleted. This action cannot be undone. Are you sure?',

    statTotal: 'Total',
    statActive: 'Active',
    statAccepted: 'Accepted',
    statRejected: 'Rejected',
    statWaiting: 'Pending',
    statUpcoming: 'Upcoming',

    upcomingDeadlines: 'Upcoming Deadlines',
    badgePast: 'OVERDUE',
    badgeUrgent: 'URGENT',
    daysLeft: (n) => `${n} day${n === 1 ? '' : 's'}`,

    progress: 'Progress',
    next: 'Next:',
    updated: 'Upd:',

    noAppsTitle: 'No applications yet',
    noAppsDesc: 'Start tracking your internship journey by adding your first application.',
    addFirstApp: 'Add First Application',

    searchPlaceholder: 'Search company or position...',

    calendarTitle: 'Calendar',
    weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],

    statsTitle: 'Statistics',
    statsSubtitle: 'Summary analysis and success charts of your applications.',
    statsNoData: 'No Data',
    statsNoDataDesc: 'You need to add at least one application to see statistics.',
    statsStatusDist: 'Status Distribution',
    statsPriorityDist: 'Priority Distribution',
    statsMonthlyTrend: (year) => `${year} Application Trend`,
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    statusAccepted: 'Accepted',
    statusRejected: 'Rejected',
    statusOngoing: 'Ongoing',
    priorityCritical: 'Critical',
    priorityHigh: 'High',
    priorityMedium: 'Medium',
    priorityLow: 'Low',
  },
  tr: {
    dashboard: 'Dashboard',
    calendar: 'Takvim',
    stats: 'İstatistikler',
    settings: 'Ayarlar',
    profileAndSettings: 'Profilim & Ayarlar',
    signOut: 'Çıkış Yap',
    addNew: 'Yeni Başvuru Ekle',

    settingsTitle: 'Ayarlar',
    settingsSubtitle: 'Verilerinizi yedekleyin, içe aktarın ve uygulamanızı yönetin.',

    languageSection: 'Dil',
    languageSectionDesc: 'Uygulamanın görüntüleme dilini seçin.',
    langEn: 'İngilizce',
    langTr: 'Türkçe',
    langDe: 'Almanca',

    themeSection: 'Görünüm & Tema',
    themeLight: 'Açık (Light)',
    themeDark: 'Koyu (Siyah/Gri)',
    themeLightBlue: 'Açık Mavi',
    themeDarkBlue: 'Koyu Mavi',

    dataSection: 'Veri Yönetimi (Yedekleme)',
    dataSectionDesc:
      'Uygulama arka ucu (backend) olmadığı için tüm verileriniz yalnızca tarayıcınızın içinde saklanmaktadır. Veri kaybı yaşamamak için düzenli olarak dışa aktarmanızı öneririz.',
    exportTitle: 'Verileri Dışa Aktar (Export)',
    exportDesc: 'Tüm başvurularınızı bir JSON dosyası olarak indirir.',
    exportBtn: 'Dışa Aktar',
    importTitle: 'Verileri İçe Aktar (Import)',
    importDesc: 'Daha önce indirdiğiniz ".json" uzantılı yedek dosyasını yükler.',
    importBtn: 'İçe Aktar',

    dangerZone: 'Tehlikeli Bölge',
    clearAll: 'Tüm Verileri Sil',
    clearAllDesc: 'Tarayıcıdaki tüm staj başvuru verilerinizi temizler.',
    clearBtn: 'Verileri Temizle',

    confirmImport: (count) =>
      `Uyarı: Bu işlem mevcut tüm verilerinizi silecek ve yüklediğiniz dosyadaki verileri ekleyecektir (${count} başvuru). Devam etmek istiyor musunuz?`,
    invalidFile:
      'Geçersiz dosya formatı. Lütfen StajTakip tarafından oluşturulmuş bir yedek dosyası seçin.',
    fileReadError: 'Dosya okunurken bir hata oluştu.',
    confirmClear:
      'DİKKAT! Tüm başvuru verileriniz kalıcı olarak silinecektir. Bu işlem geri alınamaz. Emin misiniz?',

    statTotal: 'Toplam',
    statActive: 'Aktif',
    statAccepted: 'Kabul',
    statRejected: 'Red',
    statWaiting: 'Beklemede',
    statUpcoming: 'Yaklaşan',

    upcomingDeadlines: 'Yaklaşan Deadline\'lar',
    badgePast: 'GEÇMİŞ',
    badgeUrgent: 'ACİL',
    daysLeft: (n) => `${n} gün`,

    progress: 'İlerleme',
    next: 'Sonraki:',
    updated: 'Gnc:',

    noAppsTitle: 'Henüz başvuru yok',
    noAppsDesc: 'İlk staj başvurunu ekleyerek süreci takip etmeye başlayabilirsin.',
    addFirstApp: 'İlk Başvurunu Ekle',

    searchPlaceholder: 'Şirket veya pozisyon ara...',

    calendarTitle: 'Takvim',
    weekDays: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],

    statsTitle: 'İstatistikler',
    statsSubtitle: 'Başvurularınızın özet analizleri ve başarı grafikleri.',
    statsNoData: 'Veri Yok',
    statsNoDataDesc: 'İstatistikleri görebilmek için en az bir başvuru eklemelisiniz.',
    statsStatusDist: 'Durum Dağılımı',
    statsPriorityDist: 'Öncelik Dağılımı',
    statsMonthlyTrend: (year) => `${year} Yılı Başvuru Trendi`,
    monthNames: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    statusAccepted: 'Kabul',
    statusRejected: 'Red',
    statusOngoing: 'Devam Ediyor',
    priorityCritical: 'Kritik',
    priorityHigh: 'Yüksek',
    priorityMedium: 'Orta',
    priorityLow: 'Düşük',
  },
  de: {
    dashboard: 'Dashboard',
    calendar: 'Kalender',
    stats: 'Statistiken',
    settings: 'Einstellungen',
    profileAndSettings: 'Profil & Einstellungen',
    signOut: 'Abmelden',
    addNew: 'Neue Bewerbung hinzufügen',

    settingsTitle: 'Einstellungen',
    settingsSubtitle: 'Sichern Sie Ihre Daten, importieren Sie sie und verwalten Sie Ihre Anwendung.',

    languageSection: 'Sprache',
    languageSectionDesc: 'Wählen Sie die Anzeigesprache der Anwendung.',
    langEn: 'Englisch',
    langTr: 'Türkisch',
    langDe: 'Deutsch',

    themeSection: 'Erscheinungsbild & Thema',
    themeLight: 'Hell',
    themeDark: 'Dunkel (Schwarz/Grau)',
    themeLightBlue: 'Hellblau',
    themeDarkBlue: 'Dunkelblau',

    dataSection: 'Datenverwaltung (Sicherung)',
    dataSectionDesc:
      'Da es kein Backend gibt, werden alle Ihre Daten nur in Ihrem Browser gespeichert. Wir empfehlen regelmäßige Exporte, um Datenverlust zu vermeiden.',
    exportTitle: 'Daten exportieren',
    exportDesc: 'Lädt alle Ihre Bewerbungen als JSON-Datei herunter.',
    exportBtn: 'Exportieren',
    importTitle: 'Daten importieren',
    importDesc: 'Lädt eine zuvor gespeicherte ".json"-Sicherungsdatei.',
    importBtn: 'Importieren',

    dangerZone: 'Gefahrenzone',
    clearAll: 'Alle Daten löschen',
    clearAllDesc: 'Löscht alle Praktikumsbewerbungsdaten aus dem Browser.',
    clearBtn: 'Daten löschen',

    confirmImport: (count) =>
      `Warnung: Diese Aktion löscht alle Ihre aktuellen Daten und fügt die Daten aus der hochgeladenen Datei hinzu (${count} Bewerbungen). Möchten Sie fortfahren?`,
    invalidFile:
      'Ungültiges Dateiformat. Bitte wählen Sie eine von StajTakip erstellte Sicherungsdatei.',
    fileReadError: 'Beim Lesen der Datei ist ein Fehler aufgetreten.',
    confirmClear:
      'ACHTUNG! Alle Ihre Bewerbungsdaten werden dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden. Sind Sie sicher?',

    statTotal: 'Gesamt',
    statActive: 'Aktiv',
    statAccepted: 'Angenommen',
    statRejected: 'Abgelehnt',
    statWaiting: 'Ausstehend',
    statUpcoming: 'Bevorstehend',

    upcomingDeadlines: 'Bevorstehende Deadlines',
    badgePast: 'ABGELAUFEN',
    badgeUrgent: 'DRINGEND',
    daysLeft: (n) => `${n} Tag${n === 1 ? '' : 'e'}`,

    progress: 'Fortschritt',
    next: 'Nächstes:',
    updated: 'Akt:',

    noAppsTitle: 'Noch keine Bewerbungen',
    noAppsDesc: 'Fügen Sie Ihre erste Bewerbung hinzu, um den Prozess zu verfolgen.',
    addFirstApp: 'Erste Bewerbung hinzufügen',

    searchPlaceholder: 'Unternehmen oder Position suchen...',

    calendarTitle: 'Kalender',
    weekDays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],

    statsTitle: 'Statistiken',
    statsSubtitle: 'Zusammenfassende Analysen und Erfolgsdiagramme Ihrer Bewerbungen.',
    statsNoData: 'Keine Daten',
    statsNoDataDesc: 'Sie müssen mindestens eine Bewerbung hinzufügen, um Statistiken zu sehen.',
    statsStatusDist: 'Statusverteilung',
    statsPriorityDist: 'Prioritätsverteilung',
    statsMonthlyTrend: (year) => `Bewerbungstrend ${year}`,
    monthNames: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    statusAccepted: 'Angenommen',
    statusRejected: 'Abgelehnt',
    statusOngoing: 'Laufend',
    priorityCritical: 'Kritisch',
    priorityHigh: 'Hoch',
    priorityMedium: 'Mittel',
    priorityLow: 'Niedrig',
  },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('stajtakip-language') as Language | null;
    return stored && ['en', 'tr', 'de'].includes(stored) ? stored : 'en';
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem('stajtakip-language', lang);
    setLanguageState(lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
