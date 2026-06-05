import type { ClientRole } from "./types.js";

interface SessionClient {
  socketId: string;
  role: ClientRole;
}

export class SessionStore {
  private readonly sessions = new Map<string, Map<ClientRole, string>>();

  join(sessionId: string, client: SessionClient) {
    const session = this.sessions.get(sessionId) ?? new Map<ClientRole, string>();
    session.set(client.role, client.socketId);
    this.sessions.set(sessionId, session);
  }

  leave(socketId: string) {
    for (const [sessionId, session] of this.sessions) {
      for (const [role, storedSocketId] of session) {
        if (storedSocketId === socketId) {
          session.delete(role);
        }
      }

      if (session.size === 0) {
        this.sessions.delete(sessionId);
      }
    }
  }

  getPeer(sessionId: string, targetRole: ClientRole) {
    return this.sessions.get(sessionId)?.get(targetRole);
  }

  snapshot() {
    return [...this.sessions.entries()].map(([sessionId, clients]) => ({
      sessionId,
      clients: Object.fromEntries(clients)
    }));
  }
}
