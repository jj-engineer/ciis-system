// ====================================================================
// Hook: useLabSession
// Manages Computer Class Session Lifecycle, Elapsed Timer, & Submissions
// ====================================================================

import { useState, useEffect, useCallback } from 'react';
import {
  FileCollectionProgress,
  LabGroup,
  LabSession,
  TargetApplication
} from '../types/lab';
import { LabApiService } from '../services/labApi';
import { LabStorageService } from '../services/labStorage';

export function useLabSession(currentLabGroup: LabGroup) {
  const [activeSession, setActiveSession] = useState<LabSession | null>(() => {
    return LabStorageService.getActiveSession();
  });
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState<boolean>(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState<boolean>(false);
  const [collectionProgress, setCollectionProgress] = useState<FileCollectionProgress>({
    isCollecting: false,
    totalStudents: 0,
    collectedCount: 0,
    percent: 0,
    statusText: 'Ready',
    completed: false,
    collectedFiles: []
  });

  // Calculate elapsed time from session start
  useEffect(() => {
    if (!activeSession || activeSession.status !== 'active') {
      setElapsedSeconds(0);
      return;
    }

    const startMs = new Date(activeSession.startedAt).getTime();
    const updateElapsed = () => {
      const nowMs = Date.now();
      const diff = Math.max(0, Math.floor((nowMs - startMs) / 1000));
      setElapsedSeconds(diff);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  // Start Class Session
  const startSession = useCallback(
    (
      title: string,
      targetApp: TargetApplication,
      durationMinutes: number,
      assignmentId?: string,
      assignmentTitle?: string
    ) => {
      const newSession = LabApiService.startLabSession(
        currentLabGroup,
        title,
        targetApp,
        durationMinutes,
        assignmentId,
        assignmentTitle
      );
      setActiveSession(newSession);
      setIsSessionModalOpen(false);
      return newSession;
    },
    [currentLabGroup]
  );

  // End Class Session
  const endSession = useCallback(() => {
    LabApiService.endLabSession();
    setActiveSession(null);
  }, []);

  // Collect All Student Work
  const collectAllWork = useCallback(async () => {
    setIsCollectionModalOpen(true);
    const result = await LabApiService.startFileCollection(currentLabGroup, (progress) => {
      setCollectionProgress(progress);
    });
    setCollectionProgress(result);
    return result;
  }, [currentLabGroup]);

  // Format Elapsed Time as HH:MM:SS
  const formatTime = (sec: number): string => {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return {
    activeSession,
    elapsedSeconds,
    formattedElapsed: formatTime(elapsedSeconds),
    isSessionModalOpen,
    setIsSessionModalOpen,
    isCollectionModalOpen,
    setIsCollectionModalOpen,
    collectionProgress,
    startSession,
    endSession,
    collectAllWork
  };
}
