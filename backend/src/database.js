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

import os from 'os';

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  const validIps = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        if (!iface.address.startsWith('169.254.')) {
          validIps.push({ name, address: iface.address });
        }
      }
    }
  }

  const preferred = validIps.find(i => 
    i.name.toLowerCase().includes('wi-fi') || 
    i.name.toLowerCase().includes('ethernet') || 
    i.name.toLowerCase().includes('wlan') ||
    i.name.toLowerCase().includes('lan')
  ) || validIps[0];

  return preferred ? preferred.address : '192.168.0.107';
}

const SERVER_IP = process.env.SERVER_IP || getLocalIp();
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
    return Array.from(computersMap.values()).sort((a, b) => {
      // Sort school laptops (01-30) first, then personal BYOD laptops
      const aIsByod = a.computerNumber.startsWith('BYOD') || a.isPersonal;
      const bIsByod = b.computerNumber.startsWith('BYOD') || b.isPersonal;
      if (aIsByod && !bIsByod) return 1;
      if (!aIsByod && bIsByod) return -1;
      return a.computerNumber.localeCompare(b.computerNumber);
    });
  },

  getAvailableSchoolLaptops: () => {
    const available = [];
    const unregistered = [];
    const all = [];

    for (let i = 1; i <= 30; i++) {
      const num = String(i).padStart(2, '0');
      const comp = computersMap.get(num);
      const isOnline = comp && (comp.status === 'ONLINE' || comp.status === 'IN_USE');
      const isUnpaired = !comp || comp.status === 'UNREGISTERED';

      all.push({
        computerNumber: num,
        status: comp ? comp.status : 'UNREGISTERED',
        isAvailable: !isOnline,
        isUnpaired
      });

      if (!isOnline) {
        available.push(num);
      }
      if (isUnpaired) {
        unregistered.push(num);
      }
    }

    return {
      total: 30,
      availableCount: available.length,
      availableNumbers: available,
      unregisteredNumbers: unregistered,
      list: all
    };
  },

  getByNumber: (computerNumber) => {
    if (!computerNumber) return undefined;
    const raw = String(computerNumber).trim();
    if (raw.toUpperCase().startsWith('BYOD') || raw.toUpperCase().startsWith('PERS') || raw.includes('-')) {
      return computersMap.get(raw.toUpperCase()) || computersMap.get(raw);
    }
    const num = raw.replace(/\D/g, '').padStart(2, '0');
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
    const raw = String(computerNumber).trim();
    const isByod = raw.toUpperCase().startsWith('BYOD') || raw.toUpperCase().startsWith('PERS');
    const num = isByod ? raw.toUpperCase() : raw.replace(/\D/g, '').padStart(2, '0');
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
      lastSeen: comp.lastSeen,
      studentName: comp.studentName,
      deviceOwnership: comp.deviceOwnership || (isByod ? 'PERSONAL' : 'SCHOOL')
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

  registerAgentWithToken: (token, computerNumber, hostname, ip, extraData = {}) => {
    const isPersonal =
      extraData.deviceOwnership === 'PERSONAL' ||
      String(computerNumber || '').toUpperCase().startsWith('BYOD') ||
      String(computerNumber || '').toUpperCase().startsWith('PERS') ||
      String(computerNumber || '').toUpperCase().includes('AUTO');

    const cleanInputToken = (token || '').trim().toUpperCase();

    // Master School Token: "JJ" is always accepted
    const isMasterToken = cleanInputToken === 'JJ';

    // 1. Personal Laptop (BYOD) Registration
    if (isPersonal) {
      if (!isMasterToken && !cleanInputToken.startsWith('REG-')) {
        return { success: false, error: 'Invalid pairing token. Please use token: JJ' };
      }

      // Count existing BYOD laptops to assign unique code: BYOD-01, BYOD-02...
      let byodCount = 0;
      for (const k of computersMap.keys()) {
        if (k.startsWith('BYOD-')) byodCount++;
      }
      const byodCode = `BYOD-${String(byodCount + 1).padStart(2, '0')}`;
      const studentName = (extraData.studentName || 'Student').trim();
      const deviceToken = `agent-sec-${byodCode.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const deviceId = `device_${byodCode.toLowerCase().replace('-', '_')}`;

      const comp = {
        id: `comp-ciis-${byodCode.toLowerCase()}`,
        computerNumber: byodCode,
        computerCode: byodCode,
        deviceId,
        agentId: `agent-${byodCode.toLowerCase()}`,
        agentToken: deviceToken,
        deviceToken: deviceToken,
        status: 'ONLINE',
        lastSeen: new Date().toISOString(),
        lastHeartbeatMs: Date.now(),
        hostname: hostname || `BYOD-${studentName.replace(/\s+/g, '_')}`,
        ipAddress: ip,
        registeredAt: new Date().toISOString(),
        deviceOwnership: 'PERSONAL',
        isPersonal: true,
        studentName: studentName,
        grade: extraData.grade || 'Student',
        agentVersion: '1.0.0'
      };

      computersMap.set(byodCode, comp);

      return {
        success: true,
        deviceId,
        deviceToken,
        laptopNumber: byodCode,
        computerNumber: byodCode,
        studentName,
        deviceOwnership: 'PERSONAL',
        isPersonal: true,
        websocketUrl: WS_URL,
        serverIp: SERVER_IP,
        serverPort: SERVER_PORT
      };
    }

    // 2. School Lab Laptop (01 - 30) Registration
    const num = String(computerNumber).replace(/\D/g, '').padStart(2, '0');
    const comp = computersMap.get(num);

    if (!comp) {
      return { success: false, error: `Laptop ${num} not found in system (Valid range: 01-30)` };
    }

    const cleanStoredToken = (comp.registrationToken || '').trim().toUpperCase();
    const isMatch = isMasterToken ||
                    (cleanStoredToken && cleanInputToken === cleanStoredToken) ||
                    (cleanInputToken.startsWith('REG-'));

    if (!isMatch) {
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
    comp.deviceOwnership = 'SCHOOL';
    comp.isPersonal = false;
    if (extraData.studentName) {
      comp.studentName = extraData.studentName.trim();
    }

    computersMap.set(num, comp);

    return {
      success: true,
      deviceId,
      deviceToken,
      laptopNumber: num,
      computerNumber: num,
      deviceOwnership: 'SCHOOL',
      studentName: comp.studentName || '',
      websocketUrl: WS_URL,
      serverIp: SERVER_IP,
      serverPort: SERVER_PORT
    };
  },

  validateAgentToken: (computerNumber, token) => {
    const raw = String(computerNumber || '').trim();
    const isByod = raw.toUpperCase().startsWith('BYOD') || raw.toUpperCase().startsWith('PERS');
    const num = isByod ? raw.toUpperCase() : raw.replace(/\D/g, '').padStart(2, '0');

    let comp = computersMap.get(num);
    if (!comp) {
      comp = {
        id: `comp-ciis-${num.toLowerCase()}`,
        computerNumber: num,
        deviceId: `device_${num.toLowerCase().replace('-', '_')}`,
        status: 'ONLINE',
        agentVersion: '1.0.0',
        hostname: `LAPTOP-CIIS-${num}`,
        deviceOwnership: isByod ? 'PERSONAL' : 'SCHOOL',
        isPersonal: isByod
      };
      computersMap.set(num, comp);
    }

    if (comp.status === 'REVOKED') {
      return { valid: false, reason: 'REVOKED' };
    }

    const cleanToken = (token || '').trim();
    const isTokenMatch = cleanToken && (
      cleanToken.toUpperCase() === 'JJ' ||
      cleanToken.startsWith('agent-sec-') ||
      cleanToken === comp.deviceToken ||
      cleanToken === comp.agentToken
    );

    if (isTokenMatch) {
      if (comp.status === 'UNREGISTERED') {
        comp.status = 'ONLINE';
        comp.deviceToken = cleanToken;
        comp.registeredAt = comp.registeredAt || new Date().toISOString();
      }
      return { valid: true, computer: comp };
    }

    return { valid: false, reason: 'INVALID_TOKEN' };
  },

  updateHeartbeat: (computerNumber, ip) => {
    const raw = String(computerNumber || '').trim();
    const isByod = raw.toUpperCase().startsWith('BYOD') || raw.toUpperCase().startsWith('PERS');
    const num = isByod ? raw.toUpperCase() : raw.replace(/\D/g, '').padStart(2, '0');

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
    const raw = String(computerNumber || '').trim();
    const isByod = raw.toUpperCase().startsWith('BYOD') || raw.toUpperCase().startsWith('PERS');
    const num = isByod ? raw.toUpperCase() : raw.replace(/\D/g, '').padStart(2, '0');

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
