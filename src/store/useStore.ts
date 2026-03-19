import { create } from 'zustand';
import type { Application } from '../types';
import {
  fetchApplications,
  createApplication,
  updateApplicationInDb,
  deleteApplicationFromDb,
} from '../lib/supabaseService';

interface StoreState {
  applications: Application[];
  isNewAppModalOpen: boolean;
  theme: string;
  loading: boolean;
  // Data operations
  loadApplications: (userId: string) => Promise<void>;
  addApplication: (app: Application, userId: string) => Promise<void>;
  updateApplication: (id: string, data: Partial<Application>, userId: string) => Promise<void>;
  deleteApplication: (id: string, userId: string) => Promise<void>;
  // UI operations
  openNewAppModal: () => void;
  closeNewAppModal: () => void;
  setTheme: (theme: string) => void;
  clearApplications: () => void;
}

export const useStore = create<StoreState>()((set, get) => ({
  applications: [],
  isNewAppModalOpen: false,
  theme: localStorage.getItem('stajtakip-theme') ?? 'light',
  loading: false,

  loadApplications: async (userId: string) => {
    set({ loading: true });
    try {
      const apps = await fetchApplications(userId);
      set({ applications: apps, loading: false });
    } catch (err) {
      console.error('Başvurular yüklenemedi:', err);
      set({ loading: false });
    }
  },

  addApplication: async (app: Application, userId: string) => {
    await createApplication(app, userId);
    // Optimistic update
    set((state) => ({ applications: [app, ...state.applications] }));
  },

  updateApplication: async (id: string, data: Partial<Application>, userId: string) => {
    await updateApplicationInDb(id, data, userId);
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...data, updatedAt: new Date().toISOString() } : app
      ),
    }));
  },

  deleteApplication: async (id: string, userId: string) => {
    await deleteApplicationFromDb(id, userId);
    set((state) => ({
      applications: state.applications.filter((app) => app.id !== id),
    }));
  },

  clearApplications: () => set({ applications: [] }),

  openNewAppModal: () => set({ isNewAppModalOpen: true }),
  closeNewAppModal: () => set({ isNewAppModalOpen: false }),

  setTheme: (theme) => {
    localStorage.setItem('stajtakip-theme', theme);
    set({ theme });
  },
}));
