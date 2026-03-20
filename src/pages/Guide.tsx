import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function GuidePage() {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-xl mx-auto pb-20 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.guideTitle}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t.guideSubtitle}</p>
      </div>

      <div className="space-y-3">
        {t.guideSteps.map((step, i) => (
          <div key={i} className="border rounded-lg p-4 bg-card flex gap-4">
            <div className="text-2xl flex-shrink-0 w-8 text-center">{step.icon}</div>
            <div>
              <p className="font-semibold text-sm mb-0.5">{i + 1}. {step.title}</p>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground border-t pt-4">
        💡 {language === 'tr'
          ? 'Sağ alt köşedeki ➕ butonuyla istediğin zaman yeni başvuru ekleyebilirsin.'
          : 'Use the ➕ button in the bottom right corner to add a new application at any time.'}
      </p>
    </div>
  );
}
