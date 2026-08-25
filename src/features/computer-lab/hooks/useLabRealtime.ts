// ====================================================================
// Hook: useLabRealtime
// Manages WebSocket server connection status and Demo Mode switching
// ====================================================================

import { useState, useEffect, useCallback } from 'react';
import { labWsClient } from '../services/labWebSocket';
import { LabStorageService } from '../services/labStorage';

export function useLabRealtime() {
  const [isWsConnected, setIsWsConnected] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return LabStorageService.isDemoMode();
  });

  useEffect(() => {
    // Connect to WebSocket server in background
    labWsClient.connect();

    const unsub = labWsClient.onStatusChange((connected) => {
      setIsWsConnected(connected);
    });

    return () => {
      unsub();
    };
  }, []);

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode((prev) => {
      const next = !prev;
      LabStorageService.setDemoMode(next);
      return next;
    });
  }, []);

  const reconnect = useCallback(() => {
    labWsClient.disconnect();
    labWsClient.connect();
  }, []);

  return {
    isWsConnected,
    isDemoMode,
    toggleDemoMode,
    reconnect
  };
}
