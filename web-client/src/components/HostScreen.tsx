import { useEffect, useRef, useState } from "react";
import { socket } from "../networking/socket";
import { attachStream, createPeerConnection } from "../networking/webrtc";
import type { SignalPayload } from "../types";

interface HostScreenProps {
  sessionId: string;
}

export function HostScreen({ sessionId }: HostScreenProps) {
  const previewRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState("Waiting");
  const [shareUrl, setShareUrl] = useState("");
  const [lastInput, setLastInput] = useState("No input yet");

  useEffect(() => {
    const playerUrl = `${window.location.origin}/player?session=${encodeURIComponent(sessionId)}`;
    setShareUrl(playerUrl);

    socket.on("session:peer-ready", async () => {
      if (streamRef.current) {
        await createOffer();
      }
    });

    socket.on("webrtc:signal", async (payload: SignalPayload) => {
      const peer = peerRef.current;
      if (!peer) return;

      try {
        if (payload.description) {
          await peer.setRemoteDescription(payload.description);
        }

        if (payload.candidate) {
          await peer.addIceCandidate(payload.candidate);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown WebRTC error";
        setStatus(`Signal failed: ${message}`);
      }
    });

    socket.on("input:frame", (packet) => {
      setLastInput(`move=${packet.moveX.toFixed(2)} jump=${packet.jump} attack=${packet.attack}`);
    });

    socket.connect();
    socket.emit("session:join", { sessionId, role: "host" });

    return () => {
      socket.off("session:peer-ready");
      socket.off("webrtc:signal");
      socket.off("input:frame");
      peerRef.current?.close();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      socket.disconnect();
    };
  }, [sessionId]);

  async function startCapture() {
    try {
      if (!window.isSecureContext || !navigator.mediaDevices?.getDisplayMedia) {
        setStatus("Screen capture needs Chrome/Edge on localhost or HTTPS");
        return;
      }

      setStatus("Choose your Unity game window");
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: { ideal: 30, max: 30 },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      attachStream(previewRef.current, stream);
      setStatus("Capture ready");
      await createOffer();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown capture error";
      setStatus(`Capture failed: ${message}`);
    }
  }

  async function createOffer() {
    if (!streamRef.current) return;

    peerRef.current?.close();
    const peer = createPeerConnection();
    peerRef.current = peer;

    streamRef.current.getTracks().forEach((track) => {
      peer.addTrack(track, streamRef.current as MediaStream);
    });

    peer.onicecandidate = (event) => {
      if (!event.candidate) return;
      socket.emit("webrtc:signal", {
        sessionId,
        targetRole: "player",
        candidate: event.candidate.toJSON()
      });
    };

    peer.onconnectionstatechange = () => {
      setStatus(`WebRTC ${peer.connectionState}`);
    };

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit("webrtc:signal", {
      sessionId,
      targetRole: "player",
      description: peer.localDescription
    });
  }

  return (
    <main className="screen host-screen">
      <section className="top-bar">
        <div>
          <p className="eyebrow">Host</p>
          <h1>PocketStream</h1>
        </div>
        <button className="primary-button" onClick={startCapture}>
          Start capture
        </button>
      </section>

      <section className="host-layout">
        <div className="video-shell">
          <video ref={previewRef} muted playsInline />
        </div>

        <aside className="status-panel">
          <div>
            <span>Status</span>
            <strong>{status}</strong>
          </div>
          <div>
            <span>Session</span>
            <strong>{sessionId}</strong>
          </div>
          <div>
            <span>Player URL</span>
            <code>{shareUrl}</code>
          </div>
          <div>
            <span>Last input</span>
            <strong>{lastInput}</strong>
          </div>
        </aside>
      </section>
    </main>
  );
}
