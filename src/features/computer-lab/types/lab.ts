// ====================================================================
// Computer Lab Control System - TypeScript Core Types & Interfaces
// ====================================================================

export type ComputerStatus =
  | 'ONLINE'
  | 'OFFLINE'
  | 'AVAILABLE'
  | 'IN_USE'
  | 'LOCKED'
  | 'DISCONNECTED'
  | 'ERROR'
  | 'UNREGISTERED'
  | 'REVOKED';

export type LabCommandType =
  | 'PING'
  | 'GET_STATUS'
  | 'START_SESSION'
  | 'END_SESSION'
  | 'LOCK_WORKSTATION'
  | 'UNLOCK_WORKSTATION'
  | 'OPEN_ASSIGNMENT'
  | 'COLLECT_FILES'
  | 'GENERATE_TOKEN'
  | 'REVOKE_AGENT'
  | 'SET_OFFLINE'
  | 'UNPAIR_LAPTOP';

export type CommandExecutionStatus = 'pending' | 'sent' | 'acknowledged' | 'failed' | 'completed';

export type LabSessionStatus = 'active' | 'paused' | 'completed';

export type TargetApplication =
  | 'Microsoft Excel'
  | 'Microsoft Word'
  | 'Touch Typing'
  | 'Google Chrome'
  | 'General';

export type LabGroup = 'Lab A' | 'Lab B' | 'Lab C';

export interface ComputerWorkstation {
  id: string;
  computerNumber?: string; // e.g. "01", "02", ... "30"
  computerCode: string; // e.g. "01" or "LAB-01"
  hostname: string; // e.g. "LAPTOP-CIIS-01"
  ipAddress?: string;
  macAddress?: string;
  agentId: string;
  labGroup: LabGroup;
  status: ComputerStatus;
  studentId?: string;
  studentName?: string;
  studentAvatar?: string;
  currentApp?: string; // "Microsoft Excel", "Microsoft Word", etc.
  sessionDuration: number; // in seconds
  lastHeartbeat: string; // ISO timestamp
  lastSeen?: string;
  agentVersion: string; // "0.1.0"
  registrationToken?: string;
  tokenExpiresAt?: string;
  currentSessionId?: string;
  cpuUsagePct?: number; // 0-100
  memoryUsagePct?: number; // 0-100
  isLocked: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabSession {
  id: string;
  teacherId: string;
  teacherName: string;
  labGroup: LabGroup;
  title: string;
  assignmentId?: string;
  assignmentTitle?: string;
  targetApplication: TargetApplication;
  durationMinutes: number;
  startedAt: string;
  endedAt?: string;
  status: LabSessionStatus;
  totalComputers: number;
  connectedStudents: number;
  collectedFilesCount: number;
}

export interface ComputerSessionRecord {
  id: string;
  sessionId: string;
  computerId: string;
  computerCode: string;
  studentId: string;
  studentName: string;
  connectedAt: string;
  disconnectedAt?: string;
  status: 'connected' | 'working' | 'submitted' | 'disconnected';
  submittedFiles: {
    fileName: string;
    fileSizeFormatted: string;
    submittedAt: string;
    filePath: string;
  }[];
}

export interface LabCommand {
  commandId: string;
  teacherId: string;
  computerId: string;
  computerCode: string;
  sessionId?: string;
  commandType: LabCommandType;
  payload?: {
    assignmentId?: string;
    assignmentTitle?: string;
    targetApplication?: string;
    lockMessage?: string;
    filePath?: string;
  };
  status: CommandExecutionStatus;
  dispatchedAt: string;
  acknowledgedAt?: string;
  completedAt?: string;
  result?: {
    success: boolean;
    message?: string;
    data?: any;
  };
}

export interface LabAuditLog {
  id: string;
  userId: string;
  teacherName: string;
  computerId?: string;
  computerCode?: string;
  action: string;
  details: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  timestamp: string;
}

export interface FileCollectionProgress {
  isCollecting: boolean;
  totalStudents: number;
  collectedCount: number;
  percent: number;
  statusText: string;
  currentStudent?: string;
  completed: boolean;
  collectedFiles: {
    studentId: string;
    studentName: string;
    computerCode: string;
    fileName: string;
    fileSize: string;
    status: 'success' | 'pending' | 'failed';
    timestamp: string;
  }[];
}
