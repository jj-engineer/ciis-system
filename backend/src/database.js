/**
 * @typedef {Object} SchoolComputer
 * @property {string} id
 * @property {string} computerNumber
 * @property {string} [agentId]
 * @property {string} [agentToken]
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

// Initial 30 School Computers (01 - 30)
const computersMap = new Map();

for (let i = 1; i <= 30; i++) {
  const num = String(i).padStart(2, '0');
  // Initialize some registered computers and some ready for registration
  const isPreRegistered = i <= 24;
  computersMap.set(num, {
    id: `comp-ciis-${num}`,
    computerNumber: num,
    agentId: isPreRegistered ? `agent-${num}-${Math.random().toString(36).substring(2, 7)}` : undefined,
    agentToken: isPreRegistered ? `token-${num}-auth` : undefined,
    status: isPreRegistered ? (i === 3 || i === 18 ? 'OFFLINE' : 'ONLINE') : 'UNREGISTERED',
    lastSeen: isPreRegistered
      ? new Date(Date.now() - (i === 3 ? 120000 : i === 18 ? 300000 : 2000)).toISOString()
      : undefined,
    lastHeartbeatMs: isPreRegistered
      ? Date.now() - (i === 3 ? 120000 : i === 18 ? 300000 : 2000)
      : undefined,
    agentVersion: '0.1.0',
    hostname: `LAPTOP-CIIS-${num}`,
    ipAddress: `192.168.10.${100 + i}`,
    registeredAt: isPreRegistered ? new Date(Date.now() - 86400000 * 7).toISOString() : undefined
  });
}

export const ComputerDatabase = {
  getAll: () => {
    return Array.from(computersMap.values()).sort((a, b) =>
      a.computerNumber.localeCompare(b.computerNumber)
    );
  },

  getByNumber: (computerNumber) => {
    const num = String(computerNumber).padStart(2, '0');
    return computersMap.get(num);
  },

  getByToken: (agentToken) => {
    for (const comp of computersMap.values()) {
      if (comp.agentToken === agentToken) {
        return comp;
      }
    }
    return undefined;
  },

  generateRegistrationToken: (computerNumber) => {
    const num = String(computerNumber).padStart(2, '0');
    const comp = computersMap.get(num) || {
      id: `comp-ciis-${num}`,
      computerNumber: num,
      status: 'UNREGISTERED'
    };

    const token = `REG-${num}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const expiresAtMs = Date.now() + 15 * 60 * 1000; // 15 minutes validity

    comp.registrationToken = token;
    comp.tokenExpiresAt = expiresAtMs;
    computersMap.set(num, comp);

    return {
      token,
      expiresAt: new Date(expiresAtMs).toISOString()
    };
  },

  registerAgentWithToken: (token, computerNumber, hostname, ip) => {
    const num = String(computerNumber).padStart(2, '0');
    const comp = computersMap.get(num);

    if (!comp) {
      return { success: false, error: `Computer ${num} not found in system` };
    }

    if (!comp.registrationToken || comp.registrationToken !== token.trim()) {
      return { success: false, error: 'Invalid or expired registration token' };
    }

    if (comp.tokenExpiresAt && Date.now() > comp.tokenExpiresAt) {
      return { success: false, error: 'Registration token has expired' };
    }

    // Generate permanent device credentials
    const agentToken = `agent-sec-${num}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    comp.agentId = `agent-${num}`;
    comp.agentToken = agentToken;
    comp.status = 'ONLINE';
    comp.lastSeen = new Date().toISOString();
    comp.lastHeartbeatMs = Date.now();
    comp.hostname = hostname || `LAPTOP-CIIS-${num}`;
    comp.ipAddress = ip;
    comp.registeredAt = new Date().toISOString();
    comp.registrationToken = undefined;
    comp.tokenExpiresAt = undefined;

    computersMap.set(num, comp);

    return {
      success: true,
      agentToken
    };
  },

  updateHeartbeat: (computerNumber, ip) => {
    const num = String(computerNumber).padStart(2, '0');
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
    const num = String(computerNumber).padStart(2, '0');
    const comp = computersMap.get(num);
    if (comp && comp.status === 'ONLINE') {
      comp.status = 'OFFLINE';
      computersMap.set(num, comp);
    }
  },

  revokeAgent: (computerNumber) => {
    const num = String(computerNumber).padStart(2, '0');
    const comp = computersMap.get(num);
    if (!comp) return false;

    comp.status = 'REVOKED';
    comp.agentToken = undefined;
    comp.agentId = undefined;
    computersMap.set(num, comp);
    return true;
  }
};
