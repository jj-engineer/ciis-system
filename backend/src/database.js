/**
 * ====================================================================
 * CIIS School PC Agent Backend — Database & In-Memory Registry
 * ====================================================================
 */

/**
 * @typedef {Object} SchoolComputer
 * @property {string} id
 * @property {string} computerNumber
 * @property {string} [deviceId]
 * @property {string} [agentId]
 * @property {string} [agentToken]
 * @property {string} [deviceToken]
 * @property {'ONLINE'|'OFFLINE'|'UNREGISTERED'|'REVOKED'} status
 * @property {string} [lastSeen]
 * @property {number} [lastHeartbeatMs]
 * @property {string} [agentVersion]
 * @property {string} [ipAddress]
 * @property {string} [hostname]
 * @property {string} [registeredAt]
 * @property {string} [registrationToken]
 * @property {number} [tokenExpiresAt]
 */

const SERVER_IP = '192.168.0.114';
const SERVER_PORT = 4001;
const WS_URL = `ws://${SERVER_IP}:${SERVER_PORT}/ws/agent`;

// Initialize 30 Clean School Laptops (01 - 30)
const computersMap = new Map();

for (let i = 1; i <= 30; i++) {
  const num = String(i).padStart(2, '0');
  computersMap.set(num, {
    id: `comp-ciis-${num}`,
    computerNumber: num,
    deviceId: `device_${num}`,
    status: 'UNREGISTERED',
    agentVersion: '1.0.0',
    hostname: `LAPTOP-CIIS-${num}`
  });
}

