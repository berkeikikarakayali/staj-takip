export type Priority = 'Düşük' | 'Orta' | 'Yüksek' | 'Kritik';
export type AppStatus = 'Tümü' | 'Hazırlık' | 'Başvuruldu' | 'Devam Ediyor' | 'Mülakat' | 'Teklif' | 'Kabul' | 'Red' | 'İptal';
export type StageStatus = 'Yapılacak' | 'Devam Ediyor' | 'Tamamlandı' | 'Atlandı';

export interface Stage {
  id: string; // uuid
  name: string;
  status: StageStatus;
  deadline?: string; // ISO date string
  note?: string;
}

export interface Application {
  id: string; // uuid
  companyName: string;
  position: string;
  department?: string;
  location?: string;
  workModel?: 'Ofis' | 'Uzaktan' | 'Hibrit';
  type?: 'Zorunlu' | 'Gönüllü' | 'Yaz' | 'Uzun Dönem';
  appliedDate: string; // ISO date string
  startDate?: string;
  endDate?: string;
  salary?: string;
  url?: string;
  adUrl?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  source?: 'LinkedIn' | 'Kariyer.net' | 'Şirket Sitesi' | 'Referans' | 'Üniversite' | 'Diğer';
  priority: Priority;
  notes?: string;
  status: AppStatus;
  progress: number; // 0-100 calculated by stages
  stages: Stage[];
  createdAt: string;
  updatedAt: string;
}
