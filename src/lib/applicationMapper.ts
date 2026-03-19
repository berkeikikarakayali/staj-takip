import type { Application, Stage, StageStatus } from '../types';

// --- Mapping helpers: Frontend (Türkçe) <-> Supabase (İngilizce) ---

const priorityToDb: Record<string, string> = {
  'Düşük': 'low',
  'Orta': 'medium',
  'Yüksek': 'high',
  'Kritik': 'critical',
};
const priorityFromDb: Record<string, string> = Object.fromEntries(
  Object.entries(priorityToDb).map(([k, v]) => [v, k])
);

const statusToDb: Record<string, string> = {
  'Hazırlık': 'preparation',
  'Başvuruldu': 'applied',
  'Devam Ediyor': 'in_progress',
  'Mülakat': 'interview',
  'Teklif': 'offer',
  'Kabul': 'accepted',
  'Red': 'rejected',
  'İptal': 'cancelled',
};
const statusFromDb: Record<string, string> = Object.fromEntries(
  Object.entries(statusToDb).map(([k, v]) => [v, k])
);

const stageStatusToDb: Record<string, string> = {
  'Yapılacak': 'todo',
  'Devam Ediyor': 'in_progress',
  'Tamamlandı': 'completed',
  'Atlandı': 'skipped',
};
const stageStatusFromDb: Record<string, string> = Object.fromEntries(
  Object.entries(stageStatusToDb).map(([k, v]) => [v, k])
);

const workModelToDb: Record<string, string> = {
  'Ofis': 'office',
  'Uzaktan': 'remote',
  'Hibrit': 'hybrid',
};
const workModelFromDb: Record<string, string> = Object.fromEntries(
  Object.entries(workModelToDb).map(([k, v]) => [v, k])
);

const typeToDb: Record<string, string> = {
  'Zorunlu': 'mandatory',
  'Gönüllü': 'voluntary',
  'Yaz': 'summer',
  'Uzun Dönem': 'longterm',
};
const typeFromDb: Record<string, string> = Object.fromEntries(
  Object.entries(typeToDb).map(([k, v]) => [v, k])
);

// --- Application row → Frontend Application ---
export function rowToApp(row: any, stageRows: any[]): Application {
  const stages: Stage[] = stageRows
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((s) => ({
      id: s.id,
      name: s.name,
      status: (stageStatusFromDb[s.status] ?? s.status) as StageStatus,
      deadline: s.deadline ?? undefined,
      note: s.note ?? undefined,
    }));

  const progress = stages.length > 0
    ? Math.round((stages.filter(s => s.status === 'Tamamlandı' || s.status === 'Atlandı').length / stages.length) * 100)
    : 0;

  return {
    id: row.id,
    companyName: row.company_name,
    position: row.position,
    department: row.department ?? undefined,
    location: row.location ?? undefined,
    workModel: row.work_model ? (workModelFromDb[row.work_model] as any) : undefined,
    type: row.internship_type ? (typeFromDb[row.internship_type] as any) : undefined,
    appliedDate: row.application_date,
    startDate: row.start_date ?? undefined,
    endDate: row.end_date ?? undefined,
    salary: row.salary ?? undefined,
    url: row.application_url ?? undefined,
    adUrl: row.job_posting_url ?? undefined,
    contactName: row.contact_person ?? undefined,
    contactEmail: row.contact_email ?? undefined,
    contactPhone: row.contact_phone ?? undefined,
    source: row.source ?? undefined,
    priority: (priorityFromDb[row.priority] ?? row.priority) as any,
    status: (statusFromDb[row.status] ?? row.status) as any,
    notes: row.notes ?? undefined,
    stages,
    progress,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// --- Frontend Application → Supabase application row ---
export function appToRow(app: Partial<Application>, userId: string): Record<string, any> {
  const row: Record<string, any> = { user_id: userId };

  if (app.id !== undefined) row.id = app.id;
  if (app.companyName !== undefined) row.company_name = app.companyName;
  if (app.position !== undefined) row.position = app.position;
  if (app.department !== undefined) row.department = app.department || null;
  if (app.location !== undefined) row.location = app.location || null;
  if (app.workModel !== undefined) row.work_model = app.workModel ? (workModelToDb[app.workModel] ?? app.workModel) : null;
  if (app.type !== undefined) row.internship_type = app.type ? (typeToDb[app.type] ?? app.type) : null;
  if (app.appliedDate !== undefined) row.application_date = app.appliedDate;
  if (app.startDate !== undefined) row.start_date = app.startDate || null;
  if (app.endDate !== undefined) row.end_date = app.endDate || null;
  if (app.salary !== undefined) row.salary = app.salary || null;
  if (app.url !== undefined) row.application_url = app.url || null;
  if (app.adUrl !== undefined) row.job_posting_url = app.adUrl || null;
  if (app.contactName !== undefined) row.contact_person = app.contactName || null;
  if (app.contactEmail !== undefined) row.contact_email = app.contactEmail || null;
  if (app.contactPhone !== undefined) row.contact_phone = app.contactPhone || null;
  if (app.source !== undefined) row.source = app.source || null;
  if (app.priority !== undefined) row.priority = priorityToDb[app.priority as string] ?? app.priority;
  if (app.status !== undefined) row.status = statusToDb[app.status as string] ?? app.status;
  if (app.notes !== undefined) row.notes = app.notes || null;

  return row;
}

// --- Frontend Stage[] → Supabase stage rows ---
export function stagesToRows(stages: Stage[], applicationId: string, userId: string): Record<string, any>[] {
  return stages.map((stage, index) => ({
    id: stage.id,
    application_id: applicationId,
    user_id: userId,
    name: stage.name,
    sort_order: index,
    status: stageStatusToDb[stage.status] ?? stage.status,
    deadline: stage.deadline || null,
    note: stage.note || null,
  }));
}
