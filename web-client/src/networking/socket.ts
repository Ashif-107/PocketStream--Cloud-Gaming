import { io } from "socket.io-client";

export const SIGNALING_URL = import.meta.env.VITE_SIGNALING_URL ?? `${window.location.protocol}//${window.location.hostname}:3001`;

export const socket = io(SIGNALING_URL, {
  autoConnect: false,
  transports: ["websocket"]
});
