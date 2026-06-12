import "dotenv/config";
import cors from "cors";
import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import { SessionStore } from "./sessionStore.js";
import type { CloudInputPacket, JoinSessionPayload, SignalPayload } from "./types.js";
import { UnityInputRelay } from "./unityInputRelay.js";
import { launchGame, stopGame, isGameRunning } from "./gameLauncher.js";


const port = Number(process.env.PORT ?? 3001);
const clientOrigin = process.env.CLIENT_ORIGIN ?? "*";
const unityInputHost = process.env.UNITY_INPUT_HOST ?? "127.0.0.1";
const unityInputPort = Number(process.env.UNITY_INPUT_PORT ?? 7777);

const app = express();
const server = http.createServer(app);
const sessions = new SessionStore();
const unityInput = new UnityInputRelay(unityInputHost, unityInputPort);

const io = new Server(server, {
  cors: {
    origin: clientOrigin === "*" ? true : clientOrigin,
    methods: ["GET", "POST"]
  }
});

app.use(cors({ origin: clientOrigin === "*" ? true : clientOrigin }));
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    sessions: sessions.snapshot(),
    unityInput: `${unityInputHost}:${unityInputPort}`
  });
});

io.engine.on("connection", (rawSocket) => {
  console.log("[engine] transport connected", rawSocket.id);
});


io.on("connection", (socket) => {
  console.log("[socket] connected", socket.id);

  socket.on("session:join", (payload: JoinSessionPayload) => {
    socket.join(payload.sessionId);
    sessions.join(payload.sessionId, { socketId: socket.id, role: payload.role });
    socket.to(payload.sessionId).emit("session:peer-ready", { role: payload.role });
    console.log(`[session] ${payload.role} joined ${payload.sessionId}`);
  });

  socket.on("webrtc:signal", (payload: SignalPayload) => {
    const peerSocketId = sessions.getPeer(payload.sessionId, payload.targetRole);

    if (!peerSocketId) {
      socket.emit("session:error", `No ${payload.targetRole} connected for ${payload.sessionId}`);
      return;
    }

    io.to(peerSocketId).emit("webrtc:signal", payload);
  });

  socket.on("input:frame", (packet: CloudInputPacket) => {
    unityInput.send(packet);
    socket.to(packet.sessionId).emit("input:frame", packet);
  });

  socket.on("ping:client", (timestamp: number) => {
    socket.emit("pong:server", timestamp);
  });

  socket.on("disconnect", () => {
    sessions.leave(socket.id);
    console.log(`[socket] disconnected ${socket.id}`);
  });

  socket.on("game:launch", () => {
    launchGame();

    socket.emit("game:status", {
      running: isGameRunning()
    });
  });

  socket.on("game:stop", () => {
    stopGame();

    socket.emit("game:status", {
      running: false
    });
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`[server] listening on http://0.0.0.0:${port}`);
  console.log(`[server] relaying Unity input to udp://${unityInputHost}:${unityInputPort}`);
});
