export interface Profile {
  id: string
  email: string
  full_name: string | null
  university: string | null
  department: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface ApplicationRow {
  id: string
  user_id: string
  company_name: string
  position: string
  department: string | null
  location: string | null
  work_model: 'office' | 'remote' | 'hybrid' | null
  internship_type: 'mandatory' | 'voluntary' | 'summer' | 'longterm' | null
  application_date: string
  start_date: string | null
  end_date: string | null
  salary: string | null
  application_url: string | null
  job_posting_url: string | null
  contact_person: string | null
  contact_email: string | null
  contact_phone: string | null
  source: 'linkedin' | 'kariyer' | 'company' | 'referral' | 'university' | 'other' | null
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'preparation' | 'applied' | 'in_progress' | 'interview' | 'offer' | 'accepted' | 'rejected' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface StageRow {
  id: string
  application_id: string
  user_id: string
  name: string
  sort_order: number
  status: 'todo' | 'in_progress' | 'completed' | 'skipped'
  deadline: string | null
  completed_at: string | null
  note: string | null
  created_at: string
  updated_at: string
}

export interface ActivityLogRow {
  id: string
  application_id: string
  user_id: string
  action: string
  details: string | null
  is_manual: boolean
  created_at: string
}

export interface ApplicationLinkRow {
  id: string
  application_id: string
  user_id: string
  title: string
  url: string
  description: string | null
  created_at: string
}

export interface UserSettingsRow {
  id: string
  user_id: string
  theme: 'light' | 'dark' | 'system'
  default_stages: string[]
  reminder_days: number
  notifications_enabled: boolean
  created_at: string
  updated_at: string
}
