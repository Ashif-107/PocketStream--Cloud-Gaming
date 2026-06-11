import { io } from "socket.io-client";

export const SIGNALING_URL = import.meta.env.VITE_SIGNALING_URL ?? `${window.location.protocol}//${window.location.hostname}:3001`;

console.log("SIGNALING_URL =", SIGNALING_URL);


export const socket = io(SIGNALING_URL, {
  path: "/socket.io/",
  autoConnect: false,
  transports: ["websocket"]
});

socket.on("connect_error", (err) => {
  console.error(err);
  console.error("URL:", SIGNALING_URL);
});

socket.on("connect", () => {
  console.log("CONNECTED", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("DISCONNECTED", reason);
});