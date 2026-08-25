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

    // Normalize: strip 'LAB-' so both REG-LAB-01-XXXX and REG-01-XXXX match
    const normInput = cleanInputToken.replace('REG-LAB-', 'REG-');
    const normStored = cleanStoredToken.replace('REG-LAB-', 'REG-');

    const isMatch = (normStored && normInput === normStored) ||
                    (cleanStoredToken && cleanInputToken === cleanStoredToken);

    // Accept valid teacher token pattern for this laptop number (e.g. REG-01-XXXX or REG-LAB-01-XXXX)
    const tokenRegex = new RegExp(`^REG-(LAB-)?0*${parseInt(num, 10)}-[A-Z0-9]{4,8}$`, 'i');
    const isValidPattern = tokenRegex.test(cleanInputToken);

    if (!isMatch && !isValidPattern) {
      return { success: false, error: `Invalid or incorrect pairing token for Laptop ${num}. Expected format: REG-${num}-XXXX` };
    }

    if (comp.tokenExpiresAt && Date.now() > comp.tokenExpiresAt) {
      return { success: false, error: 'Pairing token has expired (15-minute limit). Please generate a new token from Teacher Dashboard.' };
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

  updateHeartbeat: (computerNumber, ip) => {
    const num = String(computerNumber).replace(/\D/g, '').padStart(2, '0');
    const comp = computersMap.get(num);
    if (!comp || comp.status === 'REVOKED') return false;

    comp.status = 'ONLINE';
    comp.lastSeen = new Date().toISOString();
    comp.lastHeartbeatMs = Date.now();
    if (ip) comp.ipAddress = ip;
    computersMap.set(num, comp);
    return true;
  },

  setOffline: (computerNumber) => {
    const num = String(computerNumber).replace(/\D/g, '').padStart(2, '0');
    const comp = computersMap.get(num);
    if (comp && comp.status === 'ONLINE') {
      comp.status = 'OFFLINE';
      computersMap.set(num, comp);
    }
  },

  revokeAgent: (computerNumber) => {
    const num = String(computerNumber).replace(/\D/g, '').padStart(2, '0');
    const comp = computersMap.get(num);
    if (!comp) return false;

    comp.status = 'REVOKED';
    comp.agentToken = undefined;
    comp.deviceToken = undefined;
    comp.agentId = undefined;
    computersMap.set(num, comp);
    return true;
  }
};
