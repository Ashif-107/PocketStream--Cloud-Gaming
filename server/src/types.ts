export type ClientRole = "host" | "player";

export interface JoinSessionPayload {
  sessionId: string;
  role: ClientRole;
}

export interface SignalPayload {
  sessionId: string;
  targetRole: ClientRole;
  description?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

export interface CloudInputPacket {
  sessionId: string;
  sequence: number;
  timestamp: number;
  moveX: number;
  jump: boolean;
  attack: boolean;
}
