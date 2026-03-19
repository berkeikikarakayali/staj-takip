import { supabase } from './supabase';
import { appToRow, rowToApp, stagesToRows } from './applicationMapper';
import type { Application } from '../types';

// Fetch all applications + their stages for a user
export async function fetchApplications(userId: string): Promise<Application[]> {
  const { data: appRows, error: appError } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (appError) throw appError;
  if (!appRows || appRows.length === 0) return [];

  const appIds = appRows.map((r: any) => r.id);

  const { data: stageRows, error: stageError } = await supabase
    .from('stages')
    .select('*')
    .in('application_id', appIds)
    .order('sort_order', { ascending: true });

  if (stageError) throw stageError;

  return appRows.map((row: any) => {
    const stages = (stageRows ?? []).filter((s: any) => s.application_id === row.id);
    return rowToApp(row, stages);
  });
}

// Create a new application + its stages
export async function createApplication(app: Application, userId: string): Promise<void> {
  const row = appToRow(app, userId);

  const { error: appError } = await supabase
    .from('applications')
    .insert(row);

  if (appError) throw appError;

  if (app.stages && app.stages.length > 0) {
    const stageRows = stagesToRows(app.stages, app.id, userId);
    const { error: stageError } = await supabase
      .from('stages')
      .insert(stageRows);
    if (stageError) throw stageError;
  }
}

// Update application fields (and optionally replace all stages)
export async function updateApplicationInDb(
  id: string,
  data: Partial<Application>,
  userId: string
): Promise<void> {
  // Separate stages from the rest of the fields
  const { stages, ...rest } = data;
  
  if (Object.keys(rest).length > 0) {
    const row = appToRow(rest, userId);
    // Remove user_id from the update payload (only used for insert/filter)
    const { user_id, ...updateFields } = row;
    
    const { error } = await supabase
      .from('applications')
      .update({ ...updateFields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // If stages changed, delete all existing and reinsert
  if (stages !== undefined) {
    const { error: deleteError } = await supabase
      .from('stages')
      .delete()
      .eq('application_id', id);
    if (deleteError) throw deleteError;

    if (stages.length > 0) {
      const stageRows = stagesToRows(stages, id, userId);
      const { error: insertError } = await supabase
        .from('stages')
        .insert(stageRows);
      if (insertError) throw insertError;
    }
  }
}

// Delete an application (stages are cascade deleted by DB)
export async function deleteApplicationFromDb(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}
