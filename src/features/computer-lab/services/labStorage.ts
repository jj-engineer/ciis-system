// ====================================================================
// Local Storage Persistence for Computer Lab Control
// ====================================================================

import {
  ComputerWorkstation,
  LabAuditLog,
  LabGroup,
  LabSession
} from '../types/lab';
import {
  INITIAL_LAB_A_COMPUTERS,
  INITIAL_LAB_B_COMPUTERS,
  INITIAL_LAB_C_COMPUTERS,
  INITIAL_LAB_SESSION,
  INITIAL_AUDIT_LOGS
} from './labMockData';

const STORAGE_KEYS = {
  COMPUTERS_LAB_A: 'ciis_lab_a_computers_v1',
  COMPUTERS_LAB_B: 'ciis_lab_b_computers_v1',
  COMPUTERS_LAB_C: 'ciis_lab_c_computers_v1',
  ACTIVE_SESSION: 'ciis_lab_active_session_v1',
  AUDIT_LOGS: 'ciis_lab_audit_logs_v1',
  SELECTED_LAB: 'ciis_lab_selected_group_v1',
  DEMO_MODE: 'ciis_lab_demo_mode_v1'
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key}:`, e);
    return fallback;
  }
}

function setItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key}:`, e);
  }
}

export const LabStorageService = {
  getComputers: (group: LabGroup): ComputerWorkstation[] => {
    switch (group) {
      case 'Lab B':
        return getItem<ComputerWorkstation[]>(STORAGE_KEYS.COMPUTERS_LAB_B, INITIAL_LAB_B_COMPUTERS);
      case 'Lab C':
        return getItem<ComputerWorkstation[]>(STORAGE_KEYS.COMPUTERS_LAB_C, INITIAL_LAB_C_COMPUTERS);
      case 'Lab A':
      default:
        return getItem<ComputerWorkstation[]>(STORAGE_KEYS.COMPUTERS_LAB_A, INITIAL_LAB_A_COMPUTERS);
    }
  },

  saveComputers: (group: LabGroup, computers: ComputerWorkstation[]): void => {
    switch (group) {
      case 'Lab B':
        setItem(STORAGE_KEYS.COMPUTERS_LAB_B, computers);
        break;
      case 'Lab C':
        setItem(STORAGE_KEYS.COMPUTERS_LAB_C, computers);
        break;
      case 'Lab A':
      default:
        setItem(STORAGE_KEYS.COMPUTERS_LAB_A, computers);
        break;
    }
  },

  updateSingleComputer: (updatedPc: ComputerWorkstation): void => {
    const current = LabStorageService.getComputers(updatedPc.labGroup);
    const next = current.map(pc => pc.id === updatedPc.id ? updatedPc : pc);
    LabStorageService.saveComputers(updatedPc.labGroup, next);
  },

  getActiveSession: (): LabSession | null => {
    return getItem<LabSession | null>(STORAGE_KEYS.ACTIVE_SESSION, INITIAL_LAB_SESSION);
  },

  saveActiveSession: (session: LabSession | null): void => {
    setItem(STORAGE_KEYS.ACTIVE_SESSION, session);
  },

  getAuditLogs: (): LabAuditLog[] => {
    return getItem<LabAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  addAuditLog: (log: Omit<LabAuditLog, 'id' | 'timestamp'>): LabAuditLog => {
    const current = LabStorageService.getAuditLogs();
    const newLog: LabAuditLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    const next = [newLog, ...current].slice(0, 100);
    setItem(STORAGE_KEYS.AUDIT_LOGS, next);
    return newLog;
  },

  getSelectedLabGroup: (): LabGroup => {
    return getItem<LabGroup>(STORAGE_KEYS.SELECTED_LAB, 'Lab A');
  },

  saveSelectedLabGroup: (group: LabGroup): void => {
    setItem(STORAGE_KEYS.SELECTED_LAB, group);
  },

  isDemoMode: (): boolean => {
    return getItem<boolean>(STORAGE_KEYS.DEMO_MODE, true);
  },

  setDemoMode: (isDemo: boolean): void => {
    setItem(STORAGE_KEYS.DEMO_MODE, isDemo);
  },

  resetAllLabData: (): void => {
    setItem(STORAGE_KEYS.COMPUTERS_LAB_A, INITIAL_LAB_A_COMPUTERS);
    setItem(STORAGE_KEYS.COMPUTERS_LAB_B, INITIAL_LAB_B_COMPUTERS);
    setItem(STORAGE_KEYS.COMPUTERS_LAB_C, INITIAL_LAB_C_COMPUTERS);
    setItem(STORAGE_KEYS.ACTIVE_SESSION, INITIAL_LAB_SESSION);
    setItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }
};
