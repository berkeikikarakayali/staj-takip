import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'tr';

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

  // Maps for translating DB values (stored as Turkish) to display language
  statusMap: Record<string, string>;
  priorityMap: Record<string, string>;

  // Application Detail page
  appNotFound: string;
  backToDashboard: string;
  stageTracking: string;
  addStage: string;
  newStageName: string;
  deleteStageConfirm: string;
  deleteAppConfirm: string;
  deadline: string;
  stageTodo: string;
  stageInProgress: string;
  stageDone: string;
  stageSkipped: string;
  deleteStageTitle: string;
  save: string;
  editTitle: string;
  deleteTitle: string;
  statusLabel: string;
  appDetails: string;
  workModelAndType: string;
  expectedSalary: string;
  notSpecified: string;
  appLink: string;
  goToLink: string;
  source: string;
  contactAndNotes: string;
  contactPerson: string;
  generalNotes: string;
  noNotes: string;
  editCity: string;
  editWorkModel: string;
  editWorkModelPlaceholder: string;
  editInternshipType: string;
  editInternshipTypePlaceholder: string;
  editSalary: string;
  editAppLink: string;
  editSourcePlatform: string;
  editSourcePlatformPlaceholder: string;
  editContactName: string;
  editContactEmail: string;
  editCompanyName: string;
  editPosition: string;

  // NewAppModal
  modalTitle: string;
  modalStep: (step: number, total: number) => string;
  modalCompanyName: string;
  modalPosition: string;
  modalDepartment: string;
  modalCity: string;
  modalPriority: string;
  modalAppliedDate: string;
  modalStagesDesc: string;
  modalTemplateStandard: string;
  modalTemplateFast: string;
  modalTemplateDetailed: string;
  modalTemplateEmpty: string;
  modalNewStagePlaceholder: string;
  modalAdd: string;
  modalStageDeadlineTitle: string;
  modalDeleteStageTitle: string;
  modalFinalDesc: string;
  modalAppUrl: string;
  modalGeneralNote: string;
  modalGeneralNotePlaceholder: string;
  modalSummaryTitle: string;
  modalSummaryStages: (n: number) => string;
  modalSummaryPriority: string;
  modalBack: string;
  modalNext: string;
  modalSaving: string;
  modalSave: string;

  // Stage template names (used in NewAppModal)
  stageTemplates: {
    standart: string[];
    hizli: string[];
    detayli: string[];
    bos: string[];
  };

  // Onboarding Guide
  guideNav: string;
  guideTitle: string;
  guideSubtitle: string;
  guideContinue: string;
  guideDontShow: string;
  guideSteps: {
    title: string;
    desc: string;
    icon: string;
  }[];
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

    themeSection: 'Appearance & Theme',
    themeLight: 'Light',
    themeDark: 'Dark (Black/Grey)',
    themeLightBlue: 'Light Blue',
    themeDarkBlue: 'Dark Blue',

    dataSection: 'Data Management (Backup)',
    dataSectionDesc:
      'Export your application data as a JSON file for backup purposes, or import a previously exported file.',
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

    statusMap: {
      'Hazırlık': 'Preparation',
      'Başvuruldu': 'Applied',
      'Devam Ediyor': 'In Progress',
      'Mülakat': 'Interview',
      'Teklif': 'Offer',
      'Kabul': 'Accepted',
      'Red': 'Rejected',
      'İptal': 'Cancelled',
    },
    priorityMap: {
      'Küpk': 'Critical',
      'Kritik': 'Critical',
      'Yüksek': 'High',
      'Orta': 'Medium',
      'Düşük': 'Low',
    },

    appNotFound: 'Application Not Found',
    backToDashboard: 'Back to Dashboard',
    stageTracking: 'Stage Tracking',
    addStage: 'Add New Stage',
    newStageName: 'New Stage Name:',
    deleteStageConfirm: 'Are you sure you want to delete this stage?',
    deleteAppConfirm: 'Are you sure you want to delete this application?',
    deadline: 'Deadline:',
    stageTodo: 'To Do',
    stageInProgress: 'In Progress ⏳',
    stageDone: 'Done ✓',
    stageSkipped: 'Skipped ⏭',
    deleteStageTitle: 'Delete Stage',
    save: 'Save',
    editTitle: 'Edit Details',
    deleteTitle: 'Delete',
    statusLabel: 'Status:',
    appDetails: 'Application Details',
    workModelAndType: 'Work Model & Type',
    expectedSalary: 'Expected Salary',
    notSpecified: 'Not specified',
    appLink: 'Application Link',
    goToLink: 'Go to Link',
    source: 'Source',
    contactAndNotes: 'Contact & Notes',
    contactPerson: 'Contact Person',
    generalNotes: 'General Notes',
    noNotes: 'No notes added...',
    editCity: 'City / Location',
    editWorkModel: 'Work Model',
    editWorkModelPlaceholder: 'Remote, Hybrid, Office...',
    editInternshipType: 'Internship Type',
    editInternshipTypePlaceholder: 'Mandatory, Voluntary, etc.',
    editSalary: 'Expected Salary',
    editAppLink: 'Application Link (URL)',
    editSourcePlatform: 'Source Platform',
    editSourcePlatformPlaceholder: 'LinkedIn, Indeed, etc.',
    editContactName: 'Contact Person (Name/Title)',
    editContactEmail: 'Contact Email / Phone',
    editCompanyName: 'Company Name',
    editPosition: 'Position',

    modalTitle: 'Add New Application',
    modalStep: (step, total) => `Step ${step} / ${total}`,
    modalCompanyName: 'Company Name *',
    modalPosition: 'Position *',
    modalDepartment: 'Department',
    modalCity: 'City',
    modalPriority: 'Priority *',
    modalAppliedDate: 'Application Date *',
    modalStagesDesc: 'Select or customize the stages for this application.',
    modalTemplateStandard: 'Standard',
    modalTemplateFast: 'Quick',
    modalTemplateDetailed: 'Detailed',
    modalTemplateEmpty: 'Empty',
    modalNewStagePlaceholder: 'New stage name...',
    modalAdd: 'Add',
    modalStageDeadlineTitle: 'Stage Deadline',
    modalDeleteStageTitle: 'Delete Stage',
    modalFinalDesc: 'Final checks and optional details.',
    modalAppUrl: 'Application URL',
    modalGeneralNote: 'General Note',
    modalGeneralNotePlaceholder: 'Salary expectation, important details...',
    modalSummaryTitle: 'Summary',
    modalSummaryStages: (n) => `${n}-Stage Process`,
    modalSummaryPriority: 'Priority:',
    modalBack: 'Back',
    modalNext: 'Next',
    modalSaving: 'Saving...',
    modalSave: 'Save Application ✓',
    stageTemplates: {
      standart: ['Application Submitted', 'HR Interview', 'Technical Interview', 'Offer'],
      hizli: ['Application Submitted', 'Interview', 'Result'],
      detayli: ['Application Submitted', 'CV Sent', 'Online Test', 'HR Interview', 'Technical Interview', 'Final Interview', 'Reference Check', 'Offer Received'],
      bos: [],
    },
    guideNav: 'Guide',
    guideTitle: 'Welcome to StajTakip! 🎉',
    guideSubtitle: 'Here\'s a quick overview of how to get the most out of the app.',
    guideContinue: 'Get Started',
    guideDontShow: 'Don\'t show again',
    guideSteps: [
      { icon: '📥', title: 'Add Applications', desc: 'Click the ➕ button in the bottom right to add a new internship application. Fill in company name, position, city and priority.' },
      { icon: '📋', title: 'Track Stages', desc: 'Each application has stages (e.g. Applied → Interview → Offer). Mark stages as In Progress or Done to track where you stand.' },
      { icon: '📅', title: 'Calendar View', desc: 'The Calendar page shows all your stage deadlines in a monthly view. Deadlines close to today are highlighted.' },
      { icon: '📊', title: 'Statistics', desc: 'The Statistics page shows charts of your application statuses, priorities, and monthly trends.' },
      { icon: '💾', title: 'Backup & Import', desc: 'Go to Settings → Data Management to export your data as a JSON file or restore from a backup.' },
    ],
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

    themeSection: 'Görünüm & Tema',
    themeLight: 'Açık (Light)',
    themeDark: 'Koyu (Siyah/Gri)',
    themeLightBlue: 'Açık Mavi',
    themeDarkBlue: 'Koyu Mavi',

    dataSection: 'Veri Yönetimi (Yedekleme)',
    dataSectionDesc:
      'Başvuru verilerinizi yedekleme amaçlı olarak JSON dosyası olarak dışa aktarabilir veya daha önce indirdiğiniz bir yedek dosyasını içe aktarabilirsiniz.',
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

    upcomingDeadlines: "Yaklaşan Deadline'lar",
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

    statusMap: {
      'Hazırlık': 'Hazırlık',
      'Başvuruldu': 'Başvuruldu',
      'Devam Ediyor': 'Devam Ediyor',
      'Mülakat': 'Mülakat',
      'Teklif': 'Teklif',
      'Kabul': 'Kabul',
      'Red': 'Red',
      'İptal': 'İptal',
    },
    priorityMap: {
      'Kritik': 'Kritik',
      'Yüksek': 'Yüksek',
      'Orta': 'Orta',
      'Düşük': 'Düşük',
    },

    appNotFound: 'Başvuru Bulunamadı',
    backToDashboard: "Dashboard'a Dön",
    stageTracking: 'Aşama Takibi',
    addStage: 'Yeni Aşama Ekle',
    newStageName: 'Yeni Aşama Adı:',
    deleteStageConfirm: 'Bu aşamayı silmek istediğinize emin misiniz?',
    deleteAppConfirm: 'Bu başvuruyu silmek istediğinize emin misiniz?',
    deadline: 'Son Tarih:',
    stageTodo: 'Yapılacak',
    stageInProgress: 'Devam Ediyor ⏳',
    stageDone: 'Tamamlandı ✓',
    stageSkipped: 'Atlandı ⏭',
    deleteStageTitle: 'Aşamayı Sil',
    save: 'Kaydet',
    editTitle: 'Ayrıntıları Düzenle',
    deleteTitle: 'Sil',
    statusLabel: 'Durum:',
    appDetails: 'Başvuru Detayları',
    workModelAndType: 'Çalışma Modeli & Türü',
    expectedSalary: 'Beklenen Maaş',
    notSpecified: 'Belirtilmedi',
    appLink: 'Başvuru Linki',
    goToLink: 'Linke Git',
    source: 'Kaynak',
    contactAndNotes: 'İletişim & Notlar',
    contactPerson: 'İletişim Kişisi',
    generalNotes: 'Genel Notlar',
    noNotes: 'Not eklenmemiş...',
    editCity: 'Şehir/Konum',
    editWorkModel: 'Çalışma Modeli',
    editWorkModelPlaceholder: 'Uzaktan, Hibrit, Ofis...',
    editInternshipType: 'Staj Türü',
    editInternshipTypePlaceholder: 'Zorunlu, Gönüllü, vb.',
    editSalary: 'Beklenen Maaş',
    editAppLink: 'Başvuru Linki (URL)',
    editSourcePlatform: 'Kaynak Platform',
    editSourcePlatformPlaceholder: 'LinkedIn, Kariyer, vb.',
    editContactName: 'İletişim Kişisi (Ad/Unvan)',
    editContactEmail: 'İletişim E-posta / Telefon',
    editCompanyName: 'Şirket Adı',
    editPosition: 'Pozisyon',

    modalTitle: 'Yeni Başvuru Ekle',
    modalStep: (step, total) => `Adım ${step} / ${total}`,
    modalCompanyName: 'Şirket Adı *',
    modalPosition: 'Pozisyon *',
    modalDepartment: 'Departman',
    modalCity: 'Şehir',
    modalPriority: 'Öncelik *',
    modalAppliedDate: 'Başvuru Tarihi *',
    modalStagesDesc: 'Bu başvurunun aşamalarını seçin veya kendiniz ekleyin.',
    modalTemplateStandard: 'Standart',
    modalTemplateFast: 'Hızlı',
    modalTemplateDetailed: 'Detaylı',
    modalTemplateEmpty: 'Boş',
    modalNewStagePlaceholder: 'Yeni aşama adı...',
    modalAdd: 'Ekle',
    modalStageDeadlineTitle: 'Aşama Son Tarihi (Deadline)',
    modalDeleteStageTitle: 'Aşamayı Sil',
    modalFinalDesc: 'Son kontroller ve isteğe bağlı detaylar.',
    modalAppUrl: 'Başvuru URL',
    modalGeneralNote: 'Genel Not',
    modalGeneralNotePlaceholder: 'Maaş beklentisi, önemli detaylar...',
    modalSummaryTitle: 'Özet',
    modalSummaryStages: (n) => `${n} Aşamalı Süreç`,
    modalSummaryPriority: 'Öncelik:',
    modalBack: 'Geri',
    modalNext: 'İleri',
    modalSaving: 'Kaydediliyor...',
    modalSave: 'Başvuruyu Kaydet ✓',
    stageTemplates: {
      standart: ['Online Başvuru Yapıldı', 'IK Görüşmesi', 'Teknik Mülakat', 'Teklif'],
      hizli: ['Online Başvuru Yapıldı', 'Mülakat', 'Sonuç'],
      detayli: ['Online Başvuru Yapıldı', 'CV Gönderildi', 'Online Test', 'IK Görüşmesi', 'Teknik Mülakat', 'Final Mülakatı', 'Referans Kontrolü', 'Teklif Alındı'],
      bos: [],
    },
    guideNav: 'Rehber',
    guideTitle: 'StajTakip\'e Hoş Geldin! 🎉',
    guideSubtitle: 'Uygulamayı en iyi şekilde kullanmak için hızlı bir özet.',
    guideContinue: 'Başlayalim',
    guideDontShow: 'Bir daha gösterme',
    guideSteps: [
      { icon: '📥', title: 'Başvuru Ekle', desc: 'Sağ alttaki ➕ butonuna tıklayarak yeni staj başvurusu ekle. Şirket adı, pozisyon, şehir ve öncelik bilgilerini gir.' },
      { icon: '📋', title: 'Aşama Takibi', desc: 'Her başvurunun aşamaları var (Başvuruldu → Mülakat → Teklif). Aşamaları Devam Ediyor veya Tamamlandı olarak işaretle.' },
      { icon: '📅', title: 'Takvim', desc: 'Takvim sayfasında tüm aşama deadlinelarını görebilirsin. Bugüne yakın olanlar vurgulanir.' },
      { icon: '📊', title: 'İstatistikler', desc: 'İstatistikler sayfası başvurularının durum, öncelik ve aylık trend grafikleri ile durumunu gösterir.' },
      { icon: '💾', title: 'Yedekleme & İçe Aktarma', desc: 'Ayarlar → Veri Yönetimi\'nden verilerini JSON dosyası olarak dışa aktar veya yedekten geri yükle.' },
    ],
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
    return stored && ['en', 'tr'].includes(stored) ? stored : 'en';
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
