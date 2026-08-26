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

function updateMatchingComputer(
  prev: ComputerWorkstation[],
  targetNumRaw: string | number,
  updater: (pc: ComputerWorkstation) => ComputerWorkstation
): ComputerWorkstation[] {
  const targetNum = String(targetNumRaw).replace(/\D/g, '').padStart(2, '0');
  return prev.map((pc) => {
    const pcNum = (pc.computerNumber || pc.computerCode || '').replace(/\D/g, '').padStart(2, '0');
    if (pcNum === targetNum) {
      return updater(pc);
    }
    return pc;
  });
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
    const isLocalHost = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.')
    );
    const host = isLocalHost ? window.location.hostname : '192.168.0.107';

    // 1. Initial REST API Sync from real backend
    fetch(`http://${host}:4001/api/computers`)
      .then((res) => res.json())
      .then((backendComputers: any[]) => {
        if (Array.isArray(backendComputers) && backendComputers.length > 0) {
          setComputers((prev) => {
            return prev.map((pc) => {
              const pcNum = (pc.computerNumber || pc.computerCode || '').replace(/\D/g, '').padStart(2, '0');
              const found = backendComputers.find(
                (b) => String(b.computerNumber || b.laptopNumber).replace(/\D/g, '').padStart(2, '0') === pcNum
              );
              if (found) {
                return {
                  ...pc,
                  status: found.status as ComputerStatus,
                  hostname: found.hostname || pc.hostname,
                  ipAddress: found.ipAddress || pc.ipAddress,
                  lastSeen: found.lastSeen,
                  lastHeartbeat: found.lastSeen || new Date().toISOString()
                };
              }
              return pc;
            });
          });
        }
      })
      .catch(() => {});

    // 2. WebSocket Real-time Event Subscriptions
    const unsubSnapshot = labWsClient.on('INITIAL_SNAPSHOT', (data: any) => {
      if (data && Array.isArray(data.computers)) {
        setComputers((prev) => {
          return prev.map((pc) => {
            const pcNum = (pc.computerNumber || pc.computerCode || '').replace(/\D/g, '').padStart(2, '0');
            const found = data.computers.find(
              (b: any) => String(b.computerNumber || b.laptopNumber).replace(/\D/g, '').padStart(2, '0') === pcNum
            );
            if (found) {
              return {
                ...pc,
                status: found.status as ComputerStatus,
                hostname: found.hostname || pc.hostname,
                ipAddress: found.ipAddress || pc.ipAddress,
                lastSeen: found.lastSeen,
                lastHeartbeat: found.lastSeen || new Date().toISOString()
              };
            }
            return pc;
          });
        });
      }
    });

    const unsubStatus = labWsClient.on('COMPUTER_STATUS_CHANGED', (data: any) => {
      const num = data.laptopNumber || data.computerNumber;
      if (num) {
        setComputers((prev) =>
          updateMatchingComputer(prev, num, (pc) => ({
            ...pc,
            status: data.status as ComputerStatus,
            lastSeen: data.lastSeen || new Date().toISOString(),
            lastHeartbeat: new Date().toISOString()
          }))
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
            lastSeen: data.lastSeen || new Date().toISOString(),
            lastHeartbeat: new Date().toISOString()
          }))
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
            lastSeen: new Date().toISOString(),
            lastHeartbeat: new Date().toISOString()
          }))
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
