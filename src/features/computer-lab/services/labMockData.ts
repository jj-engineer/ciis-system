// ====================================================================
// Mock Datasets for School Laptops (01 - 30) across Lab Rooms
// ====================================================================

import { ComputerWorkstation, LabAuditLog, LabSession } from '../types/lab';

const nowIso = new Date().toISOString();

// Generate 30 School Laptops (01 to 30)
export const INITIAL_LAB_A_COMPUTERS: ComputerWorkstation[] = Array.from({ length: 30 }, (_, idx) => {
  const num = String(idx + 1).padStart(2, '0');
  
  // Realistic Status distribution:
  // 24 Online, 4 Offline, 2 Unregistered
  const isOffline = idx === 2 || idx === 17 || idx === 22 || idx === 28; // e.g. 03, 18, 23, 29
  const isUnregistered = idx === 29; // 30
  const isRevoked = idx === 24; // 25

  let status: ComputerWorkstation['status'] = 'ONLINE';
  let lastSeenOffset = Math.floor(Math.random() * 4000) + 1000; // 1-5s ago

  if (isUnregistered) {
    status = 'UNREGISTERED';
    lastSeenOffset = 0;
  } else if (isRevoked) {
    status = 'REVOKED';
    lastSeenOffset = 86400000;
  } else if (isOffline) {
    status = 'OFFLINE';
    lastSeenOffset = idx === 2 ? 120000 : 180000 + idx * 20000; // 2-5 mins ago
  }

  const lastSeenDate = isUnregistered ? undefined : new Date(Date.now() - lastSeenOffset).toISOString();

  return {
    id: `pc-laptop-${num}`,
    computerNumber: num,
    computerCode: num,
    hostname: `LAPTOP-CIIS-${num}`,
    ipAddress: `192.168.10.${100 + idx + 1}`,
    macAddress: `00:1A:2B:3C:4D:${num}`,
    agentId: isUnregistered ? '' : `agent-${num}`,
    labGroup: 'Lab A',
    status,
    lastSeen: lastSeenDate,
    lastHeartbeat: lastSeenDate || nowIso,
    agentVersion: '0.1.0',
    sessionDuration: status === 'ONLINE' ? 1200 + idx * 45 : 0,
    cpuUsagePct: status === 'ONLINE' ? Math.floor(10 + Math.random() * 20) : 0,
    memoryUsagePct: status === 'ONLINE' ? Math.floor(30 + Math.random() * 25) : 0,
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
