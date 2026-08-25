// ====================================================================
// Mock Datasets for School Laptops (01 - 30) across Lab Rooms
// ====================================================================

import { ComputerWorkstation, LabAuditLog, LabSession } from '../types/lab';

const nowIso = new Date().toISOString();

// Generate 30 Clean School Laptops (01 to 30) - All UNREGISTERED by default
export const INITIAL_LAB_A_COMPUTERS: ComputerWorkstation[] = Array.from({ length: 30 }, (_, idx) => {
  const num = String(idx + 1).padStart(2, '0');

  return {
    id: `pc-laptop-${num}`,
    computerNumber: num,
    computerCode: num,
    hostname: `LAPTOP-CIIS-${num}`,
    ipAddress: '',
    macAddress: '',
    agentId: '',
    labGroup: 'Lab A',
    status: 'UNREGISTERED',
    lastSeen: undefined,
    lastHeartbeat: nowIso,
    agentVersion: '1.0.0',
    sessionDuration: 0,
    cpuUsagePct: 0,
    memoryUsagePct: 0,
    isLocked: false,
    createdAt: nowIso,
    updatedAt: nowIso
  };
});

export const INITIAL_LAB_B_COMPUTERS: ComputerWorkstation[] = Array.from({ length: 25 }, (_, idx) => {
  const num = String(idx + 1).padStart(2, '0');
  const isOff = idx === 3 || idx === 14;
  return {
    id: `pc-labb-${num}`,
    computerNumber: num,
    computerCode: num,
    hostname: `LAB-B-PC-${num}`,
    ipAddress: `192.168.20.${100 + idx + 1}`,
    macAddress: `00:2B:3C:4D:5E:${num}`,
    agentId: `agent-b-${num}`,
    labGroup: 'Lab B',
    status: isOff ? 'OFFLINE' : 'ONLINE',
    lastSeen: new Date(Date.now() - (isOff ? 180000 : 2000)).toISOString(),
    lastHeartbeat: new Date(Date.now() - (isOff ? 180000 : 2000)).toISOString(),
    agentVersion: '0.1.0',
    sessionDuration: 0,
    cpuUsagePct: isOff ? 0 : 8,
    memoryUsagePct: isOff ? 0 : 28,
    isLocked: false,
    createdAt: nowIso,
    updatedAt: nowIso
  };
});

export const INITIAL_LAB_C_COMPUTERS: ComputerWorkstation[] = Array.from({ length: 20 }, (_, idx) => {
  const num = String(idx + 1).padStart(2, '0');
  return {
    id: `pc-labc-${num}`,
    computerNumber: num,
    computerCode: num,
    hostname: `LAB-C-PC-${num}`,
    ipAddress: `192.168.30.${100 + idx + 1}`,
    macAddress: `00:3C:4D:5E:6F:${num}`,
    agentId: `agent-c-${num}`,
    labGroup: 'Lab C',
    status: idx < 16 ? 'ONLINE' : 'OFFLINE',
    lastSeen: new Date(Date.now() - (idx < 16 ? 3000 : 300000)).toISOString(),
    lastHeartbeat: new Date(Date.now() - (idx < 16 ? 3000 : 300000)).toISOString(),
    agentVersion: '0.1.0',
    sessionDuration: 0,
    cpuUsagePct: idx < 16 ? 6 : 0,
    memoryUsagePct: idx < 16 ? 25 : 0,
    isLocked: false,
    createdAt: nowIso,
    updatedAt: nowIso
  };
});

export const INITIAL_LAB_SESSION: LabSession = {
  id: 'session-excel-04',
  teacherId: 'user-teacher-01',
  teacherName: 'Lokkru Jame (Lead Teacher)',
  labGroup: 'Lab A',
  title: 'Computer Class Monitoring — 30 Laptops',
  targetApplication: 'General',
  durationMinutes: 45,
  startedAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
  status: 'active',
  totalComputers: 30,
  connectedStudents: 24,
  collectedFilesCount: 0
};

export const INITIAL_AUDIT_LOGS: LabAuditLog[] = [
  {
    id: 'log-1',
    userId: 'user-teacher-01',
    teacherName: 'Lokkru Jame',
    computerCode: '01',
    action: 'HEARTBEAT_ACTIVE',
    details: 'Laptop 01 connected and verified via secure WebSocket',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    id: 'log-2',
    userId: 'user-teacher-01',
    teacherName: 'Lokkru Jame',
    computerCode: '03',
    action: 'HEARTBEAT_TIMEOUT',
    details: 'Laptop 03 heartbeat timeout (15s exceeded) — marked OFFLINE',
    status: 'WARNING',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    id: 'log-3',
    userId: 'user-teacher-01',
    teacherName: 'Lokkru Jame',
    computerCode: '25',
    action: 'REVOKE_AGENT',
    details: 'Administrator revoked device credentials for Laptop 25',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  }
];
