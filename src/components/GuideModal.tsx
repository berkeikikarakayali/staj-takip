import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const GUIDE_SEEN_KEY = 'stajtakip-guide-seen';

export function checkShouldShowGuide(): boolean {
  return localStorage.getItem(GUIDE_SEEN_KEY) !== 'true';
}

interface GuideModalProps {
  onClose: () => void;
  onDontShow: () => void;
}

export function GuideModal({ onClose, onDontShow }: GuideModalProps) {
  const { t } = useLanguage();

  const handleDontShow = () => {
    localStorage.setItem(GUIDE_SEEN_KEY, 'true');
    onDontShow();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-lg border shadow-lg flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b">
          <div>
            <h2 className="text-lg font-bold">{t.guideTitle}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{t.guideSubtitle}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded ml-4 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps */}
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {t.guideSteps.map((step, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-md border bg-muted/30">
              <span className="text-xl flex-shrink-0">{step.icon}</span>
              <div>
                <p className="font-medium text-sm">{i + 1}. {step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex items-center justify-between">
          <button
            onClick={handleDontShow}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {t.guideDontShow}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
          >
            {t.guideContinue}
          </button>
        </div>
      </div>
    </div>
  );
}
