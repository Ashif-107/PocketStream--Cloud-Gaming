import { useEffect, useRef, useState } from "react";
import { socket } from "../networking/socket";
import type { CloudInputPacket } from "../types";

interface TouchControlsProps {
  sessionId: string;
}

export function TouchControls({ sessionId }: TouchControlsProps) {
  const sequenceRef = useRef(0);
  const moveRef = useRef(0);
  const jumpRef = useRef(false);
  const attackRef = useRef(false);
  const [moveLabel, setMoveLabel] = useState("0.00");

  useEffect(() => {
    const timer = window.setInterval(() => {
      const packet: CloudInputPacket = {
        sessionId,
        sequence: sequenceRef.current++,
        timestamp: performance.now(),
        moveX: moveRef.current,
        jump: jumpRef.current,
        attack: attackRef.current
      };

      socket.emit("input:frame", packet);
    }, 1000 / 30);

    return () => window.clearInterval(timer);
  }, [sessionId]);

  function setMove(value: number) {
    moveRef.current = value;
    setMoveLabel(value.toFixed(2));
  }

  return (
    <div className="controls-layer">
      <div className="move-pad" aria-label="Move controls">
        <button
          onPointerDown={() => setMove(-1)}
          onPointerUp={() => setMove(0)}
          onPointerCancel={() => setMove(0)}
          onPointerLeave={() => setMove(0)}
        >
          Left
        </button>
        <output>{moveLabel}</output>
        <button
          onPointerDown={() => setMove(1)}
          onPointerUp={() => setMove(0)}
          onPointerCancel={() => setMove(0)}
          onPointerLeave={() => setMove(0)}
        >
          Right
        </button>
      </div>

      <div className="action-pad" aria-label="Action controls">
        <button
          onPointerDown={() => {
            jumpRef.current = true;
          }}
          onPointerUp={() => {
            jumpRef.current = false;
          }}
          onPointerCancel={() => {
            jumpRef.current = false;
          }}
        >
          Jump
        </button>
        <button
          onPointerDown={() => {
            attackRef.current = true;
          }}
          onPointerUp={() => {
            attackRef.current = false;
          }}
          onPointerCancel={() => {
            attackRef.current = false;
          }}
        >
          Attack
        </button>
      </div>
    </div>
  );
}
