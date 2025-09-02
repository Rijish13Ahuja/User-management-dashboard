import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ActivityLog, User, UserFormData } from '@/types/user'


interface ActivityLogState {
  logs: ActivityLog[]
  addLog: (action: 'CREATE' | 'UPDATE' | 'DELETE', user: User | UserFormData) => void
  clearLogs: () => void
  administrator?: string;
}

export const useActivityLogStore = create<ActivityLogState>()(
  persist(
    (set, get) => ({
      logs: [],
      administrator: "Leanne", // hardcoded admin name
      addLog: (action, user) => {
        const newLog: ActivityLog = {
          id: Date.now().toString(),
          action,
          timestamp: new Date(),
          user,
        }
        set({ logs: [newLog, ...get().logs] })
      },
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: 'activity-log-storage',
    }
  )
)