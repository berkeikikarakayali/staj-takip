import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Clock, Building, MapPin, Calendar, Link as LinkIcon, Edit, Trash2, CheckCircle2, Circle, GripVertical, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { tr as trLocale, enUS, type Locale } from 'date-fns/locale';
import { v4 as uuidv4 } from 'uuid';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useLanguage, type Language } from '../contexts/LanguageContext';

const localeMap: Record<Language, Locale> = {
  tr: trLocale,
  en: enUS,
};

function SortableTimelineStage({
  stage,
  isActive,
  isDone,
  toggleStageStatus,
  updateStageStatusExact,
  updateStageDeadline,
  removeStage,
  t,
}: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative flex items-center md:items-start justify-between md:justify-normal w-full group">
      <div className="flex items-center absolute left-0 -ml-1.5 z-10 bg-background md:hidden">
        <button onClick={() => toggleStageStatus(stage.id)} className={`rounded-full p-1 transition-colors ${isDone ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : isActive ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-muted-foreground bg-muted hover:text-foreground'}`}>
          {isDone ? <CheckCircle2 className="w-5 h-5" /> : isActive ? <Clock className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
        </button>
      </div>

      <div className="ml-8 w-full mr-auto rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md relative">
        <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
           <div {...attributes} {...listeners} className="cursor-grab p-1 hover:bg-muted rounded touch-none">
             <GripVertical className="w-4 h-4 text-muted-foreground" />
           </div>
        </div>

        <div className="pl-6">
          <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
             <h3 className={`font-semibold text-base ${isDone ? 'line-through text-muted-foreground' : ''}`}>{stage.name}</h3>
             <div className="flex items-center gap-2">
               <select
                 value={stage.status}
                 onChange={(e) => updateStageStatusExact(stage.id, e.target.value)}
                 className={`rounded-md text-xs font-medium transition-colors border px-2 py-1 outline-none cursor-pointer ${isDone ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : isActive ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : 'bg-muted hover:bg-muted/80'}`}
               >
                 <option value="Yapılacak">{t.stageTodo}</option>
                 <option value="Devam Ediyor">{t.stageInProgress}</option>
                 <option value="Tamamlandı">{t.stageDone}</option>
                 <option value="Atlandı">{t.stageSkipped}</option>
               </select>
               <button onClick={() => removeStage(stage.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition-colors" title={t.deleteStageTitle}>
                 <Trash2 className="w-4 h-4" />
               </button>
             </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
             <Clock className="w-3 h-3 text-muted-foreground" />
             <span className="text-xs text-muted-foreground">{t.deadline}</span>
             <input
               type="date"
               value={stage.deadline || ''}
               onChange={(e) => updateStageDeadline(stage.id, e.target.value)}
               className="p-1 rounded bg-transparent border border-transparent hover:border-input focus:border-input focus:bg-background h-7 text-xs w-[130px] cursor-pointer transition-colors"
             />
          </div>
          {stage.note && (
             <p className="mt-2 text-sm text-muted-foreground bg-muted/40 p-2 rounded-md border">{stage.note}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications, updateApplication, deleteApplication } = useStore();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const locale = localeMap[language];

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

  const app = applications.find(a => a.id === id);

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
        <h3 className="text-xl font-bold mb-2">{t.appNotFound}</h3>
        <button onClick={() => navigate('/')} className="text-primary hover:underline">{t.backToDashboard}</button>
      </div>
    );
  }

  const handleEditClick = () => {
    setEditFormData({ ...app });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!user) return;
    updateApplication(app.id, editFormData, user.id);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!user) return;
    if (confirm(t.deleteAppConfirm)) {
      deleteApplication(app.id, user.id);
      navigate('/');
    }
  };

  const toggleStageStatus = (stageId: string) => {
    const stage = app.stages.find(s => s.id === stageId);
    if (!stage) return;
    const nextStatus = stage.status === 'Yapılacak' ? 'Devam Ediyor' : stage.status === 'Devam Ediyor' ? 'Tamamlandı' : 'Yapılacak';
    updateStageStatusExact(stageId, nextStatus as any);
  };

  const updateStageStatusExact = (stageId: string, status: 'Yapılacak' | 'Devam Ediyor' | 'Tamamlandı' | 'Atlandı') => {
    if (!user) return;
    const newStages = app.stages.map(s => s.id === stageId ? { ...s, status } : s);
    const progress = Math.round((newStages.filter(s => s.status === 'Tamamlandı' || s.status === 'Atlandı').length / newStages.length) * 100) || 0;
    updateApplication(app.id, { stages: newStages, progress }, user.id);
  };

  const updateStageDeadline = (stageId: string, deadline: string) => {
    if (!user) return;
    const newStages = app.stages.map(s => s.id === stageId ? { ...s, deadline: deadline || undefined } : s);
    updateApplication(app.id, { stages: newStages }, user.id);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    if (!user) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = app.stages.findIndex(s => s.id === active.id);
      const newIndex = app.stages.findIndex(s => s.id === over.id);
      const newStages = arrayMove(app.stages, oldIndex, newIndex);
      updateApplication(app.id, { stages: newStages }, user.id);
    }
  };

  const removeStage = (stageId: string) => {
    if (!user) return;
    if (confirm(t.deleteStageConfirm)) {
      const newStages = app.stages.filter(s => s.id !== stageId);
      const progress = newStages.length ? Math.round((newStages.filter(s => s.status === 'Tamamlandı' || s.status === 'Atlandı').length / newStages.length) * 100) : 0;
      updateApplication(app.id, { stages: newStages, progress }, user.id);
    }
  };

  const addNewStage = () => {
    if (!user) return;
    const name = prompt(t.newStageName);
    if (name && name.trim()) {
      const newStages = [...app.stages, {
        id: uuidv4(),
        name: name.trim(),
        status: 'Yapılacak' as const
      }];
      const progress = newStages.length ? Math.round((newStages.filter(s => s.status === 'Tamamlandı' || s.status === 'Atlandı').length / newStages.length) * 100) : 0;
      updateApplication(app.id, { stages: newStages, progress }, user.id);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Upper Bar */}
      <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <input value={editFormData.companyName || ''} onChange={e => setEditFormData({...editFormData, companyName: e.target.value})} className="h-8 px-2 text-lg font-bold border rounded-md bg-background" placeholder={t.editCompanyName} />
                <input value={editFormData.position || ''} onChange={e => setEditFormData({...editFormData, position: e.target.value})} className="h-8 px-2 text-md font-semibold border rounded-md bg-background" placeholder={t.editPosition} />
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  {app.companyName} - {app.position}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                  {app.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {app.location}</span>}
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {format(parseISO(app.appliedDate), 'dd MMM yyyy', { locale })}</span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border bg-muted/50 text-foreground font-medium text-xs">{t.statusLabel} {t.statusMap[app.status] || app.status}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={app.status}
            onChange={(e) => user && updateApplication(app.id, { status: e.target.value as any }, user.id)}
            className="h-9 px-3 rounded-md border text-sm bg-background font-medium"
          >
            {(['Hazırlık', 'Başvuruldu', 'Devam Ediyor', 'Mülakat', 'Teklif', 'Kabul', 'Red', 'İptal'] as const).map(s => (
              <option key={s} value={s}>{t.statusMap[s] || s}</option>
            ))}
          </select>
          {isEditing ? (
            <button onClick={handleSaveEdit} className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm transition-colors shadow-sm">
              {t.save}
            </button>
          ) : (
            <button onClick={handleEditClick} className="p-2 border rounded-md hover:bg-muted text-muted-foreground transition-colors" title={t.editTitle}>
              <Edit className="w-4 h-4" />
            </button>
          )}
          <button onClick={handleDelete} className="p-2 border rounded-md hover:bg-destructive hover:text-destructive-foreground text-muted-foreground transition-colors" title={t.deleteTitle}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Timeline */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">{t.stageTracking}</h2>

          <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={app.stages.map(s => s.id)} strategy={verticalListSortingStrategy}>
                {app.stages.map((stage) => {
                  const isActive = stage.status === 'Devam Ediyor';
                  const isDone = stage.status === 'Tamamlandı';
                  return (
                    <SortableTimelineStage
                      key={stage.id}
                      stage={stage}
                      isActive={isActive}
                      isDone={isDone}
                      toggleStageStatus={toggleStageStatus}
                      updateStageStatusExact={updateStageStatusExact}
                      updateStageDeadline={updateStageDeadline}
                      removeStage={removeStage}
                      t={t}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          </div>

          <div className="flex justify-center mt-6">
            <button onClick={addNewStage} className="px-4 py-2 border border-dashed rounded-full text-sm font-medium hover:bg-muted text-muted-foreground flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" /> {t.addStage}
            </button>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <h3 className="font-semibold border-b pb-2 mb-4">{t.appDetails}</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium block mb-1">{t.editCity}</label>
                  <input value={editFormData.location || ''} onChange={e => setEditFormData({...editFormData, location: e.target.value})} className="w-full text-sm border rounded p-1.5 bg-background focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">{t.editWorkModel}</label>
                  <input value={editFormData.workModel || ''} onChange={e => setEditFormData({...editFormData, workModel: e.target.value})} className="w-full text-sm border rounded p-1.5 bg-background focus:ring-1 focus:ring-primary outline-none" placeholder={t.editWorkModelPlaceholder} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">{t.editInternshipType}</label>
                  <input value={editFormData.type || ''} onChange={e => setEditFormData({...editFormData, type: e.target.value})} className="w-full text-sm border rounded p-1.5 bg-background focus:ring-1 focus:ring-primary outline-none" placeholder={t.editInternshipTypePlaceholder} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">{t.editSalary}</label>
                  <input value={editFormData.salary || ''} onChange={e => setEditFormData({...editFormData, salary: e.target.value})} className="w-full text-sm border rounded p-1.5 bg-background focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">{t.editAppLink}</label>
                  <input value={editFormData.url || ''} onChange={e => setEditFormData({...editFormData, url: e.target.value})} className="w-full text-sm border rounded p-1.5 bg-background focus:ring-1 focus:ring-primary outline-none" placeholder="https://..." />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">{t.editSourcePlatform}</label>
                  <input value={editFormData.source || ''} onChange={e => setEditFormData({...editFormData, source: e.target.value})} className="w-full text-sm border rounded p-1.5 bg-background focus:ring-1 focus:ring-primary outline-none" placeholder={t.editSourcePlatformPlaceholder} />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">{t.workModelAndType}</span>
                  <p className="text-sm font-medium">{app.workModel || '-'} • {app.type || '-'}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">{t.expectedSalary}</span>
                  <p className="text-sm font-medium">{app.salary || t.notSpecified}</p>
                </div>
                {app.url && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">{t.appLink}</span>
                    <a href={app.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" /> {t.goToLink}
                    </a>
                  </div>
                )}
                {app.source && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">{t.source}</span>
                    <p className="text-sm font-medium">{app.source}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <h3 className="font-semibold border-b pb-2 mb-4">{t.contactAndNotes}</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium block mb-1">{t.editContactName}</label>
                  <input value={editFormData.contactName || ''} onChange={e => setEditFormData({...editFormData, contactName: e.target.value})} className="w-full text-sm border rounded p-1.5 bg-background focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">{t.editContactEmail}</label>
                  <input value={editFormData.contactEmail || ''} onChange={e => setEditFormData({...editFormData, contactEmail: e.target.value})} className="w-full text-sm border rounded p-1.5 bg-background focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">{t.generalNotes}</label>
                  <textarea rows={4} value={editFormData.notes || ''} onChange={e => setEditFormData({...editFormData, notes: e.target.value})} className="w-full text-sm border rounded p-1.5 bg-background focus:ring-1 focus:ring-primary outline-none" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {app.contactName && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">{t.contactPerson}</span>
                    <p className="text-sm font-medium">{app.contactName}</p>
                    <p className="text-xs text-muted-foreground">{app.contactEmail}</p>
                  </div>
                )}
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">{t.generalNotes}</span>
                  <div className="text-sm whitespace-pre-wrap bg-muted/30 p-3 rounded-md border min-h-[100px]">
                    {app.notes || <span className="text-muted-foreground italic">{t.noNotes}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
