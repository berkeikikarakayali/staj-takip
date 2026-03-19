import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Application } from '../types';

interface StoreState {
  applications: Application[];
  isNewAppModalOpen: boolean;
  theme: string;
  addApplication: (app: Application) => void;
  updateApplication: (id: string, data: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  openNewAppModal: () => void;
  closeNewAppModal: () => void;
  setTheme: (theme: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      applications: [],
      isNewAppModalOpen: false,
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      openNewAppModal: () => set({ isNewAppModalOpen: true }),
      closeNewAppModal: () => set({ isNewAppModalOpen: false }),
      addApplication: (app) =>
        set((state) => ({ applications: [...state.applications, app] })),
      updateApplication: (id, data) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, ...data, updatedAt: new Date().toISOString() } : app
          ),
        })),
      deleteApplication: (id) =>
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
        })),
    }),
    {
      name: 'stajtakip-storage',
    }
  )
);
