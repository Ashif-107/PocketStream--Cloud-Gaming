import { useEffect, useRef, useState } from "react";
import { socket } from "../networking/socket";
import { attachStream, createPeerConnection } from "../networking/webrtc";
import type { SignalPayload } from "../types";
import { TouchControls } from "./TouchControls";

interface PlayerScreenProps {
  sessionId: string;
}

export function PlayerScreen({ sessionId }: PlayerScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const [status, setStatus] = useState("Connecting");
  const [ping, setPing] = useState<number | null>(null);

  useEffect(() => {
    socket.connect();
    socket.emit("session:join", { sessionId, role: "player" });

    const peer = createPeerConnection();
    peerRef.current = peer;

    peer.ontrack = (event) => {
      attachStream(videoRef.current, event.streams[0]);
    };

    peer.onicecandidate = (event) => {
      if (!event.candidate) return;
      socket.emit("webrtc:signal", {
        sessionId,
        targetRole: "host",
        candidate: event.candidate.toJSON()
      });
    };

    peer.onconnectionstatechange = () => {
      setStatus(`WebRTC ${peer.connectionState}`);
    };

    socket.on("webrtc:signal", async (payload: SignalPayload) => {
      if (payload.description) {
        await peer.setRemoteDescription(payload.description);

        if (payload.description.type === "offer") {
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          socket.emit("webrtc:signal", {
            sessionId,
            targetRole: "host",
            description: peer.localDescription
          });
        }
      }

      if (payload.candidate) {
        await peer.addIceCandidate(payload.candidate);
      }
    });

    socket.on("pong:server", (timestamp: number) => {
      setPing(Math.round(performance.now() - timestamp));
    });

    const pingTimer = window.setInterval(() => {
      socket.emit("ping:client", performance.now());
    }, 1000);

    return () => {
      window.clearInterval(pingTimer);
      socket.off("webrtc:signal");
      socket.off("pong:server");
      peer.close();
      socket.disconnect();
    };
  }, [sessionId]);

  return (
    <main className="screen player-screen">
      <div className="stream-stage">
        <video ref={videoRef} playsInline autoPlay />
        <div className="stream-hud">
          <span>{status}</span>
          <span>{ping === null ? "ping --" : `ping ${ping}ms`}</span>
          <span>{sessionId}</span>
        </div>
        <TouchControls sessionId={sessionId} />
      </div>
    </main>
  );
}
