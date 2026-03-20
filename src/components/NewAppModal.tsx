import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../contexts/AuthContext';
import type { Application, Stage } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { X, ChevronRight, ChevronLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useLanguage } from '../contexts/LanguageContext';

function SortableStageItem({ stage, index, removeStage, updateStageDeadline, t }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-background p-2 rounded border group">
      <div className="flex items-center gap-2 flex-1 w-full">
        <div {...attributes} {...listeners} className="cursor-grab p-1 hover:bg-muted rounded touch-none">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
        <span className="flex-1 text-sm font-medium truncate">{index + 1}. {stage.name}</span>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto pl-7 sm:pl-0">
        <input
          type="date"
          value={stage.deadline || ''}
          onChange={(e) => updateStageDeadline(stage.id, e.target.value)}
          className="text-xs p-1 h-8 rounded border bg-muted/20 w-full sm:w-[130px] focus-visible:ring-1"
          title={t.modalStageDeadlineTitle}
        />
        <button onClick={() => removeStage(stage.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded flex-shrink-0" title={t.modalDeleteStageTitle}>
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function NewAppModal() {
  const { isNewAppModalOpen, closeNewAppModal, addApplication } = useStore();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState<Partial<Application>>({
    companyName: '',
    position: '',
    department: '',
    location: '',
    workModel: 'Ofis',
    type: 'Zorunlu',
    appliedDate: format(new Date(), 'yyyy-MM-dd'),
    salary: 'Belirtilmedi',
    priority: 'Orta',
    status: 'Başvuruldu',
    stages: []
  });

  const [stagesList, setStagesList] = useState<{id: string, name: string, deadline?: string}[]>(
    () => t.stageTemplates.standart.map(s => ({ id: uuidv4(), name: s, deadline: '' }))
  );

  const [newStageName, setNewStageName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!isNewAppModalOpen) return null;

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleStageSelect = (template: keyof typeof t.stageTemplates) => {
    setStagesList(t.stageTemplates[template].map(s => ({ id: uuidv4(), name: s, deadline: '' })));
  };

  const addCustomStage = () => {
    if (newStageName.trim()) {
      setStagesList([...stagesList, { id: uuidv4(), name: newStageName.trim(), deadline: '' }]);
      setNewStageName('');
    }
  };

  const removeStage = (id: string) => {
    setStagesList(stagesList.filter(s => s.id !== id));
  };

  const updateStageDeadline = (id: string, deadline: string) => {
    setStagesList(stagesList.map(s => s.id === id ? { ...s, deadline } : s));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setStagesList((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    const newApp: Application = {
      ...formData as Application,
      id: uuidv4(),
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stages: stagesList.map(s => ({
        id: s.id,
        name: s.name,
        status: 'Yapılacak',
        deadline: s.deadline || undefined
      }))
    };

    if (newApp.stages.length > 0) {
      newApp.stages[0].status = 'Tamamlandı';
    }

    try {
      setSaving(true);
      await addApplication(newApp, user.id);
      resetAndClose();
    } catch (err) {
      console.error('Başvuru kaydedilemedi:', err);
      setSaving(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSaving(false);
    setFormData({
      companyName: '', position: '', priority: 'Orta', status: 'Başvuruldu', appliedDate: format(new Date(), 'yyyy-MM-dd'), stages: []
    });
    setStagesList(t.stageTemplates.standart.map((s: string) => ({ id: uuidv4(), name: s, deadline: '' })));
    closeNewAppModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-2xl rounded-xl shadow-lg border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">{t.modalTitle}</h2>
            <p className="text-sm text-muted-foreground">{t.modalStep(step, 3)}</p>
          </div>
          <button onClick={resetAndClose} className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-sm font-medium">{t.modalCompanyName}</label>
                  <input required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-sm font-medium">{t.modalPosition}</label>
                  <input required value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.modalDepartment}</label>
                  <input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.modalCity}</label>
                  <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.modalPriority}</label>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as any})} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="Düşük">{t.priorityLow}</option>
                    <option value="Orta">{t.priorityMedium}</option>
                    <option value="Yüksek">{t.priorityHigh}</option>
                    <option value="Kritik">{t.priorityCritical}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.modalAppliedDate}</label>
                  <input type="date" value={formData.appliedDate} onChange={e => setFormData({...formData, appliedDate: e.target.value})} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">{t.modalStagesDesc}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button onClick={() => handleStageSelect('standart')} className="p-2 border rounded hover:bg-muted text-sm">{t.modalTemplateStandard}</button>
                <button onClick={() => handleStageSelect('hizli')} className="p-2 border rounded hover:bg-muted text-sm">{t.modalTemplateFast}</button>
                <button onClick={() => handleStageSelect('detayli')} className="p-2 border rounded hover:bg-muted text-sm">{t.modalTemplateDetailed}</button>
                <button onClick={() => handleStageSelect('bos')} className="p-2 border rounded hover:bg-muted text-sm">{t.modalTemplateEmpty}</button>
              </div>

              <div className="space-y-2 border rounded-md p-4 bg-muted/20">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={stagesList.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    {stagesList.map((stage, i) => (
                      <SortableStageItem
                        key={stage.id}
                        stage={stage}
                        index={i}
                        removeStage={removeStage}
                        updateStageDeadline={updateStageDeadline}
                        t={t}
                      />
                    ))}
                  </SortableContext>
                </DndContext>

                <div className="flex gap-2 pt-2 mt-2 border-t">
                  <input
                    placeholder={t.modalNewStagePlaceholder}
                    value={newStageName}
                    onChange={e => setNewStageName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustomStage()}
                    className="flex-1 flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  />
                  <button onClick={addCustomStage} className="h-9 px-3 bg-secondary text-secondary-foreground rounded-md text-sm font-medium flex items-center gap-1 hover:bg-secondary/80">
                    <Plus className="w-4 h-4" /> {t.modalAdd}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{t.modalFinalDesc}</p>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.modalAppUrl}</label>
                <input value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://..." className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.modalGeneralNote}</label>
                <textarea rows={4} value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder={t.modalGeneralNotePlaceholder} />
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-semibold text-sm mb-2">{t.modalSummaryTitle}</h4>
                <p className="text-sm">🏢 {formData.companyName} - {formData.position}</p>
                <p className="text-sm">📋 {t.modalSummaryStages(stagesList.length)}</p>
                <p className="text-sm">🚨 {t.modalSummaryPriority} {formData.priority}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between bg-muted/20">
          <button
            disabled={step === 1}
            onClick={handlePrev}
            className="px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50 flex items-center gap-1 bg-background hover:bg-accent"
          >
            <ChevronLeft className="w-4 h-4" /> {t.modalBack}
          </button>

          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={step === 1 && (!formData.companyName || !formData.position)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium flex items-center gap-1 hover:bg-primary/90 disabled:opacity-50"
            >
              {t.modalNext} <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center gap-1 hover:bg-green-700 disabled:opacity-60"
            >
              {saving ? t.modalSaving : t.modalSave}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
