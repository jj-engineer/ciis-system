// ====================================================================
// Computer Lab Control API & Command Orchestration Service
// ====================================================================

import {
  ComputerStatus,
  ComputerWorkstation,
  FileCollectionProgress,
  LabAuditLog,
  LabCommand,
  LabCommandType,
  LabGroup,
  LabSession,
  TargetApplication
} from '../types/lab';
import { LabStorageService } from './labStorage';
import { labWsClient } from './labWebSocket';

export const LabApiService = {
  getComputers: (group: LabGroup): ComputerWorkstation[] => {
    return LabStorageService.getComputers(group);
  },

  saveComputers: (group: LabGroup, computers: ComputerWorkstation[]): void => {
    LabStorageService.saveComputers(group, computers);
  },

  // Safe Command Dispatcher
  dispatchCommand: async (
    commandType: LabCommandType,
    computer: ComputerWorkstation,
    payload?: any,
    teacherName: string = 'Lokkru Jame'
  ): Promise<{ success: boolean; message: string; updatedComputer: ComputerWorkstation }> => {
    // 1. Audit Log
    LabStorageService.addAuditLog({
      userId: 'user-teacher-01',
      teacherName,
      computerId: computer.id,
      computerCode: computer.computerCode,
      action: commandType,
      details: `Executed ${commandType} on ${computer.computerCode} (${computer.studentName || 'Unassigned'})`,
      status: 'SUCCESS'
    });

    // 2. Try WebSocket dispatch to real backend
    labWsClient.sendCommand(commandType, computer.id, computer.computerCode, payload);

    // 3. Local State Mutation (for instant responsive UI feedback in both Live & Demo modes)
    let updated: ComputerWorkstation = { ...computer, updatedAt: new Date().toISOString() };

    switch (commandType) {
      case 'LOCK_WORKSTATION':
        updated.isLocked = true;
        updated.status = 'LOCKED';
        updated.currentApp = 'Screen Locked by Teacher';
        break;

      case 'UNLOCK_WORKSTATION':
        updated.isLocked = false;
        updated.status = updated.studentName ? 'IN_USE' : 'AVAILABLE';
        updated.currentApp = updated.studentName ? (payload?.targetApplication || 'Microsoft Excel') : 'Desktop Idle';
        break;

      case 'OPEN_ASSIGNMENT':
        updated.isLocked = false;
        if (updated.status !== 'OFFLINE') {
          updated.status = 'IN_USE';
          updated.currentApp = payload?.targetApplication || 'Microsoft Excel';
        }
        break;

      case 'PING':
        updated.lastHeartbeat = new Date().toISOString();
        if (updated.status === 'OFFLINE' || updated.status === 'DISCONNECTED') {
          updated.status = updated.studentName ? 'IN_USE' : 'AVAILABLE';
        }
        break;

      case 'START_SESSION':
        if (updated.status !== 'OFFLINE') {
          updated.status = updated.studentName ? 'IN_USE' : 'AVAILABLE';
          if (payload?.targetApplication) {
            updated.currentApp = payload.targetApplication;
          }
        }
        break;

      case 'END_SESSION':
        if (updated.status !== 'OFFLINE') {
          updated.status = 'AVAILABLE';
          updated.currentApp = 'Desktop Idle';
          updated.sessionDuration = 0;
          updated.isLocked = false;
        }
        break;

      case 'COLLECT_FILES':
        // File collection handled via batch progress
        break;

      case 'GENERATE_TOKEN': {
        const token = `REG-${updated.computerNumber || updated.computerCode}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        updated.registrationToken = token;
        updated.tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        break;
      }

      case 'REVOKE_AGENT':
        updated.status = 'REVOKED';
        updated.agentId = '';
        updated.registrationToken = undefined;
        break;
    }

    LabStorageService.updateSingleComputer(updated);

    return {
      success: true,
      message: `Command ${commandType} successfully dispatched to ${computer.computerCode}`,
      updatedComputer: updated
    };
  },

  // Batch Control Commands (Lock All, Unlock All, Ping All)
  dispatchBatchCommand: async (
    commandType: LabCommandType,
    group: LabGroup,
    payload?: any,
    teacherName: string = 'Lokkru Jame'
  ): Promise<{ success: boolean; count: number }> => {
    const computers = LabStorageService.getComputers(group);
    let updatedCount = 0;

    const nextComputers = computers.map(pc => {
      if (pc.status === 'OFFLINE' && commandType !== 'PING') return pc;
      updatedCount++;

      let next = { ...pc, updatedAt: new Date().toISOString() };
      if (commandType === 'LOCK_WORKSTATION') {
        next.isLocked = true;
        next.status = 'LOCKED';
        next.currentApp = 'Screen Locked by Teacher';
      } else if (commandType === 'UNLOCK_WORKSTATION') {
        next.isLocked = false;
        next.status = next.studentName ? 'IN_USE' : 'AVAILABLE';
        next.currentApp = next.studentName ? (payload?.targetApplication || 'Microsoft Excel') : 'Desktop Idle';
      } else if (commandType === 'PING') {
        next.lastHeartbeat = new Date().toISOString();
        if (next.status === 'OFFLINE') next.status = 'AVAILABLE';
      }
      return next;
    });

    LabStorageService.saveComputers(group, nextComputers);

    // Audit Log
    LabStorageService.addAuditLog({
      userId: 'user-teacher-01',
      teacherName,
      computerCode: `ALL_${group.toUpperCase().replace(' ', '_')}`,
      action: commandType,
      details: `Batch executed ${commandType} across ${updatedCount} workstations in ${group}`,
      status: 'SUCCESS'
    });

    return { success: true, count: updatedCount };
  },

  // Start Class Session
  startLabSession: (
    group: LabGroup,
    title: string,
    targetApp: TargetApplication,
    durationMinutes: number,
    assignmentId?: string,
    assignmentTitle?: string,
    teacherName: string = 'Lokkru Jame'
  ): LabSession => {
    const computers = LabStorageService.getComputers(group);
    const connectedCount = computers.filter(pc => pc.status === 'ONLINE' || pc.status === 'IN_USE').length;

    const newSession: LabSession = {
      id: `session-${Date.now()}`,
      teacherId: 'user-teacher-01',
      teacherName,
      labGroup: group,
      title,
      assignmentId,
      assignmentTitle,
      targetApplication: targetApp,
      durationMinutes,
      startedAt: new Date().toISOString(),
      status: 'active',
      totalComputers: computers.length,
      connectedStudents: connectedCount,
      collectedFilesCount: 0
    };

    LabStorageService.saveActiveSession(newSession);

    // Update PCs to working mode with selected target application
    const updatedPcs = computers.map(pc => {
      if (pc.status === 'OFFLINE') return pc;
      return {
        ...pc,
        status: (pc.studentName ? 'IN_USE' : 'AVAILABLE') as ComputerStatus,
        currentApp: targetApp,
        sessionDuration: 0,
        isLocked: false
      };
    });
    LabStorageService.saveComputers(group, updatedPcs);

    // Audit Log
    LabStorageService.addAuditLog({
      userId: 'user-teacher-01',
      teacherName,
      computerCode: group,
      action: 'START_SESSION',
      details: `Started Class Session: "${title}" (${durationMinutes} mins) in ${group}`,
      status: 'SUCCESS'
    });

    return newSession;
  },

  // End Class Session
  endLabSession: (teacherName: string = 'Lokkru Jame'): void => {
    const session = LabStorageService.getActiveSession();
    if (session) {
      const endedSession: LabSession = {
        ...session,
        status: 'completed',
        endedAt: new Date().toISOString()
      };
      LabStorageService.saveActiveSession(endedSession);

      // Audit Log
      LabStorageService.addAuditLog({
        userId: 'user-teacher-01',
        teacherName,
        computerCode: session.labGroup,
        action: 'END_SESSION',
        details: `Ended Class Session: "${session.title}"`,
        status: 'SUCCESS'
      });
    }
  },

  // Collect All Student Work Simulation & Real Agent Batch Worker
  startFileCollection: async (
    group: LabGroup,
    onProgress: (progress: FileCollectionProgress) => void
  ): Promise<FileCollectionProgress> => {
    const computers = LabStorageService.getComputers(group);
    const activeStudents = computers.filter(c => c.studentName && c.status !== 'OFFLINE');
    const total = activeStudents.length;

    let collectedCount = 0;
    const collectedFiles: FileCollectionProgress['collectedFiles'] = [];

    onProgress({
      isCollecting: true,
      totalStudents: total,
      collectedCount: 0,
      percent: 0,
      statusText: 'Connecting to Windows Lab Agents on student computers...',
      completed: false,
      collectedFiles: []
    });

    for (let i = 0; i < total; i++) {
      const pc = activeStudents[i];
      await new Promise(res => setTimeout(res, 200)); // Smooth step

      collectedCount++;
      const percent = Math.round((collectedCount / total) * 100);
      const fileName = `${pc.studentName?.replace(/\s+/g, '_')}_Practical_Assignment.xlsx`;

      collectedFiles.push({
        studentId: pc.studentId || `std-${i + 1}`,
        studentName: pc.studentName || 'Student',
        computerCode: pc.computerCode,
        fileName,
        fileSize: `${(24 + Math.random() * 45).toFixed(1)} KB`,
        status: 'success',
        timestamp: new Date().toISOString()
      });

      onProgress({
        isCollecting: true,
        totalStudents: total,
        collectedCount,
        percent,
        statusText: `Collecting from ${pc.computerCode} (${pc.studentName})...`,
        currentStudent: pc.studentName,
        completed: percent === 100,
        collectedFiles: [...collectedFiles]
      });
    }

    const finalResult: FileCollectionProgress = {
      isCollecting: false,
      totalStudents: total,
      collectedCount,
      percent: 100,
      statusText: `Successfully collected ${collectedCount} files from student computers!`,
      completed: true,
      collectedFiles
    };

    // Update active session collected count
    const session = LabStorageService.getActiveSession();
    if (session) {
      LabStorageService.saveActiveSession({
        ...session,
        collectedFilesCount: collectedCount
      });
    }

    // Audit Log
    LabStorageService.addAuditLog({
      userId: 'user-teacher-01',
      teacherName: 'Lokkru Jame',
      computerCode: group,
      action: 'COLLECT_FILES',
      details: `Collected ${collectedCount} files from student workstations in ${group}`,
      status: 'SUCCESS'
    });

    return finalResult;
  },

  // Register New Workstation
  registerComputer: (
    data: {
      computerCode: string;
      hostname: string;
      labGroup: LabGroup;
      ipAddress?: string;
      macAddress?: string;
    }
  ): ComputerWorkstation => {
    const computers = LabStorageService.getComputers(data.labGroup);
    const newPc: ComputerWorkstation = {
      id: `pc-${data.labGroup.toLowerCase().replace(' ', '')}-${Date.now().toString().slice(-4)}`,
      computerCode: data.computerCode.trim().toUpperCase(),
      hostname: data.hostname.trim(),
      ipAddress: data.ipAddress?.trim() || `192.168.10.${100 + computers.length + 1}`,
      macAddress: data.macAddress?.trim() || `00:1A:2B:3C:4D:${String(computers.length + 1).padStart(2, '0')}`,
      agentId: `agent-${Date.now().toString().slice(-6)}`,
      labGroup: data.labGroup,
      status: 'AVAILABLE',
      currentApp: 'Desktop Idle',
      sessionDuration: 0,
      lastHeartbeat: new Date().toISOString(),
      agentVersion: 'v1.0.4',
      cpuUsagePct: 5,
      memoryUsagePct: 25,
      isLocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const next = [...computers, newPc];
    LabStorageService.saveComputers(data.labGroup, next);

    LabStorageService.addAuditLog({
      userId: 'user-teacher-01',
      teacherName: 'Lokkru Jame',
      computerCode: newPc.computerCode,
      action: 'REGISTER_COMPUTER',
      details: `Registered new computer ${newPc.computerCode} (${newPc.hostname}) in ${data.labGroup}`,
      status: 'SUCCESS'
    });

    return newPc;
  },

  // Delete Workstation
  deleteComputer: (id: string, group: LabGroup): void => {
    const computers = LabStorageService.getComputers(group);
    const target = computers.find(c => c.id === id);
    const filtered = computers.filter(c => c.id !== id);
    LabStorageService.saveComputers(group, filtered);

    if (target) {
      LabStorageService.addAuditLog({
        userId: 'user-teacher-01',
        teacherName: 'Lokkru Jame',
        computerCode: target.computerCode,
        action: 'DELETE_COMPUTER',
        details: `Deleted computer ${target.computerCode} from ${group}`,
        status: 'WARNING'
      });
    }
  }
};