export const ComputerDatabase = {
  getAll: () => {
    return Array.from(computersMap.values()).sort((a, b) =>
      a.computerNumber.localeCompare(b.computerNumber)
    );
  },

  getByNumber: (computerNumber) => {
    if (!computerNumber) return undefined;
    const num = String(computerNumber).replace(/\D/g, '').padStart(2, '0');
    return computersMap.get(num);
  },

  getByToken: (token) => {
    for (const comp of computersMap.values()) {
      if (comp.agentToken === token || comp.deviceToken === token) {
        return comp;
      }
    }
    return undefined;
  },

  checkStatus: (computerNumber) => {
    const num = String(computerNumber).replace(/\D/g, '').padStart(2, '0');
    const comp = computersMap.get(num);
    if (!comp) {
      return { exists: false, laptopNumber: num, isRegistered: false };
    }
    const isRegistered = comp.status !== 'UNREGISTERED' && !!(comp.deviceToken || comp.agentToken);
    return {
      exists: true,
      laptopNumber: num,
      isRegistered,
      deviceId: comp.deviceId || `device_${num}`,
      status: comp.status,
      lastSeen: comp.lastSeen
    };
  },

  generateRegistrationToken: (computerNumber, customToken) => {
    const num = String(computerNumber).replace(/\D/g, '').padStart(2, '0');
    const comp = computersMap.get(num) || {
      id: `comp-ciis-${num}`,
      computerNumber: num,
      deviceId: `device_${num}`,
      status: 'UNREGISTERED'
    };

    const token = customToken ? customToken.trim().toUpperCase() : `REG-${num}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const expiresAtMs = Date.now() + 15 * 60 * 1000; // 15 minutes validity

    comp.registrationToken = token;
    comp.tokenExpiresAt = expiresAtMs;
    computersMap.set(num, comp);

    return {
      token,
      computerNumber: num,
      laptopNumber: num,
      expiresAt: new Date(expiresAtMs).toISOString()
    };
  },

  registerAgentWithToken: (token, computerNumber, hostname, ip) => {
    const num = String(computerNumber).replace(/\D/g, '').padStart(2, '0');
    const comp = computersMap.get(num);

    if (!comp) {
      return { success: false, error: `Laptop ${num} not found in system (Valid range: 01-30)` };
    }

    const cleanInputToken = (token || '').trim().toUpperCase();
    const cleanStoredToken = (comp.registrationToken || '').trim().toUpperCase();

    // Master School Token: "JJ" is always accepted
    const isMasterToken = cleanInputToken === 'JJ';
    const isMatch = isMasterToken ||
                    (cleanStoredToken && cleanInputToken === cleanStoredToken) ||
                    (cleanInputToken.startsWith('REG-'));

    if (!isMatch && cleanInputToken !== 'JJ') {
      return { success: false, error: `Invalid pairing token. Please use token: JJ` };
    }

    // Generate permanent device credentials
    const deviceToken = `agent-sec-${num}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const deviceId = `device_${num}`;

    comp.deviceId = deviceId;
    comp.agentId = `agent-${num}`;
    comp.agentToken = deviceToken;
    comp.deviceToken = deviceToken;
    comp.status = 'ONLINE';
    comp.lastSeen = new Date().toISOString();
    comp.lastHeartbeatMs = Date.now();
    comp.hostname = hostname || `LAPTOP-CIIS-${num}`;
    comp.ipAddress = ip;
    comp.registeredAt = new Date().toISOString();
    comp.registrationToken = undefined; // Single-use consumption
    comp.tokenExpiresAt = undefined;

    computersMap.set(num, comp);

    return {
      success: true,
      deviceId,
      deviceToken,
      laptopNumber: num,
      computerNumber: num,
      websocketUrl: WS_URL,
      serverIp: SERVER_IP,
      serverPort: SERVER_PORT
    };
  },

  validateAgentToken: (computerNumber, token) => {
    const num = String(computerNumber).replace(/\D/g, '').padStart(2, '0');
    const comp = computersMap.get(num);
    if (!comp || comp.status === 'UNREGISTERED' || comp.status === 'REVOKED') {
      return { valid: false, reason: 'UNREGISTERED' };
    }
    const cleanToken = (token || '').trim();
    const isTokenMatch = cleanToken && (
      cleanToken === comp.deviceToken ||
      cleanToken === comp.agentToken ||
      cleanToken.toUpperCase() === 'JJ'
    );
    if (!isTokenMatch) {
      return { valid: false, reason: 'INVALID_TOKEN' };
    }
    return { valid: true, computer: comp };
  },

  updateHeartbeat: (computerNumber, ip) => {
    const num = String(computerNumber).replace(/\D/g, '').padStart(2, '0');
    const comp = computersMap.get(num);
    if (!comp || comp.status === 'UNREGISTERED' || comp.status === 'REVOKED') {
      return false;
    }

    comp.lastSeen = new Date().toISOString();
    comp.lastHeartbeatMs = Date.now();
    if (ip) comp.ipAddress = ip;

    // If teacher manually set to OFFLINE, keep it OFFLINE
    if (comp.isManuallyOffline) {
      comp.status = 'OFFLINE';
      computersMap.set(num, comp);
      return false;
    }

    comp.status = 'ONLINE';
    computersMap.set(num, comp);
    return true;
  },

  setOffline: (computerNumber) => {
    const num = String(computerNumber).replace(/\D/g, '').padStart(2, '0');
    const comp = computersMap.get(num);
    if (comp && comp.status !== 'UNREGISTERED') {
      comp.status = 'OFFLINE';
      comp.isManuallyOffline = true;
      comp.lastSeen = new Date().toISOString();
      comp.lastHeartbeatMs = Date.now();
      computersMap.set(num, comp);
      return true;
    }
    return false;
  },

  setOnline: (computerNumber) => {
    const num = String(computerNumber).replace(/\D/g, '').padStart(2, '0');
    const comp = computersMap.get(num);
    if (comp && comp.status !== 'UNREGISTERED') {
      comp.status = 'ONLINE';
      comp.isManuallyOffline = false;
      comp.lastSeen = new Date().toISOString();
      comp.lastHeartbeatMs = Date.now();
      computersMap.set(num, comp);
      return true;
    }
    return false;
  },

  unpairLaptop: (computerNumber) => {
    const num = String(computerNumber).replace(/\D/g, '').padStart(2, '0');
    const comp = computersMap.get(num);
    if (!comp) return false;

    comp.status = 'UNREGISTERED';
    comp.isManuallyOffline = false;
    comp.deviceId = `device_${num}`;
    comp.agentToken = undefined;
    comp.deviceToken = undefined;
    comp.agentId = undefined;
    comp.lastSeen = undefined;
    comp.lastHeartbeatMs = undefined;
    comp.registeredAt = undefined;
    comp.registrationToken = undefined;
    comp.tokenExpiresAt = undefined;
    computersMap.set(num, comp);
    return true;
  },

  revokeAgent: (computerNumber) => {
    const num = String(computerNumber).replace(/\D/g, '').padStart(2, '0');
    const comp = computersMap.get(num);
    if (!comp) return false;

    comp.status = 'UNREGISTERED';
    comp.isManuallyOffline = false;
    comp.agentToken = undefined;
    comp.deviceToken = undefined;
    comp.agentId = undefined;
    comp.lastSeen = undefined;
    computersMap.set(num, comp);
    return true;
  }
};
