// ====================================================================
// Hook: useLabComputers
// Manages Workstation Grid state, filters, search, and heartbeat ticker
// ====================================================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ComputerStatus, ComputerWorkstation, LabCommandType, LabGroup } from '../types/lab';
import { LabApiService } from '../services/labApi';
import { LabStorageService } from '../services/labStorage';
import { labWsClient } from '../services/labWebSocket';

export type StatusFilterOption =
  | 'ALL'
  | 'ONLINE'
  | 'OFFLINE'
  | 'UNREGISTERED'
  | 'REVOKED'
  | 'AVAILABLE'
  | 'IN_USE'
  | 'LOCKED';

function isCodeMatch(aCode: string, bCode: string): boolean {
  if (!aCode || !bCode) return false;
  const aClean = aCode.trim().toUpperCase();
  const bClean = bCode.trim().toUpperCase();
  if (aClean === bClean) return true;
  const aNum = aClean.replace(/\D/g, '').padStart(2, '0');
  const bNum = bClean.replace(/\D/g, '').padStart(2, '0');
  return aNum.length > 0 && aNum === bNum;
}

function updateMatchingComputer(
  prev: ComputerWorkstation[],
  targetNumRaw: string | number,
  updater: (pc: ComputerWorkstation) => ComputerWorkstation,
  fallbackData?: Partial<ComputerWorkstation>
): ComputerWorkstation[] {
  const targetStr = String(targetNumRaw || '').trim();
  let found = false;

  const updated = prev.map((pc) => {
    const pcCode = pc.computerNumber || pc.computerCode || '';
    if (isCodeMatch(pcCode, targetStr)) {
      found = true;
      return updater(pc);
    }
    return pc;
  });

  if (found) return updated;

  // If this is a personal BYOD device not in initial 30 list, append it dynamically
  if (targetStr.toUpperCase().startsWith('BYOD') || targetStr.toUpperCase().startsWith('PERS') || fallbackData?.isPersonal) {
    const newPersonalPc: ComputerWorkstation = {
      id: `comp-${targetStr.toLowerCase().replace('-', '_')}`,
      computerNumber: targetStr.toUpperCase(),
      computerCode: targetStr.toUpperCase(),
      hostname: fallbackData?.hostname || `BYOD-${targetStr}`,
      ipAddress: fallbackData?.ipAddress,
      agentId: `agent-${targetStr.toLowerCase()}`,
      labGroup: 'Lab A',
      status: (fallbackData?.status as ComputerStatus) || 'ONLINE',
      deviceOwnership: 'PERSONAL',
      isPersonal: true,
      studentName: fallbackData?.studentName || 'Student',
      currentApp: 'Desktop Idle',
      sessionDuration: 0,
      lastHeartbeat: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      agentVersion: '1.0.0',
      isLocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return [...updated, updater(newPersonalPc)];
  }

  return updated;
}

function mergeComputersWithBackend(prev: ComputerWorkstation[], backendComputers: any[]): ComputerWorkstation[] {
  if (!Array.isArray(backendComputers) || backendComputers.length === 0) return prev;

  const matchedSet = new Set<string>();
  const next = prev.map((pc) => {
    const pcNum = pc.computerNumber || pc.computerCode || '';
    const found = backendComputers.find((b) => isCodeMatch(b.computerNumber || b.laptopNumber, pcNum));

    if (found) {
      matchedSet.add(String(found.computerNumber || found.laptopNumber).toUpperCase());
      return {
        ...pc,
        status: found.status as ComputerStatus,
        hostname: found.hostname || pc.hostname,
        ipAddress: found.ipAddress || pc.ipAddress,
        deviceOwnership: found.deviceOwnership || pc.deviceOwnership || 'SCHOOL',
        isPersonal: found.isPersonal || pc.isPersonal || false,
        studentName: found.studentName || pc.studentName,
        lastSeen: found.lastSeen,
        lastHeartbeat: found.lastSeen || new Date().toISOString()
      };
    }
    return pc;
  });

  // Append any extra BYOD / Personal laptops registered on the backend
  for (const b of backendComputers) {
    const bCode = String(b.computerNumber || b.laptopNumber || '').toUpperCase();
    if (!matchedSet.has(bCode) && (bCode.startsWith('BYOD') || bCode.startsWith('PERS') || b.isPersonal)) {
      next.push({
        id: b.id || `comp-${bCode.toLowerCase().replace('-', '_')}`,
        computerNumber: bCode,
        computerCode: bCode,
        hostname: b.hostname || `BYOD-${bCode}`,
        ipAddress: b.ipAddress,
        agentId: b.agentId || `agent-${bCode.toLowerCase()}`,
        labGroup: 'Lab A',
        status: b.status as ComputerStatus,
        deviceOwnership: 'PERSONAL',
        isPersonal: true,
        studentName: b.studentName || 'Student',
        currentApp: 'Desktop Idle',
        sessionDuration: 0,
        lastHeartbeat: b.lastSeen || new Date().toISOString(),
        lastSeen: b.lastSeen,
        agentVersion: b.agentVersion || '1.0.0',
        isLocked: false,
        createdAt: b.registeredAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }

  return next;
}

export function useLabComputers(initialGroup: LabGroup = 'Lab A') {
  const [selectedLab, setSelectedLab] = useState<LabGroup>(() => {
    return LabStorageService.getSelectedLabGroup() || initialGroup;
  });
  const [computers, setComputers] = useState<ComputerWorkstation[]>(() => {
    return LabApiService.getComputers(selectedLab);
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('ALL');
  const [selectedComputerId, setSelectedComputerId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Reload computers when lab group changes
  useEffect(() => {
    const loaded = LabApiService.getComputers(selectedLab);
    setComputers(loaded);
    LabStorageService.saveSelectedLabGroup(selectedLab);
    setSelectedIds(new Set());
  }, [selectedLab]);

  // Connect and sync with real-time WebSocket backend & REST API
  useEffect(() => {
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const isLocalHost = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.')
    );

    // On public HTTPS cloud (e.g. Vercel), do not attempt insecure http:// to local LAN IP
    if (isHttps && !isLocalHost) {
      return;
    }

    const host = isLocalHost ? window.location.hostname : '192.168.0.107';

    // 1. Initial REST API Sync from real backend
    fetch(`http://${host}:4001/api/computers`)
      .then((res) => res.json())
      .then((backendComputers: any[]) => {
        if (Array.isArray(backendComputers) && backendComputers.length > 0) {
          setComputers((prev) => mergeComputersWithBackend(prev, backendComputers));
        }
      })
      .catch(() => {});

    // 2. WebSocket Real-time Event Subscriptions
    const unsubSnapshot = labWsClient.on('INITIAL_SNAPSHOT', (data: any) => {
      if (data && Array.isArray(data.computers)) {
        setComputers((prev) => mergeComputersWithBackend(prev, data.computers));
      }
    });

    const unsubStatus = labWsClient.on('COMPUTER_STATUS_CHANGED', (data: any) => {
      const num = data.laptopNumber || data.computerNumber;
      if (num) {
        setComputers((prev) =>
          updateMatchingComputer(prev, num, (pc) => ({
            ...pc,
            status: data.status as ComputerStatus,
            studentName: data.studentName || pc.studentName,
            deviceOwnership: data.deviceOwnership || pc.deviceOwnership,
            lastSeen: data.lastSeen || new Date().toISOString(),
            lastHeartbeat: new Date().toISOString()
          }), data)
        );
      }
    });

    const unsubHeartbeat = labWsClient.on('COMPUTER_HEARTBEAT', (data: any) => {
      const num = data.laptopNumber || data.computerNumber;
      if (num) {
        setComputers((prev) =>
          updateMatchingComputer(prev, num, (pc) => ({
            ...pc,
            status: 'ONLINE',
            studentName: data.studentName || pc.studentName,
            lastSeen: data.lastSeen || new Date().toISOString(),
            lastHeartbeat: new Date().toISOString()
          }), data)
        );
      }
    });

    const unsubRegistered = labWsClient.on('AGENT_REGISTERED', (data: any) => {
      const num = data.laptopNumber || data.computerNumber || data.computer?.computerNumber;
      if (num) {
        setComputers((prev) =>
          updateMatchingComputer(prev, num, (pc) => ({
            ...pc,
            status: 'ONLINE',
            hostname: data.computer?.hostname || pc.hostname,
            ipAddress: data.computer?.ipAddress || pc.ipAddress,
            studentName: data.studentName || data.computer?.studentName || pc.studentName,
            deviceOwnership: data.deviceOwnership || data.computer?.deviceOwnership || pc.deviceOwnership,
            isPersonal: data.deviceOwnership === 'PERSONAL' || data.computer?.isPersonal || pc.isPersonal,
            lastSeen: new Date().toISOString(),
            lastHeartbeat: new Date().toISOString()
          }), data.computer || data)
        );
      }
    });

    const unsubRevoked = labWsClient.on('AGENT_REVOKED', (data: any) => {
      const num = data.laptopNumber || data.computerNumber;
      if (num) {
        setComputers((prev) =>
          updateMatchingComputer(prev, num, (pc) => ({
            ...pc,
            status: 'REVOKED'
          }))
        );
      }
    });

    return () => {
      unsubSnapshot();
      unsubStatus();
      unsubHeartbeat();
      unsubRegistered();
      unsubRevoked();
    };
  }, [selectedLab]);

  // Periodic heartbeat & session duration ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setComputers((prev) =>
        prev.map((pc) => {
          if (pc.status === 'IN_USE' || pc.status === 'LOCKED') {
            return {
              ...pc,
              sessionDuration: pc.sessionDuration + 1
            };
          }
          return pc;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filtered & Searched Computers
  const filteredComputers = useMemo(() => {
    return computers.filter((pc) => {
      // 1. Search Query
      const query = searchQuery.trim().toLowerCase();
      const compNum = (pc.computerNumber || pc.computerCode || '').toLowerCase();
      const matchesSearch =
        !query ||
        compNum.includes(query) ||
        pc.computerCode.toLowerCase().includes(query) ||
        pc.hostname.toLowerCase().includes(query) ||
        (pc.studentName && pc.studentName.toLowerCase().includes(query)) ||
        (pc.currentApp && pc.currentApp.toLowerCase().includes(query)) ||
        (pc.ipAddress && pc.ipAddress.includes(query));

      if (!matchesSearch) return false;

      // 2. Status Filter
      if (statusFilter === 'ALL') return true;
      if (statusFilter === 'ONLINE') {
        return pc.status === 'ONLINE' || pc.status === 'IN_USE' || pc.status === 'AVAILABLE' || pc.status === 'LOCKED';
      }
      if (statusFilter === 'OFFLINE') {
        return pc.status === 'OFFLINE' || pc.status === 'DISCONNECTED';
      }
      if (statusFilter === 'UNREGISTERED') {
        return pc.status === 'UNREGISTERED';
      }
      if (statusFilter === 'REVOKED') {
        return pc.status === 'REVOKED';
      }
      if (statusFilter === 'AVAILABLE') {
        return pc.status === 'AVAILABLE';
      }
      if (statusFilter === 'IN_USE') {
        return pc.status === 'IN_USE';
      }
      if (statusFilter === 'LOCKED') {
        return pc.status === 'LOCKED';
      }

      return true;
    });
  }, [computers, searchQuery, statusFilter]);

  // Lab Statistics Summary
  const stats = useMemo(() => {
    const total = computers.length;
    const online = computers.filter(
      (c) => c.status === 'ONLINE' || c.status === 'IN_USE' || c.status === 'AVAILABLE' || c.status === 'LOCKED'
    ).length;
    const inUse = computers.filter((c) => c.status === 'IN_USE').length;
    const available = computers.filter((c) => c.status === 'AVAILABLE').length;
    const locked = computers.filter((c) => c.status === 'LOCKED').length;
    const offline = computers.filter((c) => c.status === 'OFFLINE' || c.status === 'DISCONNECTED').length;
    const unregistered = computers.filter((c) => c.status === 'UNREGISTERED').length;
    const revoked = computers.filter((c) => c.status === 'REVOKED').length;

    return {
      total,
      online,
      inUse,
      available,
      locked,
      offline,
      unregistered,
      revoked
    };
  }, [computers]);

  // Selected Computer Object
  const selectedComputer = useMemo(() => {
    if (!selectedComputerId) return null;
    return computers.find((c) => c.id === selectedComputerId) || null;
  }, [computers, selectedComputerId]);

  // Dispatch Command to Single PC
  const dispatchCommand = useCallback(
    async (commandType: LabCommandType, targetPc: ComputerWorkstation, payload?: any) => {
      const result = await LabApiService.dispatchCommand(commandType, targetPc, payload);
      if (result.success) {
        setComputers((prev) =>
          prev.map((c) => (c.id === result.updatedComputer.id ? result.updatedComputer : c))
        );
      }
      return result;
    },
    []
  );

  // Dispatch Batch Command (Lock All, Unlock All, Ping All)
  const dispatchBatchCommand = useCallback(
    async (commandType: LabCommandType, payload?: any) => {
      const result = await LabApiService.dispatchBatchCommand(commandType, selectedLab, payload);
      const updated = LabApiService.getComputers(selectedLab);
      setComputers(updated);
      return result;
    },
    [selectedLab]
  );

  // Refresh Computers from Storage / Server
  const refreshComputers = useCallback(() => {
    const loaded = LabApiService.getComputers(selectedLab);
    setComputers(loaded);
  }, [selectedLab]);

  // Multi-selection Toggles
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(filteredComputers.map((c) => c.id)));
  }, [filteredComputers]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    selectedLab,
    setSelectedLab,
    computers,
    filteredComputers,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    selectedComputerId,
    setSelectedComputerId,
    selectedComputer,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    dispatchCommand,
    dispatchBatchCommand,
    refreshComputers
  };
}
