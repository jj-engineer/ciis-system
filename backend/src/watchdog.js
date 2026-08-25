/**
 * ====================================================================
 * Watchdog Service: Heartbeat & Timeout Determination
 * ====================================================================
 *
 * Checks every 3 seconds. If lastHeartbeat > 15 seconds, marks as OFFLINE
 * and broadcasts an event to the Teacher Dashboard.
 */

import { ComputerDatabase } from './database.js';

export const HEARTBEAT_INTERVAL_SEC = 5;
export const ONLINE_TIMEOUT_SEC = 15;

export function startWatchdog(onStatusChanged) {
  const interval = setInterval(() => {
    const now = Date.now();
    const computers = ComputerDatabase.getAll();

    for (const comp of computers) {
      if (comp.status === 'ONLINE' && comp.lastHeartbeatMs) {
        const diffSec = (now - comp.lastHeartbeatMs) / 1000;
        if (diffSec > ONLINE_TIMEOUT_SEC) {
          ComputerDatabase.setOffline(comp.computerNumber);
          console.log(`[Watchdog] Computer ${comp.computerNumber} marked OFFLINE (No heartbeat for ${Math.round(diffSec)}s)`);

          if (onStatusChanged) {
            onStatusChanged({
              type: 'COMPUTER_STATUS_CHANGED',
              computerNumber: comp.computerNumber,
              status: 'OFFLINE',
              lastSeen: comp.lastSeen
            });
          }
        }
      }
    }
  }, 3000);

  return () => clearInterval(interval);
}
